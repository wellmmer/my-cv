import type { L, SkillGroup } from "@/content/types";

export interface Ui {
  metaTitle: string;
  nav: { steps: string; projects: string; contact: string; language: string };
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
  contractNote: string;
  newParts: string;
  /** `{n}` is the step number. */
  newPartsInStep: string;
  /** `{n}` is the step number. */
  partsInStep: string;
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
    nav: { steps: "Steps", projects: "Projects", contact: "Contact", language: "Language" },
    sections: { steps: "Steps", builds: "Other builds", parts: "Parts inventory", appendix: "Appendix" },
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
      cloud: "Cloud and tooling",
      ai: "AI",
    },
    cta: {
      download: "Download CV (PDF)",
      plainText: "Plain text version",
      whatsapp: "WhatsApp",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    whatsappText: "Hi Wellmmer, I saw your CV and would like to talk about a role.",
    emailSubject: "Role for Wellmmer Lucas",
    contactHeading: "Last step: add yourself.",
    contractNote:
      "Contract-ready. I invoice through my own Brazilian company, ChimpCode: since 2018, and for companies abroad since 2022. B2B contract, no employer of record needed. Also on Deel.",
    newParts: "New parts",
    newPartsInStep: "New parts in step {n}",
    partsInStep: "Parts in step {n}",
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
    nav: { steps: "Etapas", projects: "Projetos", contact: "Contato", language: "Idioma" },
    sections: { steps: "Etapas", builds: "Outras construções", parts: "Inventário de peças", appendix: "Apêndice" },
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
      cloud: "Nuvem e ferramentas",
      ai: "IA",
    },
    cta: {
      download: "Baixar CV (PDF)",
      plainText: "Versão em texto simples",
      whatsapp: "WhatsApp",
      email: "E-mail",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    whatsappText: "Olá Wellmmer, vi seu currículo e gostaria de conversar sobre uma vaga.",
    emailSubject: "Vaga para Wellmmer Lucas",
    contactHeading: "Última etapa: adicione você.",
    contractNote:
      "Pronto para contrato. Emito nota fiscal pela minha empresa no Brasil, a ChimpCode: desde 2018, e para empresas do exterior desde 2022. Contrato B2B, sem necessidade de employer of record. Também trabalho via Deel.",
    newParts: "Peças novas",
    newPartsInStep: "Peças novas na etapa {n}",
    partsInStep: "Peças da etapa {n}",
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
    nav: { steps: "Pasos", projects: "Proyectos", contact: "Contacto", language: "Idioma" },
    sections: { steps: "Pasos", builds: "Otras construcciones", parts: "Inventario de piezas", appendix: "Apéndice" },
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
      cloud: "Nube y herramientas",
      ai: "IA",
    },
    cta: {
      download: "Descargar CV (PDF)",
      plainText: "Versión en texto simple",
      whatsapp: "WhatsApp",
      email: "Correo",
      linkedin: "LinkedIn",
      github: "GitHub",
    },
    whatsappText: "Hola Wellmmer, vi tu CV y me gustaría hablar sobre una vacante.",
    emailSubject: "Vacante para Wellmmer Lucas",
    contactHeading: "Último paso: agrégate tú.",
    contractNote:
      "Listo para contratar. Facturo a través de mi propia empresa en Brasil, ChimpCode: desde 2018, y a empresas del exterior desde 2022. Contrato B2B, sin necesidad de employer of record. También en Deel.",
    newParts: "Piezas nuevas",
    newPartsInStep: "Piezas nuevas en el paso {n}",
    partsInStep: "Piezas del paso {n}",
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
