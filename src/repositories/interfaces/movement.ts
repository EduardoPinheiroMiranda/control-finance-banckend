import { Movement, Prisma } from "@/generated/prisma/client";


export interface MovementDatabaseInterface {

    create(data: Prisma.MovementUncheckedCreateInput): Promise<Movement>

    getMovements(userId: string, cursor: number): Promise<Movement[]>
}