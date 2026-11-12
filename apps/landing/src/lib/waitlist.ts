/* Talks to the waitlist Google Apps Script (apps/waitlist-sheet). */

export type JoinResult = {
  email: string;
  /** 1-based place on the list, or null when it isn't known (no backend configured). */
  position: number | null;
  /** True when this email had already joined. */
  existing: boolean;
};

/** Why a sign-up was refused. Matches the `error` codes the script returns. */
export type JoinError = "invalid_email" | "device_limit" | "rate_limited" | "failed";

export class JoinFailed extends Error {
  constructor(public code: JoinError) {
    super(code);
  }
}

const URL = import.meta.env.VITE_WAITLIST_URL as string | undefined;
const JOINED_KEY = "onebyte:joined";
const DEVICE_KEY = "onebyte:device";

/* Storage can be unavailable (private mode, blocked site data), so every access is guarded. */
function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* not persisted; the server-side limits still apply */
  }
}

/** A random ID for this browser, so the sheet can allow one email per device. */
function deviceId() {
  let id = read(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    write(DEVICE_KEY, id);
  }
  return id;
}

/** The sign-up this browser already made, if any. Shown instead of the form after a refresh. */
export function savedJoin(): JoinResult | null {
  try {
    const saved = JSON.parse(read(JOINED_KEY) ?? "null");
    return saved && typeof saved.email === "string" ? saved : null;
  } catch {
    return null;
  }
}

export async function joinWaitlist(email: string, source: string, website = ""): Promise<JoinResult> {
  let result: JoinResult;

  if (!URL) {
    console.warn("VITE_WAITLIST_URL is not set: the waitlist sign-up was not saved. See apps/waitlist-sheet/README.md.");
    await new Promise((resolve) => setTimeout(resolve, 500));
    result = { email, position: null, existing: false };
  } else {
    let data: { ok?: boolean; error?: string; position?: number; existing?: boolean };
    try {
      // text/plain keeps this a "simple" request: Apps Script can't answer a CORS preflight.
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          email,
          source,
          website,
          device: deviceId(),
          page: location.href,
          userAgent: navigator.userAgent,
        }),
      });
      data = await response.json();
    } catch {
      throw new JoinFailed("failed");
    }
    if (!data.ok) {
      const known: JoinError[] = ["invalid_email", "device_limit", "rate_limited"];
      throw new JoinFailed(known.includes(data.error as JoinError) ? (data.error as JoinError) : "failed");
    }
    result = { email, position: data.position || null, existing: Boolean(data.existing) };
  }

  write(JOINED_KEY, JSON.stringify(result));
  return result;
}
