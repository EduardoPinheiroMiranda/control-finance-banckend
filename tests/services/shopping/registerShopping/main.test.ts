import { Shopping } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { RegisterShopping } from "@/services/shopping/regitserShopping";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/shopping", () => {

	describe("# register shopping", () => {
        
		let userRepository: UserPrismaRepository;
		let shoppingRepository: ShoppingPrismaRepository;
		let invoiceRepository: InvoicePrismaRepository;
		let installmentRepository: InstallmentPrismaRepository;
		let cardRepository: CardPrismaRepository;
		let serviceRegisterShopping: RegisterShopping;


		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2025-03-02"));

			userRepository = new UserPrismaRepository();
			shoppingRepository = new ShoppingPrismaRepository();
			invoiceRepository = new InvoicePrismaRepository();
			installmentRepository = new InstallmentPrismaRepository();
			cardRepository = new CardPrismaRepository();

			serviceRegisterShopping = new RegisterShopping(
				userRepository,
				shoppingRepository,
				invoiceRepository,
				installmentRepository,
				cardRepository
			);

		});

		afterEach(() => {
			jest.useRealTimers();
		});


		it("trigger an erro if the user is not found.", async () => {

			jest.spyOn(userRepository, "getById").mockResolvedValue(null);

			const shopping: Shopping = {
				name: "wifi",
				categoryId: "1234",
				description: "",
				cardId: "123",
				dueDay: 10,
				paymentMethod: "card",
				totalInstallments: 10,
				typeInvoice: "fixedExpense",
				value: 1200,
				purchaseDate: "2025-03-02"
			};

			await expect(
				serviceRegisterShopping.execute("userInvalid", shopping)
			).rejects.toBeInstanceOf(ResourceNotFoud);
		});

		it("will generate an error if the value or total of installments is less than 0.", async () => {

			const currentDate = new Date(); 

			jest.spyOn(userRepository, "getById").mockResolvedValue({
				id: "123",
				name: "Eduardo",
				avatar: null,
				balance: Decimal(1000),
				close_day: 5,
				due_day: 10,
				email: "email@test.com",
				limit: Decimal(100),
				password: "senha",
				created_at: currentDate,
				updated_at: currentDate
			});

			const shopping: Shopping = {
				name: "wifi",
				categoryId: "1234",
				description: "",
				cardId: "123",
				dueDay: 10,
				paymentMethod: "card",
				totalInstallments: 0,
				typeInvoice: "fixedExpense",
				value: 0,
				purchaseDate: "2025-03-02"
			};

			await expect(
				serviceRegisterShopping.execute("userInvalid", shopping)
			).rejects.toBeInstanceOf(DataValidationError);
		});
	});
});