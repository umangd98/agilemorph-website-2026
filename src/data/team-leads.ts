export type TeamLead = {
  name: string;
  role: string;
  bio: string;
  imageSrc: string;
};

export const TEAM_LEADS: TeamLead[] = [
  {
    name: "Umang Dhandhania",
    role: "CEO",
    bio: "A Northwestern-educated engineer who turns complex business puzzles into clear, revenue-lifting systems. Over the past decade he has guided more than 100 companies through launches, process overhauls, and market-ready builds that beat timelines and KPIs.",
    imageSrc: "/team/umang-dhandhania.png",
  },
  {
    name: "Kaustumbh Jaiswal",
    role: "CTO",
    bio: "Leads AgileMorph's engineering and product architecture—turning automation strategy into reliable, scalable systems. He pairs deep technical craft with a builder's mindset so every solution ships fast and holds up in production.",
    imageSrc: "/team/kaustumbh-jaiswal.png",
  },
  {
    name: "Muskan Agrawal",
    role: "COO",
    bio: "Keeps delivery sharp across client engagements—aligning teams, timelines, and outcomes so projects move from discovery to launch without friction. She brings operational rigor and a client-first lens to every engagement.",
    imageSrc: "/team/muskan-agrawal.png",
  },
];
