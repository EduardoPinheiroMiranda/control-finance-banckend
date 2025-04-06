import { UserPrismaRepository } from "@/repositories/prisma/user";
import { GetUserById } from "@/services/user/getUserById";
import { describe, expect, jest, it, beforeEach } from "@jest/globals";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/user", () => {

	describe("# Get user by id", () => {

		let userRepository: UserPrismaRepository;
		let serviceGetUserById: GetUserById;


		beforeEach(() => {
            
			userRepository = new UserPrismaRepository();
			serviceGetUserById = new GetUserById(
				userRepository
			);
		});

        
		it("Trigger an error if user is not found", async () => {
            
			jest.spyOn(userRepository, "getById").mockResolvedValue(null);

			await expect(
				serviceGetUserById.execute("invalidId")
			).rejects.toThrow("Usuário não encontrado.");

		});

		it("check if the user was found", async () => {
            
			jest.spyOn(userRepository, "getById").mockResolvedValue({ 
				id: "123",
				name: "Eduardo",
				email: "eduardo@gemail.com",
				avatar: null,
				balance: Decimal(1000),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
				expired: 10,
				limit: Decimal(1000),
				password: "passwordHashed"
			});


			const expected = {
				id: "123",
				name: "Eduardo",
				email: "eduardo@gemail.com",
				avatar: null,
				balance: Decimal(1000),
				expired: 10,
				limit: Decimal(1000),
			};

			const response = await serviceGetUserById.execute("123");
			expect(response).toEqual(expected);

		});
	});
});
