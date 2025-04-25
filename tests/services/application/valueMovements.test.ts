import { DataValidationError } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { ExtractPrismaRepository } from "@/repositories/prisma/extract";
import { ValueMovements } from "@/services/application/valueMovements";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/application", () => {

	describe("#Value movements", () => {

		let applicationRepository: ApplicationPrismaRepository;
		let extractRepository: ExtractPrismaRepository;
		let serviceValueMovements: ValueMovements;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			extractRepository = new ExtractPrismaRepository();
			serviceValueMovements = new ValueMovements(
				applicationRepository,
				extractRepository
			);
		});


		it("will trigger an error if the valou is less than 0.", async () => {
            
			await expect(
				serviceValueMovements.execute("application-123", 0, "deposit")
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will triggre an error if the application is not found.", async () => {
            
			jest.spyOn(applicationRepository, "getById").mockResolvedValue(null);
            
			await expect(
				serviceValueMovements.execute("invalidId", 10, "deposit")
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("check that the application amount is updated and that the statement record was created as a deposit.", async () => {
            
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
				type: "deposit",
				value: Decimal(500),
				created_at: date,
				application_id: "application-123"
			};

			jest.spyOn(applicationRepository, "getById").mockResolvedValue(mockApplication);
			jest.spyOn(applicationRepository, "update").mockResolvedValue(mockUpadateApplication);
			jest.spyOn(extractRepository, "create").mockResolvedValue(mockCreateExtract);


			const result = await serviceValueMovements.execute("application-123", 500, "deposit");


			expect(result).toEqual({
				applicationId: "application-123",
				totalValue: 1500,
				type: "deposit",
				value: Decimal(500),
				createdAt: date
			});
		});

		it("check that the application amount is updated and that the statement record was created as a withdrawal.", async () => {
            
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
				value: Decimal(500),
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


			const result = await serviceValueMovements.execute("application-123", 500, "withdraw");


			expect(result).toEqual({
				applicationId: "application-123",
				totalValue: 500,
				type: "withdraw",
				value: Decimal(500),
				createdAt: date
			});
		});
	});
});