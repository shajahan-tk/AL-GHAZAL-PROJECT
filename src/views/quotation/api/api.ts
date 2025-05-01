import BaseService from "@/services/BaseService"


type QuotationApi={
    
    projectId:string
    estimationId:string
    validUntil:string
    scopeOfWork:string[]
    termsAndConditions:string[]
    items:[{
        description: string;
        uom: string;
        uomImage:Buffer;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }  
]
  }
  
  
export const createQuotation = async (data:QuotationApi) => {
    try {
        const response = await BaseService.post("/quotation",data)
        return response
    } catch (error) {
        console.log(error)
        throw error
    }
}