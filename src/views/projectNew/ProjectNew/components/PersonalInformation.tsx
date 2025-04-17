import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { FormikProps } from 'formik'
import { IoMdAddCircleOutline } from 'react-icons/io'
import { fetchClients } from '../../api/api'
import debounce from 'lodash/debounce'

type FormModel = {
  clientName: string
}

type PersonalInformationProps = {
  data: FormModel
  onNext: (values: FormModel) => void
}

const PersonalInformation = ({ data, onNext }: PersonalInformationProps) => {
  const [clientSuggestions, setClientSuggestions] = useState<any[]>([])
  const [isLoadingClients, setIsLoadingClients] = useState(false)

  const validationSchema = Yup.object().shape({
    clientName: Yup.string().required('Client Name is required'),
  })

  const fetchClientSuggestions = async (searchTerm: string) => {
    try {
      setIsLoadingClients(true)
      const response = await fetchClients({ search: searchTerm })
      setClientSuggestions(response?.data?.clients || [])
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      setClientSuggestions([])
    } finally {
      setIsLoadingClients(false)
    }
  }

  const debouncedFetchClients = debounce(fetchClientSuggestions, 300)

  useEffect(() => {
    return () => {
      debouncedFetchClients.cancel()
    }
  }, [debouncedFetchClients])

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Client Information</h3>
        <p>Basic information for an project opening</p>
      </div>
      <Formik
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={(values) => onNext(values)}
      >
        {({ values, touched, errors, handleChange, handleBlur }: FormikProps<FormModel>) => (
          <Form>
            <FormContainer>
              <div className="flex flex-col md:flex-row items-center gap-2">
                <FormItem
                  label="Client Name"
                  invalid={errors.clientName && touched.clientName}
                  errorMessage={errors.clientName}
                  style={{ minWidth: '300px' }}
                >
                  <div className="relative">
                    <Input
                      name="clientName"
                      placeholder="Client Name"
                      value={values.clientName}
                      onChange={(e) => {
                        handleChange(e)
                        if (e.target.value.length > 0) {
                          debouncedFetchClients(e.target.value)
                        }
                      }}
                      onBlur={handleBlur}
                    />
                    {isLoadingClients && (
                      <div className="absolute right-2 top-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                    {clientSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                        {clientSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            onMouseDown={() => {
                              handleChange({
                                target: {
                                  name: 'clientName',
                                  value: suggestion.clientName,
                                },
                              } as any)
                              setClientSuggestions([])
                            }}
                          >
                            {suggestion.clientName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormItem>
                <Button
                  shape="circle"
                  size="m"
                  icon={<IoMdAddCircleOutline />}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="solid" type="submit">
                  Next
                </Button>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
}

export { PersonalInformation }