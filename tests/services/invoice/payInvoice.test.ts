import { makeGetCurrentInvoice } from "@/factories/invoice/make-getCurrentInvoice";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { GetCurrentInvoice } from "@/services/invoice/getCurrentInvoice";
import { PayInvoice } from "@/services/invoice/payInvoice";
import { describe, expect, it,beforeEach, jest, afterEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/invoice", () => {

	let invoiceRepository: InvoicePrismaRepository;
	let installmentRepository: InstallmentPrismaRepository;
	let shoppingRepository: ShoppingPrismaRepository;
	let servicePayInvoice: PayInvoice;
	const date = new Date();


	beforeEach(() => {
		
		jest.useFakeTimers();
		jest.setSystemTime(new Date("2025-05-08T20:59:59"));


		invoiceRepository = new InvoicePrismaRepository();
		installmentRepository = new InstallmentPrismaRepository();
		shoppingRepository = new ShoppingPrismaRepository();
		servicePayInvoice = new PayInvoice(
			invoiceRepository,
			installmentRepository,
			shoppingRepository
		);
	});

	afterEach(() => {
		jest.useRealTimers();
	});


	describe("#confirm full payment for a purchase", () => {

		it("check that the value 0 is returned if there are no purchases to confirm full payment.", async () => {
           
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

	describe("#confirm invoice payment", () => {

		it("Check to see if your invoice hasn't been paid if it doesn't meet payment installment requirements.", async () => {

			const mockInvoiceDetails = [
				{
					id: "invoice-123",
					due_date: "2025-05-10T23:59:59",
					closing_date: "2025-05-05T23:59:59",
					total_installments_on_invoice: 10,
					installments_paid: 0,
					installments_pending: 10
				}
			];

			const mockInvoice = {
				invoice_id: "invoice-123",
				pay: false,
				due_date: new Date("2025-05-10T23:59:59.000Z"),
				closing_date: new Date("2025-05-05T23:59:59.000Z"),
				current: true,
				amount: 500,
				percentegeSpent: 42,
				limit: 1200,
				available: 700,
				total_fixed_expense: 200,
				total_extra_expense: 300,
				total_invoice: 200,
				total_card: 0,
				total_money: 300,
				installments: {
					fixedExpense: [
						{
							installment_id: "installment-123",
							installment_number: 1,
							installment_value: 200,
							due_date: new Date("2025-05-09T23:59:59.000Z"),
							pay: false,
							shopping_id: "shopping-123",
							total_installments: 1,
							type_invoice: "fixedExpense",
							payment_method: "invoice",
							name: "Freio hidraulico"
						}
					],
					extraExpense: [
						{
							installment_id: "installment-124",
							installment_number: 1,
							installment_value: 300,
							due_date: new Date("2025-05-09T23:59:59.000Z"),
							pay: false,
							shopping_id: "shopping-124",
							total_installments: 3,
							type_invoice: "fixedExpense",
							payment_method: "money",
							name: "Quadro absolute nero 5 verde oliva"
						}
					]
				}
			};

			jest.spyOn(invoiceRepository, "payInvoice").mockResolvedValue(
				{
					id:  "invoice-123",
					pay: false,
					due_date: new Date("2025-05-10T23:59:59"),
					closing_date: new Date("2025-05-05 23:59:59"),
					created_at: date,
					updated_at: date,
					user_id: "user-123",
				}
			);

			// const mockExecute = jest.fn().mockReturnValue(mockInvoice);

			// (GetCurrentInvoice as jest.Mock).mockImplementation(() => ({
			// 	execute: mockExecute,
			// }));
			
			const result = await servicePayInvoice.confirmInvoicePayment("user-123", mockInvoiceDetails);
		
			expect(result).toEqual(mockInvoice);
			expect(invoiceRepository.payInvoice).toBeCalledTimes(0);
			expect(makeGetCurrentInvoice().execute).toBeCalledTimes(1);
		});
	});

	describe("#Pay invoice", () => {

		// it("Will generate an error if the installment array is empty.", async () => {

		// 	await expect(
		// 		servicePayInvoice.execute("invoice-invalid", [])
		// 	).rejects.toThrowError("Informe quais parcelas você quer pagar.");
		// });

		// it("It will generate an error if the installment is not painful.", async () => {

		// 	await expect(
		// 		servicePayInvoice.execute("invoice-invalid", [])
		// 	).rejects.toThrowError("Informe quais parcelas você quer pagar.");
		// });
	});
});