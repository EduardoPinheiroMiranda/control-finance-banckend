import { InstallmentPrismaRepository } from "@/repositories/prisma/installment";
import { ShoppingPrismaRepository } from "@/repositories/prisma/shopping";
import { insertFixedPurchasesIntoNewInvoices } from "@/services/shopping/regitserShopping/insertFixedPurchasesIntoNewInvoices";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { PaymentMethod, TypeInvoice } from "@/generated/prisma";


describe("service/shopping", () => {

	describe("#Insert fixed purchases into new invoices", () => {
        
		let shoppingRepository: ShoppingPrismaRepository;
		let installmentRepository: InstallmentPrismaRepository;

		const date = new Date();

		const shopping = [
			{
				id: "shopping-123",
				name: "wi-fi",
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(69.9),
				totalInstallments: 1,
				pay: false,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: "card-123",
				categoryId: "category-123",
				userId: "user-123",
				installment: [
					{
						id: "installment-123",
						installmentNumber: 1,
						installmentValue: Decimal(69.9),
						dueDate: new Date("2025-10-06T23:59:59.000Z"),
						pay: true,
						createdAt: date,
						updatedAt: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-121"
					}
				]
			},
			{
				id: "shopping-124",
				name: "Spotify",
				typeInvoice: TypeInvoice.FIXED_EXPENSE,
				paymentMethod: PaymentMethod.INVOICE,
				value: Decimal(35.9),
				totalInstallments: 1,
				pay: false,
				description: null,
				createdAt: date,
				updatedAt: date,
				cardId: "card-123",
				categoryId: "category-123",
				userId: "user-123",
				installment: [
					{
						id: "installment-133",
						installmentNumber: 1,
						installmentValue: Decimal(69.9),
						dueDate: new Date("2025-10-06T23:59:59.000Z"),
						pay: true,
						createdAt: date,
						updatedAt: date,
						shoppingId: "shopping-123",
						invoiceId: "invoice-121"
					}
				]
			}
		];

		
		beforeEach(() => {
			shoppingRepository = new ShoppingPrismaRepository();
			installmentRepository = new InstallmentPrismaRepository();

			vi.spyOn(shoppingRepository, "findFixedTypeOpenPurchases").mockResolvedValue(shopping);
			vi.spyOn(installmentRepository, "create").mockResolvedValue([]);
			vi.spyOn(shoppingRepository, "updateTotalInstallments").mockResolvedValue(shopping.length);
		});


		it("Check if the function returns null if it finds no open fixed accounts.", async () => {

			vi.spyOn(shoppingRepository, "findFixedTypeOpenPurchases").mockResolvedValue([]);

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
					createdAt: new Date("2025-03-01"),
					updatedAt: new Date("2025-03-01"),
					userId: "1234",
					dueDate: new Date("2025-03-10"),
					closingDate: new Date("2025-03-05"),
				},
				{  
					id: "124",
					pay: false,
					createdAt: new Date("2025-03-01"),
					updatedAt: new Date("2025-03-01"),
					userId: "1234",
					dueDate: new Date("2025-04-10"),
					closingDate: new Date("2025-04-05"),
				},
				{  
					id: "123",
					pay: false,
					createdAt: new Date("2025-03-01"),
					updatedAt: new Date("2025-03-01"),
					userId: "1234",
					dueDate: new Date("2025-05-10"),
					closingDate: new Date("2025-05-05"),
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
					createdAt: new Date("2025-03-01"),
					updatedAt: new Date("2025-03-01"),
					userId: "1234",
					dueDate: new Date("2025-03-10"),
					closingDate: new Date("2025-03-05"),
				},
				{  
					id: "124",
					pay: false,
					createdAt: new Date("2025-03-01"),
					updatedAt: new Date("2025-03-01"),
					userId: "1234",
					dueDate: new Date("2025-04-10"),
					closingDate: new Date("2025-04-05"),
				},
				{  
					id: "123",
					pay: false,
					createdAt: new Date("2025-03-01"),
					updatedAt: new Date("2025-03-01"),
					userId: "1234",
					dueDate: new Date("2025-05-10"),
					closingDate: new Date("2025-05-05"),
				}
			];


			const { newInstallments } = await insertFixedPurchasesIntoNewInvoices(
				"user-123",
				invoices,
				shoppingRepository,
				installmentRepository
			);

			expect(newInstallments[0].installmentNumber).toBe(2);
			expect(newInstallments[0].dueDate.getTime()).toBe(new Date("2025-11-06T23:59:59.000Z").getTime());

			expect(newInstallments[1].installmentNumber).toBe(3);
			expect(newInstallments[1].dueDate.getTime()).toBe(new Date("2025-12-06T23:59:59.000Z").getTime());

			expect(newInstallments[2].installmentNumber).toBe(4);
			expect(newInstallments[2].dueDate.getTime()).toBe(new Date("2026-01-06T23:59:59.000Z").getTime());
		});
        
	});
});