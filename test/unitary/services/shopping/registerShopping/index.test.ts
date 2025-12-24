import { Shopping } from "src/@types/customTypes";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { UserPrismaRepository } from "@/repositories/prisma/user/user";
import { RegisterShopping } from "@/services/shopping/regitserShopping";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { PaymentMethod, TypeInvoice } from "@/generated/prisma/client";
import { MovementPrismaRepository } from "@/repositories/prisma/movements";


describe("service/shopping", () => {

	describe("#Register shopping", () => {
        
		let userRepository: UserPrismaRepository;
		let shoppingRepository: ShoppingPrismaRepository;
		let invoiceRepository: InvoicePrismaRepository;
		let installmentRepository: InstallmentPrismaRepository;
		let cardRepository: CardPrismaRepository;
		let movementRepository: MovementPrismaRepository;
		let serviceRegisterShopping: RegisterShopping;
		const currentDate = new Date();


		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date("2025-03-02"));

			userRepository = new UserPrismaRepository();
			shoppingRepository = new ShoppingPrismaRepository();
			invoiceRepository = new InvoicePrismaRepository();
			installmentRepository = new InstallmentPrismaRepository();
			cardRepository = new CardPrismaRepository();
			movementRepository = new MovementPrismaRepository();

			serviceRegisterShopping = new RegisterShopping(
				userRepository,
				shoppingRepository,
				invoiceRepository,
				installmentRepository,
				cardRepository,
				movementRepository
			);

		});

		afterEach(() => {
			vi.useRealTimers();
		});


		it("trigger an erro if the user is not found.", async () => {

			vi.spyOn(userRepository, "getById").mockResolvedValue(null);

			const shopping: Shopping = {
				name: "wifi",
				categoryId: "1234",
				description: "",
				cardId: "123",
				dueDay: 10,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 10,
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				value: 1200,
				purchaseDate: "2025-03-02"
			};

			await expect(
				serviceRegisterShopping.execute("userInvalid", shopping)
			).rejects.toThrowError("Usuário não foi encontrado.");
		});

		it("will generate an error if the value or total of installments is less than 0.", async () => { 

			vi.spyOn(userRepository, "getById").mockResolvedValue({
				id: "123",
				name: "Eduardo",
				avatar: null,
				closingDay: 5,
				dueDay: 10,
				email: "email@test.com",
				limit: Decimal(100),
				password: "senha",
				createdAt: currentDate,
				updatedAt: currentDate
			});

			const shopping: Shopping = {
				name: "wifi",
				categoryId: "1234",
				description: "",
				cardId: "123",
				dueDay: 10,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 0,
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				value: 0,
				purchaseDate: "2025-03-02"
			};

			await expect(
				serviceRegisterShopping.execute("userInvalid", shopping)
			).rejects.toThrowError("Valor ou quantidade de parcelas da compra não pode ser menor, ou igual a 0.");
		});

		it("will generate an error if the total of installments is greater than 72.", async () => { 

			vi.spyOn(userRepository, "getById").mockResolvedValue({
				id: "123",
				name: "Eduardo",
				avatar: null,
				closingDay: 5,
				dueDay: 10,
				email: "email@test.com",
				limit: Decimal(100),
				password: "senha",
				createdAt: currentDate,
				updatedAt: currentDate
			});

			const shopping: Shopping = {
				name: "wifi",
				categoryId: "1234",
				description: "",
				cardId: "123",
				dueDay: 10,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 100,
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				value: 1000,
				purchaseDate: "2025-03-02"
			};

			await expect(
				serviceRegisterShopping.execute("userId", shopping)
			).rejects.toThrowError("Não é possível adicionar uma compra com mais de 72 parcelas, neste cenário recomendamos alterar o tipo da compra para fixa.");
		});

		it("trigger an error if the dueDay is null", async () => {

			const shopping: Shopping = {
				name: "wifi",
				categoryId: "1234",
				description: "",
				cardId: "123",
				dueDay: null,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 10,
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				value: 1000,
				purchaseDate: "2025-03-02"
			};

			await expect(
				serviceRegisterShopping.registerShopping("userInvalid", shopping, [])
			).rejects.toThrowError("O dia do venciamento da compra deve ser informado.");
		});
	});
});