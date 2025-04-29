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
import { HiOutlineDuplicate, HiOutlinePlus, HiOutlineEye } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import CustomerInfo from './CustomerInfo'
import ProjectInfo from './ProjectInfo'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProject } from '../api/api'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Dialog from '@/components/ui/Dialog'

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
    viewRoute?: string // New property for view route
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
            // Use viewRoute if it exists (for estimation view), otherwise use regular route
            navigate(data.viewRoute || data.route, { state: { projectId: id } })
        } else {
            onAddClick(data.type)
        }
    }

    return (
        <Card>
            {data.exists ? (
                <div className="flex flex-col h-full">
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
                        {data.type === 'estimation' && data.exists && (
                            <Button
                                className="mt-4"
                                size="sm"
                                variant="solid"
                                icon={<HiOutlineEye />}
                                onClick={() => navigate(data.viewRoute || '', { state: { estimationId:data.id }  })}
                            >
                                View Estimation
                            </Button>
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


const StatusModal = ({ 
    isOpen, 
    onClose, 
    onStatusChange 
}: { 
    isOpen: boolean
    onClose: () => void
    onStatusChange: (status: string, comment: string) => void
}) => {
    const [comment, setComment] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')

    const handleSubmit = () => {
        if (selectedStatus) {
            onStatusChange(selectedStatus, comment)
            onClose()
        }
    }

    return (
        <Dialog
    isOpen={isOpen}
    onClose={onClose}
    width={500}
    className="dark:bg-gray-800"
>
    <h5 className="mb-4 dark:text-white">Update Project Status</h5>
    
    <div className="mb-4">
        <label className="block mb-2 dark:text-gray-300">Comments</label>
        <textarea
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comments here..."
        />
    </div>
    
    <div className="flex justify-end space-x-2">
        <Button 
            variant="plain" 
            onClick={onClose}
            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
        >
            Reject
        </Button>
        <Button 
            variant="solid" 
            onClick={handleSubmit}
            disabled={selectedStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
        >
            Approved
        </Button>
    </div>
</Dialog>
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
    const [isOpen, setIsOpen] = useState(false)
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)


    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const openStatusModal = () => {
        setIsStatusModalOpen(true)
    }

    const closeStatusModal = () => {
        setIsStatusModalOpen(false)
    }


    const handleStatusChange = (status: string, comment: string) => {
        console.log(`Status changed to: ${status}`, `Comment: ${comment}`)
        toast.push(
            <Notification 
                title={`Status updated to ${status}`} 
                type="success" 
                duration={2000} 
            />,
            {
                placement: 'top-center',
            },
        )
    }

    useEffect(() => {
        // Fetch project data first
        setProjectLoading(true)
        fetchProject(id)
            .then(data => {
                setProjectData(data?.data)
                setProjectLoading(false)
                
                // After getting project data, set up documents
                const hasEstimation = !!data?.data?.estimationId
                
                const mockDocuments: Document[] = [
                    {
                        type: 'estimation',
                        title: 'Estimation',
                        amount: hasEstimation ? 12500 : undefined,
                        date: hasEstimation ? '2023-05-15' : undefined,
                        // status: hasEstimation ? 'Approved' : undefined,
                        // icon: '/img/document-icons/estimate.png',
                        route: "/app/create-estimation", // Route for creating new estimation
                        viewRoute: hasEstimation 
                            ? `/app/estimation-view/${data.data.estimationId}` 
                            : undefined, // Route for viewing existing estimation
                        exists: hasEstimation
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
            })
            .catch(error => {
                setProjectError(error)
                setProjectLoading(false)
            })
    }, [id])

    const handleAddDocument = (type: string) => {
        const document = documents.find(doc => doc.type === type)
        if (document) {
            navigate(document.route, { state: id })
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

    const Footer = (
        <div className="text-right w-full">
            <Button size="sm" className="mr-2" onClick={() => onDrawerClose()}>
                Cancel
            </Button>
            <Button size="sm" variant="solid" onClick={() => onDrawerClose()}>
                Confirm
            </Button>
        </div>
    )

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
                    <div>
                        <br />
            <Button variant="solid" onClick={() => openDrawer()}>
                Assign 
            </Button>
            <br />
                        <br />
                        <Button variant="solid" onClick={openStatusModal}>
                            Status 
                        </Button>
            <Drawer
                title="Drawer Title"
                isOpen={isOpen}
                footer={Footer}
                onClose={onDrawerClose}
                onRequestClose={onDrawerClose}
            >
                Drawer Content
            </Drawer>
            <StatusModal
                            isOpen={isStatusModalOpen}
                            onClose={closeStatusModal}
                            onStatusChange={handleStatusChange}
                        />
        </div>
                </div>
              
               
            </div>
        </div>
    )
}

export default ProjectView