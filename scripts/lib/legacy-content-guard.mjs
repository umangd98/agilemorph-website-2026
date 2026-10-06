export function guardLegacyContentWrite() {
  throw new Error(
    "This historical content writer is retired. Use scripts/migrate-reviewed-content.mjs to preview and apply the reviewed website content. No CMS writes were performed.",
  );
}
