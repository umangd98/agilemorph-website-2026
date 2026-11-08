import type { ReactNode } from "react";

import { Container, SectionHeader } from "@/components/ui";

type FdeSectionProps = {
  id?: string;
  index: string;
  eyebrow?: string;
  heading?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
};

/** Shared shell for the FDE content sections: hairline top border, numbered header. */
export function FdeSection({
  id,
  index,
  eyebrow,
  heading,
  intro,
  children,
  className = "",
}: FdeSectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 border-t border-line py-24 sm:py-32 ${className}`}
      aria-label={heading ?? eyebrow}
    >
      <Container>
        {heading ? (
          <SectionHeader
            index={index}
            label={eyebrow ?? heading}
            title={heading}
            intro={intro}
          />
        ) : null}
        {children}
      </Container>
    </section>
  );
}
