import { ResourceNotFound } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { FilterApplications } from "@/services/application/filterApplications";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/Application", () => {

	describe("#Filter application", () => {
        
		let applicationRepository: ApplicationPrismaRepository;
		let serviceFilterApplication: FilterApplications;

		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			serviceFilterApplication = new FilterApplications(
				applicationRepository
			);
		});


		it("will trigger an error if the extract is not found.", async () => {
            
			vi.spyOn(applicationRepository, "filterApplications").mockResolvedValue({
				amount: Decimal(0),
				extracts: []
			});
            
			await expect(
				serviceFilterApplication.execute({
					date: null,
					applicationId: null,
					type: null
				})
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("will trigger an error if the extract is not found.", async () => {
            
			vi.spyOn(applicationRepository, "filterApplications").mockResolvedValue({
				amount: Decimal(200),
				extracts: [
					{
						id: "extract-123",
						value: Decimal(200),
						type: "DEPOSIT",
						applicationId: "application-123",
						createdAt: new Date()
					}
				]
			});
            
			
			const result = await serviceFilterApplication.execute({
				date: null,
				applicationId: null,
				type: null
			});


			expect(result.extracts.length).toBeGreaterThan(0);
		});
	});

});