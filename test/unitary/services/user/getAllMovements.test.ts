import { ResourceNotFound } from "@/errors/custonErros";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { GetAllMovements } from "@/services/user/getAllMovements";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { PaymentMethod, TypeInvoice } from "@/generated/prisma";


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

			vi.spyOn(shoppingRepository, "getAllShopping").mockResolvedValue([]);

			await expect(
				serviceGetAllMovements.execute("user-123", "name", null)
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("check if purchases were found.", async () => {

			const date = new Date();

			const mockShopping = [
				{
					id: "shopping-123",
					name: "S24 ultra 1T",
					typeInvoice: TypeInvoice.EXTRA_EXPENSE,
					paymentMethod: PaymentMethod.CARD,
					value: Decimal(5000),
					totalInstallments: 18,
					pay: false,
					description: null,
					createdAt: date,
					updatedAt: date,
					categoryId: "category-123",
					cardId: "card-123",
					userId: "user-123"
				}
			];

			vi.spyOn(shoppingRepository, "getAllShopping").mockResolvedValue(mockShopping);


			const result = await serviceGetAllMovements.execute("user-123", "name", null);
			
			expect(shoppingRepository.getAllShopping).toBeCalledTimes(1);
			expect(result).toEqual(mockShopping);
		});
	});
});