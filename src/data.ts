export interface Project {
  num: string;
  category: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  tech: string[];
  github?: string;
  demo?: string;
  type: 'procurement' | 'semantic' | 'waterlevel';
}

export interface JourneyItem {
  year: string;
  title: string;
  org: string;
  desc: string;
}

export interface StatItem {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  sub: string;
}

export interface PlatformStat {
  count: string;
  suffix: string;
  label: string;
  highlight: boolean;
}

export interface CertItem {
  title: string;
  issuer: string;
  date: string;
  featured?: boolean;
}

export const DATA = {
  personal: {
    firstName: "MURARISAI",
    lastName: "TADEPALLI",
    fullName: "Murarisai Tadepalli",
    roleFirstLine: "MURARISAI",
    roleSecondLine: "TADEPALLI",
    professionalHeadline: "B.Tech CSE–IoT Student | Software Development | AI & Generative AI",
    college: "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science and Engineering — Internet of Things (CSE–IoT)",
    currentYear: "Second Year",
    location: "Hyderabad, India",
    headline: "Building Intelligent Solutions Through Code, AI, and IoT.",
    intro: "Hey, I'm Murarisai, a CSE–IoT student at VNR VJIET passionate about software development, Artificial Intelligence, and building innovative technology solutions. I enjoy turning ideas into practical applications while continuously exploring new technologies and improving my problem-solving skills.",
    aboutParagraphs: [
      "Hi, I'm Murarisai Tadepalli, a second-year B.Tech student specializing in Computer Science and Engineering (IoT) at VNR VJIET with a cumulative CGPA of 9.5.",
      "I'm passionate about software development, Artificial Intelligence, Generative AI, and building technology-driven solutions to real-world problems. I enjoy exploring new technologies, developing practical projects, and understanding how different systems work together to create useful applications.",
      "My technical interests include Python, C, Java, Node.js, backend development, databases, Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), and the Internet of Things.",
      "Through projects such as an AI-Based Smart Farmer Procurement System, Ollama-based semantic search experiments, and IoT-based monitoring solutions, I'm continuously working to turn ideas into functional prototypes while strengthening my technical and problem-solving skills.",
      "I also enjoy participating in hackathons, collaborating with others, and learning from new challenges. I'm always eager to explore emerging technologies, improve my development skills, and gain hands-on experience by building meaningful products.",
      "My goal is to become a well-rounded software developer who combines AI, software engineering, and IoT to create innovative and impactful solutions."
    ],
    contactMessage: "I'm always eager to learn, collaborate, and build meaningful technology solutions. If you're interested in discussing projects, exploring ideas, or connecting about internship opportunities, feel free to reach out.",
    email: "tmurari2007@gmail.com",
    phone: "9154750615",
    github: "https://github.com/tmurari2007-crypto",
    linkedin: "https://www.linkedin.com/in/murarisai-tadepalli-03b66b402",
    resumeUrl: "./resume.pdf"
  },
  stats: [
    {
      value: 2,
      decimals: 0,
      suffix: "ND",
      label: "Academic Year",
      sub: "B.Tech CSE-IoT (2nd Year)"
    },
    {
      value: 9.5,
      decimals: 1,
      suffix: "",
      label: "Cumulative CGPA",
      sub: "B.Tech @ VNR VJIET"
    }
  ] as StatItem[],
  skillCategories: {
    "Programming Languages": ["Python", "C", "Java", "JavaScript"],
    "Backend Development": ["Node.js", "Express.js", "REST API Development"],
    "Databases": ["MongoDB", "Mongoose"],
    "AI & Generative AI": [
      "Large Language Models (LLMs)",
      "Retrieval-Augmented Generation (RAG)",
      "LangChain",
      "Ollama",
      "Text Embeddings",
      "Semantic Search"
    ],
    "IoT & Embedded Systems": [
      "Arduino Uno",
      "Ultrasonic Sensors",
      "Sensor Interfacing",
      "Embedded Programming"
    ],
    "Development Tools": [
      "Git & GitHub",
      "Visual Studio Code",
      "Postman",
      "Tinkercad"
    ]
  },
  skills: [
    "Python", "C", "Java", "JavaScript",
    "Node.js", "Express.js", "MongoDB", "Mongoose",
    "LLMs", "RAG", "LangChain", "Ollama", "Embeddings", "Semantic Search",
    "Arduino Uno", "Ultrasonic Sensors", "Sensor Interfacing", "Git & GitHub", "Postman", "Tinkercad"
  ],
  projects: [
    {
      num: "01",
      category: "FULL-STACK & DATABASE APPLICATION",
      title: "SMART FARMER PROCUREMENT",
      tagline: "AI-based digital procurement platform prototype for farmers",
      description: "A digital procurement platform prototype designed to simplify the agricultural procurement process for farmers. The system focuses on slot booking, booking management, queue handling, and role-based access for farmers and administrators.",
      features: [
        "Farmer slot booking workflow",
        "Booking and queue management",
        "Farmer and administrator roles",
        "Database-backed application workflows",
        "User-friendly procurement management interface"
      ],
      tech: ["JavaScript", "Node.js", "Express.js", "MongoDB", "HTML", "CSS"],
      github: "https://github.com/tmurari2007-crypto/intelligent-shipment-piggybacking",
      type: "procurement"
    },
    {
      num: "02",
      category: "AI & SEMANTIC RETRIEVAL",
      title: "OLLAMA SEMANTIC SEARCH",
      tagline: "Local LLM integration and text embedding generation",
      description: "An exploration of local language-model integration and text embedding generation for AI-powered information retrieval. The project work involves integrating Ollama with LangChain, experimenting with embedding models, and testing backend API connectivity.",
      features: [
        "Local language-model integration",
        "Text embedding generation",
        "Semantic search foundations",
        "Backend API integration",
        "API testing and debugging"
      ],
      tech: ["JavaScript", "Ollama", "LangChain", "Embedding Models", "REST APIs"],
      github: "https://github.com/tmurari2007-crypto",
      type: "semantic"
    },
    {
      num: "03",
      category: "IOT & EMBEDDED SYSTEMS",
      title: "SMART WATER LEVEL DETECTOR",
      tagline: "Arduino-based real-time ultrasonic water level monitoring",
      description: "An Arduino-based water-level monitoring prototype that uses an ultrasonic sensor to measure the water level and provides visual and audio alerts to indicate different levels.",
      features: [
        "Ultrasonic distance measurement",
        "Water-level status indication",
        "Red, yellow, and green LED indicators",
        "Buzzer alerts",
        "Real-time sensor-based monitoring"
      ],
      tech: ["Arduino Uno", "HC-SR04 Sensor", "Arduino C/C++", "LEDs", "Buzzer"],
      github: "https://github.com/tmurari2007-crypto",
      type: "waterlevel"
    }
  ] as Project[],
  journey: {
    startYear: 2026,
    gradYear: 2026,
    items: [
      {
        year: "2026",
        title: "B.Tech Second Year (CSE–IoT) — CGPA 9.5",
        org: "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)",
        desc: "Pursuing Bachelor of Technology in Computer Science & Engineering (Internet of Things), maintaining a 9.5 CGPA with a strong focus on software development, AI architectures, and IoT systems."
      },
      {
        year: "2026",
        title: "Convergence 2k26 Hackathon (Round 2 Participant)",
        org: "VNR VJIET Annual Technical Symposium",
        desc: "Qualified to the second round and actively competed in the intensive 24-hour hackathon, designing and demonstrating practical software prototypes."
      },
      {
        year: "2026",
        title: "HackWithHyderabad 3.0",
        org: "Hack With India × Devnovate (Microsoft Office, Hyderabad)",
        desc: "Participated in an 8-hour technology hackathon exploring hands-on collaborative problem-solving and rapid prototype development."
      }
    ] as JourneyItem[]
  },
  awards: {
    platformStats: [
      { count: "2", suffix: "ND", label: "Year B.Tech Student", highlight: true },
      { count: "9.5", suffix: "", label: "Cumulative CGPA", highlight: true },
      { count: "24", suffix: "H", label: "Convergence Hackathon", highlight: false },
      { count: "3", suffix: "+", label: "Hands-on Prototypes", highlight: false }
    ] as PlatformStat[],
    certifications: [
      { title: "Convergence 2k26 Round 2 (24h Hackathon)", issuer: "VNR VJIET Symposium", date: "2026", featured: true },
      { title: "HackWithHyderabad 3.0 Participant", issuer: "Hack With India × Devnovate", date: "2026", featured: false },
      { title: "Smart Farmer Procurement Prototype", issuer: "Academic Project", date: "2026", featured: true },
      { title: "Ollama Semantic Search & LangChain", issuer: "AI Exploration", date: "2026", featured: false },
      { title: "IoT Ultrasonic Water Level Detector", issuer: "Embedded Project", date: "2025", featured: true },
      { title: "B.Tech Computer Science & Engineering (IoT)", issuer: "VNR VJIET, Hyderabad", date: "Ongoing", featured: false }
    ] as CertItem[]
  }
};
