import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import hooks from '@/components/ui/hooks'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Field, Form, Formik, FormikProps, FieldProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import { Input } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import useUniqueId from '@/components/ui/hooks/useUniqueId'

type FormikRef = FormikProps<any>

const validationSchema = Yup.object().shape({
    clientName: Yup.string().required('Client Name Required'),
    clientAddress: Yup.string().required('Address Required'),
    mobileNumber: Yup.string()
        .required('Mobile Number Required')
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be at least 10 digits'),
    telephoneNumber: Yup.string()
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(10, 'Must be at least 10 digits'),
    trnNumber: Yup.string().required('TRN Number Required'),
    pincode: Yup.string()
        .required('Pincode Required')
        .length(6, 'Must be exactly 6 digits')
})

type InitialData = {
    clientName?: string
    clientAddress?: string
    mobileNumber?: string
    telephoneNumber?: string
    trnNumber?: string
    pincode?: string
}

export type FormModel = Omit<InitialData, 'tags'> & {
    tags: { label: string; value: string }[] | string[]
}

export type SetSubmitting = (isSubmitting: boolean) => void

export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>

type OnDelete = (callback: OnDeleteCallback) => void

type ClientFormProps = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

const ClientForm = forwardRef<FormikRef, ClientFormProps>((props, ref) => {
    const {
        type,
        initialData = {
            clientName: '',
            clientAddress: '',
            mobileNumber: '',
            telephoneNumber: '',
            trnNumber: '',
            pincode: ''
        },
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    const newId = useUniqueId('client-')

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                }}
                validationSchema={validationSchema}
                onSubmit={(values: FormModel, { setSubmitting }) => {
                    const formData = cloneDeep(values)
                    onFormSubmit?.(formData, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <FormItem
                                        label="Client Name"
                                        invalid={(errors.clientName && touched.clientName) as boolean}
                                        errorMessage={errors.clientName}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="clientName"
                                            placeholder="Client Name"
                                            component={Input}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Address"
                                        invalid={(errors.clientAddress && touched.clientAddress) as boolean}
                                        errorMessage={errors.clientAddress}
                                    >
                                        <Field
                                            type="text"
                                            autoComplete="off"
                                            name="clientAddress"
                                            placeholder="Address"
                                            component={Input}
                                            textArea
                                        />
                                    </FormItem>
                                    <div className="md:grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="Mobile Number"
                                            invalid={(errors.mobileNumber && touched.mobileNumber) as boolean}
                                            errorMessage={errors.mobileNumber}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="mobileNumber"
                                                placeholder="Mobile Number"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Telephone Number"
                                            invalid={(errors.telephoneNumber && touched.telephoneNumber) as boolean}
                                            errorMessage={errors.telephoneNumber}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="telephoneNumber"
                                                placeholder="Telephone Number"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className="md:grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="TRN Number"
                                            invalid={(errors.trnNumber && touched.trnNumber) as boolean}
                                            errorMessage={errors.trnNumber}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="trnNumber"
                                                placeholder="TRN Number"
                                                component={Input}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Pincode"
                                            invalid={(errors.pincode && touched.pincode) as boolean}
                                            errorMessage={errors.pincode}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="pincode"
                                                placeholder="Pincode"
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    {type === 'edit' && (
                                        <Button
                                            size="sm"
                                            variant="plain"
                                            type="button"
                                            icon={<HiOutlineTrash />}
                                            onClick={() => onDelete?.((prev) => !prev)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                                <div className="md:flex items-center">
                                    <Button
                                        size="sm"
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        onClick={() => onDiscard?.()}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        loading={isSubmitting}
                                        icon={<AiOutlineSave />}
                                        type="submit"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </StickyFooter>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </>
    )
})

ClientForm.displayName = 'ClientForm'

export default ClientForm