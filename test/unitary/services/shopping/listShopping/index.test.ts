import { ResourceNotFound } from "@/errors/custonErros";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { ListShopping } from "@/services/shopping/listShopping";
import { describe, it, expect, beforeEach, vi } from "vitest";


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
			vi.spyOn(shoppingRepository, "listAllOpenPurchases").mockResolvedValue({
				fixedExpense: [],
				extraExpense: []
			});

			expect(
				serviceListShopping.execute("invalidId")
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("check if the service is working.", async () => {

			const date = new Date().toString();
			const mockShopping = {
				fixedExpense: [
					{
						id: "shopping-123",
						name: "spotefy",
						typeInvoice: "fixedExpense",
						paymentMethod: "card",
						value: 39.9,
						totalInstallments: 1,
						pay: false,
						description: null,
						createdAt: date,
						updatedAt: date,
						categoryId: "category-123",
						cardId: null,
						userId: "user-123"
					}
				],
				extraExpense: [
					{
						id: "shopping-124",
						name: "S24 ultra",
						typeInvoice: "extraExpense",
						paymentMethod: "invoice",
						value: 5559.99,
						totalInstallments: 18,
						pay: false,
						description: null,
						createdAt: date,
						updatedAt: date,
						categoryId: "category-125",
						cardId: null,
						userId: "user-123"
					}
				]
			};

			vi.spyOn(shoppingRepository, "listAllOpenPurchases").mockResolvedValue(mockShopping);


			const result = await serviceListShopping.execute("user-123");


			expect(result).toEqual(mockShopping);
		});
	});

});