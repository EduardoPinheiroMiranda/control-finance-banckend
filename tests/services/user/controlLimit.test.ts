import { UserPrismaRepository } from "@/repositories/prisma/user";
import { ControlLimit } from "@/services/user/controlLimit";
import { describe, expect, jest, it, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/user", () => {

	describe("#Control limit", () => {

		let userRepository: UserPrismaRepository;
		let serviceControlLimit: ControlLimit;


		beforeEach(() => {
            
			userRepository = new UserPrismaRepository();
			serviceControlLimit = new ControlLimit(
				userRepository
			);
		});

        
		it("will trigger an arror if the limit is less than 100.", async () => {
			await expect(
				serviceControlLimit.execute("user-123", 50, 10)
			).rejects.toThrowError("Verifique o valor do limite, ele não pode ser inferior a 100.");
		});

		it("will trigger an arror if the dueDate is invalid.", async () => {
			await expect(
				serviceControlLimit.execute("user-123", 150, 40)
			).rejects.toThrowError("Data informada invalida.");
		});

		it("will trigger an arror if there is a problem in the database.", async () => {
			await expect(
				serviceControlLimit.execute("user-123", 850, 10)
			).rejects.toThrowError("Houve um problema para realizar a tarefa, tente novamente.");
		});

		it("check if the service is working.", async () => {

			const date = new Date();
			const mockUser = {
				id: "user-123",
				name: "eduardo",
				email: "test@gmail.com",
				password: "passwordHased",
				due_day: 10,
				closing_day: 5,
				limit: Decimal(1000),
				avatar: null,
				created_at: date,
				updated_at: date
			};

			jest.spyOn(userRepository, "updateLimit").mockResolvedValue(mockUser);
		

			const result = await serviceControlLimit.execute("user-123", 1000, 10);
        
			expect(result).toEqual(mockUser);
		});
	});
});
