import { DataValidationError } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { UpdateCard } from "@/services/card/updateCard";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";


describe("service/card", () => {

	describe("#Update card", () => {

		let cardRepository: CardPrismaRepository;
		let serviceUpdateCard: UpdateCard;


		beforeEach(() => {
			cardRepository = new CardPrismaRepository();
			serviceUpdateCard = new UpdateCard(
				cardRepository
			);
		});


		it("will trigger an erro if the colors values is invalid.", async () => {

			await expect(
				serviceUpdateCard.execute(
					{
						id: "card-123",
						name: "Mercado pago",
						closingDay: 5,
						dueDay: 7,
						colorCard: "#g92203sd",
						colorFont: "#g92203sd"
					}
				)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will trigger an erro if the dates are not valid.", async () => {
			await expect(
				serviceUpdateCard.execute(
					{
						id: "card-123",
						name: "Mercado pago",
						closingDay: 0,
						dueDay: 32,
						colorCard: "#f1f1f1",
						colorFont: "#00000010"
					}
				)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("test whether the card is updated", async () => {

			const date = new Date();

			jest.spyOn(cardRepository, "updateCartd").mockResolvedValue({
				id: "card-123",
				name: "Nubanck",
				active: true,
				closing_day: 4,
				due_day: 10,
				color_card: "#000000",
				color_font: "#ffffff",
				created_at: date,
				updated_at: date,
				user_id: "user-123"
			});

			const card = await serviceUpdateCard.execute(
				{
					id: "card-123",
					name: "mercado pago",
					closingDay: 5,
					dueDay: 7,
					colorCard: "#1f8fff",
					colorFont: "#fafafa"
				}
			);


			expect(card.name).toBe("Nubanck");
		});
	});
});