import { useEffect, useState } from 'react'
import { api, hasApi } from '../api'
import { fallbackNews } from '../data'
import { useLang, useT } from '../i18n'

export default function News() {
  const { lang } = useLang()
  const t = useT()
  const [items, setItems] = useState(fallbackNews)
  const [loading, setLoading] = useState(hasApi)

  useEffect(() => {
    if (!hasApi) return undefined
    let cancelled = false
    api
      .news()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length) setItems(data)
      })
      .catch(() => {
        /* mantém as novidades locais */
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="news">
      {loading && <p className="muted">{t('news.loading')}</p>}
      <div className="cards">
        {items.map((n) => (
          <article className="card" key={n.titulo}>
            <p className="card-kind">
              {n.tag} •{' '}
              {new Date(`${n.data}T12:00:00`).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US')}
            </p>
            <h3>{n.titulo}</h3>
            <p>{n.texto}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
