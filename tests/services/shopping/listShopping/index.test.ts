import { ResourceNotFoud } from "@/errors/custonErros";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { ListShopping } from "@/services/shopping/listShopping";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/shopping", () => {

	describe("#List shopping", () => {

		let shoppingRepository: ShoppingPrismaRepository;
		let serviceListShopping: ListShopping;


		beforeEach(() => {
			shoppingRepository = new ShoppingPrismaRepository();
			serviceListShopping = new ListShopping(
				shoppingRepository
			);
		});


		it("will triggre an error if the purchases is not found.", async () => {
			jest.spyOn(shoppingRepository, "listAllOpenPurchases").mockResolvedValue({
				fixedExpense: [],
				extraExpense: []
			});

			expect(
				serviceListShopping.execute("invalidId")
			).rejects.toBeInstanceOf(ResourceNotFoud);
		});

		it("check if the service is working.", async () => {

			const date = new Date();
			const mockShopping = {
				fixedExpense: [
					{
						id: "shopping-123",
						name: "spotefy",
						type_invoice: "fixedExpense",
						payment_method: "card",
						value: Decimal(39.9),
						total_installments: 1,
						pay: false,
						description: null,
						created_at: date,
						updated_at: date,
						category_id: "category-123",
						card_id: null,
						user_id: "user-123"
					}
				],
				extraExpense: [
					{
						id: "shopping-124",
						name: "S24 ultra",
						type_invoice: "extraExpense",
						payment_method: "invoice",
						value: Decimal(5559.99),
						total_installments: 18,
						pay: false,
						description: null,
						created_at: date,
						updated_at: date,
						category_id: "category-125",
						card_id: null,
						user_id: "user-123"
					}
				]
			};

			jest.spyOn(shoppingRepository, "listAllOpenPurchases").mockResolvedValue(mockShopping);


			const result = await serviceListShopping.execute("user-123");


			expect(result).toEqual(mockShopping);
		});
	});

});