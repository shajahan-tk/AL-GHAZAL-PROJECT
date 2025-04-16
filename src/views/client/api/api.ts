import BaseService from "@/services/BaseService"

export const createClient = async (values: any) => {
    try {
        const response = await BaseService.post("/client", values)
        console.log("response:",response);
        
        return response
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.message || 'Failed to create client')
        }
        throw new Error('Failed to create client')
    }
}

export const fetchClients = async (params?: {
    page?: number
    limit?: number
    search?: string
}) => {
    try {
        const response = await BaseService.get("/client", { params })
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}