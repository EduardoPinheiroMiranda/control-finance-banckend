import { DataValidationError } from "@/errors/custonErros";
import { ApplicationPrismaRepository } from "@/repositories/prisma/application";
import { RegisterApplication } from "@/services/application/registerApplication";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/application", () => {

	describe("#Register application", () => {
        
		let applicationRepository: ApplicationPrismaRepository;
		let serviceRegisterApplication: RegisterApplication;


		beforeEach(() => {
			applicationRepository = new ApplicationPrismaRepository();
			serviceRegisterApplication = new RegisterApplication(
				applicationRepository
			);
		});


		it("will trigger an error if the value is less than 0.", async () => {
            
            
			await expect(
				serviceRegisterApplication.execute(
					"user-123",
					{
						name: "Construi minha carreira",
						targetValue: 0,
						institution: "nubanck",
						colorApplication: "#4a4a4a",
						colorFont: "#121212",
						icon: "icon-1"
					}
				)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will trigger an error if the value is less than 0.", async () => {

			const mockApplication = {
				id: "application-123",
				name: "Construi minha carreira",
				target_value: Decimal(1100),
				value: Decimal(0),
				institution: "nubanck",
				color_application: "#4a4a4a",
				color_font: "#121212",
				icon: "icon-1",
				created_at: new Date(),
				updated_at: new Date(),
				user_id: "user-123"
			};
            
			jest.spyOn(applicationRepository, "create").mockResolvedValue(mockApplication);


			const result = await serviceRegisterApplication.execute(
				"user-123",
				{
					name: "Construi minha carreira",
					targetValue: 1100,
					institution: "nubanck",
					colorApplication: "#4a4a4a",
					colorFont: "#121212",
					icon: "icon-1"
				}
			);
            
			expect(result).toEqual(mockApplication);
		});
	});
});