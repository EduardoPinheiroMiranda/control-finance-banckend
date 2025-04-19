import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { UpdateShopping } from "@/services/shopping/updateShopping";
import { describe, expect, it, beforeEach, afterEach, jest } from "@jest/globals";
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
				"shopping-12344",
				{
					name: "wifi",
					typeInvoice: "fixedExpense",
					paymentMethod: "invoice",
					value: 0,
					totalInstallments: 9,
					description: null,
					dueDay: 10,
					categoryId: "category-1234",
					cardId: null,
					purchaseDate: null
				}
			)
		).rejects.toBeInstanceOf(DataValidationError);
	});

	it("will trigger an error if the purchase amount is less than 0", async () => {
        
		jest.spyOn(shoppingRepository, "getById").mockResolvedValue(null);
        
		await expect(
			serviceUpdateShopping.execute(
				"shopping-12344",
				{
					name: "wifi",
					typeInvoice: "fixedExpense",
					paymentMethod: "invoice",
					value: 120,
					totalInstallments: 9,
					description: null,
					dueDay: 10,
					categoryId: "category-1234",
					cardId: null,
					purchaseDate: null
				}
			)
		).rejects.toBeInstanceOf(ResourceNotFoud);
	});

	it("You should only update the name and description if you purchase in installments.", async () => {

		const date = new Date();

		jest.spyOn(shoppingRepository, "getById").mockResolvedValue({
			id: "shopping-123",
			type_invoice: "extraExpense",
			name: "wifi",
			card_id: "card-123",
			category_id: "category-123",
			created_at: date,
			description: null,
			pay: false,
			payment_method: "invoice",
			total_installments: 10,
			updated_at: date,
			user_id: "user-123",
			value: Decimal(1200)
		});

		jest.spyOn(shoppingRepository, "updateShopping").mockResolvedValue({
			id: "shopping-123",
			card_id: "card-123",
			category_id: "category-123",
			created_at: date,
			description: "este é o wifi de casa",
			name: "wi-fi",
			pay: false,
			payment_method: "invoice",
			total_installments: 10,
			type_invoice: "extraExpense",
			updated_at: date,
			user_id: "user-123",
			value: Decimal(1200)
		});
	});

});
