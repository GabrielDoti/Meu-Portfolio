import { useT } from '../i18n'

export default function Screen({ title, onBack, children }) {
  const t = useT()
  return (
    <section className="screen">
      <div className="screen-head">
        <h1>{title}</h1>
      </div>
      <div className="screen-body">{children}</div>
      <div className="screen-foot">
        <button onClick={onBack}>
          <kbd>Esc</kbd> {t('back')}
        </button>
      </div>
    </section>
  )
}
