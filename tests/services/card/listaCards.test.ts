import { DataValidationError, ResourceNotFoud } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { ListCards } from "@/services/card/listCards";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";


describe("service/card", () => {

	let cardRepository: CardPrismaRepository;
	let serviceListCards: ListCards;


	beforeEach(() => {
		cardRepository = new CardPrismaRepository();
		serviceListCards = new ListCards(
			cardRepository
		);
	});


	it("will trigger an erro if the cards is not found.", async () => {

		jest.spyOn(cardRepository, "getAllCards").mockResolvedValue([]);
        
		await expect(
			serviceListCards.execute("user-1233")
		).rejects.toBeInstanceOf(ResourceNotFoud);
	});

	it("cards are found.", async () => {

		const date = new Date();
		const mockCard = [
			{
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
			}
		];
        
		jest.spyOn(cardRepository, "getAllCards").mockResolvedValue(mockCard);
        
		
		const result = await serviceListCards.execute("user-123");

		expect(result).toEqual(mockCard);
	});

});