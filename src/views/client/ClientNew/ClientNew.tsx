import { useNavigate } from 'react-router-dom';
import ClientForm, { FormModel, SetSubmitting } from '@/views/client/Clientform';
import { createClient } from '../api/api';
import toast from '@/components/ui/toast';
import Notification from '@/components/ui/Notification';

const ClientNew = () => {
    const navigate = useNavigate();

    // ✅ Ensure the prop name matches EXACTLY (`onFormSubmit`)
    const onFormSubmit = async (values: FormModel, setSubmitting: SetSubmitting) => {
        setSubmitting(true);
        try {
            const response = await createClient(values);
            if (response.status === 201) {
                toast.push(
                    <Notification title="Success!" type="success" />,
                    { placement: 'top-center' }
                );
                navigate('/app/client-list');
            }
        } catch (error) {
            toast.push(
                <Notification title="Error!" type="danger" />,
                { placement: 'top-center' }
            );
        } finally {
            setSubmitting(false);
        }
    };

    // ✅ Pass ALL required props
    return (
        <ClientForm
            type="new"  // ✅ Required
            onFormSubmit={onFormSubmit}  // ✅ Must match
            onDiscard={() => navigate('/app/client-list')}  // ✅ Optional but recommended
        />
    );
};

export default ClientNew;