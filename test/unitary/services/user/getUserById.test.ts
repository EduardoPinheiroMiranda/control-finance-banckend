import { ResourceNotFound } from "@/errors/custonErros";
import { UserPrismaRepository } from "@/repositories/prisma/user/user";
import { GetUserById } from "@/services/user/getUserById";
import { describe, expect, vi, it, beforeEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/user", () => {

	describe("#Get user by id", () => {

		let userRepository: UserPrismaRepository;
		let serviceGetUserById: GetUserById;


		beforeEach(() => {
            
			userRepository = new UserPrismaRepository();
			serviceGetUserById = new GetUserById(
				userRepository
			);
		});

        
		it("Trigger an error if user is not found", async () => {
            
			vi.spyOn(userRepository, "getById").mockResolvedValue(null);

			await expect(
				serviceGetUserById.execute("invalidId")
			).rejects.toBeInstanceOf(ResourceNotFound);

		});

		it("check if the user was found", async () => {
            
			vi.spyOn(userRepository, "getById").mockResolvedValue({ 
				id: "123",
				name: "Eduardo",
				email: "eduardo@gemail.com",
				avatar: null,
				createdAt: new Date(),
				updatedAt: new Date(),
				dueDay: 10,
				closingDay: 5,
				limit: Decimal(1000),
				password: "passwordHashed"
			});


			const expected = {
				id: "123",
				name: "Eduardo",
				email: "eduardo@gemail.com",
				avatar: null,
				dueDay: 10,
				closeDay: 5,
				limit: Decimal(1000),
			};

			const response = await serviceGetUserById.execute("123");
			expect(response).toEqual(expected);

		});
	});
});
