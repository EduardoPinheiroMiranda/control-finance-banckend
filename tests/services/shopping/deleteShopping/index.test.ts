import { ResourceNotFoud } from "@/errors/custonErros";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { DeleteShopping } from "@/services/shopping/deleteShopping";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


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
        
			jest.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue(null);

			await expect(
				serviceDeleteShopping.execute("invalidId")
			).rejects.toBeInstanceOf(ResourceNotFoud);
		});

		it("check whether an extraExpense purchase with no installments paid is deleted.", async () => {
			const date = new Date();
			const mockShopping = {
				name: "wi-fi",
				id: "shopping-123",
				type_invoice: "extraExpense",
				payment_method: "invoice",
				value: Decimal(1200),
				total_installments: 2,
				pay: false,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: null,
				category_id: "category-123",
				user_id: "user-1234",
			};

			
			jest.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue({
				name: "wi-fi",
				id: "shopping-123",
				type_invoice: "extraExpense",
				payment_method: "invoice",
				value: Decimal(1200),
				total_installments: 2,
				pay: false,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: null,
				category_id: "category-123",
				user_id: "user-1234",
				installment: [
					{
						id: "installment-123",
						pay: false,
						created_at: date,
						updated_at: date,
						installment_number: 1,
						installment_value: Decimal(600),
						due_date: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-123",
					},
					{
						id: "installment-124",
						pay: false,
						created_at: date,
						updated_at: date,
						installment_number: 2,
						installment_value: Decimal(600),
						due_date: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-123",
					}
				]
			});

			jest.spyOn(shoppingRepository, "delete").mockResolvedValue(mockShopping);


			const { shopping, msg } = await serviceDeleteShopping.execute("shopping-123");

			expect(shopping).toEqual(mockShopping);
			expect(msg).toBe("Compra excluída com sucesso.");
		});
    
		it("check whether an extraExpense type purchase with some installments paid cannot be excluded.", async () => {
			const date = new Date();
		

			jest.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue({
				name: "wi-fi",
				id: "shopping-123",
				type_invoice: "extraExpense",
				payment_method: "invoice",
				value: Decimal(1200),
				total_installments: 2,
				pay: false,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: null,
				category_id: "category-123",
				user_id: "user-1234",
				installment: [
					{
						id: "installment-123",
						pay: true,
						created_at: date,
						updated_at: date,
						installment_number: 1,
						installment_value: Decimal(600),
						due_date: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-123",
					},
					{
						id: "installment-124",
						pay: false,
						created_at: date,
						updated_at: date,
						installment_number: 2,
						installment_value: Decimal(600),
						due_date: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-123",
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
				type_invoice: "fixedExpense",
				payment_method: "invoice",
				value: Decimal(1200),
				total_installments: 2,
				pay: true,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: null,
				category_id: "category-123",
				user_id: "user-1234",
			};

			jest.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue({
				name: "wi-fi",
				id: "shopping-123",
				type_invoice: "fixedExpense",
				payment_method: "invoice",
				value: Decimal(1200),
				total_installments: 2,
				pay: false,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: null,
				category_id: "category-123",
				user_id: "user-1234",
				installment: [
					{
						id: "installment-123",
						pay: true,
						created_at: date,
						updated_at: date,
						installment_number: 1,
						installment_value: Decimal(600),
						due_date: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-123",
					},
					{
						id: "installment-124",
						pay: false,
						created_at: date,
						updated_at: date,
						installment_number: 2,
						installment_value: Decimal(600),
						due_date: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-123",
					}
				]
			});

			jest.spyOn(shoppingRepository, "updateShopping").mockResolvedValue(mockShopping);
			jest.spyOn(installmentRepository, "delete").mockResolvedValue(1);


			const { shopping, msg } = await serviceDeleteShopping.execute("shopping-123");

			expect(shopping).toEqual(mockShopping);
			expect(msg).toBe("Compra excluída com sucesso.");
		});

		it("check whether a purchase with a fixed expense and no installments paid is excluded.", async () => {
			const date = new Date();
			const mockShopping = {
				name: "wi-fi",
				id: "shopping-123",
				type_invoice: "fixedExpense",
				payment_method: "invoice",
				value: Decimal(1200),
				total_installments: 2,
				pay: false,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: null,
				category_id: "category-123",
				user_id: "user-1234",
			};

			jest.spyOn(shoppingRepository, "getFullDataById").mockResolvedValue({
				name: "wi-fi",
				id: "shopping-123",
				type_invoice: "fixedExpense",
				payment_method: "invoice",
				value: Decimal(1200),
				total_installments: 2,
				pay: false,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: null,
				category_id: "category-123",
				user_id: "user-1234",
				installment: [
					{
						id: "installment-123",
						pay: false,
						created_at: date,
						updated_at: date,
						installment_number: 1,
						installment_value: Decimal(600),
						due_date: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-123",
					},
					{
						id: "installment-124",
						pay: false,
						created_at: date,
						updated_at: date,
						installment_number: 2,
						installment_value: Decimal(600),
						due_date: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-123",
					}
				]
			});

			jest.spyOn(shoppingRepository, "delete").mockResolvedValue(mockShopping);


			const { shopping, msg } = await serviceDeleteShopping.execute("shopping-123");

			expect(shopping).toEqual(mockShopping);
			expect(msg).toBe("Compra excluída com sucesso.");
		});
	});
});