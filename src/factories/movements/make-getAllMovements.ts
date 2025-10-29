import { MovementPrismaRepository } from "@/repositories/prisma/movements";
import { GetAllMovements } from "@/services/movement/getMovements";


export function makeGetAllMovements(){

	const movementRepository = new MovementPrismaRepository();
	const serviceGetAllMovements = new GetAllMovements(
		movementRepository
	);


	return serviceGetAllMovements;
}