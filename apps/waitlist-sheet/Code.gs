/**
 * OneByte waitlist: a Google Apps Script web app that saves sign-ups to this spreadsheet.
 *
 * Setup is in README.md next to this file. In short: paste this into Extensions → Apps Script
 * on the waitlist spreadsheet, deploy it as a web app ("Anyone" can access), and put the
 * web app URL in apps/landing/.env.local as VITE_WAITLIST_URL.
 *
 * The landing page POSTs JSON as text/plain (a "simple" request, so the browser skips the CORS
 * preflight that Apps Script can't answer):
 *   { "email", "source", "page", "userAgent", "device", "website" }
 * and gets back one of:
 *   { "ok": true, "position": 128, "existing": false }
 *   { "ok": false, "error": "invalid_email" | "device_limit" | "rate_limited" | "bad_request" }
 *
 * Abuse protection (Apps Script can't see IP addresses, so it works with what the browser sends):
 * - One email per device. `device` is a random ID the page keeps in the browser's storage.
 * - At most UA_LIMIT sign-ups per user agent every UA_WINDOW seconds, for people who clear their
 *   storage to get a new device ID. A user agent alone isn't unique (identical phones share one),
 *   so this is a short rate limit, not a permanent block.
 * - At most GLOBAL_LIMIT sign-ups per minute across everyone, against floods.
 * - A hidden "website" field that only bots fill in.
 */

var SHEET_NAME = "Waitlist";
var HEADERS = ["Joined at", "Email", "Source", "Page", "User agent", "Device"];
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

var UA_LIMIT = 5;
var UA_WINDOW = 600; // seconds
var GLOBAL_LIMIT = 30; // per minute

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (error) {
    return reply({ ok: false, error: "bad_request" });
  }

  // Honeypot: real visitors never see or fill the "website" field. Pretend it worked.
  if (body.website) return reply({ ok: true, position: 0, existing: false });

  var email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return reply({ ok: false, error: "invalid_email" });
  }
  var device = clip(body.device, 64);
  var userAgent = clip(body.userAgent, 300);

  // One write at a time, so two people joining together can't get the same position.
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet();
    var last = sheet.getLastRow();
    var rows = last > 1 ? sheet.getRange(2, 2, last - 1, 5).getValues() : []; // Email … Device

    // Same email again: not an error, just tell them where they are.
    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][0]).toLowerCase() === email) return reply({ ok: true, position: i + 1, existing: true });
    }
    // Same device, different email: one person, one spot.
    for (var j = 0; device && j < rows.length; j++) {
      if (String(rows[j][4]) === device) return reply({ ok: false, error: "device_limit" });
    }

    if (!allow("global", GLOBAL_LIMIT, 60) || (userAgent && !allow("ua:" + hash(userAgent), UA_LIMIT, UA_WINDOW))) {
      return reply({ ok: false, error: "rate_limited" });
    }

    sheet.appendRow([new Date(), email, clip(body.source, 40), clip(body.page, 300), userAgent, device]);
    return reply({ ok: true, position: sheet.getLastRow() - 1, existing: false });
  } finally {
    lock.releaseLock();
  }
}

/** Visiting the URL in a browser shows this, which is a quick way to confirm the deployment works. */
function doGet() {
  return reply({ ok: true, service: "onebyte-waitlist" });
}

/** Counts an event in a time bucket and says whether it is still under the limit. */
function allow(key, limit, seconds) {
  var cache = CacheService.getScriptCache();
  var bucket = key + ":" + Math.floor(Date.now() / 1000 / seconds);
  var count = Number(cache.get(bucket) || 0);
  if (count >= limit) return false;
  cache.put(bucket, String(count + 1), seconds + 5);
  return true;
}

function hash(text) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text);
  return Utilities.base64EncodeWebSafe(bytes).slice(0, 16);
}

function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  // Keep the header row current, e.g. after a column is added in an update.
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  header.setValues([HEADERS]).setFontWeight("bold");
  sheet.setFrozenRows(1);
  return sheet;
}

function clip(value, max) {
  return String(value || "").slice(0, max);
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
