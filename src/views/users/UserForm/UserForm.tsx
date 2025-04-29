import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import { Field, FieldArray, Form, Formik, FormikProps, FieldProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import { Input, Upload } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import useUniqueId from '@/components/ui/hooks/useUniqueId'
import Select from '@/components/ui/Select'
import ConfirmDialog from '@/components/shared/ConfirmDialog'

type FormikRef = FormikProps<any>

const RoleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Engineer', value: 'engineer' },
    { label: 'Finance', value: 'finance' },
    { label: 'Driver', value: 'driver' },
]

type InitialData = {
    firstName?: string
    lastName?: string
    email?: string
    phoneNumbers?: string[]
    role?: string
    password?: string
    profileImage?: string | File
    signatureImage?: string | File
}

export type FormModel = Omit<InitialData, 'tags'> & {
    tags: { label: string; value: string }[] | string[]
}

export type SetSubmitting = (isSubmitting: boolean) => void
export type OnDeleteCallback = React.Dispatch<React.SetStateAction<boolean>>
type OnDelete = (callback: OnDeleteCallback) => void

type UserForm = {
    initialData?: InitialData
    type: 'edit' | 'new'
    onDiscard?: () => void
    onDelete?: OnDelete
    onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

const UserForm = forwardRef<FormikRef, UserForm>((props, ref) => {
    const {
        type,
        initialData = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumbers: [''],
            role: '',
            password: '',
            profileImage: '',
            signatureImage: ''
        },
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    const newId = useUniqueId('product-')

    const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
    const [signatureImageFile, setSignatureImageFile] = useState<File | null>(null)

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name Required'),
        lastName: Yup.string().required('Last Name Required'),
        email: Yup.string().email('Invalid email').required('Email Required'),
        role: Yup.string().required('Role is Required'),
        password: type === 'new' 
            ? Yup.string().required('Password is Required') 
            : Yup.string(),
        phoneNumbers: Yup.array().of(
            Yup.string().matches(/^[0-9]+$/, 'Phone number must be digits only')
        ),
        profileImage: type === 'new' 
            ? Yup.mixed().required('Profile image is required') 
            : Yup.mixed(),
        signatureImage: type === 'new' 
            ? Yup.mixed().required('Signature is required') 
            : Yup.mixed()
    })

    const handleSubmit = async (values: FormModel, { setSubmitting }: { setSubmitting: SetSubmitting }) => {
        console.log('Form submission started with values:', values)
        const formData = new FormData()
        
        Object.keys(values).forEach(key => {
            if (key === 'phoneNumbers') {
                values.phoneNumbers?.forEach((num, index) => {
                    formData.append(`phoneNumbers[${index}]`, num)
                })
            } else if (key !== 'profileImage' && key !== 'signatureImage') {
                formData.append(key, values[key as keyof FormModel] as string)
            }
        })
        
        if (profileImageFile) {
            formData.append('profileImage', profileImageFile)
        }
        if (signatureImageFile) {
            formData.append('signatureImage', signatureImageFile)
        }
        
        console.log('FormData contents:')
        for (let [key, value] of formData.entries()) {
            console.log(key, value)
        }
        
        onFormSubmit?.(formData as unknown as FormModel, setSubmitting)
    }

    return (
        <>
            <Formik
                innerRef={ref}
                initialValues={{
                    ...initialData,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize={true}
            >
                {({ values, touched, errors, isSubmitting, setFieldValue }) => {
                    
                    const handleProfileImageChange = (files: File[]) => {
                        if (files.length > 0) {
                            setProfileImageFile(files[0])
                            setFieldValue('profileImage', files[0].name)
                        }
                    }
                    
                    const handleSignatureImageChange = (files: File[]) => {
                        if (files.length > 0) {
                            setSignatureImageFile(files[0])
                            setFieldValue('signatureImage', files[0].name)
                        }
                    }

                    const handleProfileRemove = () => {
                        setProfileImageFile(null)
                        setFieldValue('profileImage', '')
                    }

                    const handleSignatureRemove = () => {
                        setSignatureImageFile(null)
                        setFieldValue('signatureImage', '')
                    }

                    return (
                        <Form>
                            <FormContainer>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    <div className="lg:col-span-2">
                                        <FormItem
                                            label="First Name"
                                            invalid={!!(errors.firstName && touched.firstName)}
                                            errorMessage={errors.firstName as string}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="firstName"
                                                placeholder="First Name"
                                                component={Input}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label="Last Name"
                                            invalid={!!(errors.lastName && touched.lastName)}
                                            errorMessage={errors.lastName as string}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="lastName"
                                                placeholder="Last Name"
                                                component={Input}
                                            />
                                        </FormItem>

                                        <div className="md:grid grid-cols-2 gap-4">
                                            <FormItem
                                                label="Email"
                                                invalid={!!(errors.email && touched.email)}
                                                errorMessage={errors.email as string}
                                            >
                                                <Field
                                                    type="email"
                                                    autoComplete="off"
                                                    name="email"
                                                    placeholder="Email"
                                                    component={Input}
                                                />
                                            </FormItem>

                                            <FormItem
                                                label="Role"
                                                invalid={!!(errors.role && touched.role)}
                                                errorMessage={errors.role as string}
                                            >
                                                <Field name="role">
                                                    {({ field, form }: FieldProps) => (
                                                        <Select
                                                            placeholder="Select Role"
                                                            field={field}
                                                            form={form}
                                                            options={RoleOptions}
                                                            value={RoleOptions.find(
                                                                (role) => role.value === values.role
                                                            )}
                                                            onChange={(role) => {
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    role?.value || ''
                                                                )
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                       
                                        <div className='flex flex-col-2 gap-4 mb-4'>
                                            <div className='flex flex-col gap-y-2'>
                                                <FormItem
                                                    label="Signature"
                                                    invalid={!!(errors.signatureImage && touched.signatureImage)}
                                                    errorMessage={errors.signatureImage as string}
                                                >
                                                    <Upload 
                                                        onChange={(files) => handleSignatureImageChange(files)}
                                                        onFileRemove={handleSignatureRemove}
                                                        uploadLimit={1}
                                                        defaultFile={initialData.signatureImage}
                                                    />
                                                </FormItem>
                                            </div>
                                            <div className='flex flex-col gap-y-2'>
                                                <FormItem
                                                    label="Profile Image"
                                                    invalid={!!(errors.profileImage && touched.profileImage)}
                                                    errorMessage={errors.profileImage as string}
                                                >
                                                    <Upload 
                                                        onChange={(files) => handleProfileImageChange(files)}
                                                        onFileRemove={handleProfileRemove}
                                                        uploadLimit={1}
                                                        defaultFile={initialData.profileImage}
                                                    />
                                                </FormItem>
                                            </div>
                                        </div>
                                        
                                        <AdaptableCard divider className="mb-4">
                                            <FieldArray name="phoneNumbers">
                                                {({ push, remove }) => (
                                                    <div className="space-y-4">
                                                        {values.phoneNumbers?.map((phoneNumber, index) => (
                                                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4">
                                                                <FormItem
                                                                    label="Phone Number"
                                                                    invalid={Boolean(
                                                                        errors.phoneNumbers &&
                                                                        (errors.phoneNumbers as any)[index] &&
                                                                        touched.phoneNumbers
                                                                    )}
                                                                    errorMessage={
                                                                        errors.phoneNumbers && 
                                                                        (errors.phoneNumbers as any)[index]
                                                                    }
                                                                >
                                                                    <Field
                                                                        name={`phoneNumbers.${index}`}
                                                                        component={Input}
                                                                        placeholder="Phone Number"
                                                                    />
                                                                </FormItem>
                                                                <div className="flex justify-end">
                                                                    {values.phoneNumbers.length > 1 && (
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            variant="plain"
                                                                            color="red"
                                                                            icon={<HiOutlineTrash />}
                                                                            onClick={() => remove(index)}
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            variant="twoTone"
                                                            icon={<HiOutlinePlus />}
                                                            onClick={() => push('')}
                                                        >
                                                            Add Phone Number
                                                        </Button>
                                                    </div>
                                                )}
                                            </FieldArray>
                                        </AdaptableCard>

                                        {type === 'new' && (
                                            <FormItem
                                                label="Password"
                                                invalid={!!(errors.password && touched.password)}
                                                errorMessage={errors.password as string}
                                            >
                                                <Field
                                                    type="password"
                                                    autoComplete="off"
                                                    name="password"
                                                    placeholder="Password"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        )}
                                    </div>
                                </div>
                                
                                <StickyFooter
                                    className="-mx-8 px-8 flex items-center justify-between py-4"
                                    stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                >
                                    <div>
                                        {type === 'edit' && onDelete && (
                                            <DeleteProductButton
                                                onDelete={onDelete as OnDelete}
                                            />
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
                    )
                }}
            </Formik>
        </>
    )
})

UserForm.displayName = 'UserForm'

const DeleteProductButton = ({ onDelete }: { onDelete: OnDelete }) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    const onConfirmDialog = () => {
        setDialogOpen(false)
        onDelete?.(setDialogOpen)
    }

    const onDialogClose = () => {
        setDialogOpen(false)
    }

    return (
        <>
            <Button
                className="text-red-600"
                variant="plain"
                size="sm"
                icon={<HiOutlineTrash />}
                type="button"
                onClick={() => setDialogOpen(true)}
            >
                Delete
            </Button>
            <ConfirmDialog
                isOpen={dialogOpen}
                type="danger"
                title="Delete user"
                confirmButtonColor="red-600"
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
                onCancel={onDialogClose}
                onConfirm={onConfirmDialog}
            >
                <p>Are you sure you want to delete this user?</p>
            </ConfirmDialog>
        </>
    )
}

export default UserForm