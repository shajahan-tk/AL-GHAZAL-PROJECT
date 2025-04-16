import BaseService from "@/services/BaseService"

export const addClient=async(values:any)=>{
    try {
        //http://localhost:4000/api/user/login
        const response=await BaseService.post("/client",values);
        return response;
    } catch (error) {
        console.log(error);        
        return error;

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