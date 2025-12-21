import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetAllCardInvoices } from "@/services/invoice/getAllCardInvoices";
import { HandlerDueDate } from "@/utils/handlerDueDate";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
			dueDay: 10,
			closingDay: 5,
			limit: Decimal(1000),
			avatar: null,
			createdAt: date,
			updatedAt: date
		};

		beforeEach(() => {
			invoiceRepository = new InvoicePrismaRepository();
			userRepository = new UserPrismaRepository();
			serviceGetAllCardInvoices = new GetAllCardInvoices(
				invoiceRepository,
				userRepository
			);

			vi.useFakeTimers();
			vi.setSystemTime(new Date("2025-05-08T18:30:00.000Z"));
			vi.spyOn(userRepository, "getById").mockResolvedValue(mockUser);
		});

		afterEach(() => {
			vi.useRealTimers();
		});


		it("will trigger an error if the user is not found.", async () => {
      
			vi.spyOn(userRepository, "getById").mockResolvedValue(null);

			await expect(
				serviceGetAllCardInvoices.execute("userInvalid", "card-123")
			).rejects.toThrow("Houve um problema para consultar as informações do usuário.");
		});

		it("will triggre an error if the invoices is not found.", async () => {

			vi.spyOn(invoiceRepository, "getAllCardInvoices").mockResolvedValue([]);

			await expect(
				serviceGetAllCardInvoices.execute("user-123", "card-123")
			).rejects.toThrow("Não foi encotrado faturas deste cartão.");
		});

		it("check if the service is working.", async () => {

			const mockInvoices = [
				{
					invoiceId: "invoice-123",
					pay: false,
					dueDate: date,
					current: false,
					amount: Decimal(1000),
					installments: [
						{
							installmentId: "installment-123",
							installmentNumber: 1,
							installmentValue: 1000,
							dueDate: String(date),
							pay: false,
							shoppingId: "shopping-123",
							totalInstallments: 1,
							typeInvoice: "extraexpense",
							paymentMethod: "card",
							name: "roupa",
							purchaseDate: String(date)
						}
					]
				}
			];
			vi.spyOn(invoiceRepository, "getAllCardInvoices").mockResolvedValue(mockInvoices);
			vi.spyOn(HandlerDueDate.prototype, "generateDueDates").mockReturnValue([{
				dueDate: new Date("2025-06-10T23:59:59.000Z"),
				closingDate: new Date("2025-06-05T23:59:59.000Z")
			}]);


			const result = await serviceGetAllCardInvoices.execute("user-123", "card-123");


			expect(HandlerDueDate.prototype.generateDueDates).toBeCalledTimes(1);
			expect(invoiceRepository.getAllCardInvoices).toBeCalledTimes(1);
			expect(result.invoices).toEqual(mockInvoices);
		});
	});
});
