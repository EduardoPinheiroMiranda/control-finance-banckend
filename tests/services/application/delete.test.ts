import { DataValidationError } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { Delete } from "@/services/application/delete";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/application", () => {

	describe("#Delete", () => {
        
		let applicationRepository: ApplicationPrismaRepository;
		let serviceDelete: Delete;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			serviceDelete = new Delete(
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
            

			jest.spyOn(applicationRepository, "delete").mockResolvedValue(mockApplication);

			const result = await serviceDelete.execute("application-123");

			expect(result).toEqual(mockApplication);
		});

	});
});