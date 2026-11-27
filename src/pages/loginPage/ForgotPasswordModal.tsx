import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import {
  forgotPasswordEmailSchema,
  resetPasswordSchema,
  type ForgotPasswordEmailValues,
  type ResetPasswordValues,
} from "../../schemas/authSchema";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  initialEmail?: string;
  onClose: () => void;
  onPasswordResetSuccess: (email: string) => void;
}

type RecoveryStep = "email" | "reset" | "done";

export default function ForgotPasswordModal({
  isOpen,
  initialEmail = "",
  onClose,
  onPasswordResetSuccess,
}: ForgotPasswordModalProps) {
  if (!isOpen) return null;

  return (
    <ForgotPasswordModalContent
      key={initialEmail}
      initialEmail={initialEmail}
      onClose={onClose}
      onPasswordResetSuccess={onPasswordResetSuccess}
    />
  );
}

function ForgotPasswordModalContent({
  initialEmail,
  onClose,
  onPasswordResetSuccess,
}: Omit<ForgotPasswordModalProps, "isOpen">) {
  const { users, resetPassword } = useAuth();
  const [step, setStep] = useState<RecoveryStep>("email");
  const [targetUser, setTargetUser] = useState<{
    email: string;
    firstName: string;
  } | null>(null);
  const [serverError, setServerError] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const emailForm = useForm<ForgotPasswordEmailValues>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: { email: initialEmail },
  });

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleVerifyEmail = (values: ForgotPasswordEmailValues) => {
    setServerError("");
    const normalized = values.email.trim().toLowerCase();
    const match = users.find((u) => u.email.trim().toLowerCase() === normalized);

    if (!match) {
      setServerError(
        "No encontramos ninguna cuenta registrada con ese correo electrónico.",
      );
      return;
    }

    setTargetUser({ email: match.email, firstName: match.firstName });
    setStep("reset");
  };

  const handleResetSubmit = (values: ResetPasswordValues) => {
    if (!targetUser) return;
    setServerError("");

    const result = resetPassword(targetUser.email, values.newPassword);
    if (!result.ok) {
      setServerError(result.error);
      return;
    }

    setStep("done");
  };

  const handleFinish = () => {
    if (targetUser) {
      onPasswordResetSuccess(targetUser.email);
    }
    onClose();
  };

  return (
    <div
      className="loginModalOverlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-modal-title"
      onClick={onClose}
    >
      <div
        className="loginModalCard"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="loginModalClose"
          onClick={onClose}
          aria-label="Cerrar ventana"
        >
          ✕
        </button>

        <span className="loginModalEyebrow">RECUPERAR ACCESO</span>

        {step === "email" && (
          <>
            <h2 id="forgot-modal-title" className="loginModalTitle">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="loginModalCopy">
              Ingresá el correo electrónico asociado a tu cuenta para verificar
              tu identidad y definir una nueva contraseña.
            </p>

            <form
              className="loginModalForm"
              onSubmit={emailForm.handleSubmit(handleVerifyEmail)}
              noValidate
            >
              <div className="loginField">
                <label htmlFor="recovery-email">Correo electrónico</label>
                <div
                  className={`loginInputWrapper ${emailForm.formState.errors.email ? "isInvalid" : ""}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 7 9-7" />
                  </svg>
                  <input
                    id="recovery-email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    autoComplete="email"
                    aria-invalid={Boolean(emailForm.formState.errors.email)}
                    {...emailForm.register("email")}
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <span className="loginFieldError" role="alert">
                    {emailForm.formState.errors.email.message}
                  </span>
                )}
              </div>

              {serverError && (
                <div className="loginMessage error" role="alert">
                  {serverError}
                </div>
              )}

              <div className="loginModalActions">
                <button type="submit" className="loginSubmit">
                  Continuar <span aria-hidden="true">→</span>
                </button>
                <button
                  type="button"
                  className="loginModalSecondaryBtn"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </>
        )}

        {step === "reset" && targetUser && (
          <>
            <h2 id="forgot-modal-title" className="loginModalTitle">
              Elegí una nueva contraseña
            </h2>
            <p className="loginModalCopy">
              Cuenta verificada para <strong>{targetUser.firstName}</strong> (
              {targetUser.email}). Ingresá tu nueva clave de acceso.
            </p>

            <form
              className="loginModalForm"
              onSubmit={resetForm.handleSubmit(handleResetSubmit)}
              noValidate
            >
              <div className="loginField">
                <label htmlFor="recovery-new-password">Nueva contraseña</label>
                <div
                  className={`loginInputWrapper ${resetForm.formState.errors.newPassword ? "isInvalid" : ""}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="10" width="14" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <path d="M12 14v3" />
                  </svg>
                  <input
                    id="recovery-new-password"
                    type={showPasswords ? "text" : "password"}
                    placeholder="Mín. 8 caracteres, letra y número"
                    autoComplete="new-password"
                    aria-invalid={Boolean(
                      resetForm.formState.errors.newPassword,
                    )}
                    {...resetForm.register("newPassword")}
                  />
                </div>
                {resetForm.formState.errors.newPassword && (
                  <span className="loginFieldError" role="alert">
                    {resetForm.formState.errors.newPassword.message}
                  </span>
                )}
              </div>

              <div className="loginField">
                <label htmlFor="recovery-confirm-password">
                  Confirmar contraseña
                </label>
                <div
                  className={`loginInputWrapper ${resetForm.formState.errors.confirmPassword ? "isInvalid" : ""}`}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="10" width="14" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <path d="M12 14v3" />
                  </svg>
                  <input
                    id="recovery-confirm-password"
                    type={showPasswords ? "text" : "password"}
                    placeholder="Repetí tu nueva contraseña"
                    autoComplete="new-password"
                    aria-invalid={Boolean(
                      resetForm.formState.errors.confirmPassword,
                    )}
                    {...resetForm.register("confirmPassword")}
                  />
                </div>
                {resetForm.formState.errors.confirmPassword && (
                  <span className="loginFieldError" role="alert">
                    {resetForm.formState.errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button
                type="button"
                className="loginModalTogglePwd"
                onClick={() => setShowPasswords((prev) => !prev)}
              >
                {showPasswords ? "Ocultar contraseñas" : "Mostrar contraseñas"}
              </button>

              {serverError && (
                <div className="loginMessage error" role="alert">
                  {serverError}
                </div>
              )}

              <div className="loginModalActions">
                <button type="submit" className="loginSubmit">
                  Restablecer contraseña
                </button>
                <button
                  type="button"
                  className="loginModalSecondaryBtn"
                  onClick={() => {
                    setServerError("");
                    setStep("email");
                  }}
                >
                  Usar otro correo
                </button>
              </div>
            </form>
          </>
        )}

        {step === "done" && targetUser && (
          <>
            <div className="loginModalSuccessIcon" aria-hidden="true">
              ✓
            </div>
            <h2 id="forgot-modal-title" className="loginModalTitle">
              ¡Contraseña actualizada!
            </h2>
            <p className="loginModalCopy">
              Ya guardamos tu nueva contraseña para{" "}
              <strong>{targetUser.email}</strong>. Ahora podés iniciar sesión
              normalmente.
            </p>

            <div className="loginModalActions">
              <button
                type="button"
                className="loginSubmit"
                onClick={handleFinish}
              >
                Volver a iniciar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
