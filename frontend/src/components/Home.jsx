import { useEffect, useRef } from 'react'
import { useT } from '../i18n'

export default function Home({ apps, focused, active, onFocus, onOpen }) {
  const t = useT()
  const refs = useRef([])

  useEffect(() => {
    refs.current[focused]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [focused])

  return (
    <main className="home">
      <div className="tiles">
        {apps.map((app, i) => {
          const isFocused = active && i === focused
          return (
            <button
              key={app.id}
              ref={(el) => (refs.current[i] = el)}
              className={`tile ${isFocused ? 'focused' : ''}`}
              style={{ '--from': app.from, '--to': app.to }}
              onMouseEnter={() => onFocus(i)}
              onClick={() => onOpen(app.id)}
            >
              <span className="tile-icon">{app.icon}</span>
              <span className="tile-label">{t(`app.${app.id}`)}</span>
            </button>
          )
        })}
      </div>
      <p className="tile-title">{apps[focused] ? t(`app.${apps[focused].id}`) : ''}</p>
    </main>
  )
}
