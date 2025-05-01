import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetCurrentInvoice } from "@/services/invoice/getCurrentInvoice";
import { describe, expect, it, beforeEach, jest } from "@jest/globals";


describe("service/invoice", () => {

	describe("#Get curretn incoice", () => {
        
		let userRepository: UserPrismaRepository;
		let invoiceRepository: InvoicePrismaRepository;
		let serviceGetCurrentInvoice: GetCurrentInvoice;


		beforeEach(() => {
			userRepository = new UserPrismaRepository();
			invoiceRepository = new InvoicePrismaRepository();
			serviceGetCurrentInvoice = new GetCurrentInvoice(
				userRepository,
				invoiceRepository
			);
		});


		it("", async () => {
            
            await serviceGetCurrentInvoice.execute("6aa05c6e-c267-49a6-b8a4-ac00732b6c7e");
		});
	});
});