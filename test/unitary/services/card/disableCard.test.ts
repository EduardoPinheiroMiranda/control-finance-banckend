import { DataValidationError } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { DisableCard } from "@/services/card/disableCard";
import { describe, it, expect, beforeEach, vi } from "vitest";


describe("service/card", () => {

	describe("#Disable cards", () => {

		let cardRepository: CardPrismaRepository;
		let serviceDisableCard: DisableCard;


		beforeEach(() => {
			cardRepository = new CardPrismaRepository();
			serviceDisableCard = new DisableCard(
				cardRepository
			);
		});


		it("will trigger an erro if the cards is not found.", async () => {

			vi.spyOn(cardRepository, "getAllCards").mockResolvedValue([]);
        
			await expect(
				serviceDisableCard.execute("user-1233")
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("cards is disabled.", async () => {

			const date = new Date();
			const mockCard = {
				id: "card-123",
				name: "mercado pago",
				active: true,
				closingDay: 5,
				dueDay: 7,
				colorCard: "#000000",
				colorFont: "#ffffff",
				createdAt: date,
				updatedAt: date,
				userId: "user-123"
			};
        
			vi.spyOn(cardRepository, "disable").mockResolvedValue(mockCard);
        
        
			const result = await serviceDisableCard.execute("user-123");

			expect(result).toEqual(mockCard);
		});

	});
});