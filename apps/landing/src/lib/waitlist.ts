/* Talks to the waitlist Google Apps Script (apps/waitlist-sheet). */

export type JoinResult = {
  /** 1-based place on the list, or null when it isn't known (no backend configured). */
  position: number | null;
  /** True when this email had already joined. */
  existing: boolean;
};

const URL = import.meta.env.VITE_WAITLIST_URL as string | undefined;

export async function joinWaitlist(email: string, source: string, website = ""): Promise<JoinResult> {
  if (!URL) {
    console.warn("VITE_WAITLIST_URL is not set: the waitlist sign-up was not saved. See apps/waitlist-sheet/README.md.");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { position: null, existing: false };
  }

  // text/plain keeps this a "simple" request: Apps Script can't answer a CORS preflight.
  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ email, source, website, page: location.href, userAgent: navigator.userAgent }),
  });
  const data = await response.json();
  if (!data.ok) throw new Error(data.error ?? "join_failed");
  return { position: data.position || null, existing: Boolean(data.existing) };
}
