import { forwardRef, useState } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import hooks from '@/components/ui/hooks'
import StickyFooter from '@/components/shared/StickyFooter'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Field, FieldArray, Form, Formik, FormikProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import { Input } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'
import useUniqueId from '@/components/ui/hooks/useUniqueId'
import Select from '@/components/ui/Select'
import { statusOptions } from '@/views/account/KycForm/constants'

type FormikRef = FormikProps<any>


// ... (type definitions remain the same)

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name Required'),
    lastName: Yup.string().required('Last Name Required'),
    email: Yup.string().email('Invalid email').required('Email Required'),
    role: Yup.string().required('Role is Required'),
    password: Yup.string().required('password is Required'),
    phoneNumbers: Yup.array().of(
        Yup.string().matches(/^[0-9]+$/, 'Phone number must be digits only')
    )
})

// ... (DeleteProductButton component remains the same)

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
            password:'',
          
        },
        onFormSubmit,
        onDiscard,
        onDelete,
    } = props

    const newId = useUniqueId('product-')

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
                    
                    if (type === 'new') {
                        // formData.id = newId
                        // if (formData.imgList && formData.imgList.length > 0) {
                            // formData.img = formData.imgList[0].img
                        // }
                    }
                    onFormSubmit?.(formData, setSubmitting)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2">
                                    <FormItem
                                        label="First Name"
                                        invalid={(errors.firstName && touched.firstName) as boolean}
                                        errorMessage={errors.firstName}
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
                                        invalid={(errors.lastName && touched.lastName) as boolean}
                                        errorMessage={errors.lastName}
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
        invalid={(errors.email && touched.email) as boolean}
        errorMessage={errors.email}
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
        invalid={errors.role && touched.role}
        errorMessage={errors.role}
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
                                    <AdaptableCard divider className="mb-4">
                                        <FieldArray name="phoneNumbers">
                                            {({ push, remove }) => (
                                                <div className="space-y-4">
                                                    {values.phoneNumbers.map((phoneNumber, index) => (
                                                        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-b pb-4">
                                                            <FormItem
                                                                label="Phone Number"
                                                                invalid={Boolean(
                                                                    errors.phoneNumbers &&
                                                                    errors.phoneNumbers[index] &&
                                                                    touched.phoneNumbers
                                                                )}
                                                                errorMessage={
                                                                    errors.phoneNumbers && 
                                                                    errors.phoneNumbers[index]
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

                                    <FormItem
                                        label="password"
                                        invalid={(errors.password && touched.password) as boolean}
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            type="password"
                                            autoComplete="off"
                                            name="password"
                                            placeholder="password"
                                            component={Input}
                                        />
                                    </FormItem>


                                </div>
                            </div>
                            
                            {/* Sticky Footer with Save Button */}
                            <StickyFooter
                                className="-mx-8 px-8 flex items-center justify-between py-4"
                                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            >
                                <div>
                                    {type === 'edit' && (
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
                )}
            </Formik>
        </>
    )
})

UserForm.displayName = 'UserForm'

export default UserForm