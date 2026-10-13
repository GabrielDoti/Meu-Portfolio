import { contacts, projects } from '../data'
import { pick, useLang, useT } from '../i18n'

// Ordem garantida: do mais antigo ao mais recente, pela data (AAAA-MM).
const sorted = [...projects].sort((a, b) => a.date.localeCompare(b.date))

export default function Projects() {
  const { lang } = useLang()
  const t = useT()

  const formatDate = (date) =>
    new Date(`${date}-01T12:00:00`).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', {
      month: 'long',
      year: 'numeric',
    })

  return (
    <div>
      <p className="muted timeline-note">{t('projects.timeline')}</p>
      <ol className="timeline">
        {sorted.map((p) => (
          <li className="timeline-item" key={p.name}>
            <span className="timeline-dot" aria-hidden="true" />
            <time className="timeline-date" dateTime={p.date}>
              {formatDate(p.date)}
            </time>

            <article className="card project">
              <h3>{p.name}</h3>
              <p>{pick(p.desc, lang)}</p>

              {p.image ? (
                <img className="shot" src={p.image} alt={`${p.name}`} loading="lazy" />
              ) : (
                <div className="shot placeholder">{t('projects.noimage')}</div>
              )}

              <p className="card-kind">{t('projects.tech')}</p>
              <div className="chips">
                {p.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={p.repo || contacts.github}
                target="_blank"
                rel="noopener noreferrer"
                className="card-link"
              >
                {t('projects.repo')} →
              </a>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}
