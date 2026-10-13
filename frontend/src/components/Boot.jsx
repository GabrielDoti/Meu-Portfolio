import { useEffect } from 'react'
import { profile } from '../data'
import { useT } from '../i18n'

export default function Boot({ onDone }) {
  const t = useT()

  useEffect(() => {
    const id = setTimeout(onDone, 2400)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <div className="boot" onClick={onDone}>
      <div className="boot-logo">
        <span className="bar red" />
        <span className="bar blue" />
      </div>
      <p className="boot-name">{profile.name}</p>
      <p className="boot-hint">{t('boot.hint')}</p>
    </div>
  )
}
