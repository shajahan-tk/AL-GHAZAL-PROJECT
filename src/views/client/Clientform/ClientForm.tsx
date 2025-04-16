import { forwardRef } from 'react'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import StickyFooter from '@/components/shared/StickyFooter'
import { Field, Form, Formik, FormikProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { AiOutlineSave } from 'react-icons/ai'
import * as Yup from 'yup'
import { Input } from '@/components/ui'
import { AdaptableCard } from '@/components/shared'

type FormikRef = FormikProps<any>

// Helper function for Yup validation errors
const yupToFormErrors = (yupError: any) => {
  const errors: Record<string, string> = {}
  yupError.inner.forEach((error: any) => {
    errors[error.path] = error.message
  })
  return errors
}

const validationSchema = Yup.object().shape({
  clientName: Yup.string().required('Client Name Required'),
  clientAddress: Yup.string().required('Client Address Required'),
  pincode: Yup.string()
    .required('Pincode Required')
    .matches(/^[0-9]+$/, 'Pincode must be numeric'),
  mobileNumber: Yup.string()
    .required('Mobile Number Required')
    .matches(/^[0-9]+$/, 'Mobile number must be digits only'),
  telephoneNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Telephone number must be digits only')
    .nullable(),
  trnNumber: Yup.string()
    .required('TRN Number Required')
    .matches(/^[0-9]+$/, 'TRN must be digits only'),
})

type InitialData = {
  clientName?: string
  clientAddress?: string
  pincode?: string
  mobileNumber?: string
  telephoneNumber?: string | null
  trnNumber?: string
}

export type FormModel = InitialData

export type SetSubmitting = (isSubmitting: boolean) => void

type ClientFormProps = {
  initialData?: InitialData
  type: 'edit' | 'new'
  onDiscard?: () => void
  onDelete?: () => void
  onFormSubmit: (formData: FormModel, setSubmitting: SetSubmitting) => void
}

const ClientForm = forwardRef<FormikRef, ClientFormProps>((props, ref) => {
    const {
        type,
        initialData = {
          clientName: '',
          clientAddress: '',
          pincode: '',
          mobileNumber: '',
          telephoneNumber: null,
          trnNumber: '',
        },
        onFormSubmit,
        onDiscard,
        onDelete,
      } = props
    
    
   
  return (
    <Formik
      innerRef={ref}
      initialValues={{
        ...initialData,
      }}
      validationSchema={validationSchema}
      onSubmit={(values: FormModel, { setSubmitting }) => {
        console.log('Formik onSubmit - values:', values)
        const formData = cloneDeep(values)
        onFormSubmit(formData, setSubmitting)
      }}
      validateOnBlur={true}
      validateOnChange={false}
      validate={(values) => {
        console.log('Validating values:', values)
        try {
          validationSchema.validateSync(values, { abortEarly: false })
          console.log('Validation passed')
          return {}
        } catch (err) {
          console.log('Validation errors:', err)
          return yupToFormErrors(err)
        }
      }}
    >
      {({ values, touched, errors, isSubmitting, handleSubmit }) => {
        console.log('Formik render - errors:', errors)
        return (
          <Form onSubmit={handleSubmit}>
            <FormContainer>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <FormItem
                    label="Client Name"
                    invalid={!!(errors.clientName && touched.clientName)}
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
                    label="Client Address"
                    invalid={!!(errors.clientAddress && touched.clientAddress)}
                    errorMessage={errors.clientAddress}
                  >
                    <Field
                      as="textarea"
                      autoComplete="off"
                      name="clientAddress"
                      placeholder="Client Address"
                      component={Input}
                      textArea
                    />
                  </FormItem>

                  <div className="md:grid grid-cols-2 gap-4">
                    <FormItem
                      label="Pincode"
                      invalid={!!(errors.pincode && touched.pincode)}
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

                    <FormItem
                      label="TRN Number"
                      invalid={!!(errors.trnNumber && touched.trnNumber)}
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
                  </div>

                  <div className="md:grid grid-cols-2 gap-4">
                    <FormItem
                      label="Mobile Number"
                      invalid={!!(errors.mobileNumber && touched.mobileNumber)}
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
                      invalid={!!(errors.telephoneNumber && touched.telephoneNumber)}
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
                </div>
              </div>

              <StickyFooter
                className="-mx-8 px-8 flex items-center justify-between py-4"
                stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div>
                  {type === 'edit' && onDelete && (
                    <Button
                      size="sm"
                      variant="solid"
                      color="red"
                      type="button"
                      onClick={onDelete}
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
                    onClick={onDiscard}
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
  )
})

ClientForm.displayName = 'ClientForm'

export default ClientForm