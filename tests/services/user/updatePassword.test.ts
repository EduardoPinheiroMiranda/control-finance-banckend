import { UserPrismaRepository } from "@/repositories/prisma/user";
import { UpdatePassword } from "@/services/user/updatePassword";
import { describe, expect, jest, it, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";
import * as Bcrypt from "bcrypt";


describe("service/user", () => {

	describe("#Update password", () => {

		let userRepository: UserPrismaRepository;
		let serviceUpdatePassword: UpdatePassword;
		const date = new Date();
		let mockUser = {
			id: "user-123",
			name: "eduardo",
			email: "test@gmail.com",
			password: "senhaAtual",
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
				serviceUpdatePassword.execute("user-123", "senha atual", "1234")
			).rejects.toThrowError("A nova senha tem que possuir 8 ou mais caracteres.");
		});

		it("will trigger an arror if the user is not found.", async () => {
			jest.spyOn(userRepository, "getById").mockResolvedValue(null);
			
			await expect(
				serviceUpdatePassword.execute("user-123", "senha atual", "12345678")
			).rejects.toThrowError("Usuário não encontrado.");
		});

		it("will trigger an arror if the password is not valid.", async () => {
			jest.spyOn(userRepository, "getById").mockResolvedValue(mockUser);
			
			await expect(
				serviceUpdatePassword.execute("user-123", "senha atual", "12345678")
			).rejects.toThrowError("Senha atual invalida");
		});


		it("check if the service is working.", async () => {
			mockUser.password = await Bcrypt.hash("senhaAtual", 12);
			jest.spyOn(userRepository, "getById").mockResolvedValue(mockUser);
			jest.spyOn(userRepository, "updatePassword").mockResolvedValue(mockUser);

			const result = await serviceUpdatePassword.execute("user-123", "senhaAtual", "12345678");
        
			expect(result).toEqual({
				id: mockUser.id,
				name: mockUser.name,
				email: mockUser.email
			});
		});
	});
});
