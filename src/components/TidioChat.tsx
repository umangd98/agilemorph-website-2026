import Script from "next/script";

const TIDIO_SCRIPT_SRC =
  "https://code.tidio.co/fbc0fv6zpjcezsq8ovlzcbuts54musa4.js";

export function TidioChat() {
  return <Script src={TIDIO_SCRIPT_SRC} strategy="lazyOnload" />;
}
