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
import {
    Approvedproject,
    assignEngineer,
    checkProject,
    fetchEngineers,
    fetchProject,
    fetchProjectActivities,
} from '../api/api'
import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import Dialog from '@/components/ui/Dialog'
import { useAppSelector } from '@/store'
import Issue from '../../Issue'

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
    viewRoute?: string
    roles?: string[]
}

const DocumentCard = ({
    data,
    onAddClick,
}: {
    data: Document
    onAddClick: (type: string) => void
}) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()
    const { id } = useParams()

    const handleClick = () => {
        if (data.exists) {
            if (data.type === 'quotation') {
                // For quotation, navigate to view with projectId
                navigate(`/app/quotation-view/${id}`)
            } else {
                navigate(data.viewRoute || data.route, {
                    state: { projectId: id },
                })
            }
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
                        <Button
                            className="mt-4"
                            size="sm"
                            variant="solid"
                            icon={<HiOutlineEye />}
                            onClick={handleClick}
                        >
                            {data.exists ? 'View' : 'Create'} {data.title}
                        </Button>
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
    estimationId,
    onSuccess,
}: {
    isOpen: boolean
    onClose: () => void
    estimationId: string
    onSuccess: () => void
}) => {
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (isApproved: boolean) => {
        setIsSubmitting(true)
        setError(null)

        try {
            await Approvedproject({
                estimationId,
                isApproved,
                comment: comment || undefined,
            })

            toast.push(
                <Notification
                    title={`Project ${
                        isApproved ? 'approved' : 'rejected'
                    } successfully`}
                    type="success"
                />,
                { placement: 'top-center' },
            )

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating project status:', error)
            setError(
                error.response?.data?.message ||
                    'Failed to update project status',
            )

            toast.push(
                <Notification
                    title="Failed to update project status"
                    type="danger"
                />,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
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

            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-600 rounded dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-2 dark:text-gray-300">
                    Comments
                </label>
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
                    onClick={() => handleSubmit(false)}
                    disabled={isSubmitting}
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                    {isSubmitting ? 'Processing...' : 'Reject'}
                </Button>
                <Button
                    variant="solid"
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    {isSubmitting ? 'Processing...' : 'Approve'}
                </Button>
            </div>
        </Dialog>
    )
}

const StatusModal2 = ({
    isOpen,
    onClose,
    estimationId,
    onSuccess,
}: {
    isOpen: boolean
    onClose: () => void
    estimationId: string
    onSuccess: () => void
}) => {
    const [comment, setComment] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (isChecked: boolean, estimationId: string) => {
        setIsSubmitting(true)
        setError(null)

        try {
            await checkProject({
                estimationId: estimationId,
                isChecked,
                comment: comment || undefined,
            })

            toast.push(
                <Notification
                    title={`Project ${
                        isChecked ? 'checked' : 'rejected'
                    } successfully`}
                    type="success"
                />,
                { placement: 'top-center' },
            )

            onSuccess()
            onClose()
        } catch (error) {
            console.error('Error updating project status:', error)
            setError(
                error.response?.data?.message ||
                    'Failed to update project status',
            )

            toast.push(
                <Notification
                    title="Failed to update project status"
                    type="danger"
                />,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            width={500}
            className="dark:bg-gray-800"
        >
            <h5 className="mb-4 dark:text-white">Check Status</h5>

            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-600 rounded dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label className="block mb-2 dark:text-gray-300">
                    Comments
                </label>
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
                    onClick={() => handleSubmit(false, estimationId)}
                    disabled={isSubmitting}
                    className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                >
                    {isSubmitting ? 'Processing...' : 'Reject'}
                </Button>
                <Button
                    variant="solid"
                    onClick={() => handleSubmit(true, estimationId)}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    {isSubmitting ? 'Processing...' : 'Checked'}
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
    const [isStatusModalOpen2, setIsStatusModalOpen2] = useState(false)
    const [currentProjectId, setCurrentProjectId] = useState('')
    const [currentEstimationId, setCurrentEstimationId] = useState('')
    const [engineers, setEngineers] = useState<any[]>([])
    const [selectedEngineer, setSelectedEngineer] = useState<string | null>(
        null,
    )
    const [engineersLoading, setEngineersLoading] = useState(false)
    const userAuthority =
        useAppSelector((state) => state.auth.user.authority) || []
    const role = userAuthority[0] || 'finance'

    const fetchEngineersData = async () => {
        setEngineersLoading(true)
        try {
            const response = await fetchEngineers()
            setEngineers(response.data.engineers)

            // Set the currently assigned engineer if exists
            if (projectData?.assignedTo) {
                setSelectedEngineer(projectData.assignedTo._id) // Changed to use _id
            }
        } catch (error) {
            console.error('Failed to fetch engineers:', error)
            toast.push(
                <Notification title="Failed to load engineers" type="danger" />,
                { placement: 'top-center' },
            )
        } finally {
            setEngineersLoading(false)
        }
    }

    const openDrawer = () => {
        setIsOpen(true)
        fetchEngineersData()
    }

    const onDrawerClose = () => {
        setIsOpen(false)
    }

    const openStatusModal = () => {
        if (projectData?.estimationId) {
            setCurrentEstimationId(projectData.estimationId)
            setIsStatusModalOpen(true)
        }
    }

    const closeStatusModal = () => {
        setIsStatusModalOpen(false)
    }

    const handleApprovalSuccess = () => {
        // Refresh project data or update local state
        fetchProject(id).then((data) => {
            setProjectData(data?.data)
        })
    }

    const openStatusModal2 = (projectId: string) => {
        setCurrentProjectId(projectId)
        setIsStatusModalOpen2(true)
    }

    const closeStatusModal2 = () => {
        setIsStatusModalOpen2(false)
    }

    const handleCheckSuccess = () => {
        // Refresh data or show success message
        console.log('Project status updated successfully')
    }

    const handleAssignEngineer = async () => {
        if (!selectedEngineer || !id) {
            toast.push(
                <Notification
                    title="Please select an engineer"
                    type="warning"
                />,
                { placement: 'top-center' },
            )
            return
        }

        try {
            await assignEngineer({
                projectId: id,
                engineerId: selectedEngineer,
            })

            toast.push(
                <Notification
                    title="Engineer assigned successfully"
                    type="success"
                />,
                { placement: 'top-center' },
            )

            // Refresh project data
            const updatedProject = await fetchProject(id)
            setProjectData(updatedProject?.data)

            // Close the drawer
            onDrawerClose()
        } catch (error) {
            console.error('Assignment failed:', error)

            let errorMessage = 'Failed to assign engineer'
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            }

            toast.push(<Notification title={errorMessage} type="danger" />, {
                placement: 'top-center',
            })
        }
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
        setProjectLoading(true)
        fetchProject(id)
            .then((data) => {
                setProjectData(data?.data)
                setProjectLoading(false)

                const hasEstimation = !!data?.data?.estimationId
                const hasQuotation = !!data?.data?.quotationId

                const mockDocuments: Document[] = [
                    {
                        type: 'estimation',
                        title: 'Estimation',
                        route: '/app/create-estimation',
                        viewRoute: hasEstimation
                            ? `/app/estimation-view/${data.data.estimationId}`
                            : undefined,
                        exists: hasEstimation,
                        roles: ['finance', 'super_admin', 'admin', 'engineer'],
                    },
                    {
                        type: 'quotation',
                        title: 'Quotation',
                        route: `/app/quotation-new/${id}`,
                        viewRoute: hasQuotation
                            ? `/app/quotation-view/${id}`
                            : undefined,
                        exists: hasQuotation,
                        roles: ['finance', 'super_admin', 'admin'],
                    },
                    {
                        type: 'lpo',
                        title: 'LPO',
                        icon: '/img/document-icons/invoice.png',
                        route: '/app/lpo',
                        exists: false,
                        roles: ['finance', 'super_admin', 'admin'],
                    },
                    {
                        type: 'workProgress',
                        title: 'Work Progress',
                        icon: '/img/document-icons/report.png',
                        route: '/app/workprogress',
                        exists: false,
                        roles: ['finance', 'super_admin', 'admin'],
                    },
                    {
                        type: 'WorkCompletion',
                        title: 'Work Completion',
                        icon: '/img/document-icons/report.png',
                        route: '/app/workprogress',
                        exists: false,
                        roles: ['finance', 'super_admin', 'admin'],
                    },
                ]
                const fileredMockDocs = []
                for (let i = 0; i < mockDocuments.length; i++) {
                    if (mockDocuments[i].roles?.includes(role)) {
                        fileredMockDocs.push(mockDocuments[i])
                    }
                }
                setDocuments(fileredMockDocs)
                setLoading(false)
            })
            .catch((error) => {
                setProjectError(error)
                setProjectLoading(false)
            })
    }, [id])

    const handleAddDocument = (type: string) => {
        const document = documents.find((doc) => doc.type === type)
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

    // In your ProjectView component, update the return section to conditionally render the assignment card:
    return (
        <div className="flex flex-col gap-4">
            {/* First line - Document cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {!loading && documents.length > 0
                    ? documents.map((doc) => (
                          <DocumentCard
                              key={doc.type}
                              data={doc}
                              onAddClick={handleAddDocument}
                          />
                      ))
                    : [...Array(4).keys()].map((elm) => (
                          <Card key={elm}>
                              <Loading
                                  loading={loading}
                                  customLoader={
                                      <>
                                          <div className="flex items-center gap-4">
                                              <Skeleton variant="circle" />
                                              <Skeleton width={100} />
                                          </div>
                                          <Skeleton
                                              className="mt-6"
                                              width={150}
                                          />
                                          <Skeleton className="mt-6" />
                                      </>
                                  }
                              />
                          </Card>
                      ))}
            </div>

            {/* Second line - ProjectInfo and CustomerInfo */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <ProjectInfo projectdetails={projectData} />
                    <div>
                        <Issue projectId={id} />
                    </div>
                </div>

                <div>
                    <CustomerInfo clientinformation={projectData} />

                    {/* Only show Engineer Assignment and Status if estimation exists */}
                    {projectData?.estimationId && (
                        <>
                            <br />
                            <div className="space-y-4">
                                {/* Engineer Assignment Card */}
                                <Card className="border border-gray-200 dark:border-gray-600 rounded-lg">
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                                            <h5 className="font-semibold">
                                                Engineer Assignment
                                            </h5>
                                            {projectData?.assignedTo && (
                                                <Button
                                                    size="xs"
                                                    variant="plain"
                                                    onClick={openDrawer}
                                                >
                                                    Change
                                                </Button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    Engineer:
                                                </span>
                                                {projectData?.assignedTo ? (
                                                    <div className="flex items-center gap-2">
                                                        <Avatar
                                                            size={32}
                                                            src={
                                                                projectData
                                                                    .assignedTo
                                                                    .profileImage
                                                            }
                                                            shape="circle"
                                                        />
                                                        <span className="font-medium">
                                                            {
                                                                projectData
                                                                    .assignedTo
                                                                    .firstName
                                                            }{' '}
                                                            {
                                                                projectData
                                                                    .assignedTo
                                                                    .lastName
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="xs"
                                                        variant="solid"
                                                        onClick={openDrawer}
                                                    >
                                                        Assign Engineer
                                                    </Button>
                                                )}
                                            </div>

                                            {/* Inside the Engineer Assignment Card */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    Checked:
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        projectData?.isChecked
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                                >
                                                    {projectData?.isChecked
                                                        ? 'OK'
                                                        : 'No'}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-600 dark:text-gray-300">
                                                    Approved:
                                                </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        projectData?.isApproved
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                    }`}
                                                >
                                                    {projectData?.isApproved
                                                        ? 'OK'
                                                        : 'No'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {/* Status Button */}
                                {['super_admin', 'admin'].includes(role) &&
                                    !projectData?.isApproved && (
                                        <Button
                                            block
                                            variant="solid"
                                            onClick={openStatusModal}
                                            className="mt-4"
                                            disabled={!projectData?.isChecked}
                                        >
                                            Approve project
                                        </Button>
                                    )}

                                {['super_admin', 'admin', 'engineer'].includes(
                                    role,
                                ) &&
                                    !projectData?.isChecked && (
                                        <Button
                                            block
                                            variant="solid"
                                            onClick={() => {
                                                if (id) {
                                                    openStatusModal2(id)
                                                } else {
                                                    toast.push(
                                                        <Notification
                                                            title="Project ID is missing"
                                                            type="danger"
                                                        />,
                                                        {
                                                            placement:
                                                                'top-center',
                                                        },
                                                    )
                                                }
                                            }}
                                            className="mt-4"
                                        >
                                            Confirm check
                                        </Button>
                                    )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Drawer and Modal (can stay outside since they're portal components) */}
            <Drawer
                title="Assign Engineer"
                isOpen={isOpen}
                onClose={onDrawerClose}
                width={400}
            >
                {engineersLoading ? (
                    <div className="flex justify-center py-8">
                        <Loading />
                    </div>
                ) : engineers.length > 0 ? (
                    <div className="space-y-4">
                        {engineers.map((engineer) => (
                            <div
                                key={engineer._id}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedEngineer === engineer._id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                                }`}
                                onClick={() =>
                                    setSelectedEngineer(engineer._id)
                                }
                            >
                                <div className="flex items-center">
                                    <Avatar
                                        size={40}
                                        src={engineer.profileImage}
                                        className="mr-3"
                                        shape="circle"
                                    />
                                    <div>
                                        <h5 className="font-semibold text-gray-900 dark:text-white">
                                            {engineer.firstName}{' '}
                                            {engineer.lastName}
                                        </h5>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {engineer.phoneNumbers?.[0] ||
                                                'No phone number'}
                                        </p>
                                    </div>
                                </div>
                                {selectedEngineer === engineer._id && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                )}
                            </div>
                        ))}
                        <div className="mt-6 flex justify-end">
                            <Button
                                variant="solid"
                                onClick={handleAssignEngineer}
                                disabled={!selectedEngineer}
                            >
                                {selectedEngineer
                                    ? 'Confirm Assignment'
                                    : 'Select an engineer'}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No engineers available
                    </div>
                )}
            </Drawer>

            <StatusModal
                isOpen={isStatusModalOpen}
                onClose={closeStatusModal}
                estimationId={currentEstimationId}
                onSuccess={handleApprovalSuccess}
            />
            <StatusModal2
                isOpen={isStatusModalOpen2}
                onClose={closeStatusModal2}
                estimationId={projectData?.estimationId}
                onSuccess={handleCheckSuccess}
            />
        </div>
    )
}

export default ProjectView
