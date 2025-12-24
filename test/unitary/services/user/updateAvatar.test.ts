import { UserPrismaRepository } from "@/repositories/prisma/user/user";
import { UpdateAvatar } from "@/services/user/updateAvatar";
import { describe, expect, vi, it, beforeEach } from "vitest";
import { Decimal } from "@prisma/client/runtime/library";


describe("service/user", () => {

	describe("#Update avatar", () => {

		let userRepository: UserPrismaRepository;
		let serviceUpdateAvatar: UpdateAvatar;
		const date = new Date();
		const mockUser = {
			id: "user-123",
			name: "eduardo",
			email: "test@gmail.com",
			password: "passwordHased",
			dueDay: 10,
			closingDay: 5,
			limit: Decimal(1000),
			avatar: "avatarEduaro",
			createdAt: date,
			updatedAt: date
		};


		beforeEach(() => {
            
			userRepository = new UserPrismaRepository();
			serviceUpdateAvatar = new UpdateAvatar(
				userRepository
			);
		});

        
		

		it("will trigger an arror if there is a problem in the database.", async () => {
			await expect(
				serviceUpdateAvatar.execute("invalid_id", "AvatarEduardo")
			).rejects.toThrowError("Houve um problema para realizar a tarefa, tente novamente.");
		});

		it("check if the service is working.", async () => {
			
			vi.spyOn(userRepository, "update").mockResolvedValue(mockUser);
		

			const result = await serviceUpdateAvatar.execute("user-123", "avatarEduardo");
        
			expect(result).toEqual({
				id: mockUser.id,
				name: mockUser.name,
				email: mockUser.email,
				avatar: mockUser.avatar
			});
		});
	});
});
