/** Motion paths for data packets traveling through the ecosystem */
export const PACKET_PATHS = [
  "M375,350 H100",
  "M375,350 H650",
  "M375,350 V150",
  "M450,350 V480 H550",
  "M375,350 H340",
] as const;

/** Centered 3-pill strip: 150px pills in 750px viewBox */
export const ADDITIONAL_SERVICE_PILLS = [
  { label: "Digital Marketing", x: 75 },
  { label: "Virtual Assistance", x: 300 },
  { label: "Website", x: 525 },
] as const;

export const ECOSYSTEM_VIEWBOX = { width: 750, height: 720 } as const;
export const ECOSYSTEM_CENTER = { x: 375, y: 350 } as const;
export const RADAR_MAX_RADIUS = 200;
