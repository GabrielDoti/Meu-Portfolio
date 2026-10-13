import { useState } from 'react'
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa6'
import { MdEmail } from 'react-icons/md'
import { contacts } from '../data'
import { api, hasApi, ApiError } from '../api'
import { useT } from '../i18n'

const EMPTY = { nome: '', email: '', mensagem: '', website: '' }

// Ícones clicáveis. E-mail e WhatsApp só aparecem se estiverem preenchidos em data.js.
function buildLinks() {
  const links = []
  if (contacts.email) {
    links.push({ id: 'email', label: 'E-mail', href: `mailto:${contacts.email}`, Icon: MdEmail })
  }
  if (contacts.whatsapp) {
    links.push({
      id: 'whatsapp',
      label: 'WhatsApp',
      href: `https://wa.me/${contacts.whatsapp}`,
      Icon: FaWhatsapp,
    })
  }
  links.push(
    { id: 'linkedin', label: 'LinkedIn', href: contacts.linkedin, Icon: FaLinkedin },
    { id: 'github', label: 'GitHub', href: contacts.github, Icon: FaGithub },
  )
  return links
}

export default function Contact() {
  const t = useT()
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | sending | ok | error | no-backend
  const [message, setMessage] = useState('')

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const links = buildLinks()

  async function submit(e) {
    e.preventDefault()
    if (!hasApi) {
      setStatus('no-backend')
      return
    }
    setStatus('sending')
    setMessage('')
    try {
      await api.sendContact(form)
      setStatus('ok')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      if (err instanceof ApiError && err.status === 400 && err.data?.campos) {
        setMessage(Object.values(err.data.campos).join(' • '))
      } else if (err instanceof ApiError && err.status === 429) {
        setMessage(err.message)
      } else {
        setMessage(t('contact.error'))
      }
    }
  }

  return (
    <div className="contact">
      <section>
        <h3>{t('contact.reach')}</h3>
        <ul className="contact-icons">
          {links.map(({ id, label, href, Icon }) => (
            <li key={id}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>{t('contact.form')}</h3>
        <form onSubmit={submit}>
          <input
            name="nome"
            placeholder={t('contact.name')}
            aria-label={t('contact.name')}
            maxLength={80}
            value={form.nome}
            onChange={change}
            required
          />
          <input
            name="email"
            type="email"
            placeholder={t('contact.email')}
            aria-label={t('contact.email')}
            maxLength={120}
            value={form.email}
            onChange={change}
            required
          />
          <textarea
            name="mensagem"
            placeholder={t('contact.message')}
            aria-label={t('contact.message')}
            rows={4}
            minLength={5}
            maxLength={2000}
            value={form.mensagem}
            onChange={change}
            required
          />
          {/* Honeypot: invisível pra pessoas, robôs costumam preencher */}
          <input
            className="hp"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={form.website}
            onChange={change}
          />
          <button type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? t('contact.sending') : t('contact.send')}
          </button>
          {status === 'ok' && <p className="ok">{t('contact.ok')}</p>}
          {status === 'error' && <p className="err">{message}</p>}
          {status === 'no-backend' && <p className="err">{t('contact.nobackend')}</p>}
        </form>
      </section>
    </div>
  )
}
