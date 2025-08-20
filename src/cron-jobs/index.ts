import cron from "node-cron";
import { confirmAdvanceInvoicePayments } from "./tasks/confirmAdvanceInvoicePayments";


export function startCronJobs(){

	async function execute(){

		cron.schedule(
			"0 0 * * *",
			confirmAdvanceInvoicePayments
		);
	}

	execute();
}