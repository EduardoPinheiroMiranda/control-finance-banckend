import { Prisma, Extract } from "@/generated/prisma/client";


export interface ExtractDatabaseInterface{
    
    create(data: Prisma.ExtractUncheckedCreateInput): Promise<Extract>
}