import { useLang, useT } from '../i18n'

export default function Settings({ theme, setTheme, sound, setSound, visits }) {
  const { lang, setLang } = useLang()
  const t = useT()

  return (
    <div className="settings">
      <div className="row">
        <span>{t('settings.language')}</span>
        <div className="seg">
          <button className={lang === 'pt' ? 'on' : ''} onClick={() => setLang('pt')}>
            Português
          </button>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>
            English
          </button>
        </div>
      </div>
      <div className="row">
        <span>{t('settings.theme')}</span>
        <div className="seg">
          <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}>
            {t('settings.dark')}
          </button>
          <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}>
            {t('settings.light')}
          </button>
        </div>
      </div>
      <div className="row">
        <span>{t('settings.sound')}</span>
        <div className="seg">
          <button className={sound ? 'on' : ''} onClick={() => setSound(true)}>
            {t('settings.on')}
          </button>
          <button className={!sound ? 'on' : ''} onClick={() => setSound(false)}>
            {t('settings.off')}
          </button>
        </div>
      </div>
      <div className="row">
        <span>{t('settings.visits')}</span>
        <strong>{visits ?? '—'}</strong>
      </div>
    </div>
  )
}
