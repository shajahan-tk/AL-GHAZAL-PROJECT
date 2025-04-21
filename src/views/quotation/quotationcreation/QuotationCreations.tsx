import { forwardRef, useState, useEffect } from 'react'
import { FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import { Form, Formik, FormikProps } from 'formik'
import * as Yup from 'yup'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { BASE_URL } from '@/constants/app.constant'
import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FieldArray, FormikErrors, FormikTouched } from 'formik'
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi'
import DatePicker from '@/components/ui/DatePicker'
import Select from '@/components/ui/Select'
import Upload from '@/components/ui/Upload'
import Textarea from '@/views/ui-components/forms/Input/Textarea'

type FormikRef = FormikProps<any>

interface IQuotationItem {
    description: string
    image?: string
    unitOfMeasurement: string
    quantity: number
    unitPrice: number
    total: number
}

interface ITermsItem {
    description: string
}

interface InitialData {
    _id?: string
    dateOfEstimation: Date
    workStartDate: Date
    workEndDate: Date
    validUntil: Date
    paymentDueBy: number
    status: string
    estimationNumber?: string
    quotation: IQuotationItem[]
    termsAndConditions: ITermsItem[]
    estimatedAmount: number
    quotationAmount?: number
    commissionAmount?: number
    profit?: number
    preparedByName: string
    checkedByName: string
    approvedByName: string
}

export type FormModel = InitialData

type EstimationFormProps = {
    onDiscard?: () => void
}

const measurementUnits = [
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'lb', label: 'Pound (lb)' },
    { value: 'm', label: 'Meter (m)' },
    { value: 'cm', label: 'Centimeter (cm)' },
    { value: 'mm', label: 'Millimeter (mm)' },
    { value: 'ft', label: 'Foot (ft)' },
    { value: 'in', label: 'Inch (in)' },
    { value: 'sqm', label: 'Square Meter (sqm)' },
    { value: 'sqft', label: 'Square Foot (sqft)' },
    { value: 'l', label: 'Liter (l)' },
    { value: 'ml', label: 'Milliliter (ml)' },
    { value: 'gal', label: 'Gallon (gal)' },
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'set', label: 'Set' },
    { value: 'box', label: 'Box' },
    { value: 'roll', label: 'Roll' },
]

const validationSchema = Yup.object().shape({
    dateOfEstimation: Yup.date().required('Estimation Date is required'),
    workStartDate: Yup.date()
        .required('Work Start Date is required')
        .min(
            Yup.ref('dateOfEstimation'),
            'Work Start Date cannot be before Estimation Date',
        ),
    workEndDate: Yup.date()
        .required('Work End Date is required')
        .min(
            Yup.ref('workStartDate'),
            'Work End Date cannot be before Work Start Date',
        ),
    validUntil: Yup.date()
        .required('Valid Until Date is required')
        .min(
            Yup.ref('dateOfEstimation'),
            'Valid Until Date cannot be before Estimation Date',
        ),
    paymentDueBy: Yup.string().required('Payment Due is required'),
    status: Yup.string().required('Status is required'),
    quotation: Yup.array().of(
        Yup.object().shape({
            description: Yup.string().required('Description is required'),
            unitOfMeasurement: Yup.string().required('Unit of measurement is required'),
            quantity: Yup.number()
                .required('Quantity is required')
                .min(0, 'Quantity must be positive'),
            unitPrice: Yup.number()
                .required('Unit price is required')
                .min(0, 'Unit price must be positive'),
        }),
    ),
    preparedByName: Yup.string().required('Prepared by is required'),
    checkedByName: Yup.string().required('Checked by is required'),
    approvedByName: Yup.string().required('Approved by is required'),
})

const EstimationForm = forwardRef<FormikRef, EstimationFormProps>(
    (props, ref) => {
        const { onDiscard } = props
        const navigate = useNavigate()
        const { state: projectId } = useLocation()

        const [initialValues, setInitialValues] = useState<FormModel>({
            dateOfEstimation: new Date(),
            workStartDate: new Date(),
            workEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            paymentDueBy: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            status: 'Draft',
            quotation: [
                { 
                    description: '', 
                    unitOfMeasurement: '', 
                    quantity: 0, 
                    unitPrice: 0, 
                    total: 0 
                },
            ],
            termsAndConditions: [
                { description: '' },
            ],
            estimatedAmount: 0,
            preparedByName: '',
            checkedByName: '',
            approvedByName: '',
        })

        const [isLoading, setIsLoading] = useState(false)

        const handleFormSubmit = async (values: FormModel) => {
            try {
                const response: AxiosResponse = await createEstimation({
                    project: projectId,
                    paymentDueBy: values.paymentDueBy,
                    termsAndConditions: values.termsAndConditions,
                    validUntil: values.validUntil,
                    quotation: values.quotation,
                    workEndDate: values.workEndDate,
                    workStartDate: values.workStartDate,
                    commissionAmount: values.commissionAmount,
                    quotationAmount: values.quotationAmount,
                })
                console.log(response)

                toast.push(
                    <Notification
                        title={`Quotation Created`}
                        type="success"
                        duration={2500}
                    >
                        Quotation created successfully.
                    </Notification>,
                    { placement: 'top-center' },
                )

                navigate('/app/estimation-list')
            } catch (error) {
                console.error(`Error creating quotation:`, error)
                if (error.status === 400) {
                    toast.push(
                        <Notification
                            title={`Not Created`}
                            type="danger"
                            duration={2500}
                        >
                            Only one quotation is allowed per project.
                        </Notification>,
                        { placement: 'top-center' },
                    )
                } else {
                    toast.push(
                        <Notification
                            title="Error"
                            type="danger"
                            duration={2500}
                        >
                            Failed to create quotation. Please try again.
                        </Notification>,
                        { placement: 'top-center' },
                    )
                }
            }
        }

        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )
        }

        return (
            <Formik
                innerRef={ref}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
                enableReinitialize
            >
                {({
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    setFieldValue,
                    handleChange,
                }) => {
                    // Calculate totals whenever values change
                    useEffect(() => {
                        // Calculate quotation totals
                        values.quotation.forEach((item, index) => {
                            const total = parseFloat(
                                (
                                    item.quantity * item.unitPrice
                                ).toFixed(2),
                            )
                            if (item.total !== total) {
                                setFieldValue(
                                    `quotation[${index}].total`,
                                    total,
                                )
                            }
                        })

                        // Calculate estimated amount
                        const quotationTotal = values.quotation.reduce(
                            (sum, item) => sum + item.quantity * item.unitPrice,
                            0,
                        )
                        const estimatedAmount = parseFloat(
                            quotationTotal.toFixed(2),
                        )

                        if (values.estimatedAmount !== estimatedAmount) {
                            setFieldValue('estimatedAmount', estimatedAmount)
                        }

                        // Calculate profit if quotation and commission amounts exist
                        if (
                            values.quotationAmount !== undefined &&
                            values.commissionAmount !== undefined
                        ) {
                            const profit = parseFloat(
                                (
                                    values.quotationAmount -
                                    estimatedAmount -
                                    values.commissionAmount
                                ).toFixed(2),
                            )
                            if (values.profit !== profit) {
                                setFieldValue('profit', profit)
                            }
                        }
                    }, [
                        values.quotation,
                        values.quotationAmount,
                        values.commissionAmount,
                    ])

                    const handleFieldChange = (
                        e: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                        handleChange(e)
                        const { name, value } = e.target
                        setFieldValue(name, parseFloat(value) || 0)
                    }

                    const handleImageUpload = (index: number, files: File[]) => {
                        if (files.length > 0) {
                            setFieldValue(
                                `quotation[${index}].image`,
                                files[0].name,
                            )
                        }
                    }

                    return (
                        <Form>
                            <FormContainer>
                                <AdaptableCard divider className="mb-4">
                                    <h5>Quotation Details</h5>
                                    <p className="mb-6">
                                        Section to configure quotation information
                                    </p>
                                </AdaptableCard>

                                <AdaptableCard divider className="mb-4">
                                    <h5>Quotation Items</h5>
                                    <p className="mb-6">
                                        List of items required for the project
                                    </p>

                                    <FieldArray name="quotation">
                                        {({ push, remove }) => (
                                            <div className="space-y-4">
                                                {values.quotation.map(
                                                    (item, index) => (
                                                        <div
                                                            key={index}
                                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b pb-4"
                                                        >
                                                            <div className="md:col-span-3">
                                                                <FormItem
                                                                    label={`Description ${index + 1}`}
                                                                    invalid={
                                                                        !!errors
                                                                            .quotation?.[
                                                                            index
                                                                        ]
                                                                            ?.description &&
                                                                        touched
                                                                            .quotation?.[
                                                                            index
                                                                        ]
                                                                            ?.description
                                                                    }
                                                                    errorMessage={
                                                                        errors
                                                                            .quotation?.[
                                                                            index
                                                                        ]
                                                                            ?.description
                                                                    }
                                                                >
                                                                    <Field
                                                                        name={`quotation[${index}].description`}
                                                                        placeholder="Item description"
                                                                        component={Textarea}
                                                                        textAreaClassName="min-h-[80px]"
                                                                    />
                                                                </FormItem>
                                                            </div>

                                                            <div className="md:col-span-2">
                                                                <FormItem
                                                                    label="Image"
                                                                >
                                                                    <Upload
                                                                        onChange={(files) => handleImageUpload(index, files)}
                                                                        showList={false}
                                                                    >
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant="outline"
                                                                        >
                                                                            Upload Image
                                                                        </Button>
                                                                    </Upload>
                                                                    {item.image && (
                                                                        <div className="text-xs mt-1">
                                                                            {item.image}
                                                                        </div>
                                                                    )}
                                                                </FormItem>
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <FormItem
                                                                    label="Unit of Measurement"
                                                                    invalid={
                                                                        !!errors
                                                                            .quotation?.[
                                                                            index
                                                                        ]
                                                                            ?.unitOfMeasurement &&
                                                                        touched
                                                                            .quotation?.[
                                                                            index
                                                                        ]
                                                                            ?.unitOfMeasurement
                                                                    }
                                                                    errorMessage={
                                                                        errors
                                                                            .quotation?.[
                                                                            index
                                                                        ]
                                                                            ?.unitOfMeasurement
                                                                    }
                                                                >
                                                                    <Select
                                                                        name={`quotation[${index}].unitOfMeasurement`}
                                                                        options={measurementUnits}
                                                                        placeholder="Select unit"
                                                                        value={measurementUnits.find(
                                                                            (unit) =>
                                                                                unit.value ===
                                                                                item.unitOfMeasurement,
                                                                        )}
                                                                        onChange={(option) =>
                                                                            setFieldValue(
                                                                                `quotation[${index}].unitOfMeasurement`,
                                                                                option?.value,
                                                                            )
                                                                        }
                                                                    />
                                                                </FormItem>
                                                            </div>

                                                            <div className="md:col-span-1">
                                                                <FormItem
                                                                    label="Quantity"
                                                                    invalid={
                                                                        !!errors
                                                                            .quotation?.[
                                                                            index
                                                                        ]
                                                                            ?.quantity &&
                                                                        touched
                                                                            .quotation?.[
                                                                            index
                                                                        ]?.quantity
                                                                    }
                                                                    errorMessage={
                                                                        errors
                                                                            .quotation?.[
                                                                            index
                                                                        ]?.quantity
                                                                    }
                                                                >
                                                                    <Field
                                                                        type="number"
                                                                        name={`quotation[${index}].quantity`}
                                                                        placeholder="Qty"
                                                                        component={
                                                                            Input
                                                                        }
                                                                        min={0}
                                                                        onChange={
                                                                            handleFieldChange
                                                                        }
                                                                    />
                                                                </FormItem>
                                                            </div>

                                                            <div className="md:col-span-1">
                                                                <FormItem
                                                                    label="Unit Price"
                                                                    invalid={
                                                                        !!errors
                                                                            .quotation?.[
                                                                            index
                                                                        ]
                                                                            ?.unitPrice &&
                                                                        touched
                                                                            .quotation?.[
                                                                            index
                                                                        ]?.unitPrice
                                                                    }
                                                                    errorMessage={
                                                                        errors
                                                                            .quotation?.[
                                                                            index
                                                                        ]?.unitPrice
                                                                    }
                                                                >
                                                                    <Field
                                                                        type="number"
                                                                        name={`quotation[${index}].unitPrice`}
                                                                        placeholder="Price"
                                                                        component={
                                                                            Input
                                                                        }
                                                                        min={0}
                                                                        onChange={
                                                                            handleFieldChange
                                                                        }
                                                                    />
                                                                </FormItem>
                                                            </div>

                                                            <div className="md:col-span-1">
                                                                <FormItem label="Total">
                                                                    <Input
                                                                        readOnly
                                                                        value={
                                                                            item.total
                                                                        }
                                                                        placeholder="Total"
                                                                    />
                                                                </FormItem>
                                                            </div>

                                                            <div className="md:col-span-1 flex justify-end">
                                                                {values
                                                                    .quotation
                                                                    .length >
                                                                    1 && (
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="plain"
                                                                        color="red"
                                                                        icon={
                                                                            <HiOutlineTrash />
                                                                        }
                                                                        onClick={() =>
                                                                            remove(
                                                                                index,
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}

                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="twoTone"
                                                    icon={<HiOutlinePlus />}
                                                    onClick={() =>
                                                        push({
                                                            description: '',
                                                            unitOfMeasurement: '',
                                                            quantity: 0,
                                                            unitPrice: 0,
                                                            total: 0,
                                                        })
                                                    }
                                                >
                                                    Add Quotation Item
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </AdaptableCard>

                                <AdaptableCard divider className="mb-4">
                                    <h5>Terms and Conditions</h5>
                                    <p className="mb-6">
                                        List of terms and conditions for the quotation
                                    </p>

                                    <FieldArray name="termsAndConditions">
                                        {({ push, remove }) => (
                                            <div className="space-y-4">
                                                {values.termsAndConditions.map(
                                                    (term, index) => (
                                                        <div
                                                            key={index}
                                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b pb-4"
                                                        >
                                                            <div className="md:col-span-11">
                                                                <FormItem
                                                                    label={`Term ${index + 1}`}
                                                                    invalid={
                                                                        !!errors
                                                                            .termsAndConditions?.[
                                                                            index
                                                                        ]
                                                                            ?.description &&
                                                                        touched
                                                                            .termsAndConditions?.[
                                                                            index
                                                                        ]
                                                                            ?.description
                                                                    }
                                                                    errorMessage={
                                                                        errors
                                                                            .termsAndConditions?.[
                                                                            index
                                                                        ]
                                                                            ?.description
                                                                    }
                                                                >
                                                                    <Field
                                                                        name={`termsAndConditions[${index}].description`}
                                                                        placeholder="Enter term or condition"
                                                                        component={Textarea}
                                                                        textAreaClassName="min-h-[60px]"
                                                                    />
                                                                </FormItem>
                                                            </div>

                                                            <div className="md:col-span-1 flex justify-end">
                                                                {values
                                                                    .termsAndConditions
                                                                    .length >
                                                                    1 && (
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="plain"
                                                                        color="red"
                                                                        icon={
                                                                            <HiOutlineTrash />
                                                                        }
                                                                        onClick={() =>
                                                                            remove(
                                                                                index,
                                                                            )
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>
                                                    ),
                                                )}

                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="twoTone"
                                                    icon={<HiOutlinePlus />}
                                                    onClick={() =>
                                                        push({
                                                            description: '',
                                                        })
                                                    }
                                                >
                                                    Add Term
                                                </Button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </AdaptableCard>
                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <div>
                                        <Button
                                            size="sm"
                                            className="ltr:mr-3 rtl:ml-3"
                                            type="button"
                                            onClick={onDiscard}
                                        >
                                            Discard
                                        </Button>
                                    </div>
                                    <div className="md:flex grid-2 gap-2">
                                        <div className="md:flex "></div>
                                        <div className="md:flex">
                                            <Button
                                                size="sm"
                                                variant="solid"
                                                loading={isSubmitting}
                                                type="submit"
                                            >
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                </StickyFooter>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        )
    },
)

EstimationForm.displayName = 'EstimationForm'

export default EstimationForm