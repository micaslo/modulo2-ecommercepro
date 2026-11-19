import './CreateAnAccount.css'
import { useState, type SubmitEvent } from 'react'

export type CreateAccountData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

type PageToCreateAnAccountProps = {
  onCreateAccount?: (data: CreateAccountData) => void
}

export default function PageToCreateAnAccount({
  onCreateAccount,
}: PageToCreateAnAccountProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setStatusMessage('')

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get('password') ?? '')
    const passwordConfirmation = String(formData.get('passwordConfirmation') ?? '')

    if (password !== passwordConfirmation) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    const accountData: CreateAccountData = {
      firstName: String(formData.get('firstName') ?? '').trim(),
      lastName: String(formData.get('lastName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      password,
    }

    if (onCreateAccount) {
      onCreateAccount(accountData)
      setStatusMessage('Tus datos están listos para crear la cuenta.')
      return
    }

    setStatusMessage(
      'Formulario validado. Conecta el servicio de registro para crear la cuenta.',
    )
  }

  return (
    <main className="create-account-page">
      <section className="create-account-card" aria-labelledby="create-account-title">
        <aside className="create-account-aside">
          <a className="create-account-brand" href="/" aria-label="Detodito Market, inicio">
            <span className="create-account-brand__mark" aria-hidden="true">D</span>
            <span className="create-account-brand__name">
              <strong>Detodito</strong>
              <small>Market</small>
            </span>
          </a>

          <div className="create-account-aside__copy">
            <p className="create-account-eyebrow">Bienvenido a tu tienda</p>
            <h1>Todo lo que buscas, en un solo lugar.</h1>
            <p>Creá tu cuenta para disfrutar una experiencia de compra más simple.</p>
          </div>

          <div className="create-account-decoration" aria-hidden="true">
            <span>+</span>
            <span>✦</span>
            <span>+</span>
          </div>
        </aside>

        <div className="create-account-content">
          <header className="create-account-heading">
            <p className="create-account-eyebrow">Empezá ahora</p>
            <h2 id="create-account-title">Crear cuenta</h2>
            <p>Completá tus datos para registrarte.</p>
          </header>

          <form className="create-account-form" onSubmit={handleSubmit}>
            <div className="create-account-fields create-account-fields--two-columns">
              <div className="create-account-field">
                <label htmlFor="firstName">Nombre</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div className="create-account-field">
                <label htmlFor="lastName">Apellido</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Tu apellido"
                  required
                />
              </div>
            </div>

            <div className="create-account-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="nombre@correo.com"
                required
              />
            </div>

            <div className="create-account-field">
              <label htmlFor="phone">Teléfono <span>(opcional)</span></label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+54 9 381 ..."
              />
            </div>

            <div className="create-account-fields create-account-fields--two-columns">
              <div className="create-account-field">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  required
                />
              </div>

              <div className="create-account-field">
                <label htmlFor="passwordConfirmation">Confirmar contraseña</label>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Repetí tu contraseña"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <button
              className="create-account-password-toggle"
              type="button"
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
            </button>

            <label className="create-account-terms">
              <input name="terms" type="checkbox" required />
              <span>Acepto los términos y condiciones y la política de privacidad.</span>
            </label>

            {errorMessage && (
              <p className="create-account-message create-account-message--error" role="alert">
                {errorMessage}
              </p>
            )}
            {statusMessage && (
              <p className="create-account-message create-account-message--success" role="status">
                {statusMessage}
              </p>
            )}

            <button className="create-account-submit" type="submit">
              Crear cuenta
            </button>
          </form>

          <p className="create-account-login">
            ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </section>
    </main>
  )
}
