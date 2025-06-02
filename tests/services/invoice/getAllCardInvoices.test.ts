import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetAllCardInvoices } from "@/services/invoice/getAllCardInvoices";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/invoice", () => {
  
	describe("service/invoice", () => {

		let invoiceRepository: InvoicePrismaRepository;
		let userRepository: UserPrismaRepository;
		let serviceGetAllCardInvoices: GetAllCardInvoices;
		const date = new Date();
		const mockUser = {
			id: "user-123",
			name: "eduardo",
			email: "teste@gmail.com",
			password: "senhaCriptografada",
			due_day: 10,
			closing_day: 5,
			limit: Decimal(1000),
			avatar: null,
			created_at: date,
			updated_at: date
		};

		beforeEach(() => {
			invoiceRepository = new InvoicePrismaRepository();
			userRepository = new UserPrismaRepository();
			serviceGetAllCardInvoices = new GetAllCardInvoices(
				invoiceRepository,
				userRepository
			);

			jest.useFakeTimers();
			jest.setSystemTime(new Date("2025-05-08T18:30:00.000Z"));
			jest.spyOn(userRepository, "getById").mockResolvedValue(mockUser);
		});

		afterEach(() => {
			jest.useRealTimers();
		});


		it("will trigger an error if the user is not found.", async () => {
      
			jest.spyOn(userRepository, "getById").mockResolvedValue(null);

			await expect(
				serviceGetAllCardInvoices.execute("userInvalid", "card-123")
			).rejects.toThrow("Houve um problema para consultar as informações do usuário.");
		});

		it("will triggre an error if the invoices is not found.", async () => {

			jest.spyOn(invoiceRepository, "getAllCardInvoices").mockResolvedValue([]);

			await expect(
				serviceGetAllCardInvoices.execute("user-123", "card-123")
			).rejects.toThrow("Não foi encotrado faturas deste cartão.");
		});

		it("check if the service is working.", async () => {

			const mockInvoices = [
				{
					invoice_id: "invoice-123",
					pay: false,
					due_date: date,
					current: false,
					amount: Decimal(1000),
					installments: [
						{
							installment_id: "installment-123",
							installment_number: 1,
							installment_value: 1000,
							due_date: date,
							pay: false,
							shopping_id: "shopping-123",
							total_installments: 1,
							type_invoice: "extraexpense",
							payment_method: "card",
							name: "roupa",
							purchase_date: date
						}
					]
				}
			];
			jest.spyOn(invoiceRepository, "getAllCardInvoices").mockResolvedValue(mockInvoices);
			jest.spyOn(HandlerDueDate.prototype, "generateDueDates").mockReturnValue([{
				dueDate: new Date("2025-06-10T23:59:59.000Z"),
				closingDate: new Date("2025-06-05T23:59:59.000Z")
			}]);


			const result = await serviceGetAllCardInvoices.execute("user-123", "card-123");


			expect(HandlerDueDate.prototype.generateDueDates).toBeCalledTimes(1);
			expect(invoiceRepository.getAllCardInvoices).toBeCalledTimes(1);
			expect(result).toEqual(mockInvoices);
		});
	});
});
