import { AiAutomationAnim } from "./AiAutomationAnim";
import { BookkeepingAnim } from "./BookkeepingAnim";
import { DigitalMarketingAnim } from "./DigitalMarketingAnim";
import { VirtualAssistanceAnim } from "./VirtualAssistanceAnim";
import { WebDevelopmentAnim } from "./WebDevelopmentAnim";

import type { ComponentType } from "react";

const ANIMATIONS: Record<string, ComponentType> = {
  "ai-automation": AiAutomationAnim,
  "website-development": WebDevelopmentAnim,
  "digital-marketing": DigitalMarketingAnim,
  "virtual-assistance": VirtualAssistanceAnim,
  bookkeeping: BookkeepingAnim,
};

type ServiceHeroAnimProps = {
  slug: string;
};

export function ServiceHeroAnim({ slug }: ServiceHeroAnimProps) {
  const Anim = ANIMATIONS[slug] ?? AiAutomationAnim;
  return <Anim />;
}
