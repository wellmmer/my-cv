import type { L, SkillGroup } from "@/content/types";

export interface Ui {
  metaTitle: string;
  /** The job title shown under the name. */
  title: string;
  nav: { steps: string; builds: string; contact: string; language: string };
  sections: { steps: string; builds: string; parts: string; appendix: string };
  atsSections: {
    summary: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    certifications: string;
    languages: string;
    award: string;
  };
  groups: Record<SkillGroup, string>;
  cta: { download: string; plainText: string; whatsapp: string; email: string; linkedin: string; github: string };
  whatsappText: string;
  emailSubject: string;
  contactHeading: string;
  /** `{deel}` marks where the Deel link goes. */
  contract: { lead: string; text: string };
  partsInThisStep: string;
  via: string;
  /** `{name}` is the company name. */
  visit: string;
  theme: { toDark: string; toLight: string };
  avatar: { showPhoto: string; showBricks: string };
  mainParts: string;
  privateMode: {
    title: string;
    text: string;
    label: string;
    button: string;
    wrong: string;
    error: string;
    close: string;
    on: string;
    lock: string;
    opening: string;
    linkBad: string;
    openCv: string;
  };
  step: string;
  client: string;
  years: [string, string];
  inProjects: string;
  links: { live: string; code: string };
  status: { shutDown: string; noLiveLink: string; wip: string };
  screenshotOf: string;
  towerLabel: string;
}

export const ui: L<Ui> = {
  en: {
    metaTitle: "Wellmmer Lucas, Senior Software Engineer",
    title: "Senior Software Engineer",
    nav: { steps: "Steps", builds: "Builds", contact: "Contact", language: "Language" },
    sections: { steps: "Build steps", builds: "Side builds", parts: "Parts bin", appendix: "Extra pieces" },
    atsSections: {
      summary: "Summary",
      experience: "Experience",
      projects: "Projects",
      skills: "Skills",
      education: "Education",
      certifications: "Certifications",
      languages: "Languages",
      award: "Award",
    },
    groups: {
      languages: "Languages",
      frontend: "Frontend",
      backend: "Backend",
      data: "Data",
      cloud: "Cloud",
      versioning: "Versioning",
      analytics: "Analytics & Monitoring",
      ai: "AI",
    },
    cta: {
      download: "Download CV (PDF)",
      plainText: "Plain-text CV (for ATS)",
      whatsapp: "WhatsApp",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    whatsappText: "Hi Wellmmer, I saw your CV and would like to talk about a role.",
    emailSubject: "Role for Wellmmer Lucas",
    contactHeading: "Last step: snap yourself on.",
    contract: {
      lead: "Contract-ready:",
      text: "I invoice through ChimpCode, my own Brazilian company, since 2018, and for companies abroad since 2022. B2B contract, no employer of record needed. I'm also on {deel}, and open to any other platform you prefer.",
    },
    partsInThisStep: "Parts in this step",
    via: "via",
    visit: "Visit {name}",
    theme: { toDark: "Switch to dark mode", toLight: "Switch to light mode" },
    avatar: { showPhoto: "Show my photo", showBricks: "Show the brick version" },
    mainParts: "Main parts of all steps",
    privateMode: {
      title: "Secret build unlocked",
      text: "Got a code from Wellmmer? Snap it in to see the newest step.",
      label: "Code",
      button: "Unlock",
      wrong: "That piece doesn't fit. Check the code and try again.",
      error: "Something jammed. Try again in a moment.",
      close: "Close",
      on: "Private build on",
      lock: "Lock",
      opening: "Snapping the private build in…",
      linkBad: "This link no longer works. Ask Wellmmer for a new one.",
      openCv: "Open the CV",
    },
    step: "Step",
    client: "Client",
    years: ["yr", "yrs"],
    inProjects: "in projects",
    links: { live: "Live", code: "Code" },
    status: { shutDown: "Shut down", noLiveLink: "No live link yet", wip: "Work in progress" },
    screenshotOf: "Screenshot of",
    towerLabel: "Career tower, one brick per step",
  },
  pt: {
    metaTitle: "Wellmmer Lucas, Engenheiro de Software Sênior",
    title: "Engenheiro de Software Sênior",
    nav: { steps: "Etapas", builds: "Montagens", contact: "Contato", language: "Idioma" },
    sections: { steps: "Etapas da montagem", builds: "Montagens paralelas", parts: "Caixa de peças", appendix: "Peças extras" },
    atsSections: {
      summary: "Resumo",
      experience: "Experiência",
      projects: "Projetos",
      skills: "Habilidades",
      education: "Formação",
      certifications: "Certificações",
      languages: "Idiomas",
      award: "Prêmio",
    },
    groups: {
      languages: "Linguagens",
      frontend: "Frontend",
      backend: "Backend",
      data: "Dados",
      cloud: "Nuvem",
      versioning: "Versionamento",
      analytics: "Analytics e Monitoramento",
      ai: "IA",
    },
    cta: {
      download: "Baixar CV (PDF)",
      plainText: "CV em texto simples (para ATS)",
      whatsapp: "WhatsApp",
      email: "E-mail",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    whatsappText: "Olá Wellmmer, vi seu currículo e gostaria de conversar sobre uma vaga.",
    emailSubject: "Vaga para Wellmmer Lucas",
    contactHeading: "Última etapa: encaixe-se aqui.",
    contract: {
      lead: "Pronto para contrato:",
      text: "emito nota pela ChimpCode, minha empresa no Brasil, desde 2018, e para empresas do exterior desde 2022. Contrato B2B, sem employer of record. Também assino pela {deel} ou por qualquer outra plataforma.",
    },
    partsInThisStep: "Peças desta etapa",
    via: "via",
    visit: "Visitar {name}",
    theme: { toDark: "Ativar modo escuro", toLight: "Ativar modo claro" },
    avatar: { showPhoto: "Mostrar minha foto", showBricks: "Mostrar a versão em blocos" },
    mainParts: "Peças principais de todas as etapas",
    privateMode: {
      title: "Construção secreta desbloqueada",
      text: "Recebeu um código do Wellmmer? Encaixe aqui para ver a etapa mais nova.",
      label: "Código",
      button: "Desbloquear",
      wrong: "Essa peça não encaixa. Confira o código e tente de novo.",
      error: "Algo travou. Tente de novo em instantes.",
      close: "Fechar",
      on: "Construção privada ativa",
      lock: "Bloquear",
      opening: "Encaixando a construção privada…",
      linkBad: "Este link não funciona mais. Peça um novo ao Wellmmer.",
      openCv: "Abrir o currículo",
    },
    step: "Etapa",
    client: "Cliente",
    years: ["ano", "anos"],
    inProjects: "em projetos",
    links: { live: "Ao vivo", code: "Código" },
    status: { shutDown: "Encerrado", noLiveLink: "Ainda sem link ao vivo", wip: "Em andamento" },
    screenshotOf: "Captura de tela de",
    towerLabel: "Torre da carreira, um bloco por etapa",
  },
  es: {
    metaTitle: "Wellmmer Lucas, Ingeniero de Software Sénior",
    title: "Ingeniero de Software Sénior",
    nav: { steps: "Pasos", builds: "Montajes", contact: "Contacto", language: "Idioma" },
    sections: { steps: "Pasos de montaje", builds: "Montajes paralelos", parts: "Caja de piezas", appendix: "Piezas extra" },
    atsSections: {
      summary: "Resumen",
      experience: "Experiencia",
      projects: "Proyectos",
      skills: "Habilidades",
      education: "Educación",
      certifications: "Certificaciones",
      languages: "Idiomas",
      award: "Premio",
    },
    groups: {
      languages: "Lenguajes",
      frontend: "Frontend",
      backend: "Backend",
      data: "Datos",
      cloud: "Nube",
      versioning: "Versionado",
      analytics: "Analítica y Monitoreo",
      ai: "IA",
    },
    cta: {
      download: "Descargar CV (PDF)",
      plainText: "CV en texto simple (para ATS)",
      whatsapp: "WhatsApp",
      email: "Correo",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    whatsappText: "Hola Wellmmer, vi tu CV y me gustaría hablar sobre una vacante.",
    emailSubject: "Vacante para Wellmmer Lucas",
    contactHeading: "Último paso: encájate aquí.",
    contract: {
      lead: "Listo para contratar:",
      text: "facturo con ChimpCode, mi propia empresa en Brasil, desde 2018, y a empresas del exterior desde 2022. Contrato B2B, sin necesidad de employer of record. También estoy en {deel}, o firmo por la plataforma que prefieras.",
    },
    partsInThisStep: "Piezas de este paso",
    via: "vía",
    visit: "Visitar {name}",
    theme: { toDark: "Activar modo oscuro", toLight: "Activar modo claro" },
    avatar: { showPhoto: "Mostrar mi foto", showBricks: "Mostrar la versión en bloques" },
    mainParts: "Piezas principales de todos los pasos",
    privateMode: {
      title: "Construcción secreta desbloqueada",
      text: "¿Tienes un código de Wellmmer? Encájalo para ver el paso más nuevo.",
      label: "Código",
      button: "Desbloquear",
      wrong: "Esa pieza no encaja. Revisa el código e inténtalo de nuevo.",
      error: "Algo se trabó. Inténtalo de nuevo en un momento.",
      close: "Cerrar",
      on: "Construcción privada activa",
      lock: "Bloquear",
      opening: "Encajando la construcción privada…",
      linkBad: "Este enlace ya no funciona. Pídele uno nuevo a Wellmmer.",
      openCv: "Abrir el CV",
    },
    step: "Paso",
    client: "Cliente",
    years: ["año", "años"],
    inProjects: "en proyectos",
    links: { live: "En vivo", code: "Código" },
    status: { shutDown: "Cerrado", noLiveLink: "Aún sin enlace en vivo", wip: "En progreso" },
    screenshotOf: "Captura de pantalla de",
    towerLabel: "Torre de la carrera, un bloque por paso",
  },
};
