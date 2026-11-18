import type { SkillGroup } from "@/content/types";

export const SKILL_GROUPS: SkillGroup[] = [
  "languages", "frontend", "backend", "data", "cloud", "versioning", "analytics", "ai",
];

/**
 * Wellmmer's own years per skill (2026-11-18): `since` is the first year he used it,
 * `years` a fixed count. AI items carry neither and show no number.
 * Order inside a group breaks ties when years are equal.
 */
export const SKILLS = {
  javascript: { label: "JavaScript", group: "languages", since: 2013 },
  typescript: { label: "TypeScript", group: "languages", since: 2013 },
  java: { label: "Java", group: "languages", since: 2011 },
  csharp: { label: "C#", group: "languages", since: 2013 },
  python: { label: "Python", group: "languages", since: 2013 },
  php: { label: "PHP", group: "languages", years: 2 },
  react: { label: "React", group: "frontend", since: 2013 },
  nextjs: { label: "Next.js", group: "frontend", since: 2016 },
  tailwind: { label: "Tailwind CSS", group: "frontend", since: 2017 },
  storybook: { label: "Storybook", group: "frontend", since: 2017 },
  redux: { label: "Redux / RTK Query", group: "frontend", since: 2015 },
  mui: { label: "Material UI", group: "frontend", since: 2016 },
  angular: { label: "Angular", group: "frontend", since: 2016 },
  "react-native": { label: "React Native", group: "frontend", since: 2019 },
  nodejs: { label: "Node.js", group: "backend", since: 2016 },
  socketio: { label: "Socket.IO", group: "backend", since: 2016 },
  express: { label: "Express", group: "backend", since: 2016 },
  fastapi: { label: "FastAPI", group: "backend", since: 2019 },
  nestjs: { label: "NestJS", group: "backend", since: 2019 },
  dotnet: { label: ".NET Core", group: "backend", years: 3 },
  "spring-boot": { label: "Spring Boot", group: "backend", since: 2018 },
  postgresql: { label: "PostgreSQL", group: "data", since: 2013 },
  sqlserver: { label: "SQL Server", group: "data", years: 4 },
  oracle: { label: "Oracle", group: "data", years: 4 },
  mongodb: { label: "MongoDB", group: "data", since: 2019 },
  dynamodb: { label: "DynamoDB", group: "data", since: 2019 },
  db2: { label: "DB2", group: "data", years: 2 },
  firestore: { label: "Firestore", group: "data", since: 2019 },
  redis: { label: "Redis", group: "data", since: 2022 },
  aws: { label: "AWS", group: "cloud", since: 2019 },
  docker: { label: "Docker", group: "cloud", since: 2019 },
  kubernetes: { label: "Kubernetes", group: "cloud", since: 2019 },
  gcp: { label: "Google Cloud (GCP)", group: "cloud", since: 2019 },
  firebase: { label: "Firebase", group: "cloud", since: 2019 },
  git: { label: "Git", group: "versioning", since: 2013 },
  sentry: { label: "Sentry", group: "analytics", since: 2019 },
  posthog: { label: "PostHog", group: "analytics", since: 2022 },
  ga4: { label: "GA4", group: "analytics", since: 2022 },
  datadog: { label: "Datadog", group: "analytics", since: 2022 },
  grafana: { label: "Grafana", group: "analytics", since: 2022 },
  "ai-agents": { label: "AI Coding Agents", group: "ai" },
  claude: { label: "Claude (Anthropic)", group: "ai" },
  chatgpt: { label: "ChatGPT (OpenAI)", group: "ai" },
  gemini: { label: "Gemini (Google)", group: "ai" },
  grok: { label: "Grok (X)", group: "ai" },
  mcp: { label: "MCP", group: "ai" },
  rag: { label: "RAG", group: "ai" },
  "multi-agents": { label: "Multi-Agents", group: "ai" },
  "custom-llm": { label: "Custom LLM", group: "ai" },
  "token-control": { label: "Token Control", group: "ai" },
} as const satisfies Record<string, { label: string; group: SkillGroup; since?: number; years?: number }>;

export type SkillId = keyof typeof SKILLS;
