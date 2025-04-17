import { useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FormStep } from './components/FormStep'
import { PersonalInformation } from './components/PersonalInformation'
import ProjectReview from './components/ProjectReview'
import ProjectInformation from './components/ProjectInformation'
import AddressInformation from './components/AddressInformation'

type FormData = {
  clientName: string
  projectName: string
  projectDescription: string
  country: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipCode: string
  sameCorrespondenceAddress: boolean
  correspondenceAddress: {
    country: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
  }
}

const ProjectForm = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    projectName: '',
    projectDescription: '',
    country: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    sameCorrespondenceAddress: true,
    correspondenceAddress: {
      country: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: ''
    }
  })

  const steps = [
    { label: 'Client Details', value: 0 },
    { label: 'Project Details', value: 1 },
    { label: 'Address Information', value: 2 },
    { label: 'Review', value: 3 }
  ]

  const handleNext = (
    data: Partial<FormData>,
    formName?: string,
    setSubmitting?: (isSubmitting: boolean) => void
  ) => {
    setFormData(prev => ({ ...prev, ...data }))
    
    if (currentStep < steps.length - 2) { // Changed to steps.length - 2 to account for review step
      setCurrentStep(currentStep + 1)
    } else if (currentStep === steps.length - 2) {
      // If we're on the last form step (Address Information), go to review
      setCurrentStep(currentStep + 1)
    }
    
    setSubmitting?.(false)
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/projects', formData)
      console.log('Project created:', response.data)
      navigate('/projects')
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <Container className="h-full">
      <AdaptableCard className="h-full" bodyClass="h-full">
        <div className="grid lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-5 gap-4 h-full">
          <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-2">
            <FormStep
              currentStep={currentStep}
              steps={steps}
              onStepChange={setCurrentStep}
            />
          </div>
          <div className="2xl:col-span-4 lg:col-span-3 xl:col-span-2">
            {currentStep === 0 && (
              <PersonalInformation
                data={formData}
                onNext={handleNext}
              />
            )}
            {currentStep === 1 && (
              <ProjectInformation
                data={formData}
                onNextChange={handleNext}
                onBackChange={handleBack}
              />
            )}
            {currentStep === 2 && (
              <AddressInformation
                data={formData}
                onNextChange={(values, formName, setSubmitting) => {
                  setFormData(prev => ({ ...prev, ...values }))
                  setCurrentStep(3)
                  setSubmitting(false)
                }}
                onBackChange={handleBack}
              />
            )}
            {currentStep === 3 && (
              <ProjectReview
                data={formData}
                onBack={handleBack}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </AdaptableCard>
    </Container>
  )
}

export default ProjectForm