"use client";

import { useState } from "react";

import { CONTACT_FORM_NAME, submitNetlifyForm } from "@/lib/netlify-forms";

const field =
  "mt-2 w-full rounded-lg border border-rule bg-white px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-green focus:outline-none";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    const result = await submitNetlifyForm(form);
    if (result.ok) {
      form.reset();
      setStatus("sent");
    } else {
      setError(result.error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="border-l-2 border-green pl-5 text-lg">
        Message sent. We will reply from info@theagilemorph.com.
      </p>
    );
  }

  return (
    <form
      name={CONTACT_FORM_NAME}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="grid gap-5 sm:grid-cols-2"
    >
      <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
      <p hidden>
        <label>
          Leave this empty <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <label className="text-[0.9375rem] font-medium">
        First name
        <input name="firstName" required autoComplete="given-name" className={field} />
      </label>
      <label className="text-[0.9375rem] font-medium">
        Last name
        <input name="lastName" autoComplete="family-name" className={field} />
      </label>
      <label className="text-[0.9375rem] font-medium">
        Work email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="text-[0.9375rem] font-medium">
        Company
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <input type="hidden" name="phone" value="" />
      <label className="text-[0.9375rem] font-medium sm:col-span-2">
        What would you like AI to fix?
        <textarea
          name="message"
          required
          rows={5}
          placeholder="For example: our site teams report downtime on WhatsApp and the ERP is always behind."
          className={field}
        />
      </label>
      {status === "error" ? (
        <p role="alert" className="text-red sm:col-span-2">
          {error}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 items-center rounded-pill border border-ink px-6 text-[0.9375rem] font-medium hover:bg-ink hover:text-white disabled:opacity-60"
        >
          {status === "sending" ? "Sending" : "Send message"}
        </button>
      </div>
    </form>
  );
}
