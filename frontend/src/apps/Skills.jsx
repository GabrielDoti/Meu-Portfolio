import { skills } from '../data'
import { pick, useLang } from '../i18n'

export default function Skills() {
  const { lang } = useLang()

  return (
    <div className="skills">
      {skills.map((group) => (
        <section key={group.group.pt}>
          <h3>{pick(group.group, lang)}</h3>
          <div className="chips">
            {group.items.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
