import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetCurrentInvoice } from "@/services/invoice/getCurrentInvoice";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { describe, expect, it, beforeEach, jest, afterEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/invoice", () => {

	describe("#Get curretn incoice", () => {
        
		let userRepository: UserPrismaRepository;
		let invoiceRepository: InvoicePrismaRepository;
		let serviceGetCurrentInvoice: GetCurrentInvoice;


		beforeEach(() => {

			const date = new Date("2025-05-01T17:00:00.000Z");

			jest.useFakeTimers();
			jest.setSystemTime(date);

			userRepository = new UserPrismaRepository();
			invoiceRepository = new InvoicePrismaRepository();
			serviceGetCurrentInvoice = new GetCurrentInvoice(
				userRepository,
				invoiceRepository
			);


			jest.spyOn(userRepository, "getById").mockResolvedValue({
				id: "user-123",
				name:  "eduardo pinheiro miranda",
				email: "email@test.com",
				password: "senhaCriptografada",
				limit: Decimal(1200),
				due_day: 10,
				closing_day: 5,
				avatar: null,
				balance: Decimal(10000),
				created_at: date,
				updated_at: date,
			});

			jest.spyOn( new HandlerDueDate, "generateDueDates").mockReturnValue([{
				dueDate: new Date("2025-05-10T23:59:59.000Z"),
				closingDate: new Date("2025-05-05T23:59:59.000Z")
			}]);

		});

		afterEach(() => {
			jest.useRealTimers();
		});


		it("will trigger an error if the user is not found.", async () => {

			jest.spyOn(userRepository, "getById").mockResolvedValue(null);
			
			await expect(
				serviceGetCurrentInvoice.execute("invalidId")
			).rejects.toThrowError("Erro ao buscar os dados do usuário informado.");
		});

		it("will trigger an error if the invoice is not found.", async () => {
			
			jest.spyOn(invoiceRepository, "getCurrentInvoice").mockResolvedValue([]);

			await expect(
				serviceGetCurrentInvoice.execute("user-123")
			).rejects.toThrowError("Sua fatura não foi encontrada.");
		});

		it("service is working.", async () => {

			const mockInvoice = [
				{
					invoice_id: "invoice-123",
					pay: false,
					due_date: new Date("2025-05-10T23:59:59.000Z"),
					closing_date: new Date("2025-05-05T23:59:59.000Z"),
					current: true,
					amount: 500,
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
								shopping_id: "shopping-124",
								total_installments: 3,
								type_invoice: "fixedExpense",
								payment_method: "money",
								name: "Quadro absolute nero 5 verde oliva"
							}
						]
					}
				}
			];

			jest.spyOn(invoiceRepository, "getCurrentInvoice").mockResolvedValue(mockInvoice);


			const result = await serviceGetCurrentInvoice.execute("user-123");


			expect(invoiceRepository.getCurrentInvoice).toBeCalledTimes(1);
			expect(result).toEqual({
				percentegeSpent: 42,
				limit: 1200,
				available: 700,
				...mockInvoice[0]
			});
		});
	});
});