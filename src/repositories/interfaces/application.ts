import { Application, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export interface ApplicationDatabaseInterface{
    
    create(data: Prisma.ApplicationUncheckedCreateInput): Promise<Application>

    getAllApllications(userId: string): Promise<{
        value: Decimal,
        applications: Application[]
    }>
}