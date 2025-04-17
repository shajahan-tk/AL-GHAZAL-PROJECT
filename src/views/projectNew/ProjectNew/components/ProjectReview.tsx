import { Card } from '@/components/ui'
import Button from '@/components/ui/Button'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'

type FormData = {
  clientName: string
  projectName: string
  projectDescription: string
  siteAddress: string
  siteLocation: string
}

type ProjectReviewProps = {
  data: FormData
  onBack: () => void
  onSubmit: () => void
}

const ProjectReview = ({ data, onBack, onSubmit }: ProjectReviewProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="mb-6 text-center">Project Review</h3>
      
      <Card className="mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="mb-4">Client Information</h5>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Client Name</p>
                <p className="font-semibold">{data.clientName || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="mb-4">Project Information</h5>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Project Name</p>
                <p className="font-semibold">{data.projectName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-500">Project Description</p>
                <p className="font-semibold">{data.projectDescription || 'Not provided'}</p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="mb-4">Address Information</h5>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500">Site Address</p>
                <p className="font-semibold">{data.siteAddress || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-gray-500">Site Location</p>
                <p className="font-semibold">{data.siteLocation || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={onBack}>
          Back
        </Button>
        <Button variant="solid" onClick={onSubmit}>
          Submit Project
        </Button>
      </div>
    </div>
  )
}

export default ProjectReview