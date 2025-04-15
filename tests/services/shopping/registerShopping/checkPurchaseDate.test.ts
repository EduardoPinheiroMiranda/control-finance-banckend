import { DataValidationError } from "@/errors/custonErros";
import { checkPurchaseDate } from "@/services/shopping/regitserShopping/checkPurchaseDate";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";


describe("service/shopping", () => {

	describe("#checkPurchaseDate", () => {

		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2025-03-02"));
		});

		afterEach(() => {
			jest.useRealTimers();
		});


		it("will generate an error if the purchase date is greater than the current date.", async () => {
            
			const purchaseDate = "2025-03-20";
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 3;
			const startOnTheInvoice = false;

			await expect(
				checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments, startOnTheInvoice)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("check if an array of dates is returned if PurchaseDate is null.", async () => {
            
			const purchaseDate = null;
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 3;
			const startOnTheInvoice = false;


			const invoiceDates = await checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments, startOnTheInvoice);

			expect(invoiceDates.length).toBe(3);
		});

		it("verify that an array of dates is returned if PurchaseDate is equal to the current date.", async () => {
            
			const purchaseDate = "2025-03-02";
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 3;
			const startOnTheInvoice = false;


			const invoiceDates = await checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments, startOnTheInvoice);

			expect(invoiceDates.length).toBe(totalInstallments);
		});

		it("check if an array of dates is returned with a size smaller than the total installments.", async () => {
            
			const purchaseDate = "2025-02-02";
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 4;
			const startOnTheInvoice = false;


			const invoiceDates = await checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments, startOnTheInvoice);

			expect(invoiceDates.length).not.toBe(totalInstallments);
			expect(invoiceDates.length).toBe(3);
			expect(invoiceDates[0].dueDate.toISOString()).toBe("2025-03-10T23:59:59.000Z");
			// check matrix sequence
			expect(
				invoiceDates[0].dueDate.getTime() < invoiceDates[1].dueDate.getTime() &&
				invoiceDates[1].dueDate.getTime() < invoiceDates[2].dueDate.getTime()
			).toBe(true);
		});

		it("checking if it is a purchase made in the previous month, after closing it will generate a list of matrices with a size equal to the number of installments.", async () => {
            
			const purchaseDate = "2025-02-06";
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 4;
			const startOnTheInvoice = false;


			const invoiceDates = await checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments, startOnTheInvoice);

			expect(invoiceDates.length).toBe(totalInstallments);
			expect(invoiceDates[0].dueDate.toISOString()).toBe("2025-03-10T23:59:59.000Z");
			// check matrix sequence
			expect(
				invoiceDates[0].dueDate.getTime() < invoiceDates[1].dueDate.getTime() &&
				invoiceDates[1].dueDate.getTime() < invoiceDates[2].dueDate.getTime()
			).toBe(true);
		});

		it("Check to see if any errors are triggered if the purchase date does not generate a valid invoice date list.", async () => {
            
			const purchaseDate = "2025-00-02";
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 3;
			const startOnTheInvoice = false;


			await expect(
				checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments, startOnTheInvoice)
			).rejects.toBeInstanceOf(DataValidationError);
		});
	});
});