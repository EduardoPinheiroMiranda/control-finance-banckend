import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { createInstallments } from "@/services/shopping/regitserShopping/createInstallments";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { afterEach } from "node:test";


describe("service/shopping", () => {

	describe("#Create installments", () => {

		const installmentRepository = new InstallmentPrismaRepository();
		const shoppingId = "123";
		const purchaseValue = 1200;
		const totalInstalments = 2;
		const dueDay = 3;
		const repository = installmentRepository;
		const invoices = [
			{
				id: "124",
				pay: false,
				due_date: new Date("2025-04-10T23:59:59.000z"),
				closing_date: new Date("2025-04-05T23:59:59.000z"),
				created_at: new Date("2025-03-09T12:00:00.000z"),
				updated_at: new Date("2025-03-09T12:00:00.000z"),
				user_id: "1234"
			},
			{
				id: "125",
				pay: false,
				due_date: new Date("2025-05-10T23:59:59.000z"),
				closing_date: new Date("2025-05-05T23:59:59.000z"),
				created_at: new Date("2025-03-09T12:00:00.000z"),
				updated_at: new Date("2025-03-09T12:00:00.000z"),
				user_id: "1234"
			}
		];

		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2025-03-09T12:00:00.000z"));
                
			jest.spyOn(installmentRepository, "create").mockResolvedValue([]);
		});

		afterEach(() => {
			jest.useRealTimers();
		});


		it("Check that the number of installments is correct.", async () => {

			const { listInstallmentsToCrerate } = await createInstallments(
				shoppingId,
				purchaseValue,
				totalInstalments,
				dueDay,
				invoices,
				repository
			);

			expect(listInstallmentsToCrerate.length).toBe(invoices.length);
		});

		it("Check that installments have been assigned to invoices correctly.", async () => {

			const { listInstallmentsToCrerate } = await createInstallments(
				shoppingId,
				purchaseValue,
				totalInstalments,
				dueDay,
				invoices,
				repository
			);

			
			expect(listInstallmentsToCrerate[0].invoice_id).toBe(invoices[0].id);
		});

		it("Check that the installment number is being generated correctly when the purchase data is entered by the user.", async () => {

			const invoicesValids = [invoices[1]];

			const { listInstallmentsToCrerate } = await createInstallments(
				shoppingId,
				purchaseValue,
				totalInstalments,
				dueDay,
				invoicesValids,
				repository
			);

			expect(listInstallmentsToCrerate[0].installment_number).toBe(2);
		});
	});
});