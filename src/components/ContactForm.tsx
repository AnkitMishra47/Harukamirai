"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { profile } from "@/content";
import { MagicReveal } from "@/components/effects/MagicReveal";
import styles from "./contact.module.css";

/**
 * The contact surface.
 *
 * Two modes share one form: a work message, and a note about the site
 * itself. Both compose a `mailto:` and hand it to the visitor's own mail
 * client - nothing is transmitted from this page, and the copy says so
 * rather than implying a server that does not exist.
 *
 * Linking to `#note` (from the closing block on /contact) opens the form
 * in feedback mode.
 */

type Mode = "work" | "site";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

const MODES: {
  id: Mode;
  tab: string;
  blurb: string;
  messageLabel: string;
  messagePlaceholder: string;
  submit: string;
  subject: (name: string) => string;
}[] = [
  {
    id: "work",
    tab: "Work, or anything",
    blurb:
      "Work, hiring, freelance, or a question you would rather ask a person than a search box.",
    messageLabel: "Message",
    messagePlaceholder: "I'm gonna be the Wizard King!",
    submit: "Send message",
    subject: (name) => `${profile.domain} - message from ${name}`,
  },
  {
    id: "site",
    tab: "This site itself",
    blurb:
      "You have spent a few minutes inside something built on evenings and weekends, and I have no idea how it reads from the outside. A page that broke, a font you could not read, a section that dragged, or just the bit you remember. One line is plenty, and the unflattering ones are the useful ones.",
    messageLabel: "Your note",
    messagePlaceholder: "The dark theme is lovely, but that red is loud at 1am.",
    submit: "Send the note",
    subject: (name) => `${profile.domain} - a note on the site from ${name}`,
  },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text)] placeholder-[var(--text-subtle)] transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] aria-[invalid=true]:border-[var(--accent)]";

export function ContactForm() {
  const [mode, setMode] = useState<Mode>("work");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [handedOff, setHandedOff] = useState(false);
  const [copied, setCopied] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const reduceMotion = useReducedMotion();
  const active = MODES.find((m) => m.id === mode) ?? MODES[0];

  /* A `#note` link anywhere on the page opens the form in feedback mode. */
  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash !== "#note") return;
      setMode("site");
      /* If they have just handed a message off, bring the form back so the
         invitation below actually lands them on something writable. */
      setHandedOff(false);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const chooseMode = (next: Mode) => {
    setMode(next);
    /* Drop the deep link once the visitor steers for themselves, so a second
       click on "leave a note" is still able to fire a hashchange. */
    if (window.location.hash === "#note") {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  const clearError = (field: FieldName) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const validate = (): Errors => {
    const next: Errors = {};

    if (!name.trim()) {
      next.name = "Add a name - a first name is plenty.";
    }

    if (!email.trim()) {
      next.email = "Add an email address, otherwise there is nowhere to reply to.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "That address is missing something. Check for a typo around the @ or the dot.";
    }

    const body = message.trim();
    if (!body) {
      next.message = `The ${mode === "site" ? "note" : "message"} is empty. A sentence will do.`;
    } else if (body.length < 10) {
      next.message = "A little more, please - at least 10 characters so I know what you mean.";
    }

    return next;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const found = validate();
    setErrors(found);

    if (found.name) {
      nameRef.current?.focus();
      return;
    }
    if (found.email) {
      emailRef.current?.focus();
      return;
    }
    if (found.message) {
      messageRef.current?.focus();
      return;
    }

    const subject = encodeURIComponent(active.subject(name.trim()));
    const body = encodeURIComponent(`${message.trim()}\n\n- ${name.trim()} (${email.trim()})`);

    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setHandedOff(true);
  };

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard blocked or unavailable: the address is on screen anyway. */
      setCopied(false);
    }
  }, []);

  const fade = reduceMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
      };

  return (
    <section id="note" aria-labelledby="contact-form-heading" className="scroll-mt-28">
      <h2 id="contact-form-heading" className="sr-only">
        Send a message
      </h2>

      <MagicReveal delay={0.1}>
        <AnimatePresence mode="wait" initial={false}>
          {handedOff ? (
            <motion.div
              key="handed-off"
              {...fade}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-6 md:p-8"
            >
              <p className="font-display text-2xl text-[var(--text)]">Off to your mail client.</p>
              <p className="mt-3 text-[var(--text-muted)]">
                It should be waiting in a new draft with everything filled in. Nothing has reached me
                yet - this page cannot send mail on your behalf, so the last press is yours.
              </p>

              <div className="mt-6 border-t border-[var(--border)] pt-5">
                <p className="text-sm text-[var(--text-muted)]">
                  If nothing opened, the address is{" "}
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-mono text-[var(--accent)] underline underline-offset-4"
                  >
                    {profile.email}
                  </a>
                  .
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={copyAddress}
                    className="inline-flex min-h-11 items-center rounded-full border border-[var(--border-strong)] bg-[var(--bg)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    {copied ? "Copied" : "Copy the address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHandedOff(false)}
                    className="inline-flex min-h-11 items-center rounded-full px-3 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                  >
                    Back to the form
                  </button>
                </div>
                <p aria-live="polite" className="sr-only">
                  {copied ? "Email address copied to clipboard." : ""}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              {...fade}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-[var(--text)]">
                  What is this about?
                </legend>
                <div className={styles.segment}>
                  {MODES.map((m) => (
                    <div key={m.id} className={styles.segmentItem}>
                      <input
                        type="radio"
                        id={`contact-mode-${m.id}`}
                        name="contact-mode"
                        value={m.id}
                        checked={mode === m.id}
                        onChange={() => chooseMode(m.id)}
                        className={styles.segmentInput}
                      />
                      <label htmlFor={`contact-mode-${m.id}`} className={styles.segmentLabel}>
                        {m.tab}
                      </label>
                    </div>
                  ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={active.id}
                    {...fade}
                    transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="text-sm leading-relaxed text-[var(--text-muted)]"
                  >
                    {active.blurb}
                  </motion.p>
                </AnimatePresence>
              </fieldset>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-[var(--text)]">
                      Name
                    </label>
                    <input
                      ref={nameRef}
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        clearError("name");
                      }}
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={inputClass}
                      placeholder="Asta"
                    />
                    {errors.name && (
                      <p id="name-error" role="alert" className="text-sm text-[var(--accent)]">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text)]">
                      Email
                    </label>
                    <input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                      aria-invalid={errors.email ? true : undefined}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={inputClass}
                      placeholder="asta@blackbulls.com"
                    />
                    {errors.email && (
                      <p id="email-error" role="alert" className="text-sm text-[var(--accent)]">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--text)]">
                    {active.messageLabel}
                  </label>
                  <textarea
                    ref={messageRef}
                    id="message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      clearError("message");
                    }}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`${inputClass} resize-y`}
                    placeholder={active.messagePlaceholder}
                  />
                  {errors.message && (
                    <p id="message-error" role="alert" className="text-sm text-[var(--accent)]">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-7 py-3.5 text-sm font-medium text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {active.submit}
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden>
                    →
                  </span>
                </button>

                <div className="text-sm text-[var(--text-muted)] sm:max-w-xs sm:text-right">
                  <p>
                    This opens your own email client with everything filled in. Nothing leaves this
                    page until you send it from there.
                  </p>
                  <p className="mt-1 font-mono text-xs text-[var(--text-subtle)]">
                    No autoresponder, no ticket number. I read everything that lands there.
                  </p>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </MagicReveal>
    </section>
  );
}
