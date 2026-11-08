import { aboutPage } from "./aboutPage";
import { blogIndexPage } from "./blogIndexPage";
import { blogPost } from "./blogPost";
import { companyValue } from "./companyValue";
import { contactPage } from "./contactPage";
import { ctaButton } from "./ctaButton";
import { diagram, diagramColumn, diagramStep } from "./diagram";
import { faqItem } from "./faqItem";
import { homepage } from "./homepage";
import { navLink } from "./navLink";
import { partnerItem } from "./partnerItem";
import { positioningSchemaTypes } from "./positioning";
import { seo } from "./seo";
import { siteSettings } from "./siteSettings";
import { socialLink } from "./socialLink";

export const schemaTypes = [
  ctaButton,
  seo,
  faqItem,
  diagramStep,
  diagramColumn,
  diagram,
  companyValue,
  partnerItem,
  navLink,
  socialLink,
  homepage,
  aboutPage,
  contactPage,
  blogPost,
  blogIndexPage,
  siteSettings,
  ...positioningSchemaTypes,
];
