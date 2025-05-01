import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { createInvoices } from "@/services/shopping/regitserShopping/createInvoices";
import { Dates } from "@/@types/customTypes";



describe("service/shopping", () => {

	describe("#Create invoices", () => {

		let invoiceRepository: InvoicePrismaRepository;


		describe("## tests simulating purchases before closing the invoice", () => {

			beforeEach(() => {

				invoiceRepository = new InvoicePrismaRepository();


				jest.useFakeTimers();
				jest.setSystemTime(new Date("2025-03-02T12:00:00.000Z"));
				// 02 de março de 2025
			});
    
			afterEach(() => {
				jest.useRealTimers();
			});


			it("Check that the first invoice created is for the current month.", async () => {

				jest.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([]);
				jest.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-03-10T23:59:59.000Z"),
						closing_date: new Date("2025-03-05T23:59:59.000Z"),
						created_at: new Date("2025-03-09T12:00:00.000Z"),
						updated_at: new Date("2025-03-09T12:00:00.000Z"),
						user_id: "1234"
					}
				]);


				const userId = "1234";
				const datesForInvoices: Dates[] = [
					{
						closingDate: new Date("2025-03-05T12:00:00.000Z"),
						dueDate: new Date("2025-03-10T12:00:00.000Z")
					}
				];
            
			
				const { invoices, createNewInvoices } = await createInvoices(
					userId,
					datesForInvoices,
					invoiceRepository,
				);
                
				expect(invoices[0].due_date.getMonth()).toBe(new Date().getMonth());
				expect(createNewInvoices.length).toBe(1);
			});

			it("Make sure the number of invoices returned equals the length of dataForInvoices.", async () => {

				jest.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([
					{
						id: "122",
						pay: false,
						due_date: new Date("2025-03-10T23:59:59.000Z"),
						closing_date: new Date("2025-03-05T23:59:59.000Z"),
						created_at: new Date("2025-03-09T12:00:00.000Z"),
						updated_at: new Date("2025-03-09T12:00:00.000Z"),
						user_id: "1234"
					}
				]);

				jest.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-04-10T23:59:59.000Z"),
						closing_date: new Date("2025-04-05T23:59:59.000Z"),
						created_at: new Date("2025-03-09T12:00:00.000Z"),
						updated_at: new Date("2025-03-09T12:00:00.000Z"),
						user_id: "1234"
					}
				]);


				const userId = "1234";
				const datesForInvoices: Dates[] = [
					{
						closingDate: new Date("2025-03-05T23:59:59.000Z"),
						dueDate: new Date("2025-03-10T23:59:59.000Z")
					},
					{
						closingDate: new Date("2025-04-05T23:59:59.000Z"),
						dueDate: new Date("2025-04-10T23:59:59.000Z")
					},
				];
            
			
				const { invoices, createNewInvoices } = await createInvoices(
					userId,
					datesForInvoices,
					invoiceRepository
				);
                
				expect(invoices.length).toBe(datesForInvoices.length);
				expect(createNewInvoices[0].due_date).toBe(datesForInvoices[1].dueDate);
			});

			it("Check if the dates are being generated correctly.", async () => {

				jest.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([]);

				jest.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-03-10T23:59:59.000Z"),
						closing_date: new Date("2025-03-05T23:59:59.000Z"),
						created_at: new Date("2025-03-09T12:00:00.000Z"),
						updated_at: new Date("2025-03-09T12:00:00.000Z"),
						user_id: "1234"
					},
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-04-10T23:59:59.000Z"),
						closing_date: new Date("2025-04-05T23:59:59.000Z"),
						created_at: new Date("2025-03-09T12:00:00.000Z"),
						updated_at: new Date("2025-03-09T12:00:00.000Z"),
						user_id: "1234"
					}
				]);


				const userId = "1234";
				const datesForInvoices: Dates[] = [
					{
						closingDate: new Date("2025-03-05T23:59:59.000Z"),
						dueDate: new Date("2025-03-10T23:59:59.000Z")
					},
					{
						closingDate: new Date("2025-04-05T23:59:59.000Z"),
						dueDate: new Date("2025-04-10T23:59:59.000Z")
					},
				];
            
			
				const { createNewInvoices } = await createInvoices(
					userId,
					datesForInvoices,
					invoiceRepository
				);
                

				expect(createNewInvoices[0].closing_date).toEqual(new Date("2025-03-05T23:59:59.000Z"));
				expect(createNewInvoices[0].due_date).toEqual(new Date("2025-03-10T23:59:59.000Z"));

				expect(createNewInvoices[1].closing_date).toEqual(new Date("2025-04-05T23:59:59.000Z"));
				expect(createNewInvoices[1].due_date).toEqual(new Date("2025-04-10T23:59:59.000Z"));
			});

			it("Verify that the function returns a list of existing invoices based on datasForInvoices without needing to create new invoices.", async () => {

				jest.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-03-10T23:59:59.000Z"),
						closing_date: new Date("2025-03-05T23:59:59.000Z"),
						created_at: new Date("2025-03-09T12:00:00.000Z"),
						updated_at: new Date("2025-03-09T12:00:00.000Z"),
						user_id: "1234"
					},
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-04-10T23:59:59.000Z"),
						closing_date: new Date("2025-04-05T23:59:59.000Z"),
						created_at: new Date("2025-03-09T12:00:00.000Z"),
						updated_at: new Date("2025-03-09T12:00:00.000Z"),
						user_id: "1234"
					}
				]);


				const userId = "1234";
				const datesForInvoices: Dates[] = [
					{
						closingDate: new Date("2025-03-05T23:59:59.000Z"),
						dueDate: new Date("2025-03-10T23:59:59.000Z")
					},
					{
						closingDate: new Date("2025-04-05T23:59:59.000Z"),
						dueDate: new Date("2025-04-10T23:59:59.000Z")
					},
				];
            
			
				const { invoices, createNewInvoices } = await createInvoices(
					userId,
					datesForInvoices,
					invoiceRepository
				);


				expect(invoices.length).toBe(datesForInvoices.length);
				expect(createNewInvoices.length).toBe(0);
			});

		});


		describe("## tests simulating purchases after closing the invoice", () => {

			beforeEach(() => {
				jest.useFakeTimers();
				jest.setSystemTime(new Date("2025-03-09T12:00:00.000Z"));
                
				jest.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([]);

				jest.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-04-10T23:59:59.000Z"),
						closing_date: new Date("2025-04-05T23:59:59.000Z"),
						created_at: new Date("2025-03-09T12:00:00.000Z"),
						updated_at: new Date("2025-03-09T12:00:00.000Z"),
						user_id: "1234"
					}
				]);
			});
    
			afterEach(() => {
				jest.useRealTimers();
			});


			it("Check that the first invoice created is for the following month in relation to the current one.", async () => {

				const userId = "1234";
				const datesForInvoices: Dates[] = [
					{
						closingDate: new Date("2025-04-05T23:59:59.000Z"),
						dueDate: new Date("2025-04-10T23:59:59.000Z")
					}
				];
            
			
				const { createNewInvoices } = await createInvoices(
					userId,
					datesForInvoices,
					invoiceRepository
				);

                
				expect(createNewInvoices[0].due_date.getMonth()).toBeGreaterThan(new Date().getMonth());
			});
		});
	});
});