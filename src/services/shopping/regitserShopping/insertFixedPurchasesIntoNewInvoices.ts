import { Installment } from "@/@types/customTypes";
import { InstallmentDatabaseInterface } from "@/repositories/interfaces/installment";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { Invoice } from "@prisma/client";


export async function insertFixedPurchasesIntoNewInvoices(
	userId: string,
	invoices: Invoice[],
	shoppingRepository: ShoppingDatabaseInterface,
	installmentRepository: InstallmentDatabaseInterface
){

	const handlerDueDate = new HandlerDueDate();
	const newInstallments: Installment[] = [];
	const shoppingFroUpdate: string[] = [];
	const fixedPurchases = await shoppingRepository.findFixedTypeOpenPurchase(userId);
	
            
	fixedPurchases.forEach((purchase) => {

		let numberOfTheLastInstallmetCreated = purchase.installment.length;
        

		invoices.forEach((invoice, index) => {

			const dueDay = purchase.installment[0].due_date.getDate();
			const invoiceDates = handlerDueDate.generateDueDates(
				dueDay,
				dueDay - 1,
				invoices.length,
				false
			);
  
			newInstallments.push({
				installment_number: numberOfTheLastInstallmetCreated += 1,
				installment_value: purchase.installment[0].installment_value,
				due_date: invoiceDates[index].dueDate,
				shopping_id: purchase.id,
				invoice_id: invoice.id,
			});
		});

		shoppingFroUpdate.push(purchase.id);
	});


	const [installments, updateShopping] = await Promise.all([
	    installmentRepository.create(newInstallments),
		shoppingRepository.updateTotalInstallments(shoppingFroUpdate, invoices.length)
	]);

    
	return {
		installments,
		newInstallments,
		updateShopping
	};
}