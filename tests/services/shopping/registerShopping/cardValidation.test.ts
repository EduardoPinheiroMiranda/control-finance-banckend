import { DataValidationError } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { cardValidation } from "@/services/shopping/regitserShopping/cardValidation";
import { describe, it, expect, jest, beforeEach, afterEach } from "@jest/globals";


describe("service/shopping", () => {

	describe("#Card validate", () => {
        
		let cardRepository: CardPrismaRepository;

		beforeEach(() => {
			jest.useFakeTimers();
			jest.setSystemTime(new Date("2025-03-02"));

			cardRepository = new CardPrismaRepository();
		});

		afterEach(() => {
			jest.useRealTimers();
		});


		it("check if false is returned if the payment method is other than card.", async () => {

			const startOnTheInvoice = await cardValidation(
				"money",
				"invalidId",
				cardRepository
			);
			expect(startOnTheInvoice.startOnTheInvoice).toBe(false);

		});

		it("check if an error is raised if cardId is null.", async () => {

			await expect(
				cardValidation(
					"card",
					null,
					cardRepository
				)
			).rejects.toBeInstanceOf(DataValidationError);

		});

		it("check whether an error is generated if the card is invalid.", async () => {

			jest.spyOn(cardRepository, "getById").mockResolvedValue(null);

			await expect(
				cardValidation(
					"card",
					"invalidId",
					cardRepository
				)
			).rejects.toBeInstanceOf(DataValidationError);

		});

		it("check if true is returned if the purchase is made after closing the card.", async () => {

			const currentDate = new Date();

			jest.spyOn(cardRepository, "getById").mockResolvedValue({
				id: "123",
				closing_day: 1,
				due_day: 10,
				color_card: "#000",
				color_font: "#000",
				active: true,
				created_at: currentDate,
				updated_at: currentDate,
				user_id: "1234",
				name: "Mercado Pago"
			});


			const startOnTheInvoice = await cardValidation(
				"card",
				"validId",
				cardRepository
			);


			expect(startOnTheInvoice.startOnTheInvoice).toBe(true);
		});

		it("check if false is returned if purchase is made before card closing.", async () => {

			const currentDate = new Date();

			jest.spyOn(cardRepository, "getById").mockResolvedValue({
				id: "123",
				closing_day: 5,
				due_day: 10,
				color_card: "#000",
				color_font: "#000",
				active: true,
				created_at: currentDate,
				updated_at: currentDate,
				user_id: "1234",
				name: "Mercado Pago"
			});


			const startOnTheInvoice = await cardValidation(
				"card",
				"validId",
				cardRepository
			);


			expect(startOnTheInvoice.startOnTheInvoice).toBe(false);
		});
	});
});