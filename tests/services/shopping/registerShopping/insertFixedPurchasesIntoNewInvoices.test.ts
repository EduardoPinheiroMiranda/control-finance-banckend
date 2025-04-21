import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { insertFixedPurchasesIntoNewInvoices } from "@/services/shopping/regitserShopping/insertFixedPurchasesIntoNewInvoices";
import { paymentMethods, typeInvoices } from "@/utils/globalValues";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/shopping", () => {

	describe("#insert fixed purchases into new invoices", () => {
        
		let shoppingRepository: ShoppingPrismaRepository;
		let installmentRepository: InstallmentPrismaRepository;

		const date = new Date();

		const shopping = [
			{
				id: "shopping-123",
				name: "wi-fi",
				type_invoice: typeInvoices[0],
				payment_method: paymentMethods[0],
				value: Decimal(69.9),
				total_installments: 1,
				pay: false,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: "card-123",
				category_id: "category-123",
				user_id: "user-123",
				installment: [
					{
						id: "installment-123",
						installment_number: 1,
						installment_value: Decimal(69.9),
						due_date: new Date("2025-10-06T23:59:59.000Z"),
						pay: true,
						created_at: date,
						updated_at: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-121"
					}
				]
			},
			{
				id: "shopping-124",
				name: "Spotify",
				type_invoice: typeInvoices[0],
				payment_method: paymentMethods[0],
				value: Decimal(35.9),
				total_installments: 1,
				pay: false,
				description: null,
				created_at: date,
				updated_at: date,
				card_id: "card-123",
				category_id: "category-123",
				user_id: "user-123",
				installment: [
					{
						id: "installment-133",
						installment_number: 1,
						installment_value: Decimal(69.9),
						due_date: new Date("2025-10-06T23:59:59.000Z"),
						pay: true,
						created_at: date,
						updated_at: date,
						shopping_id: "shopping-123",
						invoice_id: "invoice-121"
					}
				]
			}
		];

		
		beforeEach(() => {
			shoppingRepository = new ShoppingPrismaRepository();
			installmentRepository = new InstallmentPrismaRepository();

			jest.spyOn(shoppingRepository, "findFixedTypeOpenPurchases").mockResolvedValue(shopping);
			jest.spyOn(installmentRepository, "create").mockResolvedValue([]);
			jest.spyOn(shoppingRepository, "updateTotalInstallments").mockResolvedValue(shopping.length);
		});


		it("Check if the function returns null if it finds no open fixed accounts.", async () => {

			jest.spyOn(shoppingRepository, "findFixedTypeOpenPurchases").mockResolvedValue([]);

			const { 
				installments,
				newInstallments,
				updateShopping
			} = await insertFixedPurchasesIntoNewInvoices(
				"1234",
				[],
				shoppingRepository,
				installmentRepository
			);

			expect(installments.length).toBe(0);
			expect(newInstallments.length).toBe(0);
			expect(updateShopping).toBe(0);
		});

		it("check that the number of installments created is correct.", async () => {

			const invoices = [
				{  
					id: "123",
					pay: false,
					created_at: new Date("2025-03-01"),
					updated_at: new Date("2025-03-01"),
					user_id: "1234",
					due_date: new Date("2025-03-10"),
					closing_date: new Date("2025-03-05"),
				},
				{  
					id: "124",
					pay: false,
					created_at: new Date("2025-03-01"),
					updated_at: new Date("2025-03-01"),
					user_id: "1234",
					due_date: new Date("2025-04-10"),
					closing_date: new Date("2025-04-05"),
				},
				{  
					id: "123",
					pay: false,
					created_at: new Date("2025-03-01"),
					updated_at: new Date("2025-03-01"),
					user_id: "1234",
					due_date: new Date("2025-05-10"),
					closing_date: new Date("2025-05-05"),
				}
			];


			const { newInstallments } = await insertFixedPurchasesIntoNewInvoices(
				"user-123",
				invoices,
				shoppingRepository,
				installmentRepository
			);

			expect(newInstallments.length).toBe(invoices.length * shopping.length);
		});

		it("check that the batches created follow the correct order of creation", async () => {

			const invoices = [
				{  
					id: "123",
					pay: false,
					created_at: new Date("2025-03-01"),
					updated_at: new Date("2025-03-01"),
					user_id: "1234",
					due_date: new Date("2025-03-10"),
					closing_date: new Date("2025-03-05"),
				},
				{  
					id: "124",
					pay: false,
					created_at: new Date("2025-03-01"),
					updated_at: new Date("2025-03-01"),
					user_id: "1234",
					due_date: new Date("2025-04-10"),
					closing_date: new Date("2025-04-05"),
				},
				{  
					id: "123",
					pay: false,
					created_at: new Date("2025-03-01"),
					updated_at: new Date("2025-03-01"),
					user_id: "1234",
					due_date: new Date("2025-05-10"),
					closing_date: new Date("2025-05-05"),
				}
			];


			const { newInstallments } = await insertFixedPurchasesIntoNewInvoices(
				"user-123",
				invoices,
				shoppingRepository,
				installmentRepository
			);

			expect(newInstallments[0].installment_number).toBe(2);
			expect(newInstallments[0].due_date.getTime()).toBe(new Date("2025-11-06T23:59:59.000Z").getTime());

			expect(newInstallments[1].installment_number).toBe(3);
			expect(newInstallments[1].due_date.getTime()).toBe(new Date("2025-12-06T23:59:59.000Z").getTime());

			expect(newInstallments[2].installment_number).toBe(4);
			expect(newInstallments[2].due_date.getTime()).toBe(new Date("2026-01-06T23:59:59.000Z").getTime());
		});
        
	});
});