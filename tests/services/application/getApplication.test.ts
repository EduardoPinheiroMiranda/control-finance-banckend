import { ResourceNotFoud } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { GetApplication } from "@/services/application/getApplication";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/application", () => {

	describe("#Get applications", () => {

		let applicationRepository: ApplicationPrismaRepository;
		let serviceGetApplication: GetApplication;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			serviceGetApplication = new GetApplication(
				applicationRepository
			);
		});


		it("will trigger an erro if the application is not found.", async () => {

			jest.spyOn(applicationRepository, "getById").mockResolvedValue(null);
        
			await expect(
				serviceGetApplication.execute("application-123")
			).rejects.toBeInstanceOf(ResourceNotFoud);
		});

		it("check if a list of apps was found.", async () => {

			const mockApplications = {
				id: "application-123",
				name: "carreira",
				target_value: Decimal(3000),
				value: Decimal(1000),
				color_application: "#ffffff",
				color_font: "#a1a1a1",
				created_at: new Date(),
				updated_at: new Date(),
				icon: "icon-123",
				institution: "nubanck",
				user_id: "user-123",
				extract: []
			};

			jest.spyOn(applicationRepository, "getById").mockResolvedValue(mockApplications);
        
            
			const result = await serviceGetApplication.execute("application-123");


			expect(result).toEqual(mockApplications);
		});

	});
});