import { DataValidationError } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { RegisterCard } from "@/services/card/registerCard";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";


describe("service/card", () => {

	describe("#Register card", () => {

		let cardRepository: CardPrismaRepository;
		let serviceRegisterCard: RegisterCard;


		beforeEach(() => {
			cardRepository = new CardPrismaRepository();
			serviceRegisterCard = new RegisterCard(
				cardRepository
			);
		});


		it("will trigger an erro if the dates are not valid.", async () => {
			await expect(
				serviceRegisterCard.execute(
					"user-1233",
					{
						name: "Mercado pago",
						closingDay: 0,
						dueDay: 32,
						colorCard: "#f1f1f1",
						colorFont: "#00000010"
					}
				)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("test whether the card is registered", async () => {

			const date = new Date();

			jest.spyOn(cardRepository, "create").mockResolvedValue({
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
			});

			const card = await serviceRegisterCard.execute(
				"user-123",
				{
					name: "mercado pago",
					closingDay: 5,
					dueDay: 7,
					colorCard: "#1f8fff",
					colorFont: "#fafafa"
				}
			);


			expect(card.name).toBe("mercado pago");
		});
    
	});
});