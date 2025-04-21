import { ShoppingUpdate } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { typeInvoices } from "@/utils/globalValues";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Installment } from "@prisma/client";


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
					category_id: data.categoryId
				}
			),
			...installments.map(async (installment) => {
            
				const month = installment.due_date.getMonth();
				const year = installment.due_date.getFullYear();
				const newDueDate = handlerDueDate.formatDate(year, month, data.dueDay);

				await this.installmentRepository.updateInstallment(
					installment.id,
					{
						installment_value: data.value,
						due_date: newDueDate
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
		

		if(shopping.type_invoice === typeInvoices[1]){
			
			const installmentsHaveBeenPaid = shopping.total_installments > installmentsInOpen.length;

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