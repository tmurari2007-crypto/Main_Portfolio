import { MURARI_KNOWLEDGE } from './knowledge';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Intelligent deterministic response engine grounded exclusively in Murari's verified facts.
 * Provides instant, zero-latency, context-aware answers when an external LLM key is not supplied,
 * or as a robust fallback.
 */
export function getContextualResponse(query: string, history: ChatMessage[] = []): string {
  const q = query.trim().toLowerCase();

  // Empty or minimal query
  if (!q) {
    return "Please ask a question about Murari's background, projects, skills, or education!";
  }

  // 1. Check for follow-up context in previous turn
  const lastUserMsg = history.length > 0
    ? history.filter(m => m.role === 'user').slice(-2, -1)[0]?.content.toLowerCase() || ''
    : '';

  const isFollowUpSecond = q.includes('second one') || q.includes('2nd one') || q.includes('second project');
  const isFollowUpFirst = q.includes('first one') || q.includes('1st one') || q.includes('first project');
  const isFollowUpThird = q.includes('third one') || q.includes('3rd one') || q.includes('third project') || q.includes('last one');

  if (isFollowUpFirst || (lastUserMsg.includes('project') && (q.includes('first') || q === '1'))) {
    const p = MURARI_KNOWLEDGE.projects[0];
    return `**${p.name}**\n\n${p.purpose}\n\n**Key Features:**\n- ${p.features.join('\n- ')}\n\n**Tech Stack:** ${p.tech.join(', ')}\n\n*Status:* ${p.status}`;
  }

  if (isFollowUpSecond || (lastUserMsg.includes('project') && (q.includes('second') || q === '2'))) {
    const p = MURARI_KNOWLEDGE.projects[1];
    return `**${p.name}**\n\n${p.purpose}\n\n**Key Highlights:**\n- ${p.features.join('\n- ')}\n\n**Tech Stack:** ${p.tech.join(', ')}\n\n*Status:* ${p.status}`;
  }

  if (isFollowUpThird || (lastUserMsg.includes('project') && (q.includes('third') || q === '3'))) {
    const p = MURARI_KNOWLEDGE.projects[2];
    const comps = p.components ? p.components.join(', ') : 'Arduino Uno, HC-SR04, LEDs, Buzzer';
    return `**${p.name}**\n\n${p.purpose}\n\n**Working Mechanism:**\nThe HC-SR04 ultrasonic sensor calculates the distance to the water surface in real-time. The Arduino Uno processes the threshold and triggers status LEDs (Green for normal, Yellow for warning, Red for critical) and an audible buzzer alert.\n\n**Components:** ${comps}\n\n**Tech Stack:** ${p.tech.join(', ')}`;
  }

  // 2. Contact / Email / Phone / LinkedIn / GitHub / Reach out (checked first so specific handle queries match accurately)
  if (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('phone') ||
    q.includes('mobile') ||
    q.includes('linkedin') ||
    q.includes('github') ||
    q.includes('reach out') ||
    q.includes('social') ||
    q.includes('profile link') ||
    q.includes('message')
  ) {
    return `You can connect with Murari directly through the following channels:\n\n- **GitHub:** [tmurari2007-crypto on GitHub](https://github.com/tmurari2007-crypto)\n- **LinkedIn:** [Murarisai Tadepalli on LinkedIn](https://www.linkedin.com/in/murarisai-tadepalli-03b66b402)\n- **Email:** [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com)\n- **Phone:** 9154750615\n- **Location:** Hyderabad, India`;
  }

  // 3. Who is Murari / Tell me about Murari
  if (
    q.includes('who is') ||
    q.includes('tell me about murari') ||
    q.includes('tell me about yourself') ||
    q.includes('about murari') ||
    q.includes('introduce') ||
    q.includes('bio') ||
    q === 'who'
  ) {
    return `**Murarisai Tadepalli** is a passionate second-year B.Tech student specializing in Computer Science and Engineering (IoT) at VNR VJIET, Hyderabad.\n\nHe has a **9.5 CGPA** and is focused on software development, Artificial Intelligence, Generative AI, and backend systems. He enjoys turning ideas into working prototypes like his Smart Farmer Procurement platform, Ollama semantic search experiments, and IoT water level detector.`;
  }

  // 5. Specific Projects
  // 5a. Smart Farmer Procurement System
  if (
    q.includes('farmer') ||
    q.includes('procurement') ||
    q.includes('agriculture') ||
    q.includes('booking')
  ) {
    const p = MURARI_KNOWLEDGE.projects[0];
    return `**${p.name}**\n\n${p.purpose}\n\n**Key Features:**\n- ${p.features.join('\n- ')}\n\n**Tech Stack:** ${p.tech.join(', ')}\n\n*Note:* This is a prototype focused on digital slot booking, queue management, and role-based access for farmers and administrators.`;
  }

  // 5b. Ollama / Semantic Search / LangChain / Embeddings
  if (
    q.includes('ollama') ||
    q.includes('semantic search') ||
    q.includes('embedding') ||
    q.includes('langchain') ||
    q.includes('vector') ||
    q.includes('cosine')
  ) {
    const p = MURARI_KNOWLEDGE.projects[1];
    return `**${p.name}**\n\n${p.purpose}\n\n**What it explores:**\n- Running local open-source language models via Ollama\n- Generating vector text embeddings to evaluate cosine similarity\n- Laying the foundations for Retrieval-Augmented Generation (RAG)\n- Framework integration with LangChain and REST API debugging via Postman\n\n**Tech Stack:** ${p.tech.join(', ')}`;
  }

  // 5c. Water Level / Ultrasonic / Arduino
  if (
    q.includes('water') ||
    q.includes('level') ||
    q.includes('ultrasonic') ||
    q.includes('sensor') ||
    q.includes('arduino') ||
    q.includes('buzzer') ||
    q.includes('led')
  ) {
    const p = MURARI_KNOWLEDGE.projects[2];
    return `**${p.name}**\n\n${p.purpose}\n\n**How it works:**\n1. The **HC-SR04 ultrasonic sensor** measures distance to the water surface continuously.\n2. The **Arduino Uno** computes water depth against configured thresholds.\n3. **LED Indicators:** Green (Normal), Yellow (Warning), and Red (Critical).\n4. **Buzzer:** Triggers an immediate audible alert when water nears tank capacity.\n\n**Tech Stack:** ${p.tech.join(', ')}`;
  }

  // 5d. General Projects inquiry
  if (q.includes('project') || q.includes('built') || q.includes('portfolio work') || q.includes('apps')) {
    return `Murari has engineered three core prototypes across AI, Full-Stack, and IoT:\n\n1. **AI-Based Smart Farmer Procurement System**: Digital slot booking, queue handling, and role-based workflows for farmers and admins (Node.js, Express, MongoDB).\n2. **Ollama-Based Semantic Search**: Local LLM and vector embedding experiments with LangChain and REST APIs.\n3. **IoT-Based Smart Water Level Detector**: Real-time ultrasonic sensing with Arduino Uno, tri-color LEDs, and audible buzzer alerts.\n\n*Feel free to ask for a deeper dive into any of them!*`;
  }

  // 6. Technical Skills / Programming Languages / Tech Stack
  if (
    q.includes('skill') ||
    q.includes('stack') ||
    q.includes('language') ||
    q.includes('program') ||
    q.includes('tool') ||
    q.includes('database') ||
    q.includes('know')
  ) {
    return `Here is Murari's technical toolkit:\n\n- **Programming Languages:** Python, C, Java, JavaScript\n- **Backend Development:** Node.js, Express.js, REST APIs\n- **Databases:** MongoDB, Mongoose\n- **AI & Generative AI:** Large Language Models (LLMs), RAG, LangChain, Ollama, Text Embeddings, Semantic Search\n- **IoT & Embedded Systems:** Arduino Uno, HC-SR04 Ultrasonic Sensors, Sensor Interfacing, Embedded C/C++\n- **Development Tools:** Git & GitHub, VS Code, Postman, Tinkercad`;
  }

  // 7. Generative AI / AI experience
  if (q.includes('generative ai') || q.includes('genai') || q.includes('llm') || q.includes('rag') || q.includes('ai')) {
    return `In AI and Generative AI, Murari has hands-on practical experience exploring:\n\n- **Local LLMs & Ollama:** Running and querying models locally\n- **Embeddings & Semantic Search:** Text embedding generation and cosine similarity calculation\n- **LangChain:** Framework integration for chained prompts and tools\n- **Retrieval-Augmented Generation (RAG):** Conceptual understanding and foundational experiments\n\nHe has applied these in his Ollama Semantic Search and LangChain integration projects.`;
  }

  // 8. IoT / Embedded Systems experience
  if (q.includes('iot') || q.includes('internet of things') || q.includes('embedded') || q.includes('hardware')) {
    return `Murari specializes in **Computer Science and Engineering (IoT)** at VNR VJIET. His practical IoT experience includes:\n\n- Microcontroller programming with **Arduino Uno**\n- Sensor interfacing with **HC-SR04 ultrasonic sensors**\n- Writing **Arduino C/C++** control loops and threshold logic\n- Circuit prototyping on breadboards and simulation in **Tinkercad**\n- Building his functional **Smart Water Level Detector** prototype`;
  }

  // 9. Backend Development
  if (q.includes('backend') || q.includes('server') || q.includes('api') || q.includes('node') || q.includes('express') || q.includes('mongo')) {
    return `For backend development, Murari uses:\n\n- **Runtime:** Node.js\n- **Framework:** Express.js\n- **APIs:** RESTful API design, routing, and controller architecture\n- **Databases:** MongoDB with Mongoose ODM for structured document schemas\n- **Testing:** Postman for API endpoint testing and debugging\n\nHe implemented these backend architectures in his Smart Farmer Procurement System.`;
  }

  // 10. Why Should I Hire Murari? / Key Strengths / Candidate Fit
  if (
    q.includes('why should i hire') ||
    q.includes('why hire') ||
    q.includes('why should we hire') ||
    q.includes('why murari') ||
    q.includes('strength') ||
    q.includes('why choose') ||
    q.includes('why pick') ||
    q.includes('why him') ||
    q.includes('good candidate') ||
    q.includes('value proposition')
  ) {
    return `Here is why **Murarisai Tadepalli** is a standout candidate for software engineering and AI internships:\n\n` +
      `1. **Exceptional Academic Excellence & Discipline:** Maintains a **9.5 CGPA** in B.Tech CSE-IoT at VNR VJIET (along with a 97.7% Intermediate score), demonstrating consistent rigor and deep computer science fundamentals.\n` +
      `2. **Hands-On Prototype Execution:** Rather than just theory, Murari builds real working applications—including a full-stack **Smart Farmer Procurement platform** (Node.js/Express/MongoDB), a local **Ollama & LangChain Semantic Search** engine, and a hardware **IoT Water Level Detector**.\n` +
      `3. **Modern, Interdisciplinary Skillset:** Proficient in Python, JavaScript, Java, C, modern backend architectures (Node.js/Express/REST APIs), and emerging AI paradigms (local LLMs, RAG, vector text embeddings).\n` +
      `4. **Proven Hackathon Drive & Teamwork:** Qualified for Round 2 in the competitive 24-hour Convergence Hackathon and participated in HackWithHyderabad 3.0 at Microsoft Office.\n` +
      `5. **High Learning Velocity & Readiness to Contribute:** As a driven second-year student, he learns rapidly, adapts easily to new codebases, and is excited to make an immediate impact on product teams.\n\n` +
      `Ready to discuss an opportunity? Feel free to reach out to him directly at [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com) or connect on [LinkedIn](https://www.linkedin.com/in/murarisai-tadepalli-03b66b402)!`;
  }

  // 10b. Internships / Work Experience / Hiring
  if (
    q.includes('internship') ||
    q.includes('intern') ||
    q.includes('work experience') ||
    q.includes('job') ||
    q.includes('hire') ||
    q.includes('collaborat') ||
    q.includes('available') ||
    q.includes('opportunity')
  ) {
    return `Murari is a motivated **second-year undergraduate student** actively seeking **internship opportunities** and collaborative software/AI projects to apply his skills.\n\nHe does not have previous corporate internships documented in his portfolio yet. If you are interested in discussing internships or project collaborations, feel free to contact him at [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com) or on [LinkedIn](https://www.linkedin.com/in/murarisai-tadepalli-03b66b402).`;
  }

  // 11. Hackathons / Competitions
  if (q.includes('hackathon') || q.includes('competition') || q.includes('convergence') || q.includes('hackwithhyderabad')) {
    return `Murari actively participates in collaborative hackathons:\n\n1. **Convergence 2k26 Hackathon:** Qualified to Round 2 and competed in the 24-hour hackathon at VNR VJIET's annual technical symposium.\n2. **HackWithHyderabad 3.0:** Participated in the 8-hour technology hackathon organized by Hack With India × Devnovate at Microsoft Office, Hyderabad.\n\nHe uses hackathons to practice rapid prototyping, team collaboration, and real-world problem solving.`;
  }

  // 12. Career Goals / Objective
  if (q.includes('career') || q.includes('goal') || q.includes('objective') || q.includes('future') || q.includes('aim')) {
    return `Murari's career objective is to gain practical industry experience through internships and collaborative projects, strengthen his software engineering and AI capabilities, and contribute to building innovative technology solutions that address real-world problems. His vision is to become a well-rounded developer bridging AI, backend systems, and IoT.`;
  }

  // 13. General polite greetings
  if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'greetings' || q.startsWith('hi ') || q.startsWith('hello ')) {
    return `Hello! 👋 I'm **Ask Murari**, your AI portfolio assistant. I can help you learn all about Murari's skills, projects, academics (CGPA 9.5), hackathons, and how to reach him. What would you like to know?`;
  }

  if (q.includes('thank') || q.includes('thanks') || q.includes('bye')) {
    return `You're very welcome! If you have any more questions about Murari or want to collaborate with him, don't hesitate to reach out at [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com). Have a great day!`;
  }

  // 14. Contextual fallback: Relate the question to Murari's relevant background first, then clarify at the end
  let relatedContext = '';
  if (q.includes('ai') || q.includes('ml') || q.includes('model') || q.includes('data')) {
    relatedContext = `Regarding AI and machine learning, Murari explores **local LLMs with Ollama**, **LangChain**, and **vector text embeddings & semantic search** in his experimental work.\n\n`;
  } else if (q.includes('hardware') || q.includes('robot') || q.includes('sensor') || q.includes('device')) {
    relatedContext = `Regarding embedded systems and hardware, Murari specializes in **CSE–IoT** at VNR VJIET and has built an **Arduino-based Smart Water Level Detector** using ultrasonic sensors.\n\n`;
  } else if (q.includes('web') || q.includes('app') || q.includes('frontend') || q.includes('code') || q.includes('dev')) {
    relatedContext = `In software engineering, Murari focuses on **JavaScript, Node.js, Express, and MongoDB**, having built a functional prototype for an **AI-Based Smart Farmer Procurement System**.\n\n`;
  } else if (q.includes('school') || q.includes('college') || q.includes('study') || q.includes('marks') || q.includes('grade')) {
    relatedContext = `Academically, Murari is in his **second year of B.Tech CSE-IoT at VNR VJIET** maintaining a **9.5 CGPA** with 97.7% in Intermediate.\n\n`;
  } else {
    relatedContext = `Murari is a second-year **B.Tech CSE-IoT student at VNR VJIET** with a **9.5 CGPA**, focused on software development, Generative AI prototypes, and IoT systems.\n\n`;
  }

  return `${relatedContext}While that relates to his domain of work, I don't have further specific details documented for this in Murari's portfolio yet.\n\nFeel free to explore his core projects, technical skills, or get in touch with Murari directly at [tmurari2007@gmail.com](mailto:tmurari2007@gmail.com) for more information!`;
}
