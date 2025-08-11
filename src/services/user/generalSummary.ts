import { makeGetCurrentInvoice } from "@/factories/invoice/make-getCurrentInvoice";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { ShoppingDatabaseInterface } from "@/repositories/interfaces/shopping";


export class GeneralSummary{

	constructor(
		private applicationRepository:ApplicationDatabaseInterface,
		private cardRepository: CardDatabaseInterface,
		private shoppingRepository: ShoppingDatabaseInterface
	){}


	async execute(userId: string){

		const serviceGetCurrentInvoice = makeGetCurrentInvoice();

		
		const [ applications, invoice, cards, movements ] = await Promise.all([
			this.applicationRepository.getAllApllications(userId),
			serviceGetCurrentInvoice.execute(userId),
			this.cardRepository.getAllCards(userId),
			this.shoppingRepository.getAllShopping(userId, null, null)
		]);


		return {
			applications,
			invoice,
			cards,
			movements
		};
	}
}