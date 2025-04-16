import BaseService from "@/services/BaseService"

export const addUser=async(values:any)=>{
    try {
        //http://localhost:4000/api/user/login
        const response=await BaseService.post("/user",values);
        return response;
    } catch (error) {
        console.log(error);        
        return error;

    }
}

export const fetchUser = async (params?: {
    page?: number
    limit?: number
    search?: string
}) => {
    try {
        const response = await BaseService.get("/user", { params })
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}