import { DataValidationError } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { DisableCard } from "@/services/card/disableCard";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";


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

			jest.spyOn(cardRepository, "getAllCards").mockResolvedValue([]);
        
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
				closing_day: 5,
				due_day: 7,
				color_card: "#000000",
				color_font: "#ffffff",
				created_at: date,
				updated_at: date,
				user_id: "user-123"
			};
        
			jest.spyOn(cardRepository, "disable").mockResolvedValue(mockCard);
        
        
			const result = await serviceDisableCard.execute("user-123");

			expect(result).toEqual(mockCard);
		});

	});
});