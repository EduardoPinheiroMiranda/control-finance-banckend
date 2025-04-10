import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { createInvoices } from "@/services/shopping/regitserShopping/createInvoices";



describe("service/shopping", () => {

	describe("# create invoices", () => {

		const invoiceRepository = new InvoicePrismaRepository();


		describe("## tests simulating purchases before closing the invoice", () => {

			beforeEach(() => {
				jest.useFakeTimers();
				jest.setSystemTime(new Date("2025-03-02T12:00:00.000z"));
                
				jest.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([
					{
						id: "122",
						pay: false,
						due_date: new Date("2025-03-10T23:59:59.000z"),
						close_date: new Date("2025-03-05T23:59:59.000z"),
						created_at: new Date("2025-03-09T12:00:00.000z"),
						updated_at: new Date("2025-03-09T12:00:00.000z"),
						user_id: "1234"
					}
				]);

				jest.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-04-10T23:59:59.000z"),
						close_date: new Date("2025-04-05T23:59:59.000z"),
						created_at: new Date("2025-03-09T12:00:00.000z"),
						updated_at: new Date("2025-03-09T12:00:00.000z"),
						user_id: "1234"
					}
				]);
			});
    
			afterEach(() => {
				jest.useRealTimers();
			});


			it("Check that the first invoice created is for the current month.", async () => {

				const userId = "1234";
				const dueDay = 10;
				const closeDay = 5;
				const totalInstallments = 2;
            
			
				const { invoices } = await createInvoices(
					userId, dueDay, closeDay, totalInstallments, invoiceRepository
				);
                
				expect(invoices[0].due_date.getMonth()).toBe(new Date().getMonth());
			});

			it("check if the number of invoices created is equal to the totalInvoices.", async () => {

				const userId = "1234";
				const dueDay = 10;
				const closeDay = 5;
				const totalInstallments = 2;
            
			
				const { invoices } = await createInvoices(
					userId, dueDay, closeDay, totalInstallments, invoiceRepository
				);
                
				expect(invoices.length).toBe(totalInstallments);
			});

			it("Check if the dates are being generated correctly.", async () => {

				jest.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([]);

				jest.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-03-10T23:59:59.000z"),
						close_date: new Date("2025-03-05T23:59:59.000z"),
						created_at: new Date("2025-03-09T12:00:00.000z"),
						updated_at: new Date("2025-03-09T12:00:00.000z"),
						user_id: "1234"
					}
				]);


				const userId = "1234";
				const dueDay = 10;
				const closeDay = 5;
				const totalInstallments = 2;
            
			
				const invoices = await createInvoices(
					userId, dueDay, closeDay, totalInstallments, invoiceRepository
				);
                


				expect(invoices.createInvoices[0].close_date).toEqual(new Date("2025-03-05T23:59:59.000z"));
				expect(invoices.createInvoices[0].due_date).toEqual(new Date("2025-03-10T23:59:59.000z"));

				expect(invoices.createInvoices[1].close_date).toEqual(new Date("2025-04-05T23:59:59.000z"));
				expect(invoices.createInvoices[1].due_date).toEqual(new Date("2025-04-10T23:59:59.000z"));
			});

		});


		describe("## tests simulating purchases after closing the invoice", () => {

			beforeEach(() => {
				jest.useFakeTimers();
				jest.setSystemTime(new Date("2025-03-09T12:00:00.000z"));
                
				jest.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([]);

				jest.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						due_date: new Date("2025-04-10T23:59:59.000z"),
						close_date: new Date("2025-04-05T23:59:59.000z"),
						created_at: new Date("2025-03-09T12:00:00.000z"),
						updated_at: new Date("2025-03-09T12:00:00.000z"),
						user_id: "1234"
					}
				]);
			});
    
			afterEach(() => {
				jest.useRealTimers();
			});


			it("Check that the first invoice created is for the following month in relation to the current one.", async () => {

				const userId = "1234";
				const dueDay = 10;
				const closeDay = 5;
				const totalInstallments = 2;
            
			
				const invoices = await createInvoices(
					userId, dueDay, closeDay, totalInstallments, invoiceRepository
				);

                
				expect(invoices.createInvoices[0].due_date.getMonth()).toBeGreaterThan(new Date().getMonth());
			});
		});
	});
});