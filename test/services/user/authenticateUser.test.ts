import { UserPrismaRepository } from "@/repositories/prisma/user";
import { AuthenticateUser } from "@/services/user/authenticateUser";
import { expect, it, jest } from "@jest/globals";
import { User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";


describe("Service --> user", () => {

	describe("# Authenticate user", () => {
		
		let userRepository: UserPrismaRepository;
		let serviceAuthenticateUser: AuthenticateUser;
		let user: User;


		beforeEach( async () => {
			userRepository = new UserPrismaRepository();
			serviceAuthenticateUser = new AuthenticateUser(
				userRepository
			);

			user = {
				name: "Eduardo",
				id: "123",
				email: "eduardo@gmail.com",
				password: await hash("123", 12),
				limit: new Decimal(1000),
				expired: 0,
				avatar: null,
				balance: new Decimal(500),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};

			jest.spyOn(
				userRepository,
				"findEmail"
			).mockResolvedValue(user);
		});


		it("trigger an error if the email is wrong", async () => {


			// jest.spyOn(userRepository,"findEmail").mockResolvedValue(null);

			await expect(
				 serviceAuthenticateUser.execute(
					"emailInvalid@gmail.com",
					"passwordInvalid"
				)
			).rejects.toThrow("Email ou senha inválidos.");
		});

		it("trigger an error if the password is wrong", async () => {
			
			await expect(
				serviceAuthenticateUser.execute(
					"eduardo@gmail.com",
					"passwordInvalid"
				)
			).rejects.toThrow("Email ou senha inválidos.");			
		});

		it("check if the user can log in", async () => {

			jest.spyOn(
				jwt,
				"sign"
			).mockImplementation(() => {
				return "token valid"; // Retorno simulado
			  });


			const response = {
				id: user.id,
				name: user.name,
				email: user.email,
				token: "token valid"
			};

			const service = await serviceAuthenticateUser.execute(
				"eduardo@gmail.com",
				"123"
			);
			
			expect(service).toEqual(response);
				
		});
	});
});
