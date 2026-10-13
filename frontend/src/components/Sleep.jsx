import { useEffect, useState } from 'react'
import { useLang, useT } from '../i18n'

export default function Sleep({ onWake }) {
  const { lang } = useLang()
  const t = useT()
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="sleep" onClick={onWake}>
      <p className="sleep-time">
        {now.toLocaleTimeString(lang === 'pt' ? 'pt-BR' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      <p className="sleep-hint">{t('sleep.hint')}</p>
    </div>
  )
}
