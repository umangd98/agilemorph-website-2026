export const CONTACT_FORM_NAME = "contact";

export type NetlifyFormSubmitResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitNetlifyForm(
  form: HTMLFormElement,
): Promise<NetlifyFormSubmitResult> {
  const formData = new FormData(form);
  const body = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      body.append(key, value);
    }
  }

  if (!body.has("form-name")) {
    body.set("form-name", CONTACT_FORM_NAME);
  }

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: "Something went wrong while sending your message. Please try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Unable to reach the server. Check your connection and try again.",
    };
  }
}
