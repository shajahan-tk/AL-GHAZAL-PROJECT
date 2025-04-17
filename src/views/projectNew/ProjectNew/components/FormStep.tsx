import Menu from '@/components/ui/Menu'
import { HiCheckCircle, HiLockClosed } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'

type FormStepProps = {
  currentStep: number
  steps: { label: string; value: number }[]
  onStepChange: (step: number) => void
}

const FormStep = ({ currentStep, steps, onStepChange }: FormStepProps) => {
  const { textTheme } = useThemeClass()

  return (
    <Menu variant="transparent" className="px-2">
      {steps.map((step) => (
        <Menu.MenuItem
          key={step.value}
          eventKey={step.value.toString()}
          className="mb-2"
          isActive={currentStep === step.value}
          onSelect={() => {
            if (step.value <= currentStep) {
              onStepChange(step.value)
            }
          }}
        >
          <span className="text-2xl ltr:mr-2 rtl:ml-2">
            {step.value < currentStep && <HiCheckCircle className={textTheme} />}
            {step.value === currentStep && (
              <HiCheckCircle className="text-gray-400" />
            )}
            {step.value > currentStep && (
              <HiLockClosed className="text-gray-400" />
            )}
          </span>
          <span>{step.label}</span>
        </Menu.MenuItem>
      ))}
    </Menu>
  )
}

export { FormStep }