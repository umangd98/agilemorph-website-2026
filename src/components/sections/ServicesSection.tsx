import Link from "next/link";
import { ArrowRight, Bot, Code2, TrendingUp, Users, BookOpen, MessageSquare } from "lucide-react";
import type { ComponentType } from "react";

import { Container } from "@/components/Container";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

type IconComponent = ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  Icon: IconComponent;
};

const SERVICES: ServiceItem[] = [
  {
    id: "ai-automation",
    title: "AI Automation",
    description:
      "We deliver powerful AI automation solutions designed specifically to streamline your workflow and boost business growth.",
    href: "/services/ai-automation",
    Icon: Bot,
  },
  {
    id: "web-development",
    title: "Web Development",
    description:
      "We design responsive web and mobile apps that captivate and engage users across all devices with cutting-edge tech.",
    href: "/services/web-development",
    Icon: Code2,
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    description:
      "Boost your online growth with our data-driven digital marketing, including SEO, content, and social media strategies.",
    href: "/services/digital-marketing",
    Icon: TrendingUp,
  },
  {
    id: "virtual-assistance",
    title: "Virtual Assistance",
    description:
      "We provide top-tier virtual assistant services that cater to businesses of all sizes, increasing operational bandwidth.",
    href: "/services/virtual-assistance",
    Icon: Users,
  },
  {
    id: "bookkeeping",
    title: "Book Keeping",
    description:
      "Efficient, reliable, and automated solutions designed to meet your financial management needs with precision.",
    href: "/services/bookkeeping",
    Icon: BookOpen,
  },
  {
    id: "customer-service",
    title: "Customer Service",
    description:
      "Our dedicated team ensures your queries are addressed promptly, building lasting brand trust and excellence.",
    href: "/services/customer-service",
    Icon: MessageSquare,
  },
];

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const { title, description, href, Icon } = service;

  return (
    <AnimateOnScroll delay={index * 80} className="h-full">
      <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-background p-8 shadow-sm border border-border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-foreground/5">
        {/* Green top bar that slides in on hover */}
        <div className="absolute left-0 top-0 h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />

        <Icon
          size={48}
          strokeWidth={1.5}
          className="mb-10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
        />

        <h3 className="mb-5 font-heading text-xl font-bold text-foreground">
          {title}
        </h3>
        <p className="mb-auto font-body text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <Link
          href={href}
          className="mt-8 inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all"
        >
          View Service Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </AnimateOnScroll>
  );
}

export function ServicesSection() {
  return (
    <section
      className="bg-surface py-section max-sm:py-section-sm"
      aria-labelledby="services-heading"
    >
      <Container>
        <AnimateOnScroll>
          <div className="mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <span className="mb-4 block font-body text-xs font-bold uppercase tracking-widest text-primary">
                Our Expertise
              </span>
              <h2
                id="services-heading"
                className="font-heading text-4xl font-extrabold text-foreground sm:text-5xl"
              >
                Discover Our Services
              </h2>
            </div>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 border-b border-primary pb-1 font-body text-xs font-bold uppercase tracking-widest text-primary hover:gap-3 transition-all"
            >
              View All Services
              <ArrowRight size={14} />
            </Link>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
