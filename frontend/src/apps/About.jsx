import { profile } from '../data'
import { pick, useLang, useT } from '../i18n'

export default function About() {
  const { lang } = useLang()
  const t = useT()

  return (
    <div className="about">
      <div className="about-top">
        <div className="about-avatar">G</div>
        <div>
          <h2>{profile.fullName}</h2>
          <p className="muted">
            {pick(profile.role, lang)} • {profile.school}
          </p>
          <p>{pick(profile.intro, lang)}</p>
        </div>
      </div>

      <div className="about-grid">
        <section>
          <h3>{t('about.education')}</h3>
          <p>{pick(profile.education, lang)}</p>
        </section>
        <section>
          <h3>{t('about.area')}</h3>
          <p>{pick(profile.area, lang)}</p>
        </section>
        <section>
          <h3>{t('about.interests')}</h3>
          <div className="chips">
            {profile.interests.map((i) => (
              <span className="chip" key={i.pt}>
                {pick(i, lang)}
              </span>
            ))}
          </div>
        </section>
        <section>
          <h3>{t('about.goals')}</h3>
          <p className="highlight">{pick(profile.goals, lang)}</p>
        </section>
      </div>
    </div>
  )
}
