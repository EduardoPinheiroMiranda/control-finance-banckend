import { DataValidationError } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { RegisterCard } from "@/services/card/registerCard";
import { describe, it, expect, beforeEach, vi } from "vitest";


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

			vi.spyOn(cardRepository, "create").mockResolvedValue({
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