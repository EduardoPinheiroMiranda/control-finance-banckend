import { ShoppingUpdate } from "@/@types/customTypes";
import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { UpdateShopping } from "@/services/shopping/updateShopping";
import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/UpdateShopping", () => {

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
        
		jest.spyOn(shoppingRepository, "getById").mockResolvedValue(null);
        
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
		).rejects.toBeInstanceOf(ResourceNotFoud);
	});

	it("if an purchase from the type extraExpense has all installment in open, update all data.", async () => {

		const date = new Date();

		jest.spyOn(shoppingRepository, "getById").mockResolvedValue({
			id: "shopping-123",
			type_invoice: "extraExpense",
			name: "celular",
			card_id: "card-123",
			category_id: "category-123",
			created_at: date,
			description: null,
			pay: false,
			payment_method: "card",
			total_installments: 2,
			updated_at: date,
			user_id: "user-123",
			value: Decimal(1200)
		});

		jest.spyOn(installmentRepository, "getInstallmentsInOpen").mockResolvedValue([
			{
				id: "installment-123",
				pay: false,
				created_at: date,
				updated_at: date,
				installment_number: 1,
				installment_value: Decimal(2500),
				due_date: new Date("2025-04-10T23:59:59.000Z"),
				shopping_id: "shopping-123",
				invoice_id: "invoice-123",
			},
			{
				id: "installment-124",
				pay: false,
				created_at: date,
				updated_at: date,
				installment_number: 2,
				installment_value: Decimal(2500),
				due_date: new Date("2025-05-10T23:59:59.000Z"),
				shopping_id: "shopping-123",
				invoice_id: "invoice-123",
			},
			
		]);

		jest.spyOn(shoppingRepository, "updateShopping").mockResolvedValue({
			id: "shopping-123",
			card_id: "card-123",
			category_id: "category-123",
			created_at: date,
			description: null,
			name: "Galaxy S24 ultra 1T",
			pay: false,
			payment_method: "card",
			total_installments: 2,
			type_invoice: "extraExpense",
			updated_at: date,
			user_id: "user-123",
			value: Decimal(5000)
		});

		jest.spyOn(installmentRepository, "updateInstallment").mockResolvedValue({
			id: "installment-123",
			pay: false,
			created_at: date,
			updated_at: date,
			installment_number: 1,
			installment_value: Decimal(2500),
			due_date: new Date("2025-04-10T23:59:59.000Z"),
			shopping_id: "shopping-123",
			invoice_id: "invoice-123",
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
			type_invoice: "extraExpense",
			name: "celular",
			card_id: "card-123",
			category_id: "category-123",
			created_at: date,
			description: null,
			pay: false,
			payment_method: "card",
			total_installments: 2,
			updated_at: date,
			user_id: "user-123",
			value: Decimal(1200)
		};

		jest.spyOn(shoppingRepository, "getById").mockResolvedValue(mockeShopping);

		jest.spyOn(installmentRepository, "getInstallmentsInOpen").mockResolvedValue([
			{
				id: "installment-124",
				pay: false,
				created_at: date,
				updated_at: date,
				installment_number: 2,
				installment_value: Decimal(2500),
				due_date: new Date("2025-05-10T23:59:59.000Z"),
				shopping_id: "shopping-123",
				invoice_id: "invoice-123",
			},
			
		]);

		jest.spyOn(shoppingRepository, "updateShopping").mockResolvedValue({
			id: "shopping-123",
			card_id: "card-123",
			category_id: "category-123",
			created_at: date,
			description: "melhor telefone do mundo",
			name: "Galaxy S24 ultra 1T 12GB ram",
			pay: false,
			payment_method: "card",
			total_installments: 2,
			type_invoice: "extraExpense",
			updated_at: date,
			user_id: "user-123",
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
			type_invoice: "extraExpense",
			name: "celular",
			card_id: "card-123",
			category_id: "category-123",
			created_at: date,
			description: null,
			pay: false,
			payment_method: "card",
			total_installments: 2,
			updated_at: date,
			user_id: "user-123",
			value: Decimal(1200)
		};

		jest.spyOn(shoppingRepository, "getById").mockResolvedValue(mockeShopping);

		jest.spyOn(installmentRepository, "getInstallmentsInOpen").mockResolvedValue([
			{
				id: "installment-124",
				pay: false,
				created_at: date,
				updated_at: date,
				installment_number: 2,
				installment_value: Decimal(2500),
				due_date: new Date("2025-05-10T23:59:59.000Z"),
				shopping_id: "shopping-123",
				invoice_id: "invoice-123",
			},
			
		]);

		jest.spyOn(shoppingRepository, "updateShopping").mockResolvedValue({
			id: "shopping-123",
			card_id: "card-123",
			category_id: "category-123",
			created_at: date,
			description: "melhor telefone do mundo",
			name: "Galaxy S24 ultra 1T 12GB ram",
			pay: false,
			payment_method: "card",
			total_installments: 2,
			type_invoice: "extraExpense",
			updated_at: date,
			user_id: "user-123",
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
