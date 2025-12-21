import { ResourceNotFound } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { ListCards } from "@/services/card/listCards";
import { describe, it, expect, beforeEach, vi } from "vitest";


describe("service/card", () => {

	describe("#Lit cards", () => {

		let cardRepository: CardPrismaRepository;
		let serviceListCards: ListCards;


		beforeEach(() => {
			cardRepository = new CardPrismaRepository();
			serviceListCards = new ListCards(
				cardRepository
			);
		});


		it("will trigger an erro if the cards is not found.", async () => {

			vi.spyOn(cardRepository, "getAllCards").mockResolvedValue([]);
        
			await expect(
				serviceListCards.execute("user-1233")
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("cards are found.", async () => {

			const date = new Date();
			const mockCard = [
				{
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
				}
			];
        
			vi.spyOn(cardRepository, "getAllCards").mockResolvedValue(mockCard);
        
		
			const result = await serviceListCards.execute("user-123");

			expect(result).toEqual(mockCard);
		});

	});
});