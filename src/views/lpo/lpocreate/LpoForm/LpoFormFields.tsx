// LpoFormFields.tsx
import AdaptableCard from '@/components/shared/AdaptableCard'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Field, FormikErrors, FormikTouched, FieldProps } from 'formik'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { HiOutlineTrash, HiOutlinePlus } from 'react-icons/hi'
import Upload from '@/components/ui/Upload'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'

type FormFieldsName = {
    lpoNumber: string
    attachedFile: File | null
    materials: {
        name: string
    }[]
}

type LpoFormFieldsProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
    values: FormFieldsName
}

const LpoFormFields = (props: LpoFormFieldsProps) => {
    const { touched, errors, values } = props
    const [filePreview, setFilePreview] = useState<string | null>(null)

    const beforeUpload = (file: FileList | null) => {
        let valid: boolean | string = true
        const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png']
        const maxFileSize = 5000000 // 5MB

        if (file && file.length > 0) {
            if (!allowedFileTypes.includes(file[0].type)) {
                valid = 'Please upload a PDF, JPEG, or PNG file!'
            }

            if (file[0].size >= maxFileSize) {
                valid = 'File size cannot be more than 5MB!'
            }
        }

        return valid
    }

    const onFileChange = (
        form: any,
        field: any,
        files: File[],
        setFieldValue: any
    ) => {
        if (files.length > 0) {
            setFieldValue(field.name, files[0])
            setFilePreview(URL.createObjectURL(files[0]))
        }
    }

    const addMaterial = (values: FormFieldsName, setFieldValue: any) => {
        const newMaterials = [
            ...values.materials,
            { name: '' }
        ]
        setFieldValue('materials', newMaterials)
    }

    const removeMaterial = (
        index: number,
        values: FormFieldsName,
        setFieldValue: any
    ) => {
        const newMaterials = [...values.materials]
        newMaterials.splice(index, 1)
        setFieldValue('materials', newMaterials)
    }

    return (
        <AdaptableCard divider className="mb-4">
            <h5>LPO Information</h5>
            <p className="mb-6">Section to enter LPO details</p>

            {/* LPO Number Field */}
            <FormItem
                label="LPO Number"
                invalid={(errors.lpoNumber && touched.lpoNumber) as boolean}
                errorMessage={errors.lpoNumber}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="lpoNumber"
                    placeholder="Enter LPO Number"
                    component={Input}
                />
            </FormItem>

            {/* Attached File Field */}
            <FormItem
                label="Attach File"
                invalid={(errors.attachedFile && touched.attachedFile) as boolean}
                errorMessage={errors.attachedFile as string}
            >
                <Field name="attachedFile">
                    {({ field, form }: FieldProps) => (
                        <div>
                            <Upload
                                beforeUpload={beforeUpload}
                                showList={false}
                                onChange={(files) =>
                                    onFileChange(
                                        form,
                                        field,
                                        files,
                                        form.setFieldValue
                                    )
                                }
                            >
                                <div className="my-4 text-center">
                                    <DoubleSidedImage
                                        className="mx-auto"
                                        src="/img/others/upload.png"
                                        darkModeSrc="/img/others/upload-dark.png"
                                    />
                                    <p className="font-semibold">
                                        <span className="text-gray-800 dark:text-white">
                                            Drop your file here, or{' '}
                                        </span>
                                        <span className="text-blue-500">
                                            browse
                                        </span>
                                    </p>
                                    <p className="mt-1 opacity-60 dark:text-white">
                                        Support: PDF, JPEG, PNG (Max 5MB)
                                    </p>
                                </div>
                            </Upload>
                            {filePreview && (
                                <div className="mt-2">
                                    <p className="text-sm font-medium">
                                        Selected file: {field.value?.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Field>
            </FormItem>

            {/* Materials Field */}
            <FormItem
                label="Materials"
                invalid={
                    (errors.materials && touched.materials) as boolean
                }
                errorMessage={errors.materials as string}
            >
                <Field name="materials">
                    {({ field, form }: FieldProps) => (
                        <div className="space-y-4">
                            {values.materials.map((material, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-12 gap-2 items-end"
                                >
                                    <div className="col-span-10">
                                        <FormItem
                                            label={`Material ${index + 1}`}
                                            className="mb-0"
                                        >
                                            <Input
                                                type="text"
                                                autoComplete="off"
                                                name={`materials.${index}.name`}
                                                placeholder="Material name"
                                                value={material.name}
                                                onChange={(e) => {
                                                    const newMaterials = [
                                                        ...values.materials,
                                                    ]
                                                    newMaterials[index].name =
                                                        e.target.value
                                                    form.setFieldValue(
                                                        'materials',
                                                        newMaterials
                                                    )
                                                }}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className="col-span-2">
                                        {values.materials.length > 1 && (
                                            <Button
                                                icon={<HiOutlineTrash />}
                                                variant="plain"
                                                size="sm"
                                                type="button"
                                                onClick={() =>
                                                    removeMaterial(
                                                        index,
                                                        values,
                                                        form.setFieldValue
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                            <Button
                                icon={<HiOutlinePlus />}
                                variant="plain"
                                size="sm"
                                type="button"
                                onClick={() =>
                                    addMaterial(values, form.setFieldValue)
                                }
                            >
                                Add Material
                            </Button>
                        </div>
                    )}
                </Field>
            </FormItem>
        </AdaptableCard>
    )
}

export default LpoFormFields