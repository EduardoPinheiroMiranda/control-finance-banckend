import { DataValidationError } from "@/errors/custonErros";
import { UserPrismaRepository } from "@/repositories/prisma/user";
import { RegisterUsers } from "@/services/user/registerUser";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";
import { hash } from "bcrypt";


describe("service/user", () => {

	describe("#Register user", () => {

		let userRepository: UserPrismaRepository;
		let serviceRegisterUser: RegisterUsers;


		beforeEach(() => {
			userRepository = new UserPrismaRepository();
			serviceRegisterUser = new RegisterUsers(
				userRepository
			);
		});


		it("will trigger an error if the email is already exist.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue({
				id: "123",
				name: "Eduardo",
				email: "eduardo@gemail.com",
				avatar: null,
				balance: Decimal(1000),
				created_at: new Date(),
				updated_at: new Date(),
				due_day: 10,
				closing_day: 5,
				limit: Decimal(1000),
				password: await hash("1234", 12)
			});

			await expect(
				serviceRegisterUser.execute({
					name: "Pedro",
					email: "eduardo@gmail.com",
					password: "1234",
					limit: 1000,
					dueDay: 10,
					closeDay: 5,
				})
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will trigger an error if the due day is invalid.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(null);

			await expect(
				serviceRegisterUser.execute({
					name: "Pedro",
					email: "eduardo@gmail.com",
					password: "1234",
					limit: 1000,
					dueDay: 32,
					closeDay: 5,
				})
			).rejects.toBeInstanceOf(DataValidationError);

			await expect(
				serviceRegisterUser.execute({
					name: "Pedro",
					email: "eduardo@gmail.com",
					password: "1234",
					limit: 1000,
					dueDay: 0,
					closeDay: 5
				})
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will trigger an error if the limit is less than 100.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(null);

			await expect(
				serviceRegisterUser.execute({
					name: "Pedro",
					email: "eduardo@gmail.com",
					password: "1234",
					limit: 10,
					dueDay: 10,
					closeDay: 5,
				})
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("will trigger an error if the password is less than 8 characters.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(null);

			await expect(
				serviceRegisterUser.execute({
					name: "Pedro",
					email: "eduardo@gmail.com",
					password: "1234",
					limit: 1000,
					dueDay: 10,
					closeDay: 5,
				})
			).rejects.toBeInstanceOf(DataValidationError);
		});

		it("check if the user is registered.", async () => {

			jest.spyOn(userRepository, "findEmail").mockResolvedValue(null);
			jest.spyOn(userRepository, "create").mockResolvedValue({
				id: "123",
				name: "Eduardo",
				email: "eduardo@gmail.com",
				avatar: null,
				balance: Decimal(1000),
				created_at: new Date(),
				updated_at: new Date(),
				due_day: 10,
				closing_day: 5,
				limit: Decimal(1000),
				password: await hash("1234", 12)
			});


			const response = await serviceRegisterUser.execute({
				name: "Eduardo",
				email: "eduardo@gmail.com",
				password: "12345678",
				limit: 1000,
				dueDay: 10,
				closeDay: 5,
			});

			expect(response.email).toBe("eduardo@gmail.com");
		});
	});
});