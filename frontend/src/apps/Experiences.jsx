import { experiences } from '../data'
import { pick, useLang } from '../i18n'

export default function Experiences() {
  const { lang } = useLang()

  return (
    <div className="cards one-col">
      {experiences.map((e, i) => (
        <article className="card" key={i}>
          <p className="card-kind">{pick(e.period, lang)}</p>
          <h3>{pick(e.role, lang)}</h3>
          <p className="exp-org">{pick(e.org, lang)}</p>
          <p>{pick(e.desc, lang)}</p>
        </article>
      ))}
    </div>
  )
}
