import { Extract, Prisma } from "@prisma/client";


export interface ExtractDatabaseInterface{
    
    create(data: Prisma.ExtractUncheckedCreateInput): Promise<Extract>
}