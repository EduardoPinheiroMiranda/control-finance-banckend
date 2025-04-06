// import { ResourceNotFoud } from "@/errors/custonErros";
// import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
// import { ListInvoices } from "@/services/invoices/listInvoices";
// import { getDateNow } from "@/utils/getDateNow";
// import { describe, expect, it, jest, beforeEach } from "@jest/globals";
// import { Decimal } from "@prisma/client/runtime/library";


// describe("service/invoices", () => {

// 	describe("# List invoices", () => {

// 		let invoiceRepository: InvoicePrismaRepository;
// 		let serviceListInvoices: ListInvoices;


// 		beforeEach(() => {
// 			invoiceRepository = new InvoicePrismaRepository();
// 			serviceListInvoices = new ListInvoices(
// 				invoiceRepository
// 			);
// 		});


// 		it("will trigger an error if invoices is not found.", async () => {

// 			jest.spyOn(invoiceRepository, "filterInvoices").mockResolvedValue(null);

// 			await expect(
// 				serviceListInvoices.execute("invalidId", "all")
// 			).rejects.toBeInstanceOf(ResourceNotFoud);
// 		});

// 		it("check if a list of invoices was found.", async () => {

// 			jest.spyOn(invoiceRepository, "filterInvoices").mockResolvedValue([
// 				{
// 					id: "123",
// 					name: "Spotify",
// 					type_invoice: "fixedExpense",
// 					payment_method: "card",
// 					value: Decimal(34.90),
// 					pay: false,
// 					expired: "10",
// 					description: "",
// 					number_of_installments: 0,
// 					installments_paid: 0,
// 					created_at: getDateNow,
// 					updated_at: getDateNow,
// 					userId: "1234",
// 				}
// 			]);

// 			const invoices = await serviceListInvoices.execute("1234", "all");

// 			expect(invoices.length).toBe(1);
// 		});
// 	});
// });