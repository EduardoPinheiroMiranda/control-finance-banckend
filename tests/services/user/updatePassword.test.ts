import { UserPrismaRepository } from "@/repositories/prisma/user";
import { UpdatePassword } from "@/services/user/updatePassword";
import { describe, expect, jest, it, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/user", () => {

	describe("#Update password", () => {

		let userRepository: UserPrismaRepository;
		let serviceUpdatePassword: UpdatePassword;
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
			serviceUpdatePassword = new UpdatePassword(
				userRepository
			);
		});

        
		it("will trigger an arror if the password is less than 8 characters.", async () => {

			await expect(
				serviceUpdatePassword.execute("user-123", "1234")
			).rejects.toThrowError("A senha tem que possuir 8 ou mais caracteres.");
		});

		it("will trigger an arror if there is a problem in the database.", async () => {
			await expect(
				serviceUpdatePassword.execute("invalid_id", "12345678")
			).rejects.toThrowError("Houve um problema para realizar a tarefa, tente novamente.");
		});

		it("check if the service is working.", async () => {

			jest.spyOn(userRepository, "updatePassword").mockResolvedValue(mockUser);
        

			const result = await serviceUpdatePassword.execute("user-123", "12345678");
        
			expect(result).toEqual({
				id: mockUser.id,
				name: mockUser.name,
				email: mockUser.email
			});
		});
	});
});
