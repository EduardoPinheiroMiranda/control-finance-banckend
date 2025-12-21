import { Decimal } from "@/generated/prisma/runtime/library";
import { MovementPrismaRepository } from "@/repositories/prisma/movements";
import { GetAllMovements } from "@/services/movement/getMovements";
import { describe, it, expect, beforeEach, vi } from "vitest";


describe("srvice/movement", () => {

	let movementRepository: MovementPrismaRepository;
	let serviceGetMovements: GetAllMovements;


	beforeEach(() => {
		movementRepository = new MovementPrismaRepository();
		serviceGetMovements = new GetAllMovements(
			movementRepository
		);
	});


	it("Trigger an error if the course is not a multiple of 10", async () => {
		await expect(
			serviceGetMovements.execute("userId", 36)
		).rejects.toThrowError("Você já chegou na ultima página");
	});


	it("Check if a movement array was returned.", async () => {
		
		vi.spyOn(movementRepository, "getMovements").mockResolvedValue([{
			id: "movement_01",
			name: "compra",
			type: "CARD",
			value: Decimal(100),
			deuDate: new Date(),
			installment: 1,
			createdAt: new Date(),
			userId: "user_01",
			shoppingId: null,
			extractId: "extract_01"
		}]);

		const result = await serviceGetMovements.execute("user_01", 10);
		expect(result[0].id).toBe("movement_01");
	});

	it("Triggers an error if the length of the result equals 0.", async () => {
		
		vi.spyOn(movementRepository, "getMovements").mockResolvedValue([]);

		await expect(
			serviceGetMovements.execute("user_01", 10)
		).rejects.toThrowError("Não foi encontrada nenhuma movimentação.");
	});
});