// src/views/users/UserNew/UserNew.tsx
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useNavigate, useParams } from 'react-router-dom'
// import UserForm, { FormModel, SetSubmitting } from './UserForm'
import { addUser, editUser, fetchUserById } from '../api/api'
import { useEffect, useState } from 'react'
import UserForm, { FormModel ,SetSubmitting} from '../UserForm'

const UserNew = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [initialData, setInitialData] = useState<any>(null)
    const [loading, setLoading] = useState(!!id)

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    console.log('Fetching user data for ID:', id)
                    const response = await fetchUserById(id)
                    console.log('User data fetched:', response.data)
                    setInitialData(response.data)
                    setLoading(false)
                } catch (error) {
                    console.error('Error fetching user:', error)
                    setLoading(false)
                    toast.push(
                        <Notification
                            title={'Failed to fetch user data'}
                            type="danger"
                            duration={2500}
                        >
                            {error.message}
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                    navigate('/app/user-list')
                }
            }
            fetchData()
        }
    }, [id, navigate])

    const handleFormSubmit = async (
        values: FormModel,
        setSubmitting: SetSubmitting,
    ) => {
        setSubmitting(true)
        console.log('Form submission started with values:', values)
        
        try {
            let response: any
            if (id) {
                console.log('Editing user with ID:', id)
                response = await editUser(id, values)
                console.log('Edit response:', response)
            } else {
                console.log('Creating new user')
                response = await addUser(values)
                console.log('Create response:', response)
            }

            if (response.status === (id ? 200 : 201)) {
                console.log('Operation successful')
                setSubmitting(false)
                toast.push(
                    <Notification
                        title={`Successfully ${id ? 'updated' : 'added'} user`}
                        type="success"
                        duration={2500}
                    >
                        User {id ? 'updated' : 'added'} successfully
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
                navigate('/app/user-list')
            } else {
                console.log('Unexpected response status:', response.status)
                throw new Error(`Unexpected status code: ${response.status}`)
            }
        } catch (error) {
            console.error('Error during form submission:', error)
            setSubmitting(false)
            toast.push(
                <Notification
                    title={`Error ${id ? 'updating' : 'adding'} user`}
                    type="danger"
                    duration={2500}
                >
                    {error.message}
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }

    const handleDiscard = () => {
        navigate('/app/user-list')
    }

    if (loading) {
        return <div>Loading user data...</div>
    }

    return (
        <>
            <UserForm
                type={id ? 'edit' : 'new'}
                initialData={initialData || {
                    firstName: '',
                    lastName: '',
                    email: '',
                    phoneNumbers: [''],
                    role: '',
                    password: '',
                }}
                onFormSubmit={handleFormSubmit}
                onDiscard={handleDiscard}
            />
        </>
    )
}

export default UserNew