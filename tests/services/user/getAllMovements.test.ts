import { ResourceNotFoud } from "@/errors/custonErros";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { GetAllMovements } from "@/services/user/getAllMovements";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/user", () => {
    
	describe("#Get all movements", () => {

		let shoppingRepository: ShoppingPrismaRepository;
		let serviceGetAllMovements: GetAllMovements;


		beforeEach(() => {
			shoppingRepository = new ShoppingPrismaRepository();
			serviceGetAllMovements = new GetAllMovements(
				shoppingRepository
			);
		});


		it("will trigger an error if the shoppings is not found.", async () => {

			jest.spyOn(shoppingRepository, "getAllShopping").mockResolvedValue([]);

			await expect(
				serviceGetAllMovements.execute("user-123", "name", null)
			).rejects.toBeInstanceOf(ResourceNotFoud);
		});

		it("check if purchases were found.", async () => {

			const date = new Date();

			const mockShopping = [
				{
					id: "shopping-123",
					name: "S24 ultra 1T",
					type_invoice: "extraExpense",
					payment_method: "card",
					value: Decimal(5000),
					total_installments: 18,
					pay: false,
					description: null,
					created_at: date,
					updated_at: date,
					category_id: "category-123",
					card_id: "card-123",
					user_id: "user-123"
				}
			];

			jest.spyOn(shoppingRepository, "getAllShopping").mockResolvedValue(mockShopping);


			const result = await serviceGetAllMovements.execute("user-123", "name", null);
			
			expect(shoppingRepository.getAllShopping).toBeCalledTimes(1);
			expect(result).toEqual(mockShopping);
		});
	});
});