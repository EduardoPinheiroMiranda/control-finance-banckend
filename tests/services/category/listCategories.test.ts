import { ResourceNotFoud } from "@/errors/custonErros";
import { CategoryPrismaRepository } from "@/repositories/prisma/category";
import { ListCategories } from "@/services/category/listCategories";
import { describe, it, expect, jest, beforeEach } from "@jest/globals";


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
            
			jest.spyOn(categoryRepository, "getAllCategories").mockResolvedValue([]);

			await expect(
				serviceListCategories.execute(null)
			).rejects.toBeInstanceOf(ResourceNotFoud);
		});

		it("Categories is found.", async () => {
            
			const date = new Date();

			jest.spyOn(categoryRepository, "getAllCategories").mockResolvedValue([
				{
					id: "category-123",
					name: "laser",
					created_at: date,
					updated_at: date
				}
			]);


			const result = await serviceListCategories.execute(null);


			expect(result.length).toBe(1);
		});
	});
});