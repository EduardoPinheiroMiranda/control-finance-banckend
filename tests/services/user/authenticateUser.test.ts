import { DataValidationError } from "@/errors/custonErros";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { AuthenticateUser } from "@/services/user/authenticateUser";
import { expect, it, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";


describe("service/user", () => {

	describe("#Authenticate user", () => {
		
		let userRepository: UserPrismaRepository;
		let serviceAuthenticateUser: AuthenticateUser;


		beforeEach( async () => {
			userRepository = new UserPrismaRepository();
			serviceAuthenticateUser = new AuthenticateUser(
				userRepository
			);
		});


		it("trigger an error if the email is wrong", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(null);

			await expect(
				 serviceAuthenticateUser.execute(
					"emailInvalid@gmail.com",
					"passwordInvalid"
				)
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("trigger an error if the password is wrong", async () => {

			const date = new Date();
			const mockUser = {
				name: "Eduardo",
				id: "123",
				email: "eduardo@gmail.com",
				password: await hash("123", 12),
				limit: Decimal(1000),
				due_day: 10,
				closing_day: 5,
				avatar: null,
				created_at: date,
				updated_at: date,
			};
			jest.spyOn(userRepository, "findEmail").mockResolvedValue(mockUser);
			

			await expect(
				serviceAuthenticateUser.execute(
					"eduardo@gmail.com",
					"passwordInvalid"
				)
			).rejects.toBeInstanceOf(DataValidationError);			
		});

		it("check if the user can log in", async () => {

			const date = new Date();
			const mockUser = {
				name: "Eduardo",
				id: "123",
				email: "eduardo@gmail.com",
				password: await hash("123", 12),
				limit: Decimal(1000),
				due_day: 10,
				closing_day: 5,
				avatar: null,
				created_at: date,
				updated_at: date,
			};
			jest.spyOn(userRepository, "findEmail").mockResolvedValue(mockUser);

			jest.spyOn(jwt, "sign").mockImplementation(() => {
				return "token valid";
			});


			const expectedResponse = {
				id: mockUser.id,
				name: mockUser.name,
				email: mockUser.email,
				token: "token valid",
				avatar: mockUser.avatar
			};

			const response = await serviceAuthenticateUser.execute(
				"eduardo@gmail.com",
				"123"
			);
			
			expect(response).toEqual(expectedResponse);
		});
	});
});
