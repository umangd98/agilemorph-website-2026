import {
  ArrowUpRight,
  AudioLines,
  Database,
  FileText,
  Layers3,
  MessageSquare,
  Search,
  ShieldCheck,
  ShoppingBag,
  Workflow,
} from "lucide-react";
import type { ReactNode } from "react";
import type { Project } from "@/lib/content-types";

export function MorphMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 54 60 23l48 31v22L60 45 12 76V54Z" fill="currentColor" />
      <path d="m12 83 48-31 48 31v22L60 74l-48 31V83Z" fill="currentColor" />
    </svg>
  );
}

function Node({
  className,
  label,
  children,
  icon,
}: {
  className: string;
  label: string;
  children: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className={`art-node ${className}`}>
      <div className="art-node-label">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

const variants: Record<string, { type: string; title: string }> = {
  "publisher-content-platform": {
    type: "publisher",
    title: "Content, connected.",
  },
  "whatsapp-inventory-intake": {
    type: "inventory",
    title: "From conversation to inventory.",
  },
  "wholesale-ordering": { type: "commerce", title: "A better way to order." },
  "business-data-search": {
    type: "data",
    title: "Your data. In plain language.",
  },
  "punchbowl-support-agent": {
    type: "support",
    title: "Understand. Check. Act.",
  },
  "certifyos-document-review": {
    type: "review",
    title: "Make exceptions visible.",
  },
  "deeply-ai-coaching": {
    type: "memory",
    title: "Context that carries forward.",
  },
  "thimblerr-manufacturing": {
    type: "cloud",
    title: "Engineering beneath the surface.",
  },
};

/** Illustrations of documented workflows, never presented as product screenshots. */
export function ProjectArtwork({
  project,
  hero = false,
}: {
  project: Pick<Project, "slug" | "workflow" | "title">;
  hero?: boolean;
}) {
  const variant = variants[project.slug.current];
  if (!variant) return null;
  return (
    <figure
      className={`project-artwork art-${variant.type} ${hero ? "art-hero" : ""}`}
    >
      <div className="art-topline">
        <span>AgileMorph / system study</span>
        <ArrowUpRight size={16} aria-hidden />
      </div>
      <div className="art-scene" aria-label={variant.title}>
        <svg
          className="art-connectors"
          viewBox="0 0 600 330"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M145 90H420Q440 90 440 115V190Q440 210 420 210H310V250" />
          <path
            d="M145 90H420Q440 90 440 115V190Q440 210 420 210H310V250"
            className="art-signal-path"
          />
          <circle cx="440" cy="165" r="5" />
          <circle cx="310" cy="210" r="5" />
        </svg>
        <MorphMark className="art-watermark" />
        {variant.type === "publisher" ? (
          <>
            <Node
              className="art-input"
              label="The input"
              icon={<FileText size={15} />}
            >
              <strong>Content brief</strong>
              <div className="art-document-lines">
                <i />
                <i />
                <i />
              </div>
            </Node>
            <div className="art-engine">
              <Layers3 size={25} aria-hidden />
              <strong>Multi-model pipeline</strong>
              <div className="art-models">
                <span>Claude</span>
                <span>GPT</span>
                <span>Gemini</span>
              </div>
            </div>
            <Node
              className="art-output"
              label="The visibility"
              icon={<Search size={15} />}
            >
              <strong>Every run, in view.</strong>
              <div className="art-two-columns">
                <span>
                  Cost
                  <br />
                  <b>Tracked</b>
                </span>
                <span>
                  Quality
                  <br />
                  <b>Observable</b>
                </span>
              </div>
            </Node>
          </>
        ) : variant.type === "inventory" ? (
          <>
            <Node
              className="art-input"
              label="WhatsApp"
              icon={<MessageSquare size={15} />}
            >
              <div className="art-message">
                Photos, shorthand,
                <br />a new listing.
              </div>
              <span className="art-small">Unstructured input</span>
            </Node>
            <div className="art-engine">
              <Workflow size={28} aria-hidden />
              <strong>Extract. Structure. Route.</strong>
              <div className="art-models">
                <span>Claude</span>
                <span>n8n</span>
              </div>
            </div>
            <Node
              className="art-output"
              label="Airtable"
              icon={<Database size={15} />}
            >
              <strong>Structured inventory</strong>
              <div className="art-record">
                <i />
                <span>Listing record</span>
                <ArrowUpRight size={14} aria-hidden />
              </div>
              <div className="art-record">
                <i />
                <span>Message routing</span>
                <ArrowUpRight size={14} aria-hidden />
              </div>
            </Node>
          </>
        ) : variant.type === "commerce" ? (
          <>
            <Node
              className="art-input"
              label="The buyer"
              icon={<ShoppingBag size={15} />}
            >
              <strong>Wholesale ordering</strong>
              <div className="art-products">
                <i />
                <i />
                <i />
              </div>
            </Node>
            <div className="art-engine">
              <ShoppingBag size={28} aria-hidden />
              <strong>A connected B2B flow</strong>
              <div className="art-models">
                <span>Shopify</span>
                <span>SparkLayer</span>
              </div>
            </div>
            <Node
              className="art-output"
              label="The operations"
              icon={<Layers3 size={15} />}
            >
              <strong>Orders → reporting</strong>
              <div className="art-record">
                <i />
                <span>n8n + Airtable</span>
              </div>
              <span className="art-small">With developer handover</span>
            </Node>
          </>
        ) : variant.type === "data" ? (
          <>
            <Node
              className="art-input"
              label="The question"
              icon={<Search size={15} />}
            >
              <strong>Ask in plain language.</strong>
              <div className="art-document-lines">
                <i />
                <i />
              </div>
            </Node>
            <div className="art-engine">
              <Database size={28} aria-hidden />
              <strong>Connect through MCP</strong>
              <div className="art-models">
                <span>Natural language</span>
              </div>
            </div>
            <Node
              className="art-output"
              label="The source"
              icon={<Database size={15} />}
            >
              <strong>Existing MSSQL data</strong>
              <div className="art-data-grid">
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
            </Node>
          </>
        ) : (
          <>
            <Node
              className="art-input"
              label="The starting point"
              icon={
                variant.type === "memory" ? (
                  <AudioLines size={15} />
                ) : (
                  <FileText size={15} />
                )
              }
            >
              <strong>{project.workflow?.[0] ?? "Business workflow"}</strong>
              <div className="art-document-lines">
                <i />
                <i />
                <i />
              </div>
            </Node>
            <div className="art-engine">
              {variant.type === "support" || variant.type === "review" ? (
                <ShieldCheck size={28} aria-hidden />
              ) : variant.type === "memory" ? (
                <AudioLines size={28} aria-hidden />
              ) : (
                <Layers3 size={28} aria-hidden />
              )}
              <strong>{project.workflow?.[1]}</strong>
              <div className="art-models">
                <span>
                  {variant.type === "support"
                    ? "Transaction safeguards"
                    : variant.type === "review"
                      ? "Rule engine"
                      : variant.type === "memory"
                        ? "Contextual retrieval"
                        : "Backend engineering"}
                </span>
              </div>
            </div>
            <Node
              className="art-output"
              label="The next step"
              icon={<ArrowUpRight size={15} />}
            >
              <strong>{project.workflow?.[2]}</strong>
              <div className="art-record">
                <i />
                <span>{project.workflow?.[3]}</span>
              </div>
            </Node>
          </>
        )}
      </div>
      <figcaption>
        <span>{variant.title}</span>
        <small>Workflow illustration</small>
      </figcaption>
    </figure>
  );
}
