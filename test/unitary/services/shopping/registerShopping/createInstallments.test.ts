import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { createInstallments } from "@/services/shopping/regitserShopping/createInstallments";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
				dueDate: new Date("2025-04-10T23:59:59.000z"),
				closingDate: new Date("2025-04-05T23:59:59.000z"),
				createdAt: new Date("2025-03-09T12:00:00.000z"),
				updatedAt: new Date("2025-03-09T12:00:00.000z"),
				userId: "1234"
			},
			{
				id: "125",
				pay: false,
				dueDate: new Date("2025-05-10T23:59:59.000z"),
				closingDate: new Date("2025-05-05T23:59:59.000z"),
				createdAt: new Date("2025-03-09T12:00:00.000z"),
				updatedAt: new Date("2025-03-09T12:00:00.000z"),
				userId: "1234"
			}
		];

		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date("2025-03-09T12:00:00.000z"));
                
			vi.spyOn(installmentRepository, "create").mockResolvedValue([]);
		});

		afterEach(() => {
			vi.useRealTimers();
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

			
			expect(listInstallmentsToCrerate[0].invoiceId).toBe(invoices[0].id);
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

			expect(listInstallmentsToCrerate[0].installmentNumber).toBe(2);
		});
	});
});