import type { CapabilityItem, CtaButton, Seo, WhyUsItem } from "@/sanity/types";
import servicesData from "./ai-automation-services.json";

export type AiAutomationSubService = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  heroCta: CtaButton;
  capabilitiesHeading: string;
  capabilities: CapabilityItem[];
  whyUsHeading: string;
  whyUs: WhyUsItem[];
  cta: {
    heading: string;
    description: string;
    button: CtaButton;
  };
  seo: Seo;
};

export const AI_AUTOMATION_SUB_SERVICE_DATA = servicesData as AiAutomationSubService[];

export function getAiAutomationSubService(slug: string) {
  return AI_AUTOMATION_SUB_SERVICE_DATA.find((service) => service.slug === slug);
}

export function getAiAutomationSubServiceSlugs() {
  return AI_AUTOMATION_SUB_SERVICE_DATA.map((service) => service.slug);
}
