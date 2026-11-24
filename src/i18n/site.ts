export type Lang = "es" | "en";
export const name = "Johan Alexander Borrero Méndez";
export const email = "johanbm0609@gmail.com";
export const github = "https://github.com/jab16jy";
export const pathFor = (lang: Lang, path = "") =>
  `${lang === "en" ? "/en" : ""}/${path ? `${path}/` : ""}`;
export const sections = [
  "",
  "projects",
  "engineering",
  "about",
  "contact",
] as const;
export const ids = ["inventory-tally", "sistema-pos", "techcamp"] as const;
export const names = ["Inventory Tally", "Sistema POS", "TechCamp v2"];
export const repos = ["inventory-tally", "Sistema_Pos", "techcamp-v2"];
export const copy = {
  es: {
    nav: ["Inicio", "Proyectos", "Ingeniería", "Sobre mí", "Contacto"],
    folio: "Portafolio de ingeniería",
    role: "Software Developer",
    intro:
      "Construyo software empresarial con asistencia de IA. Defino el problema, tomo decisiones de arquitectura y verifico que el producto funcione en condiciones reales.",
    available: "Disponible para trabajar",
    explore: "Explorar proyectos",
    cv: "Descargar CV",
    metrics: [
      "Productos en producción",
      "Meses en soporte TI",
      "Proyectos destacados",
    ],
    projects: "Proyectos seleccionados",
    projectsLead:
      "Dos productos en producción y un proyecto de investigación. Tres formas de abordar la integridad de los datos y la calidad del software.",
    archive: "Archivo de proyectos",
    all: "Todos los proyectos",
    categories: ["Web · PWA", "Escritorio · Windows", "Investigación · IoT"],
    states: ["En producción", "En producción", "Académico"],
    brief: [
      "Conteo colaborativo por sucursal, incluso cuando la conexión se interrumpe.",
      "Ventas, caja e inventario con persistencia local y trazabilidad de movimientos.",
      "Del balance hídrico a una recomendación agrícola en un entorno simulado.",
    ],
    study: "Leer caso",
    method: "Método de trabajo",
    domains: "Competencias aplicadas",
    experience: "Experiencia profesional",
    trajectory: "Trayectoria",
    profile: "Sobre mí",
    profileIntro:
      "Estudio Ingeniería de Sistemas y construyo soluciones para quienes tienen que usarlas cada día: contar inventario, registrar una venta o consultar una base de datos.",
    education: "Formación e idiomas",
    academic:
      "Ingeniería de Sistemas · Institución Universitaria Americana. Octavo semestre finalizado; noveno semestre en 2027.",
    english: "Inglés B1.",
    roles: [
      "Desarrollador de software independiente",
      "Auxiliar de soporte TI",
    ],
    dates: ["Ago — Nov 2026", "Ene — Ago 2026"],
    jobs: [
      "Desarrollo por encargo de Inventory Tally y Sistema POS, comercializados y actualmente en producción. Mi responsabilidad abarca la especificación, supervisión del desarrollo asistido por IA y validación de la entrega.",
      "Soporte tecnológico, consulta y actualización de bases de datos, gestión de registros y organización de información operativa.",
    ],
    contact: "Hablemos de software.",
    contactText:
      "Busco oportunidades como desarrollador junior o analista de sistemas. Disponible para trabajo presencial, híbrido y remoto desde Soledad, Atlántico, Colombia.",
    write: "Escríbeme",
    back: "Volver arriba",
    skip: "Saltar al contenido",
    other: "Read this page in English",
    theme: "Alternar tema",
    menu: "Menú",
    visit: "Visitar demo",
    field: "Cuaderno técnico",
    flow: ["Especificar", "Implementar", "Verificar"],
    proof: "Ver metodología",
    caption: "Modelo de trabajo",
    location: "Soledad, Atlántico · CO",
    competencies: [
      [
        "Ingeniería asistida por IA",
        "Harness y Context Engineering, especificaciones, flujos agénticos y revisión del código generado.",
      ],
      [
        "Arquitectura de software",
        "Monolitos modulares, puertos y adaptadores, Clean Architecture y separación de vista y lógica con MVVM.",
      ],
      [
        "Testing y calidad",
        "TDD, pruebas unitarias, de integración y E2E, mutación, reglas arquitectónicas y análisis estático.",
      ],
      [
        "Seguridad y datos",
        "Autenticación, roles, reglas de acceso, integridad transaccional y persistencia en PostgreSQL, SQLite y Firebase.",
      ],
      [
        "Desarrollo de software",
        "Web, escritorio, APIs REST y PWA offline-first. Utilizo TypeScript, Python, React, FastAPI y .NET según el producto.",
      ],
      [
        "DevOps y automatización",
        "Git, GitHub Actions, Docker y Linux para reproducir entornos y automatizar controles de calidad.",
      ],
    ],
  },
  en: {
    nav: ["Home", "Projects", "Engineering", "About", "Contact"],
    folio: "Engineering portfolio",
    role: "Software Developer",
    intro:
      "I build business software with AI assistance. I define the problem, make architectural decisions and verify that the product works under real operating conditions.",
    available: "Available for work",
    explore: "Explore projects",
    cv: "Download CV",
    metrics: [
      "Products in production",
      "Months in IT support",
      "Featured projects",
    ],
    projects: "Selected projects",
    projectsLead:
      "Two products in production and one research project. Three approaches to data integrity and software quality.",
    archive: "Project archive",
    all: "All projects",
    categories: ["Web · PWA", "Desktop · Windows", "Research · IoT"],
    states: ["In production", "In production", "Academic"],
    brief: [
      "Collaborative branch counts that keep working when the connection drops.",
      "Sales, cash and inventory with local persistence and traceable stock movements.",
      "From water balance to agricultural advice in a simulated environment.",
    ],
    study: "Read case study",
    method: "Working method",
    domains: "Applied competencies",
    experience: "Professional experience",
    trajectory: "Experience",
    profile: "About me",
    profileIntro:
      "I study Systems Engineering and build tools for the people who use them every day: counting inventory, recording sales or querying a database.",
    education: "Education and languages",
    academic:
      "Systems Engineering · Institución Universitaria Americana. Eighth semester completed; ninth semester in 2027.",
    english: "English B1.",
    roles: ["Independent software developer", "IT support assistant"],
    dates: ["Aug — Nov 2026", "Jan — Aug 2026"],
    jobs: [
      "Developed Inventory Tally and Sistema POS on commission. Both were sold and are in production. I specify the work, supervise AI-assisted development and validate the delivery.",
      "Provided technology support, queried and updated databases, managed records and organized operational information.",
    ],
    contact: "Let’s talk software.",
    contactText:
      "I am seeking junior developer or systems analyst opportunities. Available for on-site, hybrid and remote work from Soledad, Atlántico, Colombia.",
    write: "Email me",
    back: "Back to top",
    skip: "Skip to content",
    other: "Leer esta página en español",
    theme: "Toggle theme",
    menu: "Menu",
    visit: "Open demo",
    field: "Technical notebook",
    flow: ["Specify", "Implement", "Verify"],
    proof: "Explore methodology",
    caption: "Working model",
    location: "Soledad, Atlántico · CO",
    competencies: [
      [
        "AI-assisted engineering",
        "Harness and context engineering, specifications, agent workflows and review of generated code.",
      ],
      [
        "Software architecture",
        "Modular monoliths, ports and adapters, Clean Architecture and separation of views and logic with MVVM.",
      ],
      [
        "Testing and quality",
        "TDD, unit, integration and E2E tests, mutation testing, architectural rules and static analysis.",
      ],
      [
        "Security and data",
        "Authentication, roles, access rules, transactional integrity and persistence with PostgreSQL, SQLite and Firebase.",
      ],
      [
        "Software development",
        "Web, desktop, REST APIs and offline-first PWAs. I use TypeScript, Python, React, FastAPI and .NET according to the product.",
      ],
      [
        "DevOps and automation",
        "Git, GitHub Actions, Docker and Linux to reproduce environments and automate quality checks.",
      ],
    ],
  },
};
