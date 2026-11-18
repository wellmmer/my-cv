import type { SkillGroup } from "@/content/types";

export const SKILL_GROUPS: SkillGroup[] = ["languages", "frontend", "backend", "data", "cloud", "ai"];

export const SKILLS = {
  javascript: { label: "JavaScript", group: "languages" },
  typescript: { label: "TypeScript", group: "languages" },
  java: { label: "Java", group: "languages" },
  csharp: { label: "C#", group: "languages" },
  python: { label: "Python", group: "languages" },
  php: { label: "PHP", group: "languages" },
  react: { label: "React", group: "frontend" },
  nextjs: { label: "Next.js", group: "frontend" },
  "react-native": { label: "React Native", group: "frontend" },
  angular: { label: "Angular", group: "frontend" },
  redux: { label: "Redux / RTK Query", group: "frontend" },
  tailwind: { label: "Tailwind CSS", group: "frontend" },
  mui: { label: "Material UI", group: "frontend" },
  storybook: { label: "Storybook", group: "frontend" },
  nodejs: { label: "Node.js", group: "backend" },
  nestjs: { label: "NestJS", group: "backend" },
  express: { label: "Express", group: "backend" },
  socketio: { label: "Socket.IO", group: "backend" },
  "spring-boot": { label: "Spring Boot", group: "backend" },
  dotnet: { label: ".NET", group: "backend" },
  postgresql: { label: "PostgreSQL", group: "data" },
  mongodb: { label: "MongoDB", group: "data" },
  dynamodb: { label: "DynamoDB", group: "data" },
  sqlserver: { label: "SQL Server", group: "data" },
  oracle: { label: "Oracle", group: "data" },
  db2: { label: "DB2", group: "data" },
  aws: { label: "AWS", group: "cloud" },
  "aws-lambda": { label: "AWS Lambda / serverless", group: "cloud" },
  "aws-step-functions": { label: "AWS Step Functions", group: "cloud" },
  gcp: { label: "Google Cloud", group: "cloud" },
  firebase: { label: "Firebase", group: "cloud" },
  "azure-devops": { label: "Azure DevOps", group: "cloud" },
  docker: { label: "Docker", group: "cloud" },
  sentry: { label: "Sentry", group: "cloud" },
  git: { label: "Git", group: "cloud" },
  "ai-agents": { label: "AI coding agents", group: "ai" },
} as const satisfies Record<string, { label: string; group: SkillGroup }>;

export type SkillId = keyof typeof SKILLS;
