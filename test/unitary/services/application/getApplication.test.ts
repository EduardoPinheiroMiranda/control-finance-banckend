import { ResourceNotFound } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { GetApplication } from "@/services/application/getApplication";
import { describe, it, expect, beforeEach, vi } from "vitest";
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

			vi.spyOn(applicationRepository, "getById").mockResolvedValue(null);
        
			await expect(
				serviceGetApplication.execute("application-123")
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("check if a list of apps was found.", async () => {

			const mockApplications = {
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
				userId: "user-123",
				extract: []
			};

			vi.spyOn(applicationRepository, "getAllInfo").mockResolvedValue(mockApplications);
        
            
			const result = await serviceGetApplication.execute("application-123");


			expect(result).toEqual(mockApplications);
		});

	});
});