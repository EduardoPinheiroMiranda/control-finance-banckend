import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { PayInvoice } from "@/services/invoice/payInvoice";
import { describe, expect, it,beforeEach, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/invoice", () => {

	let invoiceRepository: InvoicePrismaRepository;
	let installmentRepository: InstallmentPrismaRepository;
	let shoppingRepository: ShoppingPrismaRepository;
	let servicePayInvoice: PayInvoice;


	beforeEach(() => {
		invoiceRepository = new InvoicePrismaRepository();
		installmentRepository = new InstallmentPrismaRepository();
		shoppingRepository = new ShoppingPrismaRepository();
		servicePayInvoice = new PayInvoice(
			invoiceRepository,
			installmentRepository,
			shoppingRepository
		);
	});

	describe("#confirm full payment for a purchase", () => {

		it("check that the value 0 is returned if there are no purchases to confirm full payment.", async () => {
           
			const date = new Date();
			const installments = [
				{
					id: "installment-123",
					installment_number: 2,
					installment_value: Decimal(200),
					due_date: date,
					pay: true,
					created_at: date,
					updated_at: date,
					shopping_id: "shopping-123",
					invoice_id: "invoice-123",
					shoppingId: {
						total_installments: 10
					}
				}
			];

			const result = await servicePayInvoice.confirmFullPaymentForAPurchase(installments);

			expect(result).toBe(0);
		});

		it("check if a value greater than 0 is returned, confirming full payment for a purchase.", async () => {
           
			jest.spyOn(shoppingRepository, "payShopping").mockResolvedValue(1);

			const date = new Date();
			const installments = [
				{
					id: "installment-123",
					installment_number: 10,
					installment_value: Decimal(200),
					due_date: date,
					pay: true,
					created_at: date,
					updated_at: date,
					shopping_id: "shopping-123",
					invoice_id: "invoice-123",
					shoppingId: {
						total_installments: 10
					}
				}
			];

			const result = await servicePayInvoice.confirmFullPaymentForAPurchase(installments);

			expect(result).toBe(1);
		});
	});

	describe("#Pay invoice", () => {

		it("It will trigger an error if something unexpected happens when requesting the database.", async () => {
			// inesitent invoice

			await expect(
				servicePayInvoice.execute("invoice-invalid", [])
			).rejects.toThrowError("Houve um problema para encontrar os dados da fatura, tente novamente.");
		});
	});
});