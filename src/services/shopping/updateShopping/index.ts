import { Shopping } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { typeInvoices } from "@/utils/globalValues";
import { HandlerDueDate } from "@/utils/handlerDueDate";


export class UpdateShopping{

	constructor(
        private shoppingRepository: ShoppingDatabaseInterface,
        private installmentRepository: InstallmentDatabaseInterface
	){}


	async updateFixedPurchase(shoppingId: string, data: Shopping){

		const handlerDueDate = new HandlerDueDate();

		const installmentsInOpen = await this.installmentRepository.getInstallmentsInOpen(shoppingId);
		

		const [ updateShopping ] = await Promise.all([
			await this.shoppingRepository.updateShopping(
				shoppingId,
				{
					name: data.name,
					payment_method: data.paymentMethod,
					value: data.value,
					description: data.description,
				}
			),
			...installmentsInOpen.map(async (installment) => {
            
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

	async execute(shoppingId: string, data: Shopping){
        
		if(data.value <= 0 || data.totalInstallments <= 0){
			throw new DataValidationError("Valor ou quantidade de parcelas da compra não pode ser menor, ou igual a 0.");
		}


		const shopping = await this.shoppingRepository.getById(shoppingId);

		if(!shopping){
			throw new ResourceNotFoud("Houve um problema para encontrar as informações necessárias.");
		}


		if(shopping.type_invoice === typeInvoices[1]){

			const updateShopping = await this.shoppingRepository.updateShopping(
				shoppingId,
				{
					name: data.name,
					description: data.description
				}
			);

			return updateShopping;
		}


		const updateShopping = await this.updateFixedPurchase(shoppingId, data);

		return updateShopping;
	}
}