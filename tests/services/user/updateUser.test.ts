import { UserPrismaRepository } from "@/repositories/prisma/user";
import { UpdateUser } from "@/services/user/updateUser";
import { describe, expect, jest, it, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/user", () => {

	describe("#Update user", () => {

		let userRepository: UserPrismaRepository;
		let serviceUpdateUser: UpdateUser;
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


		beforeEach(() => {
            
			userRepository = new UserPrismaRepository();
			serviceUpdateUser = new UpdateUser(
				userRepository
			);
		});

        
		it("will trigger an arror if the limit is less than 100.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(mockUser);
			await expect(
				serviceUpdateUser.execute("user-123", "eduardo", "teste@gmail.com")
			).rejects.toThrowError("Este email já existe.");
		});

		it("will trigger an arror if there is a problem in the database.", async () => {
			await expect(
				serviceUpdateUser.execute("invalid_id", "eduardo", "teste@gmail.com")
			).rejects.toThrowError("Houve um problema para realizar a tarefa, tente novamente.");
		});

		it("check if the service is working.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(null);
			jest.spyOn(userRepository, "update").mockResolvedValue(mockUser);
		

			const result = await serviceUpdateUser.execute("user-123", "eduardo", "test@test.com");
        
			expect(result).toEqual(mockUser);
		});
	});
});
