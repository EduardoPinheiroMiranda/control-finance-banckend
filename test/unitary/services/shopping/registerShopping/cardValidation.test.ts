import { DataValidationError } from "@/errors/custonErros";
import { CardPrismaRepository } from "@/repositories/prisma/card";
import { cardValidation } from "@/services/shopping/regitserShopping/cardValidation";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";


describe("service/shopping", () => {

	describe("#Card validate", () => {
        
		let cardRepository: CardPrismaRepository;

		beforeEach(() => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date("2025-03-02"));

			cardRepository = new CardPrismaRepository();
		});

		afterEach(() => {
			vi.useRealTimers();
		});


		it("check if false is returned if the payment method is other than card.", async () => {

			const startOnTheInvoice = await cardValidation(
				"MONEY",
				"invalidId",
				cardRepository
			);
			expect(startOnTheInvoice.startOnTheInvoice).toBe(false);

		});

		it("check if an error is raised if cardId is null.", async () => {

			await expect(
				cardValidation(
					"CARD",
					null,
					cardRepository
				)
			).rejects.toBeInstanceOf(DataValidationError);

		});

		it("check whether an error is generated if the card is invalid.", async () => {

			vi.spyOn(cardRepository, "getById").mockResolvedValue(null);

			await expect(
				cardValidation(
					"CARD",
					"invalidId",
					cardRepository
				)
			).rejects.toBeInstanceOf(DataValidationError);

		});

		it("check if true is returned if the purchase is made after closing the card.", async () => {

			const currentDate = new Date();

			vi.spyOn(cardRepository, "getById").mockResolvedValue({
				id: "123",
				closingDay: 1,
				dueDay: 10,
				colorCard: "#000",
				colorFont: "#000",
				active: true,
				createdAt: currentDate,
				updatedAt: currentDate,
				userId: "1234",
				name: "Mercado Pago"
			});


			const startOnTheInvoice = await cardValidation(
				"CARD",
				"validId",
				cardRepository
			);


			expect(startOnTheInvoice.startOnTheInvoice).toBe(true);
		});

		it("check if false is returned if purchase is made before card closing.", async () => {

			const currentDate = new Date();

			vi.spyOn(cardRepository, "getById").mockResolvedValue({
				id: "123",
				closingDay: 5,
				dueDay: 10,
				colorCard: "#000",
				colorFont: "#000",
				active: true,
				createdAt: currentDate,
				updatedAt: currentDate,
				userId: "1234",
				name: "Mercado Pago"
			});


			const startOnTheInvoice = await cardValidation(
				"CARD",
				"validId",
				cardRepository
			);


			expect(startOnTheInvoice.startOnTheInvoice).toBe(false);
		});
	});
});