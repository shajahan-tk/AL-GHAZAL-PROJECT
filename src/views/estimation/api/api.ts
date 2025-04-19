import BaseService from "@/services/BaseService"


interface IMaterialItem {
    subjectMaterial: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
interface ILabourItem {
    designation: string;
    quantityDays: number;
    price: number;
    total: number;
}

interface ITermsItem {
    miscellaneous: string;
    quantity: number;
    unitPrice: number;
    total: number;
}


type EstimationApi={
    project:string
    workStartDate:Date
    workEndDate:Date
    validUntil:Date
    paymentDueBy:Date
    materials:IMaterialItem[]
    labour:ILabourItem[]
    termsAndConditions:ITermsItem[]
    quotationAmount?:number|null
    commissionAmount?:number|null
       
  }


  export const createEstimation = async (data:EstimationApi) => {
      try {
          const response = await BaseService.post("/estimation",data)
          return response
      } catch (error) {
          console.log(error)
          throw error
      }
  }