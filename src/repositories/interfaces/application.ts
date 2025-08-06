import { Application, Prisma, Extract } from "@/generated/prisma/client";
import { Decimal } from "@/generated/prisma/runtime/library";
import { Filter } from "src/@types/customTypes";


export interface ApplicationDatabaseInterface{
    
    create(data: Prisma.ApplicationUncheckedCreateInput): Promise<Application>

    delete(applicationId: string): Promise<Application>

    filterApplications(filter: Filter): Promise<{
        amount: Decimal,
        extracts: Extract[]
    }>

    getAllInfo(applicationId: string): Promise<Prisma.ApplicationGetPayload<{
        include: {
            extract: true
        }
    }> | null>

    getAllApllications(userId: string): Promise<{
        value: Decimal,
        applications: Application[]
    }>

    getById(applicationId: string): Promise<Application | null >

    update(applicationId: string, data: Prisma.ApplicationUncheckedUpdateInput): Promise<Application>
}