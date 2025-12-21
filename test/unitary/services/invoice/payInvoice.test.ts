import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { GetCurrentInvoice } from "@/services/invoice/getCurrentInvoice";
import { PayInvoice } from "@/services/invoice/payInvoice";
import { describe, expect, it,beforeEach, vi, afterEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/invoice", () => {

	let invoiceRepository: InvoicePrismaRepository;
	let installmentRepository: InstallmentPrismaRepository;
	let shoppingRepository: ShoppingPrismaRepository;
	let servicePayInvoice: PayInvoice;

	const date = new Date();
	const mockInstallments = [
		{
			id: "installment-123",
			installmentNumber: 10,
			installmentValue: Decimal(200),
			dueDate: date,
			pay: true,
			createdAt: date,
			updatedAt: date,
			shoppingId: "shopping-123",
			invoiceId: "invoice-123",
			shopping: {
				totalInstallments: 10
			}
		}
	];
	const mockInvoiceDetails = [
		{
			id: "invoice-123",
			dueDate: "2025-05-10T23:59:59",
			closingDate: "2025-05-05T23:59:59",
			totalInstallmentsOnInvoice: 10,
			installmentsPaid: 10,
			installmentsPending: 0
		}
	];
	const mockInvoice = {
		invoiceId: "invoice-123",
		pay: false,
		dueDate: new Date("2025-05-10T23:59:59.000Z"),
		closingDate: new Date("2025-05-05T23:59:59.000Z"),
		current: true,
		amount: 500,
		percentageSpent: 42,
		limit: 1200,
		available: 700,
		totalFixedExpense: 200,
		totalExtraExpense: 300,
		totalInvoice: 200,
		totalCard: 0,
		totalMoney: 300,
		installments: {
			fixedExpense: [
				{
					installmentId: "installment-123",
					installmentNumber: 1,
					installmentValue: 200,
					dueDate: new Date("2025-05-09T23:59:59.000Z").toString(),
					pay: false,
					shoppingId: "shopping-123",
					totalInstallments: 1,
					typeInvoice: "fixedExpense",
					paymentMethod: "invoice",
					name: "Freio hidraulico",
					purchaseDate: new Date().toString(),
				}
			],
			extraExpense: [
				{
					installmentId: "installment-124",
					installmentNumber: 1,
					installmentValue: 300,
					dueDate: new Date("2025-05-09T23:59:59.000Z").toString(),
					pay: false,
					shoppingId: "shopping-124",
					totalInstallments: 3,
					typeInvoice: "fixedExpense",
					paymentMethod: "money",
					name: "Quadro absolute nero 5 verde oliva",
					purchaseDate: new Date().toString(),
				}
			]
		}
	};


	beforeEach(() => {
		
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2025-05-08T20:59:59"));


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
		vi.useRealTimers();
	});


	describe("#confirm full payment for a purchase", () => {

		it("check that the value 0 is returned if there are no purchases to confirm full paymen.", async () => {
           
			const installments = [
				{
					id: "installment-123",
					installmentNumber: 2,
					installmentValue: Decimal(200),
					dueDate: date,
					pay: true,
					createdAt: date,
					updatedAt: date,
					shoppingId: "shopping-123",
					invoiceId: "invoice-123",
					shopping: {
						totalInstallments: 10
					}
				}
			];

			const result = await servicePayInvoice.confirmFullPaymentForAPurchase(installments);

			expect(result).toBe(0);
		});

		it("check if a value greater than 0 is returned, confirming full payment for a purchase.", async () => {
           
			vi.spyOn(shoppingRepository, "payShopping").mockResolvedValue(1);

			const result = await servicePayInvoice.confirmFullPaymentForAPurchase(mockInstallments);

			expect(result).toBe(1);
		});
	});

	describe("#confirm invoice payment", () => {

		it("Check to see if your invoice hasn't been paid if it doesn't meet payment installment requirements.", async () => {

			const mockInvoiceDetails = [
				{
					id: "invoice-123",
					dueDate: "2025-05-10T23:59:59",
					closingDate: "2025-05-05T23:59:59",
					totalInstallmentsOnInvoice: 10,
					installmentsPaid: 0,
					installmentsPending: 10
				}
			];

			vi.spyOn(invoiceRepository, "payInvoice").mockResolvedValue([
				{
					id:  "invoice-123",
					pay: false,
					dueDate: new Date("2025-05-10T23:59:59"),
					closingDate: new Date("2025-05-05 23:59:59"),
					createdAt: date,
					updatedAt: date,
					userId: "user-123",
				}
			]);


			vi.spyOn(GetCurrentInvoice.prototype, "execute").mockResolvedValue(mockInvoice);

			
			const result = await servicePayInvoice.confirmInvoicePayment("user-123", mockInvoiceDetails);
		
			expect(result).toEqual(mockInvoice);
			expect(invoiceRepository.payInvoice).toBeCalledTimes(0);
			expect(GetCurrentInvoice.prototype.execute).toBeCalledTimes(1);
		});

		it("Ccheck if the invoice has been paid", async () => {

			vi.spyOn(invoiceRepository, "payInvoice").mockResolvedValue([
				{
					id:  "invoice-123",
					pay: true,
					dueDate: new Date("2025-05-10T23:59:59"),
					closingDate: new Date("2025-05-05 23:59:59"),
					createdAt: date,
					updatedAt: date,
					userId: "user-123",
				}
			]);


			vi.spyOn(GetCurrentInvoice.prototype, "execute").mockResolvedValue(mockInvoice);

			
			const result = await servicePayInvoice.confirmInvoicePayment("user-123", mockInvoiceDetails);
		
			expect(result).toEqual(mockInvoice);
			expect(invoiceRepository.payInvoice).toBeCalledTimes(1);
			expect(GetCurrentInvoice.prototype.execute).toBeCalledTimes(1);
		});
	});

	describe("#Pay invoice", () => {

		it("Will generate an error if the installment array is empty.", async () => {

			await expect(
				servicePayInvoice.execute("user-123", "invoice-invalid", [])
			).rejects.toThrowError("Informe quais parcelas você quer pagar.");
		});

		it("It will generate an error if the installment is not painful.", async () => {

			vi.spyOn(installmentRepository, "payInstallments").mockResolvedValue([]);
			await expect(
				servicePayInvoice.execute("user-123", "invoice-invalid", ["installment-123"])
			).rejects.toThrowError("Houve um problema para confirmar os pagamentos, tente novamente.");
		});

		it("check if the service is working.", async () => {

			vi.spyOn(installmentRepository, "payInstallments").mockResolvedValue(mockInstallments);
			vi.spyOn(invoiceRepository, "invoiceDetails").mockResolvedValue(mockInvoiceDetails);
			vi.spyOn(servicePayInvoice, "confirmFullPaymentForAPurchase").mockResolvedValue(0);
			vi.spyOn(servicePayInvoice, "confirmInvoicePayment").mockResolvedValue(mockInvoice);


			const result = await servicePayInvoice.execute("user-123", "invoice-123", ["installment-123"]);

			expect(result).toEqual(mockInvoice);
			expect(installmentRepository.payInstallments).toBeCalledTimes(1);
			expect(invoiceRepository.invoiceDetails).toBeCalledTimes(1);
			expect(servicePayInvoice.confirmFullPaymentForAPurchase).toBeCalledTimes(1);
			expect(servicePayInvoice.confirmInvoicePayment).toBeCalledTimes(1);
		});
	});
});