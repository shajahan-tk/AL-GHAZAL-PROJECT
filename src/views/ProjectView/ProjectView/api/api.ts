import BaseService from "@/services/BaseService"


export const fetchProject = async (id:string) => {
    try {
        console.log("idddd",id);
        
        const response = await BaseService.get(`/project/${id}`)
        console.log(response)
        return response.data

    } catch (error) {
        console.log(error)
        throw error
    }
}
