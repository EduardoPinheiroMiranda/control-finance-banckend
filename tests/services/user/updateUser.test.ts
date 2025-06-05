import { UserPrismaRepository } from "@/repositories/prisma/user";
import { UpdateUser } from "@/services/user/updateUser";
import { describe, expect, jest, it, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/user", () => {

	describe("#Update user", () => {

		let userRepository: UserPrismaRepository;
		let serviceUpdateUser: UpdateUser;
		const date = new Date();
		const mockUser1 = {
			id: "user-124",
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
		const mockUser2 = {
			id: "user-124",
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

        
		it("will trigger an arror if the email already exist.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(mockUser1);
			await expect(
				serviceUpdateUser.execute("user-123", "eduardo", "teste@gmail.com")
			).rejects.toThrowError("Este email já existe.");
		});

		it("will trigger an arror if there is a problem in the database.", async () => {
			await expect(
				serviceUpdateUser.execute("invalid_id", "eduardo", "teste@gmail.com")
			).rejects.toThrowError("Houve um problema para realizar a tarefa, tente novamente.");
		});

		it("If the email already exists, the data can be updated if the email already belongs to the user.", async () => {
			jest.spyOn(userRepository, "findEmail").mockResolvedValue(mockUser2);
			jest.spyOn(userRepository, "update").mockResolvedValue(mockUser2);

			const result = await serviceUpdateUser.execute("user-124", "eduardo Pinheiro", "test@gmail.com");

			expect(result).toEqual({
				id: mockUser2.id,
				name: mockUser2.name,
				email: mockUser2.email,
				avatar: mockUser2.avatar
			});

		});

		it("check if the service is working.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(null);
			jest.spyOn(userRepository, "update").mockResolvedValue(mockUser1);
		

			const result = await serviceUpdateUser.execute("user-123", "eduardo", "test@test.com");
        
			expect(result).toEqual({
				id: mockUser1.id,
				name: mockUser1.name,
				email: mockUser1.email,
				avatar: mockUser1.avatar
			});
		});
	});
});
