import { contacts, profile } from '../data'
import { useT } from '../i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="site-footer">
      <span>
        © {new Date().getFullYear()} {profile.fullName}
      </span>
      <span className="footer-links">
        <a href={contacts.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </span>
      <span className="footer-built">{t('footer.built')}</span>
    </footer>
  )
}
