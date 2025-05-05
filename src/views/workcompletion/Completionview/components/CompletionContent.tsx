import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import Logo from '@/components/template/Logo'
import { HiLocationMarker, HiPhone, HiUser } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useAppSelector } from '@/store'
import dayjs from 'dayjs'
import { Notification, toast } from '@/components/ui'

type CompletionData = {
    _id: string
    referenceNumber: string
    fmContractor: string
    subContractor: string
    projectDescription: string
    location: string
    completionDate: string
    lpoNumber: string
    lpoDate: string
    handover: {
        company: string
        name: string
        signature: string
        date: string
    }
    acceptance: {
        company: string
        name: string
        signature: string
        date: string
    }
    sitePictures: Array<{
        url: string
        caption?: string
    }>
    project: {
        _id: string
        projectName: string
    }
    preparedBy: {
        _id: string
        firstName: string
        lastName: string
    }
    createdAt: string
    updatedAt: string
}

// Fake data for demonstration
const fakeData: CompletionData = {
    _id: '1',
    referenceNumber: 'COMP-2023-001',
    fmContractor: 'Al Ghazal Al Abyad Technical Services',
    subContractor: 'ABC Subcontracting LLC',
    projectDescription: 'HVAC Installation and Maintenance for Office Building',
    location: 'Dubai Marina, Dubai, UAE',
    completionDate: '2025-02-24',
    lpoNumber: 'LPO-2023-456',
    lpoDate: '2023-05-15',
    handover: {
        company: 'AL GHAZAL AL ABYAD TECHNICAL SERVICES',
        name: 'Moideen Kutty',
        signature: '',
        date: '2025-02-24'
    },
    acceptance: {
        company: 'Client Company Name',
        name: 'Client Representative',
        signature: '',
        date: '2025-02-25'
    },
    sitePictures: [
        { url: 'https://via.placeholder.com/300x200?text=Site+Image+1', caption: 'HVAC Installation' },
        { url: 'https://via.placeholder.com/300x200?text=Site+Image+2', caption: 'Completed Work Area' },
        { url: 'https://via.placeholder.com/300x200?text=Site+Image+3', caption: 'Final Inspection' }
    ],
    project: {
        _id: '1',
        projectName: 'Office Tower HVAC Project'
    },
    preparedBy: {
        _id: '1',
        firstName: 'John',
        lastName: 'Smith'
    },
    createdAt: '2023-05-10',
    updatedAt: '2023-05-10'
}

const CompletionContent = () => {
    const { textTheme } = useThemeClass()
    const mode = useAppSelector((state) => state.theme.mode)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<CompletionData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [pdfLoading, setPdfLoading] = useState(false)

    useEffect(() => {
        const fetchCompletionData = async () => {
            try {
                setLoading(true)
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000))
                // Use fake data instead of API call
                setData(fakeData)
            } catch (err) {
                console.error('Error fetching completion data:', err)
                setError('Failed to load completion data')
            } finally {
                setLoading(false)
            }
        }

        fetchCompletionData()
    }, [])

    const handleDownloadPdf = async () => {
        setPdfLoading(true)
        setError('')
        
        try {
            // Simulate PDF generation delay
            await new Promise(resolve => setTimeout(resolve, 1500))
            toast.push(
                <Notification title="Success" type="success">
                    PDF downloaded successfully
                </Notification>
            )
        } catch (error) {
            setError('Failed to download PDF')
            toast.push(
                <Notification title="Error" type="danger">
                    Failed to download PDF
                </Notification>
            )
        } finally {
            setPdfLoading(false)
        }
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-500">
                {error}
                <Button className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        )
    }

    if (!data) {
        return <Loading loading={loading} />
    }

    return (
        <Loading loading={loading}>
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-10">
                <div>
                    <Logo className="mb-3" mode={mode} />
                    <h2 className="text-2xl font-bold mb-4">COMPLETION CERTIFICATE</h2>
                </div>
                <div className="my-4">
                    <div className="mb-2">
                        <h4>Reference: {data.referenceNumber}</h4>
                        <div className="flex flex-col space-y-1">
                            <span>
                                Prepared On: {dayjs(data.createdAt).format('dddd, DD MMMM, YYYY')}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 flex">
                        <HiUser className={`text-xl ${textTheme}`} />
                        <div className="ltr:ml-3 rtl:mr-3">
                            Prepared By: {data.preparedBy.firstName} {data.preparedBy.lastName}
                        </div>
                    </div>
                    <div className="mt-4 flex">
                        <HiLocationMarker className={`text-xl ${textTheme}`} />
                        <div className="ltr:ml-3 rtl:mr-3">
                            <h6>Project: {data.project.projectName}</h6>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <p><strong>FM Contractor:</strong> {data.fmContractor}</p>
                        <p><strong>Sub Contractor:</strong> {data.subContractor}</p>
                    </div>
                    <div>
                        <p><strong>Project Description:</strong> {data.projectDescription}</p>
                        <p><strong>Location:</strong> {data.location}</p>
                    </div>
                </div>
                
                <div className="my-6 p-4 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-center italic">
                        This is to certify that the work described above on project description has been cleared out and completed.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div>
                        <p><strong>Completion Date:</strong> {dayjs(data.completionDate).format('DD MMMM, YYYY')}</p>
                    </div>
                    <div>
                        <p><strong>LPO Number:</strong> {data.lpoNumber}</p>
                    </div>
                    <div>
                        <p><strong>LPO Date:</strong> {dayjs(data.lpoDate).format('DD MMMM, YYYY')}</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="border rounded p-4">
                    <h5 className="font-bold mb-4 text-center">Hand Over By</h5>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="py-2 font-semibold">Company:</td>
                                <td className="py-2">{data.handover.company}</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-semibold">Name:</td>
                                <td className="py-2">{data.handover.name}</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-semibold">Signature:</td>
                                <td className="py-2">[Signature]</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-semibold">Date:</td>
                                <td className="py-2">{dayjs(data.handover.date).format('DD MMMM, YYYY')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div className="border rounded p-4">
                    <h5 className="font-bold mb-4 text-center">Accepted By</h5>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="py-2 font-semibold">Company:</td>
                                <td className="py-2">{data.acceptance.company}</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-semibold">Name:</td>
                                <td className="py-2">{data.acceptance.name}</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-semibold">Signature:</td>
                                <td className="py-2">[Signature]</td>
                            </tr>
                            <tr>
                                <td className="py-2 font-semibold">Date:</td>
                                <td className="py-2">{dayjs(data.acceptance.date).format('DD MMMM, YYYY')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="mb-8">
                <h5 className="font-bold mb-4">Site Pictures:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {data.sitePictures.map((image, index) => (
                        <div key={`image-${index}`} className="border rounded overflow-hidden">
                            <img 
                                src={image.url} 
                                alt={image.caption || `Site Image ${index + 1}`}
                                className="w-full h-48 object-cover"
                            />
                            {image.caption && (
                                <div className="p-2 bg-gray-50 dark:bg-gray-700 text-center">
                                    <p className="text-sm">{image.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="print:hidden mt-6 flex items-center justify-end">
                <Button 
                    variant="solid" 
                    loading={pdfLoading}
                    onClick={handleDownloadPdf}
                >
                    {pdfLoading ? 'Generating PDF...' : 'Download Completion Certificate'}
                </Button>
            </div>
        </Loading>
    )
}

export default CompletionContent