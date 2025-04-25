import { DataValidationError } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { ExtractPrismaRepository } from "@/repositories/prisma/extract";
import { Deposit } from "@/services/application/deposit";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/application", () => {

	describe("#Deposit", () => {

		let applicationRepository: ApplicationPrismaRepository;
		let extractRepository: ExtractPrismaRepository;
		let serviceDeposit: Deposit;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			extractRepository = new ExtractPrismaRepository();
			serviceDeposit = new Deposit(
				applicationRepository,
				extractRepository
			);
		});


		it("will trigger an error if the valou is less than 0.", async () => {
            
			await expect(
				serviceDeposit.execute("application-123", 0)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will triggre an error if the application is not found.", async () => {
            
			jest.spyOn(applicationRepository, "getById").mockResolvedValue(null);
            
			await expect(
				serviceDeposit.execute("invalidId", 10)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("check that the application value is updated and that the statement record has been created.", async () => {
            
			const date = new Date();

			const mockApplication = {
				id: "application-123",
				name: "carreira",
				target_value: Decimal(2000),
				value: Decimal(1000),
				institution: "nubanck",
				color_font: "#000000",
				color_application: "#999999",
				icon: "svg",
				created_at: date,
				updated_at: date,
				application_id: "application-123",
				user_id: "user-123",
			};

			const mockUpadateApplication = {
				id: "application-123",
				name: "carreira",
				target_value: Decimal(2000),
				value: Decimal(1500),
				institution: "nubanck",
				color_font: "#000000",
				color_application: "#999999",
				icon: "svg",
				created_at: date,
				updated_at: date,
				application_id: "application-123",
				user_id: "user-123",
			};

			const mockCreateExtract = {
				id: "extract-123",
				type: "withdraw",
				value: Decimal(500),
				created_at: date,
				application_id: "application-123"
			};

			jest.spyOn(applicationRepository, "getById").mockResolvedValue(mockApplication);
			jest.spyOn(applicationRepository, "update").mockResolvedValue(mockUpadateApplication);
			jest.spyOn(extractRepository, "create").mockResolvedValue(mockCreateExtract);


			const result = await serviceDeposit.execute("application-123", 500);


			expect(result).toEqual({
				applicationId: "application-123",
				totalValue: 1500,
				type: "withdraw",
				value: Decimal(500),
				createdAt: date
			});
		});
	});
});