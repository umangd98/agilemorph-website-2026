type JsonLdNode = Record<string, unknown>;

type StructuredDataProps = {
  /** One or more JSON-LD nodes to emit as <script type="application/ld+json">. */
  data: JsonLdNode | JsonLdNode[];
};

/**
 * Renders JSON-LD structured data. Each node is emitted as its own script tag.
 * Server component: the JSON is serialized at render time, no client JS.
 */
export function StructuredData({ data }: StructuredDataProps) {
  const nodes = Array.isArray(data) ? data : [data];

  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
