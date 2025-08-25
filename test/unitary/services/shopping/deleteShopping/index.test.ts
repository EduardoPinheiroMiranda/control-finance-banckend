import { ResourceNotFound } from "@/errors/custonErros";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { DeleteShopping } from "@/services/shopping/deleteShopping";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PaymentMethod, TypeInvoice } from "@/generated/prisma/client";
import { Decimal } from "@/generated/prisma/runtime/library";


describe("service/shopping", () => {

	describe("#Delete shopping", () => {

		let shoppingRepository: ShoppingPrismaRepository;
		let installmentRepository: InstallmentPrismaRepository;
		let serviceDeleteShopping: DeleteShopping;

		beforeEach(() => {
			shoppingRepository = new ShoppingPrismaRepository();
			installmentRepository = new InstallmentPrismaRepository();
			serviceDeleteShopping = new DeleteShopping(
				shoppingRepository,
				installmentRepository
			);
		});

		it("trigger an error if the shopping is not found.", async () => {
        
			vi.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue(null);

			await expect(
				serviceDeleteShopping.execute("invalidId")
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("check whether an extraExpense purchase with no installments paid is deleted.", async () => {
			const date = new Date();
			const mockShopping = {
				name: "wi-fi",
				id: "shopping-123",
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(1200),
				totalInstallments: 2,
				pay: false,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: null,
				categoryId: "category-123",
				userId: "user-1234",
			};

			
			vi.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue({
				name: "wi-fi",
				id: "shopping-123",
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(1200),
				totalInstallments: 2,
				pay: false,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: null,
				categoryId: "category-123",
				userId: "user-1234",
				installment: [
					{
						id: "installment-123",
						pay: false,
						createdAt: date,
						updatedAt: date,
						installmentNumber: 1,
						installmentValue: Decimal(600),
						dueDate: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-123",
					},
					{
						id: "installment-124",
						pay: false,
						createdAt: date,
						updatedAt: date,
						installmentNumber: 2,
						installmentValue: Decimal(600),
						dueDate: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-123",
					}
				]
			});

			vi.spyOn(shoppingRepository, "delete").mockResolvedValue(mockShopping);


			const { shopping, msg } = await serviceDeleteShopping.execute("shopping-123");

			expect(shopping).toEqual(mockShopping);
			expect(msg).toBe("Compra excluída com sucesso.");
		});
    
		it("check whether an extraExpense type purchase with some installments paid cannot be excluded.", async () => {
			const date = new Date();
		

			vi.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue({
				name: "wi-fi",
				id: "shopping-123",
				typeInvoice: TypeInvoice.EXTRA_EXPENSE,
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(1200),
				totalInstallments: 2,
				pay: false,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: null,
				categoryId: "category-123",
				userId: "user-1234",
				installment: [
					{
						id: "installment-123",
						pay: true,
						createdAt: date,
						updatedAt: date,
						installmentNumber: 1,
						installmentValue: Decimal(600),
						dueDate: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-123",
					},
					{
						id: "installment-124",
						pay: false,
						createdAt: date,
						updatedAt: date,
						installmentNumber: 2,
						installmentValue: Decimal(600),
						dueDate: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-123",
					}
				]
			});


			const { shopping, msg } = await serviceDeleteShopping.execute("shopping-123");


			expect(shopping).toEqual({});
			expect(msg).toBe("Esta compra não pode ser mais excluída. Após o primeiro pagamento desta conta, os seus registros se tornaram fixos.");
		});

		it("check whether a fixedExpense purchase with some installments paid is deactivated.", async () => {
			const date = new Date();
			const mockShopping = {
				name: "wi-fi",
				id: "shopping-123",
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(1200),
				totalInstallments: 2,
				pay: true,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: null,
				categoryId: "category-123",
				userId: "user-1234",
			};

			vi.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue({
				name: "wi-fi",
				id: "shopping-123",
				typeInvoice: "FIXED_EXPENSE",
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(1200),
				totalInstallments: 2,
				pay: false,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: null,
				categoryId: "category-123",
				userId: "user-1234",
				installment: [
					{
						id: "installment-123",
						pay: true,
						createdAt: date,
						updatedAt: date,
						installmentNumber: 1,
						installmentValue: Decimal(600),
						dueDate: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-123",
					},
					{
						id: "installment-124",
						pay: false,
						createdAt: date,
						updatedAt: date,
						installmentNumber: 2,
						installmentValue: Decimal(600),
						dueDate: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-123",
					}
				]
			});

			vi.spyOn(shoppingRepository, "updateShopping").mockResolvedValue(mockShopping);
			vi.spyOn(installmentRepository, "delete").mockResolvedValue(1);


			const { shopping, msg } = await serviceDeleteShopping.execute("shopping-123");

			expect(shopping).toEqual(mockShopping);
			expect(msg).toBe("Compra excluída com sucesso.");
		});

		it("check whether a purchase with a fixed expense and no installments paid is excluded.", async () => {
			const date = new Date();
			const mockShopping = {
				name: "wi-fi",
				id: "shopping-123",
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(1200),
				totalInstallments: 2,
				pay: false,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: null,
				categoryId: "category-123",
				userId: "user-1234",
			};

			vi.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue({
				name: "wi-fi",
				id: "shopping-123",
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(1200),
				totalInstallments: 2,
				pay: false,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: null,
				categoryId: "category-123",
				userId: "user-1234",
				installment: [
					{
						id: "installment-123",
						pay: false,
						createdAt: date,
						updatedAt: date,
						installmentNumber: 1,
						installmentValue: Decimal(600),
						dueDate: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-123",
					},
					{
						id: "installment-124",
						pay: false,
						createdAt: date,
						updatedAt: date,
						installmentNumber: 2,
						installmentValue: Decimal(600),
						dueDate: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-123",
					}
				]
			});

			vi.spyOn(shoppingRepository, "delete").mockResolvedValue(mockShopping);


			const { shopping, msg } = await serviceDeleteShopping.execute("shopping-123");

			expect(shopping).toEqual(mockShopping);
			expect(msg).toBe("Compra excluída com sucesso.");
		});
	});
});