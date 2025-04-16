
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate } from 'react-router-dom'
import { apiCreateSalesProduct } from '@/services/SalesService'
import UserForm, { FormModel, SetSubmitting } from '@/views/users/UserForm'
import { addUser } from '../api/api'

const UserNew = () => {
    const navigate = useNavigate()

    const addProduct = async (data: FormModel) => {
        const response = await apiCreateSalesProduct<boolean, FormModel>(data)
        return response.data
    }

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting,
    ) => {
        setSubmitting(true)
        const response:any = await addUser(values)
        if(response.status===201){
        setSubmitting(false)
        toast.push(
            <Notification
                title={'Successfuly added user'}
                type="success"
                duration={2500}
            >
                User successfuly added
            </Notification>,
            {
                placement: 'top-center',
            },
        )
        navigate('/app/user-list')
        }
       
    }

    const handleDiscard = () => {
        navigate('/app/sales/product-list')
    }

    return (
        <>
            <UserForm
                type="new"
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default UserNew
