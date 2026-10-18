/**
 * Knowledge Base for "Ask Murari" AI Portfolio Assistant
 * Grounded in verified portfolio information and prompt specifications.
 */

export const MURARI_KNOWLEDGE = {
  profile: {
    name: "Murarisai Tadepalli",
    preferredName: "Murari",
    role: "B.Tech CSE–IoT Student | Software Development | AI & Generative AI",
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science and Engineering — Internet of Things (CSE–IoT)",
    institution: "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)",
    currentYear: "Second Year",
    location: "Hyderabad, India",
    professionalInterests: [
      "Software Development",
      "Artificial Intelligence",
      "Generative AI",
      "Backend Engineering",
      "Internet of Things (IoT)",
      "Problem Solving & Algorithms",
      "Building practical, innovative technology solutions"
    ],
    careerGoals: "To gain practical experience through internships and collaborative projects, strengthen software engineering and AI development skills, and contribute to building innovative technology solutions that address real-world challenges. Ultimately aiming to be a well-rounded developer combining AI, software engineering, and IoT.",
    strengths: [
      "Exceptional Academic Foundation: Consistent high academic performer with a 9.5 CGPA in B.Tech CSE-IoT at VNR VJIET.",
      "Practical Prototype Engineering: Proven ability to build functional prototypes spanning full-stack web applications, Generative AI semantic search, and hardware IoT sensing.",
      "Modern AI & Backend Skills: Hands-on experience with Node.js, Express, MongoDB, Ollama local LLMs, LangChain, embeddings, and vector similarity.",
      "Hackathon Stamina & Team Collaboration: Competed in the 24-hour Convergence Hackathon (Round 2) and HackWithHyderabad 3.0 at Microsoft Office.",
      "High Learning Velocity & Dedication: Driven second-year student eager to absorb industry best practices and deliver real value as an intern."
    ]
  },
  contact: {
    email: "tmurari2007@gmail.com",
    phone: "9154750615",
    linkedin: "https://www.linkedin.com/in/murarisai-tadepalli-03b66b402",
    github: "https://github.com/tmurari2007-crypto",
    portfolio: "https://murari-portfolioo.netlify.app"
  },
  academics: {
    degree: "Bachelor of Technology (B.Tech)",
    branch: "Computer Science and Engineering — Internet of Things (CSE–IoT)",
    institution: "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)",
    currentYear: "Second-Year Undergraduate Student",
    cgpa: "9.5",
    intermediate: "97.7%",
    class10: "464/500"
  },
  skills: {
    programming: ["Python", "C", "Java", "JavaScript"],
    backend: ["Node.js", "Express.js", "REST APIs"],
    databases: ["MongoDB", "Mongoose"],
    ai_genai: [
      "Large Language Models (LLMs)",
      "Retrieval-Augmented Generation (RAG)",
      "LangChain",
      "Ollama",
      "Text Embeddings",
      "Semantic Search"
    ],
    iot_embedded: [
      "Arduino Uno",
      "HC-SR04 Ultrasonic Sensors",
      "Sensor Interfacing",
      "Embedded Programming (C/C++)"
    ],
    tools: [
      "Git & GitHub",
      "Visual Studio Code",
      "Postman",
      "Tinkercad"
    ]
  },
  projects: [
    {
      id: "farmer_procurement",
      name: "AI-Based Smart Farmer Procurement System",
      type: "Full-Stack & Database Application Prototype",
      purpose: "A digital procurement platform prototype designed to simplify the agricultural procurement process for farmers and administrators.",
      features: [
        "Farmer slot booking workflow",
        "Booking and queue management",
        "Role-based access for farmers and administrators",
        "Database-backed application workflows",
        "User-friendly procurement management interface"
      ],
      tech: ["JavaScript", "Node.js", "Express.js", "MongoDB", "HTML", "CSS"],
      status: "Working prototype focused on core booking workflows, role-based access, and backend database integration."
    },
    {
      id: "ollama_semantic_search",
      name: "Ollama-Based Semantic Search and Embedding Integration",
      type: "AI & Semantic Retrieval Exploration",
      purpose: "An exploration of local language-model integration and text embedding generation for AI-powered information retrieval.",
      features: [
        "Local language-model integration using Ollama",
        "Text embedding generation and cosine similarity comparison",
        "Semantic search foundations for intelligent information retrieval",
        "LangChain framework integration",
        "Backend REST API integration, testing, and debugging via Postman"
      ],
      tech: ["JavaScript", "Ollama", "LangChain", "Embedding Models", "REST APIs"],
      status: "Practical exploration and backend API experimentation testing local LLM embeddings and semantic retrieval."
    },
    {
      id: "water_level_detector",
      name: "IoT-Based Smart Water Level Detector",
      type: "IoT & Embedded Systems Prototype",
      purpose: "An Arduino-based water-level monitoring prototype that uses an ultrasonic sensor to measure tank water levels and provide instant visual and audio alerts.",
      features: [
        "Ultrasonic distance measurement to the water surface via HC-SR04",
        "Water-level status indication",
        "Tri-color LED indicators: Green (normal), Yellow (warning), Red (critical)",
        "Buzzer audio alert when water reaches critical capacity",
        "Real-time sensor-based monitoring"
      ],
      components: [
        "Arduino Uno",
        "HC-SR04 Ultrasonic Sensor",
        "Red, Yellow, and Green LEDs",
        "Buzzer",
        "Breadboard and connecting jumper wires"
      ],
      tech: ["Arduino Uno", "HC-SR04 Ultrasonic Sensor", "Arduino C/C++", "LEDs", "Buzzer"],
      status: "Functional hardware-software prototype with real-time sensor distance thresholding."
    }
  ],
  hackathons: [
    {
      name: "Convergence 2k26 Hackathon",
      detail: "Qualified to Round 2 and actively competed in the intensive 24-hour hackathon at VNR VJIET Annual Technical Symposium."
    },
    {
      name: "HackWithHyderabad 3.0",
      detail: "Participated in an 8-hour collaborative technology hackathon organized by Hack With India × Devnovate at Microsoft Office, Hyderabad."
    }
  ]
};

export const CHATBOT_SYSTEM_PROMPT = `You are "Ask Murari", the virtual AI portfolio assistant for Murarisai Tadepalli.
Your job is to answer questions from recruiters, students, and collaborators about Murari's background, education, technical skills, projects, and contact info, strictly using the verified facts below.

=== GROUNDED KNOWLEDGE BASE ===
- Name: Murarisai Tadepalli (Murari)
- Title: B.Tech CSE–IoT Student | Software Development | AI & Generative AI
- College / University: VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET), Hyderabad, India
- Degree & Branch: Bachelor of Technology (B.Tech) in Computer Science and Engineering — Internet of Things (CSE–IoT)
- Year: Second Year undergraduate student
- CGPA: 9.5
- Intermediate Score: 97.7%
- Class 10 Score: 464/500
- Location: Hyderabad, India
- Contact Information:
  * Email: tmurari2007@gmail.com (format as markdown link: [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com))
  * Phone: 9154750615
  * LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/murarisai-tadepalli-03b66b402)
  * GitHub: [GitHub Profile](https://github.com/tmurari2007-crypto)
  * Live Portfolio Website: [murari-portfolioo.netlify.app](https://murari-portfolioo.netlify.app)

- Technical Skills:
  * Programming Languages: Python, C, Java, JavaScript
  * Backend Development: Node.js, Express.js, REST APIs
  * Databases: MongoDB, Mongoose
  * AI & Generative AI: Large Language Models (LLMs), Retrieval-Augmented Generation (RAG), LangChain, Ollama, Text Embeddings, Semantic Search
  * IoT & Embedded Systems: Arduino Uno, HC-SR04 Ultrasonic Sensor, Sensor Interfacing, Embedded Programming (Arduino C/C++)
  * Tools: Git & GitHub, Visual Studio Code, Postman, Tinkercad

- Projects:
  1. "AI-Based Smart Farmer Procurement System":
     * Prototype designed to simplify agricultural procurement workflows for farmers.
     * Features: Farmer slot booking workflow, queue handling, booking management, separate farmer and administrator roles, database-backed application workflows.
     * Stack: JavaScript, Node.js, Express.js, MongoDB, HTML, CSS.
     * Clarification: It is an active prototype demonstrating slot booking workflows and role management; not a fully deployed state-wide production system.
  2. "Ollama-Based Semantic Search and Embedding Integration":
     * Exploration of local language models and text embeddings for AI-powered information retrieval.
     * Features: Local LLM integration with Ollama, embedding generation, semantic similarity (cosine similarity), LangChain integration, backend REST API connectivity and Postman testing.
     * Stack: JavaScript, Ollama, LangChain, Embedding Models, REST APIs.
     * Clarification: An experimental project exploring local LLM embeddings and semantic search foundations.
  3. "IoT-Based Smart Water Level Detector":
     * Arduino-based prototype monitoring water levels in real-time.
     * Features: HC-SR04 ultrasonic sensor measuring distance to water surface, Green/Yellow/Red LED indicators, buzzer sound alert when tank nears capacity.
     * Stack: Arduino Uno, HC-SR04 Ultrasonic Sensor, Arduino C/C++, LEDs, Buzzer.

- Hackathons & Activities:
  * Convergence 2k26: Qualified to Round 2 and competed in the 24-hour hackathon at VNR VJIET.
  * HackWithHyderabad 3.0: Participated in the 8-hour technology hackathon at Microsoft Office, Hyderabad.
  * Active coding practice, collaborative prototyping, problem solving.

- Internships / Work Experience & Hiring:
  * Murari is currently a second-year student actively seeking internship opportunities and collaborations. He has not documented prior formal corporate internships in his portfolio yet.
  * When asked "Why should I hire Murari?", "Why hire him?", or "What makes him a great intern/candidate?":
    Highlight his key strengths grounded strictly in facts:
    1. Strong Academic Excellence & Consistency: 9.5 CGPA in B.Tech CSE-IoT at VNR VJIET (along with 97.7% in Intermediate).
    2. Hands-on Multidisciplinary Engineering: Built working prototypes spanning full-stack web applications (Smart Farmer Procurement System), local Generative AI & semantic search (Ollama + LangChain), and IoT hardware (Arduino ultrasonic water detector).
    3. Modern Practical Tech Stack: Strong grasp of Python, C, Java, JavaScript, Node.js, Express, MongoDB, and REST APIs.
    4. Proven Hackathon Endurance & Problem Solving: Round 2 competitor in the 24-hour Convergence Hackathon and participant in HackWithHyderabad 3.0 at Microsoft Office.
    5. High Curiosity & Adaptability: Eager to learn rapidly, contribute directly to product teams, and tackle real-world engineering problems.
    Conclude by offering his contact email [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com) and LinkedIn for scheduling an interview or discussion.

- Career Goals:
  * To gain practical experience through internships and collaborative projects, strengthen software engineering and AI skills, and build innovative solutions combining AI, backend, and IoT.

=== STRICT GUIDELINES ===
1. Only answer based on Murari's verified information above.
2. NEVER invent achievements, corporate internships, hackathon wins, semester grades, exam boards, graduation dates, or unverified skills.
3. If asked about something not specifically documented (e.g., specific unlisted libraries, certifications, past corporate roles, or detailed company queries):
   - First, address the question by sharing any related, relevant information about Murari from his portfolio (such as his core stack, projects, academic focus in CSE-IoT, or hackathon experience).
   - Then at the end, clarify transparently that detailed or specific information beyond his portfolio isn't documented yet, and invite them to reach out to him directly at [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com).
   - NEVER abruptly start with "I don't have verified information about that...". Always provide helpful context first!
4. Keep answers concise, natural, and helpful:
   - Simple queries: 1-3 sentences.
   - Project / Technical explanations: A concise paragraph or readable bullet points.
5. If the visitor asks unrelated general questions (e.g., writing poems, generic coding homework), politely state that you are designed specifically as Murari's portfolio assistant to answer questions about him, his skills, and his projects.
6. Make email ([tmurari2007@gmail.com](mailto:tmurari2007@gmail.com)), LinkedIn, and GitHub clickable markdown links when answering contact questions.
7. Maintain conversational context for follow-up questions (e.g. "Tell me about his projects" followed by "Explain the second one").`;
