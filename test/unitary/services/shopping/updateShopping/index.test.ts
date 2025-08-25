import { ShoppingUpdate } from "src/@types/customTypes";
import { DataValidationError, ResourceNotFound } from "@/errors/custonErros";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { UpdateShopping } from "@/services/shopping/updateShopping";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { PaymentMethod, TypeInvoice } from "@/generated/prisma";


describe("service/shopping", () => {

	describe("#Update shopping", () => {

		let shoppingRepository: ShoppingPrismaRepository;
		let installmentRepository: InstallmentPrismaRepository;
		let serviceUpdateShopping: UpdateShopping;


		beforeEach(() => {

			shoppingRepository = new ShoppingPrismaRepository();
			installmentRepository = new InstallmentPrismaRepository();
			serviceUpdateShopping = new UpdateShopping(
				shoppingRepository,
				installmentRepository
			);
		});


		it("will trigger an error if the purchase amount is less than 0", async () => {
        
			await expect(
				serviceUpdateShopping.execute(
					{
						id: "shopping-12344",
						name: "wifi",
						value: 0,
						description: null,
						dueDay: 10,
						categoryId: "category-1234",
					}
				)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will trigger an error if the purchase amount is less than 0", async () => {
        
			vi.spyOn(shoppingRepository, "getById").mockResolvedValue(null);
        
			await expect(
				serviceUpdateShopping.execute(
					{

						id: "shopping-12344",
						name: "wifi",
						value: 120,
						description: null,
						dueDay: 10,
						categoryId: "category-1234",
					}
				)
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("if an purchase from the type extraExpense has all installment in open, update all data.", async () => {

			const date = new Date();

			vi.spyOn(shoppingRepository, "getById").mockResolvedValue({
				id: "shopping-123",
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				name: "celular",
				cardId: "card-123",
				categoryId: "category-123",
				createdAt: date,
				description: null,
				pay: false,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 2,
				updatedAt: date,
				userId: "user-123",
				value: Decimal(1200)
			});

			vi.spyOn(installmentRepository, "getInstallmentsInOpen").mockResolvedValue([
				{
					id: "installment-123",
					pay: false,
					createdAt: date,
					updatedAt: date,
					installmentNumber: 1,
					installmentValue: Decimal(2500),
					dueDate: new Date("2025-04-10T23:59:59.000Z"),
					shoppingId: "shopping-123",
					invoiceId: "invoice-123",
				},
				{
					id: "installment-124",
					pay: false,
					createdAt: date,
					updatedAt: date,
					installmentNumber: 2,
					installmentValue: Decimal(2500),
					dueDate: new Date("2025-05-10T23:59:59.000Z"),
					shoppingId: "shopping-123",
					invoiceId: "invoice-123",
				},
			
			]);

			vi.spyOn(shoppingRepository, "updateShopping").mockResolvedValue({
				id: "shopping-123",
				cardId: "card-123",
				categoryId: "category-123",
				createdAt: date,
				description: null,
				name: "Galaxy S24 ultra 1T",
				pay: false,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 2,
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				updatedAt: date,
				userId: "user-123",
				value: Decimal(5000)
			});

			vi.spyOn(installmentRepository, "updateInstallment").mockResolvedValue({
				id: "installment-123",
				pay: false,
				createdAt: date,
				updatedAt: date,
				installmentNumber: 1,
				installmentValue: Decimal(2500),
				dueDate: new Date("2025-04-10T23:59:59.000Z"),
				shoppingId: "shopping-123",
				invoiceId: "invoice-123",
			});


			const updateShopping: ShoppingUpdate = {
				id: "shopping-123",
				name: "Galaxy S24 ultra 1T",
				value: 5000,
				description: null,
				dueDay: 10,
				categoryId: "category-1234",
			};


			const result = await serviceUpdateShopping.execute(updateShopping);


			expect(shoppingRepository.updateShopping).toHaveBeenCalledTimes(1);
			expect(installmentRepository.updateInstallment).toHaveBeenCalledTimes(2);
			expect(result.name).toBe(updateShopping.name);
			expect(Number(result.value)).toBe(updateShopping.value);


		});

		it("If an extraExpense purchase has at least one installment paid, it will only be possible to update the name and description.", async () => {

			const date = new Date();
		
			const mockeShopping = {
				id: "shopping-123",
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				name: "celular",
				cardId: "card-123",
				categoryId: "category-123",
				createdAt: date,
				description: null,
				pay: false,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 2,
				updatedAt: date,
				userId: "user-123",
				value: Decimal(1200)
			};

			vi.spyOn(shoppingRepository, "getById").mockResolvedValue(mockeShopping);

			vi.spyOn(installmentRepository, "getInstallmentsInOpen").mockResolvedValue([
				{
					id: "installment-124",
					pay: false,
					createdAt: date,
					updatedAt: date,
					installmentNumber: 2,
					installmentValue: Decimal(2500),
					dueDate: new Date("2025-05-10T23:59:59.000Z"),
					shoppingId: "shopping-123",
					invoiceId: "invoice-123",
				},
			
			]);

			vi.spyOn(shoppingRepository, "updateShopping").mockResolvedValue({
				id: "shopping-123",
				cardId: "card-123",
				categoryId: "category-123",
				createdAt: date,
				description: "melhor telefone do mundo",
				name: "Galaxy S24 ultra 1T 12GB ram",
				pay: false,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 2,
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				updatedAt: date,
				userId: "user-123",
				value: Decimal(1200)
			});


			const updateShopping = {
				id: "shopping-123",
				name: "Galaxy S24 ultra 1T 12GB ram",
				value: 5000,
				description: "melhor telefone do mundo",
				dueDay: 10,
				categoryId: "category-1234",
			};


			const result = await serviceUpdateShopping.execute(updateShopping);


			expect(shoppingRepository.updateShopping).toHaveBeenCalledTimes(1);
			expect(result.name).toBe(updateShopping.name);
			expect(result.value).not.toEqual(updateShopping.value);
			expect(result.description).toEqual(updateShopping.description);
		});

		it("If an extraExpense purchase has at least one installment paid, it will only be possible to update the name and description.", async () => {

			const date = new Date();
		
			const mockeShopping = {
				id: "shopping-123",
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				name: "celular",
				cardId: "card-123",
				categoryId: "category-123",
				createdAt: date,
				description: null,
				pay: false,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 2,
				updatedAt: date,
				userId: "user-123",
				value: Decimal(1200)
			};

			vi.spyOn(shoppingRepository, "getById").mockResolvedValue(mockeShopping);

			vi.spyOn(installmentRepository, "getInstallmentsInOpen").mockResolvedValue([
				{
					id: "installment-124",
					pay: false,
					createdAt: date,
					updatedAt: date,
					installmentNumber: 2,
					installmentValue: Decimal(2500),
					dueDate: new Date("2025-05-10T23:59:59.000Z"),
					shoppingId: "shopping-123",
					invoiceId: "invoice-123",
				},
			
			]);

			vi.spyOn(shoppingRepository, "updateShopping").mockResolvedValue({
				id: "shopping-123",
				cardId: "card-123",
				categoryId: "category-123",
				createdAt: date,
				description: "melhor telefone do mundo",
				name: "Galaxy S24 ultra 1T 12GB ram",
				pay: false,
				paymentMethod: PaymentMethod.CARD,
				totalInstallments: 2,
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				updatedAt: date,
				userId: "user-123",
				value: Decimal(1200)
			});


			const updateShopping = {
				id: "shopping-123",
				name: "Galaxy S24 ultra 1T 12GB ram",
				value: 5000,
				description: "melhor telefone do mundo",
				dueDay: 10,
				categoryId: "category-1234",
			};


			const result = await serviceUpdateShopping.execute(updateShopping);


			expect(shoppingRepository.updateShopping).toHaveBeenCalledTimes(1);
			expect(result.name).toBe(updateShopping.name);
			expect(result.value).not.toEqual(updateShopping.value);
			expect(result.description).toEqual(updateShopping.description);
		});

	});
});
