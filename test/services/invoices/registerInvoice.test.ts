import { InvoicePrismaRepository } from "@/repositories/prisma/invoice";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { RegisterInvoice } from "@/services/invoices/registerInvoice";
import { getDateNow } from "@/utils/getDateNow";
import { describe, expect, it, jest, beforeEach} from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/invoices", () => {

	describe("# register invoice", () => {
        
		let userRepository: UserPrismaRepository;
		let invoiceRepository: InvoicePrismaRepository;
		let serviceRegisterInvoice: RegisterInvoice;


		beforeEach(() => {
			userRepository = new UserPrismaRepository();
			invoiceRepository = new InvoicePrismaRepository();
			serviceRegisterInvoice = new RegisterInvoice(
				userRepository,
				invoiceRepository
			);

			jest.spyOn(userRepository, "getById").mockResolvedValue({
				id: "1234",
				name: "eduardo",
				email: "eduardo@invoice.com",
				balance: Decimal(1000),
				avatar: null,
				expired: 10,
				limit: Decimal(1000),
				password: "passowordHashed",
				created_at: getDateNow,
				updated_at: getDateNow,
			});
		});


		it("will trigger an error if the user is not found.", async () => {
            
			jest.spyOn(userRepository, "getById").mockResolvedValue(null);

			const invoice = { 
				name: "Internet - wifi",
				typeInvoice: "fixedExpense",
				paymentMethod: "invoice",
				value: 69.90,
				expired: "10",
				description: "boleto para pagar",
				numberOfInstallments: 0,
			};

			await expect(
				serviceRegisterInvoice.execute(invoice, "invalidId")
			).rejects.toThrow("Usuário inexistente.");
		});

		it("will trigger an error if the value is less than or equal to 0.", async () => {

			const invoice = { 
				name: "Internet - wifi",
				typeInvoice: "fixedExpense",
				paymentMethod: "invoice",
				value: 0, // value invalid
				expired: "10",
				description: "boleto para pagar",
				numberOfInstallments: 0,
			};

			await expect(
				serviceRegisterInvoice.execute(invoice, "1234")
			).rejects.toThrow("Valor da fatura invalido.");
		});

		it("will trigger an error if the due date is incorrect.", async () => {

			jest.spyOn(Date.prototype, "getTime").mockReturnValue(
				new Date("2025-03-27T12:00:00Z").getTime()
			);


			const invoice = { 
				name: "Internet - wifi",
				typeInvoice: "extraExpenses",
				paymentMethod: "invoice",
				value: 100,
				expired: "10",	//invalid date, smaller than today
				description: "boleto para pagar",
				numberOfInstallments: 0,
			};

			await expect(
				serviceRegisterInvoice.execute(invoice, "1234")
			).rejects.toThrow("Data de vencimento deve ser superior ao dia atual.");
		});

		it("will trigger an error if the number of installments is incorrect.", async () => {

			jest.spyOn(Date.prototype, "getTime").mockReturnValue(
				new Date("2025-03-27T12:00:00Z").getTime()
			);


			const invoice = { 
				name: "Internet - wifi",
				typeInvoice: "fixedExpense",
				paymentMethod: "card", // payment method invalid
				value: 100,
				expired: "10",	
				description: "boleto para pagar",
				numberOfInstallments: 0,
			};

			await expect(
				serviceRegisterInvoice.execute(invoice, "1234")
			).rejects.toThrow("Quantidade de parcelas invalidas");
		});

		it("invoice has been registered.", async () => {

			jest.spyOn(Date.prototype, "getTime").mockReturnValue(
				new Date("2025-03-27T12:00:00Z").getTime()
			);

			jest.spyOn(invoiceRepository, "create").mockResolvedValue({
				id: "12345",
				name: "Celular novo",
				type_invoice: "fixedExpense",
				payment_method: "card",
				pay: false,
				expired: "10",
				description: "celular novo",
				number_of_installments: 12,
				installments_paid: 0,
				value: Decimal(1200),
				created_at: getDateNow,
				updated_at: getDateNow,
				userId: "1234"
			});


			const invoice = { 
				name: "Celular novo",
				typeInvoice: "fixedExpense",
				paymentMethod: "card",
				value: 1200,
				expired: "10",	
				description: "celular novo",
				numberOfInstallments: 12,
			};

			const response = await serviceRegisterInvoice.execute(invoice, "1234");
			expect(response.type_invoice).toBe("fixedExpense");
		});
	});
});