# Waitlist sheet

Sign-ups from the landing page are saved to a Google Sheet by a small Apps Script web app (`Code.gs`). Each row records the time, email, which form it came from (`hero` or `closing`), the page URL and the browser. Duplicate emails aren't added twice; the person is told they're already on the list, with their original position.

## Setup (about 5 minutes)

1. Create a Google Sheet, for example "OneByte waitlist".
2. In the sheet, open **Extensions → Apps Script**.
3. Replace everything in `Code.gs` with the contents of `Code.gs` from this folder, then save.
4. Click **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Authorise when asked (Google warns that the app is unverified, because it's your own script: choose **Advanced → Go to project**).
6. Copy the **Web app URL** (it ends in `/exec`). Opening it in a browser should show `{"ok":true,"service":"onebyte-waitlist"}`.
7. In `apps/landing/`, create `.env.local` containing:

   ```
   VITE_WAITLIST_URL=https://script.google.com/macros/s/…/exec
   ```

8. Run `npm run deploy` from the repo root. The URL is baked into the build.

The first sign-up creates a **Waitlist** tab with headers if it doesn't exist.

## Updating the script

After editing `Code.gs`, use **Deploy → Manage deployments → Edit → Version: New version**. This keeps the same URL. A brand-new deployment gets a new URL, which would then need updating in `.env.local`.

## Limits

- **One email per device.** The page gives each browser a random ID (kept in its local storage) and sends it with the sign-up. A second, different email from the same ID is refused. Re-submitting the same email just shows the person their place.
- **Per user agent:** at most 5 sign-ups every 10 minutes from the same browser/device type. This catches someone clearing their storage to get a new ID. It is a short window on purpose: identical phones send identical user agents.
- **Overall:** at most 30 sign-ups a minute across everyone.
- After joining, the page remembers it, so a refresh shows "You're on the list" instead of the form.

Change the numbers at the top of `Code.gs` (`UA_LIMIT`, `UA_WINDOW`, `GLOBAL_LIMIT`). Apps Script can't see IP addresses, so a determined person using several browsers or devices can still get through; this stops casual repeats and simple bots.

## Notes

- The URL is public by design (it's in the page's JavaScript). The script only ever appends rows, never returns sheet contents, rejects malformed emails, and ignores bots that fill the hidden `website` field.
- Without `VITE_WAITLIST_URL`, the form still shows its confirmation but **nothing is saved**. A warning is logged in the browser console.
