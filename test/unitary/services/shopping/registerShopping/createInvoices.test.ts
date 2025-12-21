import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createInvoices } from "@/services/shopping/regitserShopping/createInvoices";
import { Dates } from "src/@types/customTypes";



describe("service/shopping", () => {

	describe("#Create invoices", () => {

		let invoiceRepository: InvoicePrismaRepository;


		describe("## tests simulating purchases before closing the invoice", () => {

			beforeEach(() => {

				invoiceRepository = new InvoicePrismaRepository();


				vi.useFakeTimers();
				vi.setSystemTime(new Date("2025-03-02T12:00:00.000Z"));
				// 02 de março de 2025
			});
    
			afterEach(() => {
				vi.useRealTimers();
			});


			it("Check that the first invoice created is for the current month.", async () => {

				vi.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([]);
				vi.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						dueDate: new Date("2025-03-10T23:59:59.000Z"),
						closingDate: new Date("2025-03-05T23:59:59.000Z"),
						createdAt: new Date("2025-03-09T12:00:00.000Z"),
						updatedAt: new Date("2025-03-09T12:00:00.000Z"),
						userId: "1234"
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
                
				expect(invoices[0].dueDate.getMonth()).toBe(new Date().getMonth());
				expect(createNewInvoices.length).toBe(1);
			});

			it("Make sure the number of invoices returned equals the length of dataForInvoices.", async () => {

				vi.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([
					{
						id: "122",
						pay: false,
						dueDate: new Date("2025-03-10T23:59:59.000Z"),
						closingDate: new Date("2025-03-05T23:59:59.000Z"),
						createdAt: new Date("2025-03-09T12:00:00.000Z"),
						updatedAt: new Date("2025-03-09T12:00:00.000Z"),
						userId: "1234"
					}
				]);

				vi.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						dueDate: new Date("2025-04-10T23:59:59.000Z"),
						closingDate: new Date("2025-04-05T23:59:59.000Z"),
						createdAt: new Date("2025-03-09T12:00:00.000Z"),
						updatedAt: new Date("2025-03-09T12:00:00.000Z"),
						userId: "1234"
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
				expect(createNewInvoices[0].dueDate).toBe(datesForInvoices[1].dueDate);
			});

			it("Check if the dates are being generated correctly.", async () => {

				vi.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([]);

				vi.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						dueDate: new Date("2025-03-10T23:59:59.000Z"),
						closingDate: new Date("2025-03-05T23:59:59.000Z"),
						createdAt: new Date("2025-03-09T12:00:00.000Z"),
						updatedAt: new Date("2025-03-09T12:00:00.000Z"),
						userId: "1234"
					},
					{
						id: "124",
						pay: false,
						dueDate: new Date("2025-04-10T23:59:59.000Z"),
						closingDate: new Date("2025-04-05T23:59:59.000Z"),
						createdAt: new Date("2025-03-09T12:00:00.000Z"),
						updatedAt: new Date("2025-03-09T12:00:00.000Z"),
						userId: "1234"
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
                

				expect(createNewInvoices[0].closingDate).toEqual(new Date("2025-03-05T23:59:59.000Z"));
				expect(createNewInvoices[0].dueDate).toEqual(new Date("2025-03-10T23:59:59.000Z"));

				expect(createNewInvoices[1].closingDate).toEqual(new Date("2025-04-05T23:59:59.000Z"));
				expect(createNewInvoices[1].dueDate).toEqual(new Date("2025-04-10T23:59:59.000Z"));
			});

			it("Verify that the function returns a list of existing invoices based on datasForInvoices without needing to create new invoices.", async () => {

				vi.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([
					{
						id: "124",
						pay: false,
						dueDate: new Date("2025-03-10T23:59:59.000Z"),
						closingDate: new Date("2025-03-05T23:59:59.000Z"),
						createdAt: new Date("2025-03-09T12:00:00.000Z"),
						updatedAt: new Date("2025-03-09T12:00:00.000Z"),
						userId: "1234"
					},
					{
						id: "124",
						pay: false,
						dueDate: new Date("2025-04-10T23:59:59.000Z"),
						closingDate: new Date("2025-04-05T23:59:59.000Z"),
						createdAt: new Date("2025-03-09T12:00:00.000Z"),
						updatedAt: new Date("2025-03-09T12:00:00.000Z"),
						userId: "1234"
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
				vi.useFakeTimers();
				vi.setSystemTime(new Date("2025-03-09T12:00:00.000Z"));
                
				vi.spyOn(invoiceRepository, "findInvoicesFromDueDate").mockResolvedValue([]);

				vi.spyOn(invoiceRepository, "create").mockResolvedValue([
					{
						id: "124",
						pay: false,
						dueDate: new Date("2025-04-10T23:59:59.000Z"),
						closingDate: new Date("2025-04-05T23:59:59.000Z"),
						createdAt: new Date("2025-03-09T12:00:00.000Z"),
						updatedAt: new Date("2025-03-09T12:00:00.000Z"),
						userId: "1234"
					}
				]);
			});
    
			afterEach(() => {
				vi.useRealTimers();
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

                
				expect(createNewInvoices[0].dueDate.getMonth()).toBeGreaterThan(new Date().getMonth());
			});
		});
	});
});