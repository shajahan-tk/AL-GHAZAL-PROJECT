import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    Card,
    Avatar,
    Button,
    Tooltip,
    Notification,
    toast,
    Badge,
    Drawer,
    Dialog,
    Select
} from '@/components/ui'

import { ClipLoader } from 'react-spinners'
import { 
    HiOutlineEye, 
    HiOutlinePlus,
    HiOutlineUserAdd,
    HiOutlineCheckCircle,
    HiOutlineXCircle
} from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'
import useThemeClass from '@/utils/hooks/useThemeClass'
import CustomerInfo from './CustomerInfo'
import ProjectInfo from './ProjectInfo'
import Issue from '../../Issue'
import {
    Approvedproject,
    assignEngineer,
    checkProject,
    fetchEngineers,
    fetchProject,
} from '../api/api'
import { useAppSelector } from '@/store'
import { Loading } from '@/components/shared'

interface Document {
    type: 'estimation' | 'quotation' | 'lpo' | 'workProgress' | 'invoice'
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

    const getButtonColor = () => {
        switch(data.type) {
            case 'estimation': return 'blue-600'
            case 'quotation': return 'purple-600'
            case 'lpo': return 'green-600'
            case 'workProgress': return 'orange-600'
            case 'invoice': return 'indigo-600'
            default: return 'gray-600'
        }
    }

    return (
        <Card className="h-full transition-all duration-200 hover:shadow-lg">
            {data.exists ? (
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Avatar 
                                size={40} 
                                src={data.icon} 
                                className="bg-gray-100 dark:bg-gray-600 p-2"
                                shape="square"
                            />
                            <h6 className="font-bold text-gray-800 dark:text-gray-100">{data.title}</h6>
                        </div>
                        {data.status && (
                            <Badge 
                                content={data.status} 
                                innerClass={`${
                                    data.status === 'approved' 
                                        ? 'bg-emerald-500' 
                                        : data.status === 'pending' 
                                            ? 'bg-amber-500' 
                                            : 'bg-blue-500'
                                }`}
                            />
                        )}
                    </div>
                    <div className="mt-auto">
                        {data.amount && (
                            <h5 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                                <NumericFormat
                                    displayType="text"
                                    value={data.amount}
                                    prefix="$"
                                    thousandSeparator={true}
                                    decimalScale={2}
                                />
                            </h5>
                        )}
                        {data.date && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {dayjs(data.date).format('MMM D, YYYY')}
                            </p>
                        )}
                        <Button
                            className="w-full"
                            size="sm"
                            variant="twoTone"
                            icon={<HiOutlineEye className="text-lg" />}
                            onClick={handleClick}
                            color={getButtonColor()}
                        >
                            View {data.title}
                        </Button>
                    </div>
                </div>
            ) : (
                <Card
                    clickable
                    className="border-dashed border-2 hover:border-indigo-600 hover:dark:border-gray-300 bg-transparent h-full flex items-center justify-center transition-colors duration-200"
                    onClick={handleClick}
                >
                    <div className="flex flex-col justify-center items-center py-5">
                        <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-600 transition-colors duration-200">
                            <HiOutlinePlus className="text-2xl text-gray-400 dark:text-gray-300" />
                        </div>
                        <p className="mt-3 font-semibold text-gray-600 dark:text-gray-300">
                            Add {data.title}
                        </p>
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
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [documents, setDocuments] = useState<Document[]>([])
    const [projectData, setProjectData] = useState<any>(null)
    const [projectLoading, setProjectLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [currentProjectId, setCurrentProjectId] = useState('')
    const [isStatusModalOpen2, setIsStatusModalOpen2] = useState(false)

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
    const [engineers, setEngineers] = useState<any[]>([])
    const [selectedEngineer, setSelectedEngineer] = useState<string | null>(null)
    const [engineersLoading, setEngineersLoading] = useState(false)
    const userAuthority = useAppSelector((state) => state.auth.user.authority) || []
    const role = userAuthority[0] || 'finance'
    const [isAssigning, setIsAssigning] = useState(false) // Add this state at the top with your other states

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
            setIsStatusModalOpen(true)
        }
    }

    const closeStatusModal = () => {
        setIsStatusModalOpen(false)
    }

    const openStatusModal2 = (projectId: string) => {
        setCurrentProjectId(projectId)
        setIsStatusModalOpen2(true)
    }

    const closeStatusModal2 = () => {
        setIsStatusModalOpen2(false)
    }

    const handleApprovalSuccess = () => {
        fetchProject(id).then((data) => {
            setProjectData(data?.data)
        })
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
    
        setIsAssigning(true) // Start loading
    
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
        } finally {
            setIsAssigning(false) // Stop loading regardless of success/failure
        }
    }
    

    const handleAddDocument = (type: string) => {
        const document = documents.find((doc) => doc.type === type)
        if (document) {
            navigate(document.route, { state: { projectId: id } })
        }
    }
    useEffect(() => {
        setProjectLoading(true);
        fetchProject(id)
            .then((data) => {
                setProjectData(data?.data);
                setProjectLoading(false);
    
                const status = data?.data?.status || 'draft';
                const isApproved = data?.data?.isApproved;
                const hasAssignedEngineer = !!data?.data?.assignedTo;
                const hasEstimation = !!data?.data?.estimationId;
                const hasQuotation = !!data?.data?.quotationId;
                const hasLPO = !!data?.data?.lpoId;
                const hasInvoice = !!data?.data?.lopId;
                const hasWorkProgress = !!data?.data?.lpoId;
    
                const baseDocuments = [
                    {
                        type: 'estimation',
                        title: 'Estimation',
                        route: `/app/create-estimation/${id}`,
                        viewRoute: hasEstimation ? `/app/estimation-view/${data.data.estimationId}` : undefined,
                        exists: hasEstimation,
                        icon: '/img/document-icons/estimation.png',
                        roles: ['finance', 'super_admin', 'admin', 'engineer'],
                    }
                ];
    
                let statusDocuments = [...baseDocuments];
    
                if (isApproved && hasAssignedEngineer) {
                    statusDocuments.push({
                        type: 'quotation',
                        title: 'Quotation',
                        route: `/app/quotation-new/${id}`,
                        viewRoute: hasQuotation ? `/app/quotation-view/${id}` : undefined,
                        exists: hasQuotation,
                        icon: '/img/document-icons/quotation.png',
                        roles: ['finance', 'super_admin', 'admin'],
                    });
                }
    
                if (['quotation_sent', 'lpo_received', 'work_started', 'in_progress', 'work_completed', 'invoice_sent'].includes(status)) {
                    statusDocuments.push({
                        type: 'lpo',
                        title: 'LPO',
                        route: `/app/lpo/${id}`,
                        exists: hasLPO,
                        viewRoute: hasLPO ? `/app/lpo-view/${id}` : undefined,
                        icon: '/img/document-icons/lpo.png',
                        roles: ['finance', 'super_admin', 'admin'],
                    });
                }
    
                if (['lpo_received', 'work_started', 'in_progress', 'work_completed', 'invoice_sent'].includes(status)) {
                    statusDocuments.push({
                        type: 'workProgress',
                        title: 'Work Progress',
                        route: hasWorkProgress ? undefined : '/app/workprogress',
                        viewRoute: hasWorkProgress ? `/app/workprogress/${id}` : undefined,
                        exists: hasWorkProgress,
                        icon: '/img/document-icons/report.png',
                        roles: ['finance', 'super_admin', 'admin', 'engineer'],
                    });
                }
    
                // Work Completion Report (view-only, appears when work is completed)
                if (status === 'work_completed') {
                    statusDocuments.push({
                        type: 'workCompletion',
                        title: 'Completion Report',
                        viewRoute: `/app/workcompletionreport/${id}`,
                        exists: true,
                        icon: '/img/document-icons/completion.png',
                        roles: ['finance', 'super_admin', 'admin', 'engineer'],
                    });
                }
    
                // Invoice (strictly view-only, appears last)
                if (status === 'work_completed' ) {
                    statusDocuments.push({
                        type: 'invoice',
                        title: 'Invoice',
                        viewRoute: id ? `/app/invoice-view/${id}` : undefined,
                        exists: id,
                        icon: '/img/document-icons/invoice.png',
                        roles: ['finance', 'super_admin', 'admin'],
                    });
                }
    
                const filteredDocuments = statusDocuments.filter(doc => doc.roles?.includes(role));
                setDocuments(filteredDocuments);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching project:', error);
                setProjectLoading(false);
            });
    }, [id, role]);
    return (
        <div className="flex flex-col gap-4">
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
                              <div className="flex justify-center p-4">
                                  <ClipLoader size={20} color="#3b82f6" loading={loading} />
                              </div>
                          </Card>
                      ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 space-y-4">
                    <ProjectInfo projectdetails={projectData} />
                    <Issue projectId={id} />
                </div>

                <div className="space-y-4">
                    <CustomerInfo clientinformation={projectData} />

                    {projectData?.estimationId && (
                        <Card>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between border-b pb-3 border-gray-200 dark:border-gray-600">
                                    <h5 className="font-semibold">
                                        Project Status
                                    </h5>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Status:
                                        </span>
                                        <Badge content={projectData?.status || 'draft'} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Engineer:
                                        </span>
                                        {projectData?.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    size={32}
                                                    src={projectData.assignedTo.profileImage}
                                                    shape="circle"
                                                />
                                                <span className="font-medium">
                                                    {projectData.assignedTo.firstName}{' '}
                                                    {projectData.assignedTo.lastName}
                                                </span>
                                            </div>
                                        ) : (
                                            <Button
                                                size="xs"
                                                variant="solid"
                                                icon={<HiOutlineUserAdd />}
                                                onClick={openDrawer}
                                            >
                                                Assign
                                            </Button>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Checked:
                                        </span>
                                        <Badge 
                                            content={projectData?.isChecked ? 'Verified' : 'Pending'} 
                                            innerClass={projectData?.isChecked ? 'bg-emerald-500' : 'bg-amber-500'}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Approved:
                                        </span>
                                        <Badge 
                                            content={projectData?.isApproved ? 'Approved' : 'Pending'} 
                                            innerClass={projectData?.isApproved ? 'bg-emerald-500' : 'bg-amber-500'}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2">
                                    {['super_admin', 'admin'].includes(role) &&
                                        !projectData?.isApproved && (
                                            <Button
                                                block
                                                variant="solid"
                                                onClick={openStatusModal}
                                                disabled={!projectData?.isChecked}
                                                icon={projectData?.isChecked ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />}
                                            >
                                                {projectData?.isChecked ? 'Approve Project' : 'Needs Verification First'}
                                            </Button>
                                        )}

                                    {['super_admin', 'admin', 'engineer'].includes(role) &&
                                        !projectData?.isChecked && (
                                            <Button
                                                block
                                                variant="solid"
                                                onClick={() => openStatusModal2()}
                                            >
                                                Verify Project
                                            </Button>
                                        )}
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

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
    {isAssigning ? (
        <div className="flex items-center justify-center">
            <ClipLoader size={20} color="#3b82f6" />
        </div>
    ) : (
        <Button
            variant="solid"
            onClick={handleAssignEngineer}
            disabled={!selectedEngineer}
        >
            {selectedEngineer ? 'Confirm Assignment' : 'Select an engineer'}
        </Button>
    )}
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
                estimationId={projectData?.estimationId}
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