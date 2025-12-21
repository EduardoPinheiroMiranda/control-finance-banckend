import { ResourceNotFound } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { GetAllApplications } from "@/services/application/getAllApplications";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/application", () => {

	describe("#Get all applications", () => {

		let applicationRepository: ApplicationPrismaRepository;
		let serviceGetAllApplications: GetAllApplications;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			serviceGetAllApplications = new GetAllApplications(
				applicationRepository
			);
		});


		it("will trigger an erro if the applications is not found.", async () => {

			vi.spyOn(applicationRepository, "getAllApllications").mockResolvedValue({
				value: Decimal(0),
				applications: []
			});
        
			await expect(
				serviceGetAllApplications.execute("user-1233")
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("check if a list of apps was found.", async () => {

			const mockApplications = {
				value: Decimal(1000),
				applications: [
					{
						id: "application-123",
						name: "carreira",
						targetValue: Decimal(3000),
						value: Decimal(1000),
						colorApplication: "#ffffff",
						colorFont: "#a1a1a1",
						createdAt: new Date(),
						updatedAt: new Date(),
						icon: "icon-123",
						institution: "nubanck",
						userId: "user-123"
					}
				]
			};

			vi.spyOn(applicationRepository, "getAllApllications").mockResolvedValue(mockApplications);
        
			
			const result = await serviceGetAllApplications.execute("user-123");


			expect(result).toEqual(mockApplications);
		});

	});
});