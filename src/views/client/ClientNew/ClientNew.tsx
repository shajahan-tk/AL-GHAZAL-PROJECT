import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { addClient } from '../api/api'
import { useRef } from 'react'
import ClientForm from '../Clientform'
import { FormikProps } from 'formik'

const ClientNew = () => {
    const navigate = useNavigate()
    const formikRef = useRef<FormikProps<any>>(null)

    const handleFormSubmit = async (
        values: any,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        setSubmitting(true)
        try {
            const response:any = await addClient(values)
            if(response.status === 201) {
                toast.push(
                    <Notification
                        title={'Successfully added client'}
                        type="success"
                        duration={2500}
                    >
                        Client successfully added
                    </Notification>,
                    {
                        placement: 'top-center',
                    }
                )
                navigate('/app/client-list')
            }
        } catch (error: any) {
            toast.push(
                <Notification
                    title={'Error'}
                    type="danger"
                    duration={2500}
                >
                    {error.message || 'Failed to add client'}
                </Notification>,
                {
                    placement: 'top-center',
                }
            )
        } finally {
            setSubmitting(false)
        }
    }

    const handleDiscard = () => {
        navigate('/app/client-list')
    }

    return (
        <>
            <ClientForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
                ref={formikRef}
            />
        </>
    )
}

export default ClientNew