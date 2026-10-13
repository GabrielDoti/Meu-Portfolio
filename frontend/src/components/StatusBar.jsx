import { useEffect, useState } from 'react'
import { navItems, profile } from '../data'
import { useLang, useT } from '../i18n'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function useBattery() {
  const [level, setLevel] = useState(null)
  useEffect(() => {
    let battery
    let cancelled = false
    const update = () => battery && !cancelled && setLevel(Math.round(battery.level * 100))
    if (navigator.getBattery) {
      navigator.getBattery().then((b) => {
        battery = b
        update()
        b.addEventListener('levelchange', update)
      })
    }
    return () => {
      cancelled = true
      battery?.removeEventListener('levelchange', update)
    }
  }, [])
  return level
}

/** Cabeçalho: perfil, menu de navegação das 4 seções, idioma, hora e bateria. */
export default function StatusBar({ current, onNavigate, onHome }) {
  const { lang, setLang } = useLang()
  const t = useT()
  const now = useClock()
  const battery = useBattery()
  const time = now.toLocaleTimeString(lang === 'pt' ? 'pt-BR' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <header className="status-bar">
      <button className="user" onClick={onHome} aria-label={t('nav.home')}>
        <span className="avatar">G</span>
        <span className="user-name">{profile.name}</span>
      </button>

      <nav className="main-nav" aria-label={t('nav.label')}>
        {navItems.map((id) => (
          <button
            key={id}
            className={current === id ? 'active' : ''}
            aria-current={current === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            {t(`app.${id}`)}
          </button>
        ))}
      </nav>

      <div className="status-right">
        <div className="lang-switch" role="group" aria-label={t('lang.switch')}>
          <button className={lang === 'pt' ? 'on' : ''} onClick={() => setLang('pt')} lang="pt">
            PT
          </button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} lang="en">
            EN
          </button>
        </div>
        <span className="clock">{time}</span>
        <span className="battery" title="Bateria">
          {battery ?? 100}% 🔋
        </span>
      </div>
    </header>
  )
}
