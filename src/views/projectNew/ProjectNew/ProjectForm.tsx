import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptableCard from '@/components/shared/AdaptableCard'
import { useNavigate, useParams } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import { FormStep } from './components/FormStep'
import { PersonalInformation } from './components/PersonalInformation'
import ProjectReview from './components/ProjectReview'
import ProjectInformation from './components/ProjectInformation'
import AddressInformation from './components/AddressInformation'
import { createProject, editProject, fetchProjectById } from '../api/api'
import { Notification, toast } from '@/components/ui'

type  ClientData ={
  _id:string;
  clientName:string;
  clientAddress: string
  pincode: string
  mobileNumber: string
  telephoneNumber: string | null
  trnNumber: string
}

type FormData = {
  clientName: string
  projectName: string
  projectDescription: string
  siteAddress: string
  siteLocation: string
  clientData:ClientData

}


const ProjectForm = () => {
  const navigate = useNavigate()
  const {id}=useParams()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    clientName: '',
    projectName: '',
    projectDescription:'',
    siteAddress: '',
    siteLocation:'',
    clientData:{
      _id:"",
      clientName:"",
      clientAddress:"", 
      pincode:"", 
      mobileNumber:"", 
      telephoneNumber:"",  
      trnNumber:"", 
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
    setCompletedSteps(prev=>prev>(currentStep+1)?prev:currentStep+1);
    
    setSubmitting?.(false)
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  // const handleSubmit = async () => {
  //   try {
  //     const response = await createProject()
  //     console.log('Project created:', response.data)
  //     navigate('/projects')
  //   } catch (error) {
  //     console.error('Error submitting form:', error)
  //   }
  // }


  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    if(id){
      const response:AxiosResponse = await editProject(id,{
        client:formData.clientData._id,
        projectDescription:formData.projectDescription,
        projectName:formData.projectName,
        siteAddress:formData.siteAddress,
        siteLocation:formData.siteLocation
      })
      if(response.status===200){
       
        console.log('Project Updated:', response.data)
        toast.push(
          <Notification
              title={'Successfuly Updated project'}
              type="success"
              duration={2500}
          >
              Project successfuly Updated
          </Notification>,
          {
              placement: 'top-center',
          },
      )
        navigate('/app/project-list')
      }
    }else{
      try {
        const response:AxiosResponse = await createProject({
          client:formData.clientData._id,
          projectDescription:formData.projectDescription,
          projectName:formData.projectName,
          siteAddress:formData.siteAddress,
          siteLocation:formData.siteLocation
        })
  
        if(response.status===201){
          //on second callila,ini cheythok, on run cheyy setttttttt mahn
          console.log('Project creatd:', response.data)
          toast.push(
            <Notification
                title={'Successfuly created project'}
                type="success"
                duration={2500}
            >
                Project successfuly created
            </Notification>,
            {
                placement: 'top-center',
            },
        )
          navigate(-1)
        }
       
      } catch (error) {
        console.error('Error submitting form:', error)
        setError('Failed to create project. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
   
  }
  const fetchProject=async()=>{
    const {data}=await fetchProjectById(id);
    setFormData({
      clientData:{
        _id:data?.client?._id,
        clientName:data?.client?.clientName,
        clientAddress:data?.client?.clientAddress,
        mobileNumber:data?.client?.mobileNumber,
        telephoneNumber:data?.client?.telephoneNumber,
        trnNumber:data?.client?.trnNumber,
        pincode:data?.client?.pincode,
      },
      projectName:data?.projectName,
      projectDescription:data?.projectDescription,
      siteAddress:data?.siteAddress,
      siteLocation:data?.siteLocation,
      clientName:data?.client?.clientName
    })
    setCompletedSteps(3);
    setCurrentStep(3);
}  
  useEffect(()=>{
    if (id) {
      fetchProject()
    }
  },[])


  return (
    <Container className="h-full">
      <AdaptableCard className="h-full" bodyClass="h-full">
        <div className="grid lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-5 gap-4 h-full">
          <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-2">
            <FormStep
              currentStep={currentStep}
              steps={steps}
              onStepChange={setCurrentStep}
              completed={completedSteps}
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