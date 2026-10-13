import { createContext, useCallback, useContext, useMemo } from 'react'

export const LangContext = createContext({ lang: 'pt', setLang: () => {} })

export const useLang = () => useContext(LangContext)

/** Pega o texto no idioma atual de um campo { pt, en } (ou devolve o valor como está). */
export function pick(value, lang) {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'pt' in value) {
    return value[lang] ?? value.pt
  }
  return value
}

const strings = {
  pt: {
    'boot.hint': 'clique ou espere pra entrar',
    'sleep.hint': 'Modo Soneca • toque ou aperte qualquer tecla',
    'nav.label': 'Navegação principal',
    'nav.home': 'Início',
    'back': 'Voltar',
    'lang.switch': 'Mudar idioma',

    'app.sobre': 'Sobre mim',
    'app.projetos': 'Projetos',
    'app.experiencias': 'Experiências',
    'app.contato': 'Contato',
    'app.skills': 'Skills',
    'app.game': 'Cube Runner',

    'dock.novidades': 'Novidades',
    'dock.config': 'Configurações',
    'dock.github': 'GitHub',
    'dock.linkedin': 'LinkedIn',
    'dock.soneca': 'Modo Soneca',

    'about.education': 'Formação',
    'about.area': 'Área de atuação',
    'about.interests': 'Interesses',
    'about.goals': 'Objetivos profissionais',

    'projects.timeline': 'Linha do tempo, do mais antigo ao mais recente',
    'projects.repo': 'Ver no GitHub',
    'projects.tech': 'Tecnologias',
    'projects.noimage': 'Print ou GIF do projeto',

    'exp.present': 'atual',

    'contact.reach': 'Fale comigo',
    'contact.form': 'Ou me mande uma mensagem',
    'contact.name': 'Seu nome',
    'contact.email': 'Seu e-mail',
    'contact.message': 'Mensagem',
    'contact.send': 'Enviar mensagem',
    'contact.sending': 'Enviando... (a API pode demorar a acordar)',
    'contact.ok': 'Mensagem enviada! Valeu 🙌',
    'contact.error': 'Não rolou enviar agora. Se a API acabou de acordar, tenta de novo em 1 minuto.',
    'contact.nobackend': 'O backend ainda não está conectado. Use os ícones acima por enquanto.',

    'settings.theme': 'Tema',
    'settings.dark': 'Escuro',
    'settings.light': 'Claro',
    'settings.sound': 'Sons do sistema',
    'settings.on': 'Ligado',
    'settings.off': 'Desligado',
    'settings.language': 'Idioma',
    'settings.visits': 'Visitas ao portfólio',

    'news.loading': 'Buscando novidades na API...',

    'game.title': 'Cube Runner',
    'game.points': 'Pontos',
    'game.best': 'Melhor',
    'game.start': 'Espaço, ↑ ou toque na tela pra pular',
    'game.over': 'Game over',
    'game.retry': 'Espaço ou toque pra tentar de novo',
    'game.tip': 'Segure o botão pra pular de novo assim que pousar. Pode subir nos blocos.',

    'footer.built': 'Feito com React, Vite e Spring Boot',
  },
  en: {
    'boot.hint': 'click or wait to enter',
    'sleep.hint': 'Sleep mode • tap or press any key',
    'nav.label': 'Main navigation',
    'nav.home': 'Home',
    'back': 'Back',
    'lang.switch': 'Change language',

    'app.sobre': 'About me',
    'app.projetos': 'Projects',
    'app.experiencias': 'Experience',
    'app.contato': 'Contact',
    'app.skills': 'Skills',
    'app.game': 'Cube Runner',

    'dock.novidades': 'News',
    'dock.config': 'Settings',
    'dock.github': 'GitHub',
    'dock.linkedin': 'LinkedIn',
    'dock.soneca': 'Sleep mode',

    'about.education': 'Education',
    'about.area': 'Field of work',
    'about.interests': 'Interests',
    'about.goals': 'Professional goals',

    'projects.timeline': 'Timeline, from oldest to newest',
    'projects.repo': 'View on GitHub',
    'projects.tech': 'Technologies',
    'projects.noimage': 'Project screenshot or GIF',

    'exp.present': 'present',

    'contact.reach': 'Get in touch',
    'contact.form': 'Or send me a message',
    'contact.name': 'Your name',
    'contact.email': 'Your e-mail',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.sending': 'Sending... (the API may take a while to wake up)',
    'contact.ok': 'Message sent! Thanks 🙌',
    'contact.error': "Couldn't send it right now. If the API just woke up, try again in a minute.",
    'contact.nobackend': 'The backend is not connected yet. Use the icons above for now.',

    'settings.theme': 'Theme',
    'settings.dark': 'Dark',
    'settings.light': 'Light',
    'settings.sound': 'System sounds',
    'settings.on': 'On',
    'settings.off': 'Off',
    'settings.language': 'Language',
    'settings.visits': 'Portfolio visits',

    'news.loading': 'Fetching news from the API...',

    'game.title': 'Cube Runner',
    'game.points': 'Score',
    'game.best': 'Best',
    'game.start': 'Space, ↑ or tap the screen to jump',
    'game.over': 'Game over',
    'game.retry': 'Space or tap to try again',
    'game.tip': 'Hold the button to jump again as soon as you land. You can climb on the blocks.',

    'footer.built': 'Built with React, Vite and Spring Boot',
  },
}

/** Hook de tradução: const t = useT(); t('app.sobre') */
export function useT() {
  const { lang } = useLang()
  return useCallback((key) => strings[lang]?.[key] ?? strings.pt[key] ?? key, [lang])
}

export function useLangValue(lang, setLang) {
  return useMemo(() => ({ lang, setLang }), [lang, setLang])
}
