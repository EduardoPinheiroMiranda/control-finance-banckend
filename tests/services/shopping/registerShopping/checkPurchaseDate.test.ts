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

			await expect(
				checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("check if an array of dates is returned if PurchaseDate is null.", async () => {
            
			const purchaseDate = null;
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 3;


			const invoiceDates = await checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments);

			expect(invoiceDates.length).toBe(3);
		});

		it("verify that an array of dates is returned if PurchaseDate is equal to the current date.", async () => {
            
			const purchaseDate = "2025-03-02";
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 3;


			const invoiceDates = await checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments);

			expect(invoiceDates.length).toBe(3);
		});

		it("check if an array of dates is returned with a size smaller than the total installments.", async () => {
            
			const purchaseDate = "2025-02-02";
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 3;


			const invoiceDates = await checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments);

			expect(invoiceDates.length).not.toBe(totalInstallments);
			expect(invoiceDates.length).toBe(2);
			expect(invoiceDates[0].dueDate.toISOString()).toBe("2025-03-10T23:59:59.000Z");
		});

		it("Check to see if any errors are triggered if the purchase date does not generate a valid invoice date list.", async () => {
            
			const purchaseDate = "2025-00-02";
			const closeDay = 5;
			const dueDay = 10;
			const totalInstallments = 3;


			await expect(
				checkPurchaseDate(purchaseDate, dueDay, closeDay, totalInstallments)
			).rejects.toBeInstanceOf(DataValidationError);
		});
	});
});