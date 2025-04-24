import { ResourceNotFoud } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { FilterAllApplications } from "@/services/application/filterApplications";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/Application", () => {

	describe("#Filter application", () => {
        
		let applicationRepository: ApplicationPrismaRepository;
		let serviceFilterApplication: FilterAllApplications;

		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			serviceFilterApplication = new FilterAllApplications(
				applicationRepository
			);
		});


		it("will trigger an error if the extract is not found.", async () => {
            
			jest.spyOn(applicationRepository, "filterApplications").mockResolvedValue({
				amount: Decimal(0),
				extracts: []
			});
            
			await expect(
				serviceFilterApplication.execute({
					date: null,
					institutionId: null,
					type: null
				})
			).rejects.toBeInstanceOf(ResourceNotFoud);
		});

		it("will trigger an error if the extract is not found.", async () => {
            
			jest.spyOn(applicationRepository, "filterApplications").mockResolvedValue({
				amount: Decimal(200),
				extracts: [
					{
						id: "extract-123",
						value: Decimal(200),
						type: "deposit",
						application_id: "application-123",
						created_at: new Date()
					}
				]
			});
            
			
			const result = await serviceFilterApplication.execute({
				date: null,
				institutionId: null,
				type: null
			});


			expect(result.extracts.length).toBeGreaterThan(0);
		});
	});

});