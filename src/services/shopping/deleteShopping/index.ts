import { ResourceNotFoud } from "@/errors/custonErros";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { typeInvoices } from "@/utils/globalValues";
import { Installment } from "@prisma/client";


export class DeleteShopping{

	constructor(
        private shoppingRepository: ShoppingDatabaseInterface,
        private installmentRepository: InstallmentDatabaseInterface
	){}


	async desableShopping(shoppingId: string, installment: Installment[]){

		const unpaidInstallments: string[] = [];

		installment.forEach((installment) => {
			if(installment.pay === false){
				unpaidInstallments.push(installment.id);
			}
		});
		

		const updateShopping = await this.shoppingRepository.updateShopping(shoppingId, {pay: true});
		await this.installmentRepository.delete(unpaidInstallments);

            
		return {
			updateShopping,
			msg: "Compra excluída com sucesso."
		};
	}

	async delete(shoppingId: string, installmentsHaveBeenPaid: boolean){

		if(!installmentsHaveBeenPaid){
			const deleteShopping = await this.shoppingRepository.delete(shoppingId);
			return {
				shopping: deleteShopping,
				msg: "Compra excluída com sucesso."
			};
		}

		return {
			shopping: {},
			msg: "Esta compra não pode ser mais excluída. Após o primeiro pagamento desta conta, os seus registros se tornaram fixos."
		};
	}

	async execute(shoppingId: string){

		const shopping = await this.shoppingRepository.getFullDataById(shoppingId);
      
		if(!shopping){
			throw new ResourceNotFoud("Erro ao executar a ação, tente novamente mais tarde.");
		}


		const installmentPaid = shopping.installment.find((installment) => installment.pay === true);
		const installmentsHaveBeenPaid = installmentPaid? true : false;


		if(shopping.type_invoice === typeInvoices[1]){
			const {shopping, msg} = await this.delete(shoppingId, installmentsHaveBeenPaid);
			return {
				shopping,
				msg
			};
		}


		if(shopping.type_invoice === typeInvoices[0] && installmentsHaveBeenPaid){
			const {updateShopping, msg} = await this.desableShopping(shoppingId, shopping.installment);
			return {
				shopping: updateShopping,
				msg
			};
		}


		const {shopping: desableShopping, msg} = await this.delete(shoppingId, installmentsHaveBeenPaid);
		return {
			shopping: desableShopping,
			msg
		};
	}
}