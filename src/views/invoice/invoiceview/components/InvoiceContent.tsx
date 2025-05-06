import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Loading from '@/components/shared/Loading'
import Logo from '@/components/template/Logo'
import { HiLocationMarker, HiPhone, HiUser } from 'react-icons/hi'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useAppSelector } from '@/store'
import dayjs from 'dayjs'
import { Notification, toast } from '@/components/ui'
import ContentTable from './ContentTable'

type InvoiceData = {
    _id: string
    invoiceNumber: string
    date: string
    orderNumber: string
    vendor: {
        name: string
        poBox: string
        address: string
        phone: string
        fax: string
        trn: string
    }
    vendee: {
        name: string
        contactPerson: string
        poBox: string
        address: string
        phone: string
        fax: string
        trn: string
        grnNumber: string
        supplierNumber: string
        servicePeriod: string
    }
    subject: string
    paymentTerms: string
    amountInWords: string
    products: Array<{
        sno: number
        description: string
        qty: number
        unitPrice: number
        total: number
    }>
    summary: {
        amount: number
        vat: number
        totalReceivable: number
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
const fakeData: InvoiceData = {
    _id: '1',
    invoiceNumber: 'AGA244444',
    date: '2025-02-25',
    orderNumber: 'ssdfs4232',
    vendor: {
        name: 'AL GHAZAL AL ABYAD TECHNICAL SERVICES',
        poBox: '63509',
        address: 'Dubai - UAE',
        phone: '(04) 4102555',
        fax: '',
        trn: '104037793700003'
    },
    vendee: {
        name: 'IMDAAD LLC',
        contactPerson: 'Mr. Solomon Dhanapalan',
        poBox: '18220',
        address: 'DUBAI - UAE',
        phone: '(04) 812 8888',
        fax: '(04) 881 8405',
        trn: '100236819700003',
        grnNumber: '87143',
        supplierNumber: 'PO25IMD7595',
        servicePeriod: '02-02-2025 to 23-02-2025'
    },
    subject: 'SUPPLY AND FIXING GROHE CONCEALED TANK AND SUPPLY AND FIXING OF SS PUSH PLATE LOCATION: WATERFRONT MARKET,DEIRA',
    paymentTerms: '90 DAYS',
    amountInWords: 'Seventy thousand five hundred sixty and xx/100 UAE Dirham',
    products: [
        {
            sno: 1,
            description: 'GROHE CONCEALED TANK',
            qty: 10,
            unitPrice: 1500,
            total: 15000
        },
        {
            sno: 2,
            description: 'SS PUSH PLATE',
            qty: 20,
            unitPrice: 500,
            total: 10000
        }
    ],
    summary: {
        amount: 25000,
        vat: 1250,
        totalReceivable: 26250
    },
    preparedBy: {
        _id: '1',
        firstName: 'John',
        lastName: 'Smith'
    },
    createdAt: '2025-02-24',
    updatedAt: '2025-02-24'
}

const InvoiceContent = () => {
    const { textTheme } = useThemeClass()
    const mode = useAppSelector((state) => state.theme.mode)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<InvoiceData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [pdfLoading, setPdfLoading] = useState(false)

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                setLoading(true)
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000))
                // Use fake data instead of API call
                setData(fakeData)
            } catch (err) {
                console.error('Error fetching invoice data:', err)
                setError('Failed to load invoice data')
            } finally {
                setLoading(false)
            }
        }

        fetchInvoiceData()
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
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div>
                    <Logo className="mb-3" mode={mode} />
                    <h2 className="text-2xl font-bold mb-4">TAX INVOICE</h2>
                </div>
                <div className="my-4">
                    <div className="mb-2">
                        <div className="flex justify-between">
                            <span>PO Box No: {data.vendor.poBox}</span>
                            <span>Date: {dayjs(data.date).format('DD/MM/YYYY')}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Dubai, UAE</span>
                            <span>INV #: {data.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Website: www.alghazalgroup.com</span>
                            <span>Order No: {data.orderNumber}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="border-t border-b border-gray-200 dark:border-gray-600 py-4 my-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold mb-2">Vendee</h4>
                        <p className="whitespace-pre-line">{`
${data.vendee.name}
${data.vendee.contactPerson}
${data.vendee.address}
PB ${data.vendee.poBox}
Phone: ${data.vendee.phone}
Fax: ${data.vendee.fax}
TRN#: ${data.vendee.trn}
                        `}</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-2">Vendor</h4>
                        <p className="whitespace-pre-line">{`
${data.vendor.name}
PB: ${data.vendor.poBox} ${data.vendor.address}
Phone: ${data.vendor.phone}
TRN#: ${data.vendor.trn}
GRN Number: ${data.vendee.grnNumber}
Supplier No.: ${data.vendee.supplierNumber}
Service Period: ${data.vendee.servicePeriod}
                        `}</p>
                    </div>
                </div>
            </div>
            
            <div className="my-6">
                <h4 className="font-bold">Subject:</h4>
                <p>{data.subject}</p>
            </div>
            
            <div className="my-6">
                <ContentTable products={data.products} summary={data.summary} />
            </div>
            
            <div className="my-6">
                <h4 className="font-bold mb-2">Comments or special instructions</h4>
                <p>Payment: {data.paymentTerms}</p>
                <p>Amt in Words: {data.amountInWords}</p>
            </div>
            
            <div className="mt-8">
                <div className="flex justify-end">
                    <div className="text-center">
                        <p className="font-bold">Approved by:</p>
                        <p className="mt-8">Signature: ___________________</p>
                    </div>
                </div>
            </div>

            <div className="print:hidden mt-6 flex items-center justify-end">
                <Button 
                    variant="solid" 
                    loading={pdfLoading}
                    onClick={handleDownloadPdf}
                >
                    {pdfLoading ? 'Generating PDF...' : 'Download Invoice'}
                </Button>
            </div>
        </Loading>
    )
}

export default InvoiceContent