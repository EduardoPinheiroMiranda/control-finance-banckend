import { CategoryPrismaRepository } from "@/repositories/prisma/category";


const seeds = {
	categories: [
		{ name: "eletronicos" },
		{ name: "supermercado" },
		{ name: "farmácia" },
		{ name: "açougue" },
		{ name: "academia" },
		{ name: "fastFood" },
		{ name: "restaurante" },
		{ name: "laser"},
		{ name: "mecânico"},
		{ name: "viagem"},
		{ name: "despesas da casa"},
	],
};


async function createSeeds() {

	const categoryRepository = new CategoryPrismaRepository();
	await categoryRepository.createMany(seeds.categories);
}

createSeeds();