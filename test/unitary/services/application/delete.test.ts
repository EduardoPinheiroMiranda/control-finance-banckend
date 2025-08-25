import { DataValidationError } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { DeleteApplication } from "@/services/application/deleteApplication";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/application", () => {

	describe("#Delete", () => {
        
		let applicationRepository: ApplicationPrismaRepository;
		let serviceDelete: DeleteApplication;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			serviceDelete = new DeleteApplication(
				applicationRepository
			);
		});


		it("trigger an error if deleting the application fails.", async () => {
            
			await expect(
				serviceDelete.execute("application-123")
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("check if the application is being deleted.", async () => {

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
            

			vi.spyOn(applicationRepository, "delete").mockResolvedValue(mockApplication);

			const result = await serviceDelete.execute("application-123");

			expect(result).toEqual(mockApplication);
		});

	});
});