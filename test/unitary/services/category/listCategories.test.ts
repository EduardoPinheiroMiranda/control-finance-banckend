import { ResourceNotFound } from "@/errors/custonErros";
import { CategoryPrismaRepository } from "@/repositories/prisma/category";
import { ListCategories } from "@/services/category/listCategories";
import { describe, it, expect, vi, beforeEach } from "vitest";


describe("service/categories", () => {

	describe("#List categories", () => {
        
		let categoryRepository: CategoryPrismaRepository;
		let serviceListCategories: ListCategories;


		beforeEach(() => {
			categoryRepository = new CategoryPrismaRepository();
			serviceListCategories = new ListCategories(
				categoryRepository
			);
		});


		it("will trigger an error if is not found categories.", async () => {
            
			vi.spyOn(categoryRepository, "getAllCategories").mockResolvedValue([]);

			await expect(
				serviceListCategories.execute(null)
			).rejects.toBeInstanceOf(ResourceNotFound);
		});

		it("Categories is found.", async () => {
            
			const date = new Date();

			vi.spyOn(categoryRepository, "getAllCategories").mockResolvedValue([
				{
					id: "category-123",
					name: "laser",
					createdAt: date,
					updatedAt: date
				}
			]);


			const result = await serviceListCategories.execute(null);


			expect(result.length).toBe(1);
		});
	});
});