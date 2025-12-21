import { makeGetCurrentInvoice } from "@/factories/invoice/make-getCurrentInvoice";
import { ApplicationDatabaseInterface } from "@/repositories/interfaces/application";
import { CardDatabaseInterface } from "@/repositories/interfaces/card";
import { MovementDatabaseInterface } from "@/repositories/interfaces/movement";


export class GeneralSummary{

	constructor(
		private applicationRepository:ApplicationDatabaseInterface,
		private cardRepository: CardDatabaseInterface,
		private movementRepository: MovementDatabaseInterface
	){}


	async execute(userId: string){

		const serviceGetCurrentInvoice = makeGetCurrentInvoice();

		
		const [ applications, invoice, cards, movements ] = await Promise.all([
			this.applicationRepository.getAllApllications(userId),
			serviceGetCurrentInvoice.execute(userId),
			this.cardRepository.getAllCards(userId),
			this.movementRepository.getMovements(userId, 0)
		]);


		return {
			applications,
			invoice,
			cards,
			movements
		};
	}
}