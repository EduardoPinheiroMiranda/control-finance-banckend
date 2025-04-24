import { ResourceNotFoud } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { GetAllApplication } from "@/services/application/getAllApplications";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/application", () => {

	describe("#Get all applications", () => {

		let applicationRepository: ApplicationPrismaRepository;
		let serviceGetAllApplications: GetAllApplication;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			serviceGetAllApplications = new GetAllApplication(
				applicationRepository
			);
		});


		it("will trigger an erro if the applications is not found.", async () => {

			jest.spyOn(applicationRepository, "getAllApllications").mockResolvedValue({
				value: Decimal(0),
				applications: []
			});
        
			await expect(
				serviceGetAllApplications.execute("user-1233")
			).rejects.toBeInstanceOf(ResourceNotFoud);
		});

		it("check if a list of apps was found.", async () => {

			const mockApplications = {
				value: Decimal(1000),
				applications: [
					{
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
						user_id: "user-123"
					}
				]
			};

			jest.spyOn(applicationRepository, "getAllApllications").mockResolvedValue(mockApplications);
        
			
			const result = await serviceGetAllApplications.execute("user-123");


			expect(result).toEqual(mockApplications);
		});

	});
});