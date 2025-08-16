import { ShoppingUpdate } from "src/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Installment } from "@/generated/prisma/client";


export class UpdateShopping{

	constructor(
        private shoppingRepository: ShoppingDatabaseInterface,
        private installmentRepository: InstallmentDatabaseInterface
	){}


	async updateCompleteData(data: ShoppingUpdate, installments: Installment[]){

		const handlerDueDate = new HandlerDueDate();


		const [ updateShopping ] = await Promise.all([
			await this.shoppingRepository.updateShopping(
				data.id,
				{
					name: data.name,
					value: data.value,
					description: data.description,
					categoryId: data.categoryId
				}
			),
			...installments.map(async (installment) => {
            
				const month = installment.dueDate.getMonth();
				const year = installment.dueDate.getFullYear();
				const newDueDate = handlerDueDate.formatDate(year, month, data.dueDay);

				await this.installmentRepository.updateInstallment(
					installment.id,
					{
						installmentValue: data.value,
						dueDate: newDueDate
					}
				);
			})
		]);


		return updateShopping;
	}

	async execute(data: ShoppingUpdate){
        
		if(data.value <= 0){
			throw new DataValidationError("Valor ou quantidade de parcelas da compra não pode ser menor, ou igual a 0.");
		}


		const shopping = await this.shoppingRepository.getById(data.id);

		if(!shopping){
			throw new ResourceNotFoud("Houve um problema para encontrar as informações necessárias.");
		}


		const installmentsInOpen = await this.installmentRepository.getInstallmentsInOpen(data.id);
		

		if(shopping.typeInvoice === "EXTRA_EXPENSE"){
			
			const installmentsHaveBeenPaid = shopping.totalInstallments > installmentsInOpen.length;

			if(!installmentsHaveBeenPaid){
				const updateShopping = await this.updateCompleteData(data, installmentsInOpen);
				return updateShopping;
			}

			const updateShopping = await this.shoppingRepository.updateShopping(
				data.id,
				{
					name: data.name,
					description: data.description
				}
			);

			return updateShopping;
		}


		const updateShopping = await this.updateCompleteData(data, installmentsInOpen);

		return updateShopping;
	}
}