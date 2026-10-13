export const profile = {
  name: 'Gabriel Doti',
  fullName: 'Gabriel Vinícius Soares Doti',
  role: { pt: 'Estudante de Engenharia de Software', en: 'Software Engineering student' },
  school: 'PUC Minas • Belo Horizonte, Brasil',

  intro: {
    pt: 'Sou o Gabriel, estudante de Engenharia de Software. Aprendo construindo: já fiz APIs com Spring Boot, um jogo em Pygame e agora este portfólio com React.',
    en: "I'm Gabriel, a Software Engineering student. I learn by building: I've made APIs with Spring Boot, a game in Pygame, and now this portfolio with React.",
  },
  education: {
    pt: 'Graduando em Engenharia de Software na PUC Minas (Belo Horizonte), turma de 2026, com formatura prevista para 2029.',
    en: 'Software Engineering undergraduate at PUC Minas (Belo Horizonte, Brazil), class of 2026, expected graduation in 2029.',
  },
  area: {
    pt: 'Desenvolvimento de software, com foco em back-end (Java e Spring Boot), além de front-end com React e jogos em Python.',
    en: 'Software development, focused on back-end (Java and Spring Boot), plus front-end with React and games in Python.',
  },
  interests: [
    { pt: 'Back-end e APIs REST', en: 'Back-end and REST APIs' },
    { pt: 'Desenvolvimento de jogos', en: 'Game development' },
    { pt: 'Aprender construindo projetos', en: 'Learning by building projects' },
    { pt: 'Jogos digitais', en: 'Video games' },
  ],
  goals: {
    pt: 'Conquistar meu primeiro estágio em tecnologia em Belo Horizonte, aprendendo com times experientes e contribuindo com projetos reais.',
    en: 'Land my first tech internship in Belo Horizonte, learning from experienced teams and contributing to real projects.',
  },
}

export const contacts = {
  email: 'gabrieldoti69@gmail.com',
  whatsapp: '5531971333671',
  linkedin: 'https://linkedin.com/in/gabriel-doti-33691b423',
  github: 'https://github.com/GabrielDoti',
}

export const apps = [
  { id: 'sobre', icon: '🙂', from: '#ff4554', to: '#b3122a' },
  { id: 'projetos', icon: '🎮', from: '#00c3e3', to: '#0a6fa8' },
  { id: 'experiencias', icon: '💼', from: '#7b5cff', to: '#3a22b0' },
  { id: 'contato', icon: '✉️', from: '#2ed47a', to: '#0f7f49' },
  { id: 'skills', icon: '🛒', from: '#ffb100', to: '#c26a00' },
  { id: 'game', icon: '🟥', from: '#ff6b35', to: '#a82f0a' },
]

export const navItems = ['sobre', 'projetos', 'experiencias', 'contato']

export const dockItems = [
  { id: 'novidades', icon: '📰', screen: 'novidades' },
  { id: 'config', icon: '⚙️', screen: 'config' },
  { id: 'github', icon: '🐙', href: contacts.github },
  { id: 'linkedin', icon: '🔗', href: contacts.linkedin },
  { id: 'soneca', icon: '🌙', action: 'sleep' },
]

export const projects = [
  {
    name: 'Space Shooter',
    date: '2026-08',
    desc: {
      pt: 'Jogo de nave estilo Asteroids feito em Python com Pygame.',
      en: 'Asteroids-style space shooter made with Python and Pygame.',
    },
    tags: ['Python', 'Pygame'],
    repo: '',
    image: '',
  },
  {
    name: 'API de Clima',
    date: '2026-09',
    desc: {
      pt: 'API REST em Spring Boot que consulta e entrega dados de clima de Belo Horizonte usando a Open-Meteo. Atividade da faculdade, feita em dupla.',
      en: 'REST API in Spring Boot that fetches and serves weather data for Belo Horizonte using Open-Meteo. College assignment, done in pairs.',
    },
    tags: ['Java', 'Spring Boot', 'REST', 'Open-Meteo'],
    repo: 'https://github.com/GabrielDoti/Diaw',
    image: '',
  },
  {
    name: 'SecureLoginPUC',
    date: '2026-09',
    desc: {
      pt: 'Sistema de login e cadastro com área admin, recuperação de senha por e-mail e reCAPTCHA. Atividade da faculdade.',
      en: 'Login and sign-up system with an admin area, password recovery by e-mail and reCAPTCHA. College assignment.',
    },
    tags: ['Java', 'Spring Boot', 'Spring Security', 'Thymeleaf'],
    repo: '',
    image: '',
  },
  {
    name: 'Laje',
    date: '2026-10',
    desc: {
      pt: 'Plataforma web para consultar, comparar e acompanhar Fundos de Investimento Imobiliário (FIIs). Projeto em equipe da disciplina TI2.',
      en: 'Web platform to search, compare and track Brazilian real estate investment funds (FIIs). Team project for the TI2 course.',
    },
    tags: ['React', 'Vite', 'Tailwind', 'Spring Boot', 'PostgreSQL', 'Docker'],
    repo: 'https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-2-ti2-8243100-aaaegs',
    image: '',
  },
]

export const experiences = [
  {
    org: 'PUC Minas',
    role: { pt: 'Graduando em Engenharia de Software', en: 'Software Engineering undergraduate' },
    period: { pt: '2026 – 2029 (previsto)', en: '2026 – 2029 (expected)' },
    desc: {
      pt: 'Curso de Engenharia de Software, com disciplinas práticas de programação, desenvolvimento web e trabalho em equipe.',
      en: 'Software Engineering degree, with hands-on courses in programming, web development and teamwork.',
    },
  },
  {
    org: { pt: 'PUC Minas • Projeto Laje (TI2)', en: 'PUC Minas • Laje project (TI2)' },
    role: { pt: 'Desenvolvedor em projeto de equipe', en: 'Developer in a team project' },
    period: { pt: '2026', en: '2026' },
    desc: {
      pt: 'Trabalho em equipe com Kanban e GitHub Projects, em React e Spring Boot. Fiquei com o painel de notícias e comunicados dos FIIs.',
      en: 'Teamwork using Kanban and GitHub Projects, with React and Spring Boot. I took the FII news and announcements panel.',
    },
  },
]

export const fallbackNews = [
  {
    titulo: 'Cube Runner no ar',
    tag: 'Jogo',
    data: '2026-10-11',
    texto: 'Agora o portfólio tem um jogo de pulo estilo auto-runner. Tenta bater o recorde!',
  },
  {
    titulo: 'Portfólio Switch OS',
    tag: 'Novo',
    data: '2026-10-11',
    texto: 'Primeira versão do portfólio com visual inspirado no Nintendo Switch, feita com React, Vite e Spring Boot.',
  },
]

export const skills = [
  {
    group: { pt: 'Linguagens', en: 'Languages' },
    items: ['Java', 'Python', 'JavaScript'],
  },
  {
    group: { pt: 'Back-end', en: 'Back-end' },
    items: ['Spring Boot', 'Spring Security', 'Spring Data JPA', 'APIs REST', 'PostgreSQL', 'Flyway'],
  },
  {
    group: { pt: 'Front-end', en: 'Front-end' },
    items: ['React', 'Vite', 'Tailwind CSS', 'shadcn/ui', 'HTML', 'CSS'],
  },
  {
    group: { pt: 'Ferramentas', en: 'Tools' },
    items: ['Git', 'GitHub', 'Docker', 'Figma'],
  },
]
