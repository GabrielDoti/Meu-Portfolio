import { useT } from '../i18n'

export default function Dock({ items, focused, active, onFocus, onActivate }) {
  const t = useT()
  return (
    <nav className="dock" aria-label="Dock">
      {items.map((item, i) => {
        const label = t(`dock.${item.id}`)
        return (
          <button
            key={item.id}
            className={`dock-btn ${active && i === focused ? 'focused' : ''}`}
            title={label}
            aria-label={label}
            onMouseEnter={() => onFocus(i)}
            onClick={() => onActivate(item)}
          >
            <span>{item.icon}</span>
            {active && i === focused && <small>{label}</small>}
          </button>
        )
      })}
    </nav>
  )
}
