import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user/user";
import { GetAllInvoices } from "@/services/invoice/getAllInvoices";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/invoice", () => {

	describe("#Get all incoice", () => {
        
		let userRepository: UserPrismaRepository;
		let invoiceRepository: InvoicePrismaRepository;
		let serviceGetAllInvoices: GetAllInvoices;


		beforeEach(() => {

			const date = new Date("2025-05-01T17:00:00.000Z");

			vi.useFakeTimers();
			vi.setSystemTime(date);

			userRepository = new UserPrismaRepository();
			invoiceRepository = new InvoicePrismaRepository();
			serviceGetAllInvoices = new GetAllInvoices(
				userRepository,
				invoiceRepository
			);


			vi.spyOn(userRepository, "getById").mockResolvedValue({
				id: "user-123",
				name:  "eduardo pinheiro miranda",
				email: "email@test.com",
				password: "senhaCriptografada",
				limit: Decimal(1200),
				dueDay: 10,
				closingDay: 5,
				avatar: null,
				createdAt: date,
				updatedAt: date,
			});

			vi.spyOn( new HandlerDueDate, "generateDueDates").mockReturnValue([{
				dueDate: new Date("2025-05-10T23:59:59.000Z"),
				closingDate: new Date("2025-05-05T23:59:59.000Z")
			}]);

		});

		afterEach(() => {
			vi.useRealTimers();
		});


		it("will trigger an error if the user is not found.", async () => {

			vi.spyOn(userRepository, "getById").mockResolvedValue(null);
            
			await expect(
				serviceGetAllInvoices.execute("invalidId")
			).rejects.toThrowError("Houve um problema ao buscar suas faturas, tente novamente.");
		});

		it("will trigger an error if the invoice is not found.", async () => {
            
			vi.spyOn(invoiceRepository, "getAllInvoices").mockResolvedValue([]);

			await expect(
				serviceGetAllInvoices.execute("user-123")
			).rejects.toThrowError("Nenhuma fatura encontrada.");
		});

		it("service is working.", async () => {

			const mockInvoice = [
				{
					invoiceId: "invoice-123",
					pay: false,
					dueDate: new Date("2025-05-10T23:59:59.000Z"),
					closingDate: new Date("2025-05-05T23:59:59.000Z"),
					current: true,
					amount: 500,
					limit: 1000,
					available: 500,
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
				}
			];

			vi.spyOn(invoiceRepository, "getAllInvoices").mockResolvedValue(mockInvoice);


			const result = await serviceGetAllInvoices.execute("user-123");


			expect(invoiceRepository.getAllInvoices).toBeCalledTimes(1);
			expect(result.invoices).toEqual(mockInvoice);
		});
	});
});