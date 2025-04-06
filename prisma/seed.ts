import { prisma } from "@/libs/primsa";


const seeds = {
	categories: [
		{ name: "eletronicos" },
		{ name: "supermercado" },
		{ name: "farmácia" },
		{ name: "açougue" },
		{ name: "academia" },
		{ name: "fastFood" },
		{ name: "restaurante" },
		{ name: "laser"}
	]
};

async function createSeeds(seeds: any) {

	await prisma.category.createMany({
		data: seeds.categories
	});

}

createSeeds(seeds);