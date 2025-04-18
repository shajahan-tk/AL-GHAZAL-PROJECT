import BaseService from "@/services/BaseService"


export const fetchClients = async (params?: {
    page?: number
    limit?: number
    search?: string
}) => {
    try {
        const response = await BaseService.get("/client", { params })
        console.log(response.data)
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

type FormDataApi={
  projectName: string
  projectDescription: string
  siteAddress: string
  siteLocation: string
  client:string
}
export const createProject = async (data:FormDataApi) => {
    try {
        const response = await BaseService.post("/project",data)
        return response
    } catch (error) {
        console.log(error)
        throw error
    }
}


export const fetchProjectList = async (params?: {
    page?: number
    limit?: number
    search?: string
}) => {
    try {
        const response = await BaseService.get("/project", { params })
        console.log(response)
        return response.data

    } catch (error) {
        console.log(error)
        throw error
    }
}


