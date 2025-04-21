import { useEffect, useState } from 'react'
import classNames from 'classnames'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Skeleton from '@/components/ui/Skeleton'
import Loading from '@/components/shared/Loading'
import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { HiOutlineDuplicate, HiOutlinePlus } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import CustomerInfo from './CustomerInfo'
import ProjectInfo from './ProjectInfo'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProject } from '../api/api'

// Define Document type
interface Document {
    type: 'estimation' | 'quotation' | 'invoice' | 'workReport'
    title: string
    amount?: number
    date?: string
    status?: string
    icon: string
    exists: boolean
    route: string
}

const DocumentCard = ({ 
    data,
    onAddClick 
}: { 
    data: Document,
    onAddClick: (type: string) => void 
}) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const handleClick = () => {
        if (data.exists) {
            navigate(data.route, { state: { projectId: id } })
        } else {
            onAddClick(data.type)
        }
    }

    return (
        <Card>
            {data.exists ? (
                <div 
                    className="flex flex-col h-full cursor-pointer" 
                    onClick={handleClick}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar size={40} src={data.icon} />
                            <h6 className="font-bold">{data.title}</h6>
                        </div>
                        {data.status && (
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                {data.status}
                            </span>
                        )}
                    </div>
                    <div className="mt-auto">
                        {data.amount && (
                            <h5 className="mb-2">
                                <NumericFormat
                                    displayType="text"
                                    value={data.amount}
                                    prefix="$"
                                    thousandSeparator={true}
                                />
                            </h5>
                        )}
                        {data.date && (
                            <p className="text-sm text-gray-500">{data.date}</p>
                        )}
                    </div>
                </div>
            ) : (
                <Card
                    clickable
                    className="border-dashed border-2 hover:border-indigo-600 hover:dark:border-gray-300 bg-transparent h-full flex items-center justify-center"
                    onClick={handleClick}
                >
                    <div className="flex flex-col justify-center items-center py-5">
                        <div className="p-4 rounded-full bg-gray-50 dark:bg-gray-600">
                            <HiOutlinePlus className="text-4xl text-gray-300" />
                        </div>
                        <p className="mt-5 font-semibold">Add {data.title}</p>
                    </div>
                </Card>
            )}
        </Card>
    )
}

const ProjectView = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState(false)
    const [documents, setDocuments] = useState<Document[]>([])
    const navigate = useNavigate()
    const [projectData, setProjectData] = useState<any>(null)
    const [projectLoading, setProjectLoading] = useState(false)
    const [projectError, setProjectError] = useState<any>(null)

    useEffect(() => {
        // Simulate loading data
        setLoading(true)
        
        // This would be replaced with actual API call to get document status
        setTimeout(() => {
            // Mock data - in real app this would come from API
            const mockDocuments: Document[] = [
                {
                    type: 'estimation',
                    title: 'Estimation',
                    amount: 12500,
                    date: '2023-05-15',
                    status: 'Approved',
                    icon: '/img/document-icons/estimate.png',
                    route: "/app/create-estimation",
                    exists: false
                },
                {
                    type: 'quotation',
                    title: 'Quotation',
                    icon: '/img/document-icons/quotation.png',
                    route: "/app/quotation-new",
                    exists: false
                },
                {
                    type: 'invoice',
                    title: 'Invoice',
                    icon: '/img/document-icons/invoice.png',
                    route: "/app/invoices/new",
                    exists: false
                },
                {
                    type: 'workReport',
                    title: 'Work Report',
                    icon: '/img/document-icons/report.png',
                    route: "/app/work-reports/new",
                    exists: false
                }
            ]
            setDocuments(mockDocuments)
            setLoading(false)
        }, 1000)
        
        // Fetch project data
        setProjectLoading(true)
        fetchProject(id)
            .then(data => {
                setProjectData(data?.data)
                setProjectLoading(false)
            })
            .catch(error => {
                setProjectError(error)
                setProjectLoading(false)
            })
    }, [id])

    const handleAddDocument = (type: string) => {
        const document = documents.find(doc => doc.type === type)
        if (document) {
            navigate(document.route, { state: { projectId: id } })
        }
        toast.push(
            <Notification 
                title={`Creating new ${type}`} 
                type="info" 
                duration={2000} 
            />,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* First line - Document cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {!loading && documents.length > 0 ? (
                    documents.map((doc) => (
                        <DocumentCard 
                            key={doc.type}
                            data={doc}
                            onAddClick={handleAddDocument}
                        />
                    ))
                ) : (
                    [...Array(4).keys()].map((elm) => (
                        <Card key={elm}>
                            <Loading
                                loading={loading}
                                customLoader={
                                    <>
                                        <div className="flex items-center gap-4">
                                            <Skeleton variant="circle" />
                                            <Skeleton width={100} />
                                        </div>
                                        <Skeleton className="mt-6" width={150} />
                                        <Skeleton className="mt-6" />
                                    </>
                                }
                            />
                        </Card>
                    ))
                )}
            </div>

            {/* Second line - ProjectInfo and CustomerInfo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <ProjectInfo projectdetails={projectData} />
                </div>
                <div>
                    <CustomerInfo clientinformation={projectData}/>
                </div>
            </div>
        </div>
    )
}

export default ProjectView