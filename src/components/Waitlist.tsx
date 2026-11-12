import { useState, type FormEvent } from "react";
import { Icon } from "./primitives";
import "./Waitlist.css";

/**
 * Email capture for the waitlist.
 * No backend yet: this only confirms in the UI. Point `onSubmit` at the real endpoint before launch.
 */
export function WaitlistForm({ id, tone = "paper" }: { id: string; tone?: "paper" | "green" }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim()) setJoined(true);
  };

  if (joined) {
    return (
      <p className="waitlist waitlist--done" data-tone={tone} role="status">
        <strong>You're on the list.</strong> We'll write to {email} when your spot opens.
      </p>
    );
  }

  return (
    <form className="waitlist" data-tone={tone} onSubmit={onSubmit}>
      <label htmlFor={id} className="sr-only">
        Work email
      </label>
      <input
        id={id}
        type="email"
        required
        autoComplete="email"
        placeholder="Your work email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <button type="submit" className="btn btn--ink">
        Join the waitlist
        <Icon name="arrow" className="arrow" />
      </button>
    </form>
  );
}
