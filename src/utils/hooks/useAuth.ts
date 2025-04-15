import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

type Status = 'success' | 'failed'

function useAuth() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    const signIn = async (
        values: SignInCredential,
    ): Promise<
        | {
              status: Status
              message: string
          }
        | undefined
    > => {
        try {
            // Check if credentials match the allowed admin credentials
            if (values.userName !== 'admin' || values.password !== 'hitech@Eng') {
                return {
                    status: 'failed',
                    message: 'Invalid credentials',
                }
            }

            // Define admin user details
            const adminUser = {
                avatar: '/img/avatars/thumb-1.png',
                userName: 'AL GHAZAL Admin',
                authority: ['admin', 'user'],
                email: 'admin@hitech.com',
            }

            const adminToken = 'wVYrxaeNa9OxdnULvde1Au5m5w63'

            dispatch(signInSuccess(adminToken))
            dispatch(setUser(adminUser))

            const redirectUrl = query.get(REDIRECT_URL_KEY)
            navigate(
                redirectUrl
                    ? redirectUrl
                    : appConfig.authenticatedEntryPath,
            )

            return {
                status: 'success',
                message: '',
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values: SignUpCredential) => {
        // Disable signup functionality
        return {
            status: 'failed',
            message: 'Signup is disabled. Please use admin@hitech.com with password hitech@Eng to sign in',
        }
    }

    const handleSignOut = () => {
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [],
            }),
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    }
}

export default useAuth