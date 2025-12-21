import { DataValidationError } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { ExtractPrismaRepository } from "@/repositories/prisma/extract";
import { ValueMovements } from "@/services/application/valueMovements";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";
import { TypeExtract } from "@/generated/prisma/client";
import { MovementPrismaRepository } from "@/repositories/prisma/movements";


describe("service/application", () => {

	describe("#Value movements", () => {

		let applicationRepository: ApplicationPrismaRepository;
		let extractRepository: ExtractPrismaRepository;
		let movementRepository: MovementPrismaRepository;
		let serviceValueMovements: ValueMovements;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			extractRepository = new ExtractPrismaRepository();
			movementRepository = new MovementPrismaRepository();
			serviceValueMovements = new ValueMovements(
				applicationRepository,
				extractRepository,
				movementRepository
			);
		});


		it("will trigger an error if the valou is less than 0.", async () => {
            
			await expect(
				serviceValueMovements.execute("application-123", 0, "DEPOSIT")
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will triggre an error if the application is not found.", async () => {
            
			vi.spyOn(applicationRepository, "getById").mockResolvedValue(null);
            
			await expect(
				serviceValueMovements.execute("invalidId", 10, "DEPOSIT")
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("check that the application amount is updated and that the statement record was created as a deposit.", async () => {
            
			const date = new Date();

			const mockApplication = {
				id: "application-123",
				name: "carreira",
				targetValue: Decimal(2000),
				value: Decimal(1000),
				institution: "nubanck",
				colorFont: "#000000",
				colorApplication: "#999999",
				icon: "svg",
				createdAt: date,
				updatedAt: date,
				applicationId: "application-123",
				userId: "user-123",
			};

			const mockUpadateApplication = {
				id: "application-123",
				name: "carreira",
				targetValue: Decimal(2000),
				value: Decimal(1500),
				institution: "nubanck",
				colorFont: "#000000",
				colorApplication: "#999999",
				icon: "svg",
				createdAt: date,
				updatedAt: date,
				applicationId: "application-123",
				userId: "user-123",
			};

			const mockCreateExtract = {
				id: "extract-123",
				type: TypeExtract.DEPOSIT,
				value: Decimal(500),
				createdAt: date,
				applicationId: "application-123"
			};

			const mockMovement = {
				id: "01",
				name: mockCreateExtract.type,
				type: mockCreateExtract.type,
				value: mockCreateExtract.value,
				installment: null,
				createdAt: mockCreateExtract.createdAt,
				userId: "011",
				extractId: mockCreateExtract.id,
				shoppingId: null
			};

			vi.spyOn(applicationRepository, "getById").mockResolvedValue(mockApplication);
			vi.spyOn(applicationRepository, "update").mockResolvedValue(mockUpadateApplication);
			vi.spyOn(extractRepository, "create").mockResolvedValue(mockCreateExtract);
			vi.spyOn(movementRepository, "create").mockResolvedValue(mockMovement);


			const result = await serviceValueMovements.execute("application-123", 500, "DEPOSIT");


			expect(result).toEqual({
				applicationId: "application-123",
				totalValue: 1500,
				type: TypeExtract.DEPOSIT,
				value: Decimal(500),
				createdAt: date
			});
		});

		it("check that the application amount is updated and that the statement record was created as a withdrawal.", async () => {
            
			const date = new Date();

			const mockApplication = {
				id: "application-123",
				name: "carreira",
				targetValue: Decimal(2000),
				value: Decimal(1000),
				institution: "nubanck",
				colorFont: "#000000",
				colorApplication: "#999999",
				icon: "svg",
				createdAt: date,
				updatedAt: date,
				applicationId: "application-123",
				userId: "user-123",
			};

			const mockUpadateApplication = {
				id: "application-123",
				name: "carreira",
				targetValue: Decimal(2000),
				value: Decimal(500),
				institution: "nubanck",
				colorFont: "#000000",
				colorApplication: "#999999",
				icon: "svg",
				createdAt: date,
				updatedAt: date,
				applicationId: "application-123",
				userId: "user-123",
			};

			const mockCreateExtract = {
				id: "extract-123",
				type: TypeExtract.WITHDRAW,
				value: Decimal(500),
				createdAt: date,
				applicationId: "application-123"
			};

			const mockMovement = {
				id: "01",
				name: mockCreateExtract.type,
				type: mockCreateExtract.type,
				value: mockCreateExtract.value,
				installment: null,
				createdAt: mockCreateExtract.createdAt,
				userId: "011",
				extractId: mockCreateExtract.id,
				shoppingId: null
			};

			vi.spyOn(applicationRepository, "getById").mockResolvedValue(mockApplication);
			vi.spyOn(applicationRepository, "update").mockResolvedValue(mockUpadateApplication);
			vi.spyOn(extractRepository, "create").mockResolvedValue(mockCreateExtract);
			vi.spyOn(movementRepository, "create").mockResolvedValue(mockMovement);

			const result = await serviceValueMovements.execute("application-123", 500, "WITHDRAW");
			

			expect(result).toEqual({
				applicationId: "application-123",
				totalValue: 500,
				type: "WITHDRAW",
				value: Decimal(500),
				createdAt: date
			});
		});
	});
});
