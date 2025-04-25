import { Filter } from "@/@types/customTypes";
import { Application, Extract, Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export interface ApplicationDatabaseInterface{
    
    create(data: Prisma.ApplicationUncheckedCreateInput): Promise<Application>

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