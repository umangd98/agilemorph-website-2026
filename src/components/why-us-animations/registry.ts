import type { ComponentType } from "react";

import type { WhyUsAnimationType } from "@/sanity/types";

import { ExpertiseAnim } from "./ExpertiseAnim";
import { GenericAnim } from "./GenericAnim";
import { InnovationAnim } from "./InnovationAnim";
import { PartnershipAnim } from "./PartnershipAnim";
import { ProfessionalismAnim } from "./ProfessionalismAnim";
import type { WhyUsAnimProps } from "./types";

const WHY_US_ANIMS: Record<WhyUsAnimationType, ComponentType<WhyUsAnimProps>> = {
  innovation: InnovationAnim,
  professionalism: ProfessionalismAnim,
  expertise: ExpertiseAnim,
  partnership: PartnershipAnim,
  generic: GenericAnim,
};

export function getWhyUsAnim(type?: WhyUsAnimationType): ComponentType<WhyUsAnimProps> {
  return WHY_US_ANIMS[type ?? "generic"] ?? GenericAnim;
}
