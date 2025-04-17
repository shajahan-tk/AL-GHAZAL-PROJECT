import BaseService from "@/services/BaseService"


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

export const fetchClient = async (params?: {
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

export const createProject = async (params?: {
    page?: number
    limit?: number
    search?: string
}) => {
    try {
        const response = await BaseService.post("/project", { params })
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}