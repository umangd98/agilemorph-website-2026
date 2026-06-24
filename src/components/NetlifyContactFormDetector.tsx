import { CONTACT_FORM_NAME } from "@/lib/netlify-forms";

/**
 * Netlify parses static HTML at build time to register forms.
 * This hidden duplicate must stay in sync with the live contact form fields.
 */
export function NetlifyContactFormDetector() {
  return (
    <form
      name={CONTACT_FORM_NAME}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      hidden
    >
      <input type="hidden" name="form-name" value={CONTACT_FORM_NAME} />
      <input name="bot-field" />
      <input name="firstName" />
      <input name="lastName" />
      <input name="email" />
      <input name="phone" />
      <input name="company" />
      <textarea name="message" />
    </form>
  );
}
