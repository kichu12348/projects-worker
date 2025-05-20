interface Link {
    url: string;
    icon: string;
    text: string;
}

interface Collaborator {
    name: string;
    uri: {
        type: string;
        uri: string;
        icon: string;
    }[];
}
export interface Project {
    title: string;
    description: string;
    tech: string[];
    features: string[];
    links: Link[];
    collaborators?: Collaborator[];
}



export const initialProjects:Project[] = [
  {
    title: "Vibelink – Where Vibes Connect",
    description:
      "A playful social media app designed to connect users through photos, thoughts, DMs, and private journaling. With a strong focus on personal expression and real-time interaction, it blends lighthearted features with powerful tech like encryption and real-time updates.",
    tech: ["React Native", "Expo", "Socket.io", "Express.js"],
    features: [
      "Photo & thought sharing with humor-forward UX",
      "Real-time DMs via Socket.io",
      "Private encrypted journaling for self-reflection",
      "Custom themes (Cyberpunk, Midnight Blue, Obsidian Black... and more)",
    ],
    links: [
      {
        url: "https://github.com/kichu12348/vibelink",
        icon: "Github",
        text: "GitHub",
      },
      {
        url: "https://vibelink.kichu.space",
        icon: "Info",
        text: "Learn More",
      },
    ],
  },
  {
    title: "SnapBook – Collaborative Digital Scrapbooking",
    description:
      "A real-time collaborative scrapbook app that turns memory-making into a digital art form. Users can create dreamy digital memory boards with drag, pinch, rotate, and animate capabilities—all while collaborating live with friends.",
    tech: ["React Native", "Expo", "Reanimated", "Socket.io", "Express.js"],
    features: [
      "Create scrapbooks with themed covers and custom quotes",
      "Freeform layout with animated, resizable elements",
      "Real-time collab with live editing via Socket.io",
      "Dreamy dark mode aesthetic with soft overlays",
    ],
    links: [
      {
        url: "https://github.com/kichu12348/snapbook",
        icon: "Github",
        text: "GitHub",
      },
      {
        url: "https://snapbook.kichu.space",
        icon: "Info",
        text: "Learn More",
      },
    ],
  },
  {
    title: "UTSAV 2K25 – Interactive Arts Festival",
    description:
      "A cinematic web experience designed around a fictional arts festival set on Arrakis (inspired by Dune). It merges mythical storytelling, immersive visuals, and real-time interactivity through cutting-edge front-end techniques.",
    tech: ["React", "GSAP", "CSS Modules", "Next.js"],
    features: [
      "Animated 3D pyramid hero scene with particle effects",
      "Interactive house selection with gamified visuals",
      "Flip-card event showcase with scroll-triggered animation",
      "Live scoreboard system with dynamic counters",
    ],
    links: [
      {
        url: "https://github.com/kichu12348/dune_base",
        icon: "Github",
        text: "GitHub",
      },
      {
        url: "https://utsav-2k25.vercel.app",
        icon: "Globe",
        text: "Live Demo",
      },
    ],
  },
  {
    title: "Neru – A Simple Neural Network Implementation",
    description:
      "An educational TypeScript library for implementing feed-forward neural networks with backpropagation learning. Designed for simplicity and clarity, it provides a hands-on way to understand neural networks.",
    tech: ["TypeScript"],
    features: [
      "Feed-forward propagation",
      "Simplified backpropagation learning",
      "Configurable network architecture",
      "Sigmoid activation function",
    ],
    links: [
      {
        url: "https://github.com/kichu12348/neru",
        icon: "Github",
        text: "GitHub",
      },
    ],
  },
  {
    title: "Pineabble 🎯",
    description:
      "A collection of quirky and pointless web experiences designed to cure boredom and provide endless, useless entertainment. It includes features that range from infinite scrolling and cat philosophy to progress bars that never quite make it to 100%.",
    tech: ["React", "JavaScript", "HTML", "CSS Modules", "Vite"],
    features: [
      "Infinite scrolling content with whimsical quotes",
      "Philosophical Cat page with AI-generated insights",
      "Pointless Progress Bars with zero closure",
      "History of Invisible Things and Fortune Teller Potato",
    ],
    links: [
      {
        url: "https://github.com/username/bananas",
        icon: "Github",
        text: "GitHub",
      },
      {
        url: "https://baananaa.vercel.app",
        icon: "Globe",
        text: "Live Demo",
      },
    ],
    collaborators: [
      {
        name: "Neil Oommen Renni",
        uri: [
          {
            type: "LinkedIn",
            uri: "https://www.linkedin.com/in/neil-oommen-renni-aa1694291",
            icon: "Linkedin",
          },
          {
            type: "GitHub",
            uri: "https://github.com/neilor-21",
            icon: "Github",
          },
        ],
      },
      {
        name: "Malavika G K",
        uri: [
          {
            type: "LinkedIn",
            uri: "https://www.linkedin.com/in/malavika-g-k-405089351",
            icon: "Linkedin",
          },
          {
            type: "GitHub",
            uri: "https://github.com/MalavikaGK",
            icon: "Github",
          },
        ],
      },
    ],
  },
];
