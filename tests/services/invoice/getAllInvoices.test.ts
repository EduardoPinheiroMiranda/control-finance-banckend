import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetAllInvoices } from "@/services/invoice/getAllInvoices";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { describe, expect, it, beforeEach, jest, afterEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/invoice", () => {

	describe("#Get all incoice", () => {
        
		let userRepository: UserPrismaRepository;
		let invoiceRepository: InvoicePrismaRepository;
		let serviceGetAllInvoices: GetAllInvoices;


		beforeEach(() => {

			const date = new Date("2025-05-01T17:00:00.000Z");

			jest.useFakeTimers();
			jest.setSystemTime(date);

			userRepository = new UserPrismaRepository();
			invoiceRepository = new InvoicePrismaRepository();
			serviceGetAllInvoices = new GetAllInvoices(
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
				serviceGetAllInvoices.execute("invalidId")
			).rejects.toThrowError("Houve um problema ao buscar suas faturas, tente novamente.");
		});

		it("will trigger an error if the invoice is not found.", async () => {
            
			jest.spyOn(invoiceRepository, "getAllInvoices").mockResolvedValue([]);

			await expect(
				serviceGetAllInvoices.execute("user-123")
			).rejects.toThrowError("Nenhuma fatura encontrada.");
		});

		it("service is working.", async () => {

			const mockInvoice = [
				{
					invoice_id: "invoice-123",
					pay: false,
					due_date: new Date("2025-05-10T23:59:59.000Z"),
					closing_date: new Date("2025-05-05T23:59:59.000Z"),
					current: true,
					amount: Decimal(500),
					limit: Decimal(1000),
					available: Decimal(500),
					total_fixed_expense: Decimal(200),
					total_extra_expense: Decimal(300),
					total_invoice: Decimal(200),
					total_card: Decimal(0),
					total_money: Decimal(300),
					installments: {
						fixed_expense: [
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
								name: "Freio hidraulico",
								purchase_date: new Date,
							}
						],
						extra_expense: [
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
								name: "Quadro absolute nero 5 verde oliva",
								purchase_date: new Date,
							}
						]
					}
				}
			];

			jest.spyOn(invoiceRepository, "getAllInvoices").mockResolvedValue(mockInvoice);


			const result = await serviceGetAllInvoices.execute("user-123");


			expect(invoiceRepository.getAllInvoices).toBeCalledTimes(1);
			expect(result.invoices).toEqual(mockInvoice);
		});
	});
});