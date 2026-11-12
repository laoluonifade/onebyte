/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google Apps Script web app that saves waitlist sign-ups. See apps/waitlist-sheet/README.md. */
  readonly VITE_WAITLIST_URL?: string;
}
