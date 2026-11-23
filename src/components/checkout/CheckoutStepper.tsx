import { FaCheck } from "react-icons/fa";
import type { CheckoutStep } from "../../types/cart";

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  onGoToStep: (step: CheckoutStep) => void;
}

const STEPS: Array<{ step: CheckoutStep; label: string }> = [
  { step: 1, label: "Tu carrito" },
  { step: 2, label: "Tus datos" },
  { step: 3, label: "Pago" },
  { step: 4, label: "Confirmación" },
];

export default function CheckoutStepper({
  currentStep,
  onGoToStep,
}: CheckoutStepperProps) {
  return (
    <nav className="checkoutStepper" aria-label="Pasos de compra">
      <ol className="checkoutStepperList">
        {STEPS.map((item, idx) => {
          const isActive = item.step === currentStep;
          const isCompleted = item.step < currentStep;
          const canNavigateBack = isCompleted && currentStep < 4;

          return (
            <li
              key={item.step}
              className={`checkoutStepItem ${isActive ? "isActive" : ""} ${
                isCompleted ? "isCompleted" : ""
              }`}
            >
              <button
                type="button"
                className="checkoutStepBtn"
                disabled={!canNavigateBack}
                onClick={() => canNavigateBack && onGoToStep(item.step)}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="checkoutStepCircle">
                  {isCompleted ? <FaCheck size={11} /> : item.step}
                </span>
                <span className="checkoutStepLabel">{item.label}</span>
              </button>

              {idx < STEPS.length - 1 && (
                <span
                  className={`checkoutStepLine ${
                    isCompleted ? "isCompleted" : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
