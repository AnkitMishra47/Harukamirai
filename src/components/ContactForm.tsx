"use client";

import { useState } from "react";
import { MagicReveal } from "@/components/effects/MagicReveal";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) return;

    const subject = encodeURIComponent(`Portfolio Contact: ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    
    // Open mailto link
    window.location.href = `mailto:ankitm17.2001@gmail.com?subject=${subject}&body=${body}`;
    
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    
    // Reset form
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <MagicReveal delay={0.1}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[var(--text)]">
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text)] placeholder-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                placeholder="Asta"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[var(--text)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text)] placeholder-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                placeholder="asta@blackbulls.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-[var(--text)]">
              Message
            </label>
            <textarea
              id="message"
              required
              minLength={10}
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-3 text-[var(--text)] placeholder-[var(--text-subtle)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-colors resize-none"
              placeholder="I'm gonna be the Wizard King!"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-7 py-3.5 text-sm font-medium text-[var(--text)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_20px_var(--accent-glow)]"
          >
            {submitted ? "Opening Mail Client..." : "Send Message"}
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </button>
          
          <div className="text-sm text-[var(--text-muted)] text-right">
            <p>This opens your email client. Response within 24 hours.</p>
            <p className="mt-1 font-mono text-xs text-[var(--text-subtle)]">Currently working IST (UTC+5:30) / AEDT hours</p>
          </div>
        </div>
      </form>
    </MagicReveal>
  );
}
