/**
 * OneByte waitlist: a Google Apps Script web app that saves sign-ups to this spreadsheet.
 *
 * Setup is in README.md next to this file. In short: paste this into Extensions → Apps Script
 * on the waitlist spreadsheet, deploy it as a web app ("Anyone" can access), and put the
 * web app URL in apps/landing/.env.local as VITE_WAITLIST_URL.
 *
 * The landing page POSTs JSON as text/plain (a "simple" request, so the browser skips the CORS
 * preflight that Apps Script can't answer):
 *   { "email": "...", "source": "hero" | "closing", "page": "https://...", "website": "" }
 * and gets back:
 *   { "ok": true, "position": 128, "existing": false }
 *   { "ok": false, "error": "invalid_email" }
 */

var SHEET_NAME = "Waitlist";
var HEADERS = ["Joined at", "Email", "Source", "Page", "User agent"];
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  var body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
  } catch (error) {
    return reply({ ok: false, error: "bad_request" });
  }

  // Honeypot: real visitors never see or fill the "website" field.
  if (body.website) return reply({ ok: true, position: 0, existing: false });

  var email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return reply({ ok: false, error: "invalid_email" });
  }

  // One write at a time, so two people joining together can't get the same position.
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet();
    var last = sheet.getLastRow();

    if (last > 1) {
      var emails = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (var i = 0; i < emails.length; i++) {
        if (String(emails[i][0]).toLowerCase() === email) {
          return reply({ ok: true, position: i + 1, existing: true });
        }
      }
    }

    sheet.appendRow([
      new Date(),
      email,
      clip(body.source, 40),
      clip(body.page, 300),
      clip(body.userAgent, 300),
    ]);
    return reply({ ok: true, position: sheet.getLastRow() - 1, existing: false });
  } finally {
    lock.releaseLock();
  }
}

/** Visiting the URL in a browser shows this, which is a quick way to confirm the deployment works. */
function doGet() {
  return reply({ ok: true, service: "onebyte-waitlist" });
}

function getSheet() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
  }
  return sheet;
}

function clip(value, max) {
  return String(value || "").slice(0, max);
}

function reply(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
