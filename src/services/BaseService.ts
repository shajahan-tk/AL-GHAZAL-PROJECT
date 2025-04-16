import axios from 'axios'
import appConfig from '@/configs/app.config'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import store, { signOutSuccess } from '../store'

const unauthorizedCode = [401]

const BaseService = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiPrefix,
})

BaseService.interceptors.request.use(
    (config) => {
        // const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
        // const persistData = deepParseJson(rawPersistData)

        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // let accessToken = (persistData as any).auth.session.token

        // if (!accessToken) {
        //     const { auth } = store.getState()
        //     accessToken = auth.session.token
        // }

        let accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2ZmNTU1N2Y2MmFhODgxMzRmMTFiOTAiLCJlbWFpbCI6InN1cGVyYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoic3VwZXJfYWRtaW4iLCJpYXQiOjE3NDQ4MTIwMzUsImV4cCI6MTc0NTQxNjgzNX0.QiZvZ21ZE9_zHQWVJdPVUsM3huVuaJyawm-jxAzClOA" as string;
        if (accessToken) {
            config.headers[REQUEST_HEADER_AUTH_KEY] =
                `${TOKEN_TYPE}${accessToken}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

BaseService.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error

        if (response && unauthorizedCode.includes(response.status)) {
            store.dispatch(signOutSuccess())
        }

        return Promise.reject(error)
    },
)

export default BaseService
