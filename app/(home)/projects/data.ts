const PROJECTS: Project[] = [
  {
    name: "Portfolio",
    description:
      "Personal platform to share my writings and showcase my open-source projects.",
    updatedAt: "2024-04",
    tags: ["TypeScript", "Next.js", "Tailwind CSS", "Redis"],
    repoUrl: "https://github.com/tifandotme/tifan.me",
  },
  {
    name: "Crumpled Paper",
    description:
      "Medium-like news publishing platform with built-in content management system. Noteable features include role-based user authentication, subscription-based content access, like system, and algorithmic trending articles section.",
    updatedAt: "2023-12",
    tags: ["TypeScript", "Next.js", "Zustand", "Tailwind CSS"],
    repoUrl: "https://github.com/tifandotme/crumpled-paper",
    demoUrl: "https://crumpled-paper.tifan.me",
    image: "projects/crumpled-paper",
  },
  {
    name: "ByeByeSick",
    description:
      "A healthcare platform that connects patients with medical professionals, enabling patients to receive diagnosis and prescriptions via online medical consultation with doctors. Patients can also order the respective medicine through the app, which only displays products from pharmacies nearest to the patient using coordinates from Google Maps Geocoding API. Other noteworthy features include stock mutation between pharmacies and a checkout flow with delivery options. This collaboration between frontend and backend developers resulted in a tightly coupled Next.js frontend and Go backend.",
    updatedAt: "2024-01",
    tags: [
      "TypeScript",
      "Go",
      "Next.js",
      "Zustand",
      "Tailwind CSS",
      "WebSocket",
      "RESTful API",
      "PostgreSQL",
    ],
    repoUrl: "https://github.com/tifandotme/byebyesick",
    image: "projects/byebyesick",
  },
  {
    name: "Puri",
    description:
      "Developed for a logistics company in Semarang, this application aims to improve the customer order processing workflow. It provides an alternative to the existing manual whiteboard method with an integrated web-based system, facilitating a seamless coordination between the sales and logistics divisions. This transition seeks to reduce human errors and increase delivery response time, enabled by real-time data display and push notifications.",
    updatedAt: "2023-04",
    tags: ["TypeScript", "React", "Chakra UI", "Firebase", "PWA"],
    repoUrl: "https://github.com/tifandotme/puri",
    demoUrl: "https://puri.tifan.me",
    image: "projects/puri",
  },
]

type Project = Readonly<{
  name: string
  description: string
  /**
   * Format: `YYYY-MM`
   */
  updatedAt: `${number}-${number}`
  tags: string[]
  repoUrl: string
  demoUrl?: string
  /**
   * Cloudinary Public ID. Ensure that the image's aspect ratio is 16:10.
   */
  image?: string
}>

export default PROJECTS.map((project) => ({
  ...project,
  stars: 0,
})).sort((a, b) => Intl.Collator().compare(b.updatedAt, a.updatedAt))
