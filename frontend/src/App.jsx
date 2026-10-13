import { useCallback, useEffect, useState } from 'react'
import Boot from './components/Boot'
import StatusBar from './components/StatusBar'
import Home from './components/Home'
import Dock from './components/Dock'
import Footer from './components/Footer'
import Screen from './components/Screen'
import Sleep from './components/Sleep'
import About from './apps/About'
import Projects from './apps/Projects'
import Experiences from './apps/Experiences'
import Skills from './apps/Skills'
import Contact from './apps/Contact'
import News from './apps/News'
import Settings from './apps/Settings'
import CubeRunner from './apps/CubeRunner'
import { apps, dockItems } from './data'
import { play, setSound } from './sound'
import { api, hasApi } from './api'
import { LangContext, useLangValue, useT } from './i18n'

const screens = {
  sobre: { titleKey: 'app.sobre', Component: About },
  projetos: { titleKey: 'app.projetos', Component: Projects },
  experiencias: { titleKey: 'app.experiencias', Component: Experiences },
  contato: { titleKey: 'app.contato', Component: Contact },
  skills: { titleKey: 'app.skills', Component: Skills },
  game: { titleKey: 'app.game', Component: CubeRunner },
  novidades: { titleKey: 'dock.novidades', Component: News },
  config: { titleKey: 'dock.config', Component: Settings },
}

const INTERACTIVE = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A']

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

function writeStored(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignora */
  }
}

function initialLang() {
  const saved = readStored('lang', '')
  if (saved === 'pt' || saved === 'en') return saved
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

export default function App() {
  const [lang, setLang] = useState(initialLang)
  const langValue = useLangValue(lang, setLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    writeStored('lang', lang)
  }, [lang])

  return (
    <LangContext.Provider value={langValue}>
      <Shell />
    </LangContext.Provider>
  )
}

function Shell() {
  const t = useT()
  const [booted, setBooted] = useState(false)
  const [screen, setScreen] = useState(null)
  const [zone, setZone] = useState('tiles')
  const [tileIdx, setTileIdx] = useState(0)
  const [dockIdx, setDockIdx] = useState(0)
  const [sleeping, setSleeping] = useState(false)
  const [theme, setTheme] = useState(() => readStored('theme', 'dark'))
  const [sound, setSoundState] = useState(() => readStored('sound', 'on') === 'on')
  const [visits, setVisits] = useState(null)

  useEffect(() => {
    if (!hasApi) return
    let alreadyCounted = false
    try {
      alreadyCounted = sessionStorage.getItem('visit-counted') === '1'
    } catch {
      
    }
    const call = alreadyCounted ? api.visits : api.registerVisit
    call()
      .then((data) => {
        setVisits(data.total)
        try {
          sessionStorage.setItem('visit-counted', '1')
        } catch {
          
        }
      })
      .catch(() => {
        
      })
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeStored('theme', theme)
  }, [theme])

  useEffect(() => {
    setSound(sound)
    writeStored('sound', sound ? 'on' : 'off')
  }, [sound])

  const open = useCallback((id) => {
    play('open')
    setScreen(id)
  }, [])

  const back = useCallback(() => {
    play('back')
    setScreen(null)
  }, [])

  const activateDock = useCallback(
    (item) => {
      if (item.href) {
        play('open')
        window.open(item.href, '_blank', 'noopener,noreferrer')
      } else if (item.action === 'sleep') {
        play('open')
        setSleeping(true)
      } else if (item.screen) {
        open(item.screen)
      }
    },
    [open],
  )

  useEffect(() => {
    if (!booted) return undefined

    const onKey = (e) => {
      if (sleeping) {
        setSleeping(false)
        return
      }
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (screen) {
        if (e.key === 'Escape') back()
        return
      }

      const move = (setter, length, delta) => {
        play('move')
        setter((i) => Math.min(length - 1, Math.max(0, i + delta)))
      }

      switch (e.key) {
        case 'ArrowRight':
          zone === 'tiles' ? move(setTileIdx, apps.length, 1) : move(setDockIdx, dockItems.length, 1)
          break
        case 'ArrowLeft':
          zone === 'tiles' ? move(setTileIdx, apps.length, -1) : move(setDockIdx, dockItems.length, -1)
          break
        case 'ArrowDown':
          if (zone === 'tiles') {
            play('move')
            setZone('dock')
          }
          break
        case 'ArrowUp':
          if (zone === 'dock') {
            play('move')
            setZone('tiles')
          }
          break
        case 'Enter':
        case ' ':
          // Se um botão/link tem o foco, o próprio navegador já cuida do clique.
          if (INTERACTIVE.includes(tag)) return
          e.preventDefault()
          zone === 'tiles' ? open(apps[tileIdx].id) : activateDock(dockItems[dockIdx])
          break
        default:
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [booted, sleeping, screen, zone, tileIdx, dockIdx, open, back, activateDock])

  if (!booted) return <Boot onDone={() => setBooted(true)} />

  const current = screen ? screens[screen] : null
  const Current = current?.Component

  return (
    <div className="os">
      <StatusBar current={screen} onNavigate={open} onHome={back} />

      {current ? (
        <Screen title={t(current.titleKey)} onBack={back}>
          <Current
            theme={theme}
            setTheme={setTheme}
            sound={sound}
            setSound={setSoundState}
            visits={visits}
          />
        </Screen>
      ) : (
        <>
          <Home
            apps={apps}
            focused={tileIdx}
            active={zone === 'tiles'}
            onFocus={(i) => {
              setZone('tiles')
              setTileIdx(i)
            }}
            onOpen={open}
          />
          <Dock
            items={dockItems}
            focused={dockIdx}
            active={zone === 'dock'}
            onFocus={(i) => {
              setZone('dock')
              setDockIdx(i)
            }}
            onActivate={activateDock}
          />
        </>
      )}

      <Footer />

      {sleeping && <Sleep onWake={() => setSleeping(false)} />}
    </div>
  )
}
