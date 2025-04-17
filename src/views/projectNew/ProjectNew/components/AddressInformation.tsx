import { useCallback } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import get from 'lodash/get'
import * as Yup from 'yup'
import type { FieldProps, FormikTouched, FormikErrors } from 'formik'

type FormModel = {
  siteAddress: string
  siteLocation: string
}

type AddressInformationProps = {
  data: FormModel
  onNextChange?: (
    values: FormModel,
    formName: string,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => void
  onBackChange?: () => void
  currentStepStatus?: string
}

const validationSchema = Yup.object().shape({
  siteAddress: Yup.string().required('Site Address is required'),
  siteLocation: Yup.string().required('Site Location is required'),
})

const AddressInformation = ({
  data = {
    siteAddress: '',
    siteLocation: '',
  },
  onNextChange,
  onBackChange,
  currentStepStatus,
}: AddressInformationProps) => {
  const onNext = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    onNextChange?.(values, 'addressInformation', setSubmitting)
  }

  const onBack = () => {
    onBackChange?.()
  }

  const getError = useCallback(
    (errors: FormikErrors<FormModel>, name: string) => {
      return get(errors, name)
    },
    []
  )

  const getTouched = useCallback(
    (touched: FormikTouched<FormModel>, name: string) => {
      return get(touched, name)
    },
    []
  )

  return (
    <div className="mb-8">
      <h3 className="mb-2">Address Information</h3>
      <p>Enter your site address and location information</p>
      
      <Formik
        enableReinitialize
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          setTimeout(() => {
            onNext(values, setSubmitting)
          }, 1000)
        }}
      >
        {({ values, touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Site Address"
                invalid={!!getError(errors, 'siteAddress') && !!getTouched(touched, 'siteAddress')}
                errorMessage={getError(errors, 'siteAddress')}
              >
                <Field
                as="textarea"
                  
                  autoComplete="off"
                  name="siteAddress"
                  placeholder="Enter site address"
                  component={Input}
                  textArea
                />
              </FormItem>

              <FormItem
                label="Site Location"
                invalid={!!getError(errors, 'siteLocation') && !!getTouched(touched, 'siteLocation')}
                errorMessage={getError(errors, 'siteLocation')}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="siteLocation"
                  placeholder="Enter site location"
                  component={Input}
                  
                />
              </FormItem>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" onClick={onBack}>
                  Back
                </Button>
                <Button
                  loading={isSubmitting}
                  variant="solid"
                  type="submit"
                >
                  {currentStepStatus === 'complete' ? 'Save' : 'Next'}
                </Button>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddressInformation