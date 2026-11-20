import type { Cv, L } from "@/content/types";

const SP: L = { en: "São Paulo, Brazil", pt: "São Paulo, Brasil", es: "São Paulo, Brasil" };
const SOROCABA: L = {
  en: "Sorocaba, São Paulo, Brazil",
  pt: "Sorocaba, São Paulo, Brasil",
  es: "Sorocaba, São Paulo, Brasil",
};
const SENIOR_FULLSTACK: L = {
  en: "Senior Fullstack Developer",
  pt: "Desenvolvedor Fullstack Sênior",
  es: "Desarrollador Fullstack Sénior",
};

export const cv: Cv = {
  name: "Wellmmer Lucas",

  summary: {
    en: "Senior Software Engineer. I've been snapping JavaScript bricks together since 2013: web, mobile and backend, from React and React Native to Node.js and NestJS. These days AI agents build alongside me. Remote from Sorocaba, Brazil (UTC-3).",
    pt: "Engenheiro de Software Sênior. Encaixo blocos de JavaScript desde 2013: web, mobile e backend, de React e React Native a Node.js e NestJS. Hoje, agentes de IA constroem junto comigo. Remoto de Sorocaba, Brasil (UTC-3).",
    es: "Ingeniero de Software Sénior. Encajo bloques de JavaScript desde 2013: web, mobile y backend, de React y React Native a Node.js y NestJS. Hoy, agentes de IA construyen a mi lado. Remoto desde Sorocaba, Brasil (UTC-3).",
  },

  // Oldest first. Bullets use only facts from the old CV and LinkedIn.
  steps: [
    {
      n: 1,
      id: "ipt",
      company: "IPT",
      short: "IPT",
      companyUrl: "https://ipt.br",
      role: { en: "Trainee Researcher", pt: "Pesquisador Trainee", es: "Investigador en Formación" },
      start: "2013-03",
      end: "2015-03",
      city: SP,
      brick: "blue",
      bullets: {
        en: [
          "Built software for São Paulo State Government projects.",
          "Did technology research and wrote articles and technical manuals; my 2013 article on Arduino-based smart traffic won Top Article.",
          "Automated quality tests in my first agile team.",
        ],
        pt: [
          "Desenvolvi software para projetos do Governo do Estado de São Paulo.",
          "Fiz pesquisa em tecnologia e escrevi artigos e manuais técnicos; meu artigo de 2013 sobre trânsito inteligente com Arduino ganhou o prêmio de Melhor Artigo.",
          "Automatizei testes de qualidade no meu primeiro time ágil.",
        ],
        es: [
          "Desarrollé software para proyectos del Gobierno del Estado de São Paulo.",
          "Hice investigación en tecnología y escribí artículos y manuales técnicos; mi artículo de 2013 sobre tráfico inteligente con Arduino ganó el premio al Mejor Artículo.",
          "Automaticé pruebas de calidad en mi primer equipo ágil.",
        ],
      },
      uses: ["javascript", "java", "csharp", "oracle", "sqlserver", "git"],
    },
    {
      n: 2,
      id: "valemobi",
      company: "Valemobi",
      companyUrl: "https://www.valemobi.com.br",
      role: {
        en: "Junior Fullstack Developer",
        pt: "Desenvolvedor Fullstack Júnior",
        es: "Desarrollador Fullstack Júnior",
      },
      start: "2016-02",
      end: "2017-02",
      city: SP,
      brick: "yellow",
      bullets: {
        en: [
          "Built web and mobile apps for financial-market clients: banks, brokerages, investment advisers and stock exchanges.",
          "Worked on architecture, development and maintenance across many client projects.",
        ],
        pt: [
          "Desenvolvi apps web e mobile para clientes do mercado financeiro: bancos, corretoras, consultorias de investimento e bolsas de valores.",
          "Atuei em arquitetura, desenvolvimento e manutenção em vários projetos de clientes.",
        ],
        es: [
          "Desarrollé apps web y móviles para clientes del mercado financiero: bancos, corredoras, asesores de inversión y bolsas de valores.",
          "Trabajé en arquitectura, desarrollo y mantenimiento en muchos proyectos de clientes.",
        ],
      },
      uses: ["javascript", "typescript", "angular", "react", "java", "php", "nodejs", "postgresql", "docker", "git"],
    },
    {
      n: 3,
      id: "iatec",
      company: "IATec",
      companyUrl: "https://www.iatec.com",
      role: {
        en: "Dev Lead & Fullstack Developer",
        pt: "Dev Lead e Desenvolvedor Fullstack",
        es: "Dev Lead y Desarrollador Fullstack",
      },
      start: "2017-03",
      end: "2018-07",
      city: {
        en: "Hortolândia, São Paulo, Brazil",
        pt: "Hortolândia, São Paulo, Brasil",
        es: "Hortolândia, São Paulo, Brasil",
      },
      brick: "black",
      bullets: {
        en: [
          "Led a team of 7 developers on the ASAS project.",
          "Shaped the solution architecture and built the most complex features in Angular and C# .NET Core.",
        ],
        pt: [
          "Liderei um time de 7 desenvolvedores no projeto ASAS.",
          "Defini a arquitetura da solução e desenvolvi as funcionalidades mais complexas em Angular e C# .NET Core.",
        ],
        es: [
          "Lideré un equipo de 7 desarrolladores en el proyecto ASAS.",
          "Definí la arquitectura de la solución y desarrollé las funcionalidades más complejas en Angular y C# .NET Core.",
        ],
      },
      uses: ["javascript", "typescript", "angular", "csharp", "dotnet", "sqlserver"],
    },
    {
      n: 4,
      id: "gft-1",
      company: "GFT Group",
      short: "GFT",
      companyUrl: "https://www.gft.com",
      client: "Deutsche Bank",
      role: { en: "Fullstack Developer", pt: "Desenvolvedor Fullstack", es: "Desarrollador Fullstack" },
      start: "2018-07",
      end: "2019-07",
      city: SOROCABA,
      brick: "grey",
      bullets: {
        en: [
          "Moved a Deutsche Bank application's frontend from GWT to Angular.",
          "Moved its backend from RPC to REST in Java with Spring Boot, and gave the client technical designs.",
        ],
        pt: [
          "Migrei o frontend de uma aplicação do Deutsche Bank de GWT para Angular.",
          "Migrei o backend de RPC para REST em Java com Spring Boot e entreguei desenhos técnicos ao cliente.",
        ],
        es: [
          "Migré el frontend de una aplicación de Deutsche Bank de GWT a Angular.",
          "Migré el backend de RPC a REST en Java con Spring Boot y entregué diseños técnicos al cliente.",
        ],
      },
      uses: ["javascript", "typescript", "angular", "java", "spring-boot", "storybook"],
    },
    {
      n: 5,
      id: "tippou",
      company: "Tippou",
      role: { en: "Co-Founder & CTO", pt: "Cofundador e CTO", es: "Cofundador y CTO" },
      start: "2019-07",
      end: "2020-04",
      city: SOROCABA,
      brick: "red",
      bullets: {
        en: [
          "Designed the architecture of Tippou, a digital wallet for tips, and led a team of 4 developers.",
          "Shipped the MVP to the App Store and Google Play in 4 months and grew to almost 1,000 users in under a year.",
          "Built payments by balance, card and QR code, with cashback, loyalty points, coupons and split bills.",
        ],
        pt: [
          "Projetei a arquitetura do Tippou, uma carteira digital para gorjetas, e liderei um time de 4 desenvolvedores.",
          "Lancei o MVP na App Store e no Google Play em 4 meses, com quase mil usuários em menos de um ano.",
          "Desenvolvi pagamentos por saldo, cartão e QR code, com cashback, pontos de fidelidade, cupons e divisão de contas.",
        ],
        es: [
          "Diseñé la arquitectura de Tippou, una billetera digital para propinas, y lideré un equipo de 4 desarrolladores.",
          "Lancé el MVP en App Store y Google Play en 4 meses, con casi mil usuarios en menos de un año.",
          "Desarrollé pagos con saldo, tarjeta y código QR, con cashback, puntos de fidelidad, cupones y división de cuentas.",
        ],
      },
      note: {
        en: "Tippou shut down in April 2020, during the COVID-19 pandemic.",
        pt: "O Tippou encerrou as atividades em abril de 2020, durante a pandemia de COVID-19.",
        es: "Tippou cerró en abril de 2020, durante la pandemia de COVID-19.",
      },
      uses: [
        "javascript", "typescript", "react", "react-native", "redux", "mui", "nodejs", "express",
        "mongodb", "dynamodb", "aws", "firebase", "gcp",
      ],
    },
    {
      n: 6,
      id: "gft-2",
      company: "GFT Group",
      short: "GFT",
      companyUrl: "https://www.gft.com",
      client: "Deutsche Bank",
      role: SENIOR_FULLSTACK,
      start: "2020-06",
      end: "2021-03",
      city: SOROCABA,
      brick: "blue",
      bullets: {
        en: [
          "Built APIs, microservices and job schedulers in Java with Spring Boot for Deutsche Bank.",
          "Maintained a legacy C# .NET application and an Angular web app.",
          "Exported and migrated data across DB2, SAP Sybase, Oracle and SQL Server.",
        ],
        pt: [
          "Desenvolvi APIs, microsserviços e agendadores de jobs em Java com Spring Boot para o Deutsche Bank.",
          "Mantive uma aplicação legada em C# .NET e um app web em Angular.",
          "Exportei e migrei dados entre DB2, SAP Sybase, Oracle e SQL Server.",
        ],
        es: [
          "Desarrollé APIs, microservicios y planificadores de jobs en Java con Spring Boot para Deutsche Bank.",
          "Mantuve una aplicación heredada en C# .NET y una app web en Angular.",
          "Exporté y migré datos entre DB2, SAP Sybase, Oracle y SQL Server.",
        ],
      },
      uses: ["javascript", "typescript", "angular", "java", "spring-boot", "csharp", "dotnet", "db2", "oracle", "sqlserver"],
    },
    {
      n: 7,
      id: "fyture",
      company: "Fyture",
      product: "Sales Journey + WedClub",
      role: {
        en: "Dev Lead & Senior Fullstack Developer",
        pt: "Dev Lead e Desenvolvedor Fullstack Sênior",
        es: "Dev Lead y Desarrollador Fullstack Sénior",
      },
      start: "2021-03",
      end: "2022-08",
      city: SP,
      brick: "yellow",
      bullets: {
        en: [
          "Led a team of 6 developers on two products in parallel, Sales Journey and WedClub.",
          "Co-designed the Sales Journey pricing engine and moved it from Python to Node.js.",
          "Owned the solution architecture and the most complex features.",
        ],
        pt: [
          "Liderei um time de 6 desenvolvedores em dois produtos em paralelo, Sales Journey e WedClub.",
          "Coprojetei o motor de precificação do Sales Journey e o migrei de Python para Node.js.",
          "Fui responsável pela arquitetura da solução e pelas funcionalidades mais complexas.",
        ],
        es: [
          "Lideré un equipo de 6 desarrolladores en dos productos en paralelo, Sales Journey y WedClub.",
          "Codiseñé el motor de precios de Sales Journey y lo migré de Python a Node.js.",
          "Fui responsable de la arquitectura de la solución y de las funcionalidades más complejas.",
        ],
      },
      uses: [
        "javascript", "typescript", "react", "nextjs", "react-native", "tailwind", "mui", "nodejs", "express",
        "socketio", "mongodb", "aws", "sentry", "python",
      ],
    },
    {
      n: 8,
      id: "stickchart",
      company: "StickChart",
      companyUrl: "https://www.stickchart.com",
      role: SENIOR_FULLSTACK,
      start: "2022-08",
      end: "2025-02",
      city: { en: "Atlanta, US", pt: "Atlanta, EUA", es: "Atlanta, EE. UU." },
      brick: "black",
      bullets: {
        en: [
          "Built core features of the StickChart MVP and moved parts of the API to serverless on AWS.",
          "Designed a two-way integration module with CRMs such as SAP, Salesforce and HubSpot.",
          "Built workflow and process control with AWS Step Functions.",
        ],
        pt: [
          "Desenvolvi funcionalidades centrais do MVP da StickChart e migrei partes da API para serverless na AWS.",
          "Projetei um módulo de integração bidirecional com CRMs como SAP, Salesforce e HubSpot.",
          "Desenvolvi o controle de fluxos e processos com AWS Step Functions.",
        ],
        es: [
          "Desarrollé funcionalidades centrales del MVP de StickChart y migré partes de la API a serverless en AWS.",
          "Diseñé un módulo de integración bidireccional con CRMs como SAP, Salesforce y HubSpot.",
          "Desarrollé el control de flujos y procesos con AWS Step Functions.",
        ],
      },
      uses: [
        "javascript", "typescript", "react", "nextjs", "mui", "nodejs", "express", "socketio",
        "postgresql", "aws", "sentry",
      ],
    },
    {
      n: 9,
      id: "ryelabs",
      company: "RyeLabs",
      companyUrl: "https://www.ryelabs.co",
      product: "Finove",
      role: SENIOR_FULLSTACK,
      start: "2022-12",
      end: "2023-03",
      city: { en: "New York, US", pt: "Nova York, EUA", es: "Nueva York, EE. UU." },
      brick: "blue",
      bullets: {
        en: [
          "Built and maintained Finove, a B2B payments and credit platform for Brazil.",
          "Worked on its architecture until Finove shut down.",
        ],
        pt: [
          "Desenvolvi e mantive a Finove, uma plataforma B2B de pagamentos e crédito para o Brasil.",
          "Atuei na arquitetura até o encerramento da Finove.",
        ],
        es: [
          "Desarrollé y mantuve Finove, una plataforma B2B de pagos y crédito para Brasil.",
          "Trabajé en su arquitectura hasta el cierre de Finove.",
        ],
      },
      uses: [
        "javascript", "typescript", "react", "nextjs", "redux", "tailwind", "storybook",
        "nodejs", "nestjs", "postgresql", "aws", "sentry",
      ],
    },
    {
      n: 10,
      id: "cial",
      company: "CIAL Dun & Bradstreet",
      short: "CIAL D&B",
      companyUrl: "https://www.cialdnb.com",
      product: "Dunsguide",
      via: "RyeLabs",
      role: SENIOR_FULLSTACK,
      start: "2023-03",
      end: "now",
      city: { en: "Jacksonville, US", pt: "Jacksonville, EUA", es: "Jacksonville, EE. UU." },
      brick: "red",
      bullets: {
        en: [
          { lead: "CIAL360 Task Hub", text: "built the live Tasks area where companies complete their CIAL360 requests, from the event webhook to typed real-time refresh over SSE and Redis, rolled out behind a feature flag." },
          { lead: "DUNS Doctor", text: "in a hackathon, built an internal tool that diagnoses a company's data: a health score, issues by severity, data-source panels and an AI summary for support teams." },
          { lead: "Pulso", text: "built Mexico financial-health and compliance views on SAT and Buró data, with a streaming AI assistant that uses tool calling and live web scraping." },
          { lead: "AI-first workflow", text: "work with Claude Code every day: written plans, subagent-driven development, and automated PR and security reviews across a Next.js and NestJS stack." },
          { lead: "SAT Auth Flow", text: "built the flow where a company proves who it is with its SAT tax credentials to unlock its tax data: queue-based checks, typed failure reasons, retries and recovery screens." },
          { lead: "Buró Auth Flow", text: "built the online Buró de Crédito authorization with e-signature and the automatic credit-report order behind it: worker jobs, ID-mismatch guards and a retry sweep." },
        ],
        pt: [
          { lead: "CIAL360 Task Hub", text: "criei a área de Tarefas ao vivo, onde as empresas concluem suas solicitações do CIAL360, do webhook de eventos à atualização em tempo real tipada via SSE e Redis, liberada por feature flag." },
          { lead: "DUNS Doctor", text: "num hackathon, criei uma ferramenta interna que diagnostica os dados de uma empresa: score de saúde, problemas por severidade, painéis por fonte de dados e um resumo com IA para o time de suporte." },
          { lead: "Pulso", text: "criei as visões de saúde financeira e compliance do México com dados do SAT e do Buró, com um assistente de IA em streaming que usa tool calling e web scraping ao vivo." },
          { lead: "Fluxo AI-first", text: "trabalho com Claude Code todos os dias: planos escritos, desenvolvimento com subagentes e revisões automáticas de PR e segurança numa stack Next.js e NestJS." },
          { lead: "SAT Auth Flow", text: "criei o fluxo em que a empresa comprova sua identidade com as credenciais fiscais do SAT para liberar seus dados fiscais: verificações em fila, motivos de falha tipados, novas tentativas e telas de recuperação." },
          { lead: "Buró Auth Flow", text: "criei a autorização online do Buró de Crédito com assinatura eletrônica e o pedido automático do relatório de crédito por trás dela: jobs em workers, proteção contra IDs divergentes e varredura de novas tentativas." },
        ],
        es: [
          { lead: "CIAL360 Task Hub", text: "creé el área de Tareas en vivo donde las empresas completan sus solicitudes de CIAL360, desde el webhook de eventos hasta la actualización en tiempo real tipada vía SSE y Redis, lanzada con feature flag." },
          { lead: "DUNS Doctor", text: "en un hackathon, creé una herramienta interna que diagnostica los datos de una empresa: puntaje de salud, problemas por severidad, paneles por fuente de datos y un resumen con IA para el equipo de soporte." },
          { lead: "Pulso", text: "creé las vistas de salud financiera y cumplimiento de México con datos del SAT y del Buró, con un asistente de IA en streaming que usa tool calling y web scraping en vivo." },
          { lead: "Flujo AI-first", text: "trabajo con Claude Code todos los días: planes escritos, desarrollo con subagentes y revisiones automáticas de PR y seguridad en un stack Next.js y NestJS." },
          { lead: "SAT Auth Flow", text: "creé el flujo en el que la empresa acredita su identidad con sus credenciales fiscales del SAT para desbloquear sus datos fiscales: verificaciones en cola, motivos de falla tipados, reintentos y pantallas de recuperación." },
          { lead: "Buró Auth Flow", text: "creé la autorización en línea del Buró de Crédito con firma electrónica y el pedido automático del reporte de crédito detrás de ella: jobs en workers, protección contra IDs que no coinciden y un barrido de reintentos." },
        ],
      },
      pdfBullets: 4,
      uses: [
        "javascript", "typescript", "react", "nextjs", "redux", "tailwind", "storybook",
        "nodejs", "nestjs", "socketio", "postgresql", "redis", "aws", "sentry", "posthog",
        "ai-agents", "claude", "chatgpt",
      ],
    },
  ],

  projects: [
    {
      id: "computable",
      name: "Computable",
      size: "lg",
      status: "live",
      what: {
        en: "A Turing machine simulator for teaching computer science. My final project for the Computer Science degree.",
        pt: "Um simulador de máquina de Turing para ensinar ciência da computação. Meu trabalho de conclusão do bacharelado em Ciência da Computação.",
        es: "Un simulador de máquina de Turing para enseñar ciencias de la computación. Mi proyecto final de la carrera de Ciencias de la Computación.",
      },
      role: { en: "Designed and built it.", pt: "Projetei e desenvolvi.", es: "Lo diseñé y desarrollé." },
      stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "React Flow", "Zustand", "MDX", "Playwright"],
      uses: ["typescript", "react", "nextjs", "tailwind", "ai-agents"],
      live: "https://computable-lac.vercel.app",
      repo: "https://github.com/wellmmer/computable",
      shot: "/shots/computable.png",
    },
    {
      id: "campeonato",
      name: "Campeonato App",
      size: "lg",
      status: "live",
      what: {
        en: "The official record of LIFAS, the Adventist football league of Sorocaba: championships, matches, goals and seasons.",
        pt: "O registro oficial da LIFAS, a liga de futebol adventista de Sorocaba: campeonatos, jogos, gols e temporadas.",
        es: "El registro oficial de LIFAS, la liga de fútbol adventista de Sorocaba: campeonatos, partidos, goles y temporadas.",
      },
      role: {
        en: "Built with Matheus Alamino.",
        pt: "Desenvolvido com Matheus Alamino.",
        es: "Desarrollado con Matheus Alamino.",
      },
      stack: ["Next.js"],
      uses: ["nextjs"],
      live: "https://campeonato-app.vercel.app",
      shot: "/shots/campeonato.png",
    },
    {
      id: "tippou",
      name: "Tippou",
      size: "md",
      status: "story",
      what: {
        en: "A digital wallet for tips. MVP in both app stores in 4 months, and almost 1,000 users in under a year. Shut down during the COVID-19 pandemic.",
        pt: "Uma carteira digital para gorjetas. MVP nas duas lojas de apps em 4 meses e quase mil usuários em menos de um ano. Encerrada durante a pandemia de COVID-19.",
        es: "Una billetera digital para propinas. MVP en las dos tiendas de apps en 4 meses y casi mil usuarios en menos de un año. Cerró durante la pandemia de COVID-19.",
      },
      role: { en: "Co-founder and CTO.", pt: "Cofundador e CTO.", es: "Cofundador y CTO." },
      stack: ["React Native", "React", "Node.js", "MongoDB", "AWS", "Firebase"],
      uses: ["react-native", "react", "nodejs", "mongodb", "aws", "firebase"],
    },
    {
      id: "megasenha",
      name: "Megasenha",
      size: "sm",
      status: "story",
      what: {
        en: "A word game for a youth group.",
        pt: "Um jogo de palavras para um grupo de jovens.",
        es: "Un juego de palabras para un grupo de jóvenes.",
      },
      role: { en: "Built it.", pt: "Desenvolvi.", es: "Lo desarrollé." },
      stack: [],
      uses: [],
    },
    {
      id: "chimpcode-office",
      name: "ChimpCode Office",
      size: "sm",
      status: "wip",
      what: {
        en: "An AI office of agents built on OpenClaw and Claw3D. Work in progress.",
        pt: "Um escritório de agentes de IA construído com OpenClaw e Claw3D. Em andamento.",
        es: "Una oficina de agentes de IA construida con OpenClaw y Claw3D. En progreso.",
      },
      role: { en: "Building it.", pt: "Em construção por mim.", es: "Lo estoy construyendo." },
      stack: ["Python"],
      uses: ["python", "ai-agents"],
    },
  ],

  education: [
    {
      degree: { en: "MBA in IT Management", pt: "MBA em Gestão de TI", es: "MBA en Gestión de TI" },
      school: "UNASP",
      place: SP,
      start: "2017-03",
      end: "2018-09",
    },
    {
      degree: {
        en: "B.A.Sc. in Computer Science",
        pt: "Bacharelado em Ciência da Computação",
        es: "Licenciatura en Ciencias de la Computación",
      },
      school: "UNASP",
      place: SP,
      start: "2012-01",
      end: "2016-12",
    },
    {
      degree: {
        en: "English as a Second Language",
        pt: "Inglês como Segunda Língua",
        es: "Inglés como Segunda Lengua",
      },
      school: "Andrews University",
      place: { en: "Michigan, US", pt: "Michigan, EUA", es: "Michigan, EE. UU." },
      start: "2015-07",
      end: "2015-12",
    },
    {
      degree: { en: "IT Technician", pt: "Técnico em Informática", es: "Técnico en Informática" },
      school: "UNASP",
      place: SP,
      start: "2009-01",
      end: "2011-12",
    },
  ],

  certifications: {
    en: [
      "Scrum Foundation Professional Certificate",
      "DevOps Essentials Professional Certificate",
      "Introduction to Git and Version Control",
      "Introduction to GitHub and Team Commands",
      "Essential Programming Logic",
    ],
    pt: [
      "Scrum Foundation Professional Certificate",
      "DevOps Essentials Professional Certificate",
      "Introdução ao Git e Controle de Versão",
      "Introdução ao GitHub e Comandos para Trabalhar em Equipe",
      "Lógica de Programação Essencial",
    ],
    es: [
      "Scrum Foundation Professional Certificate",
      "DevOps Essentials Professional Certificate",
      "Introduction to Git and Version Control",
      "Introduction to GitHub and Team Commands",
      "Essential Programming Logic",
    ],
  },

  languages: [
    {
      code: "pt",
      name: { en: "Portuguese", pt: "Português", es: "Portugués" },
      level: { en: "Native", pt: "Nativo", es: "Nativo" },
    },
    { code: "en", name: { en: "English", pt: "Inglês", es: "Inglés" }, level: { en: "C1", pt: "C1", es: "C1" } },
    { code: "es", name: { en: "Spanish", pt: "Espanhol", es: "Español" }, level: { en: "B1", pt: "B1", es: "B1" } },
  ],

  award: {
    en: 'Top Article in Computer Science and Information Technology, "Smart Traffic Based on Traffic Analysis with Arduino", November 2013.',
    pt: 'Melhor Artigo em Ciência da Computação e Tecnologia da Informação, "Smart Traffic Based on Traffic Analysis with Arduino", novembro de 2013.',
    es: 'Mejor Artículo en Ciencias de la Computación y Tecnología de la Información, "Smart Traffic Based on Traffic Analysis with Arduino", noviembre de 2013.',
  },
};
