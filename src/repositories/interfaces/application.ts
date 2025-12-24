import { Application, Prisma, Extract, TypeExtract } from "@/generated/prisma/client";
import { Decimal } from "@/generated/prisma/runtime/library";


export interface Filter{
    date: string | null,
    applicationId: string | null,
    type: TypeExtract | null
}

export interface ApplicationSummary{
    amount: Decimal,
    extracts: Extract[]
}

type ApplicationWithExtract = Prisma.ApplicationGetPayload<{
    include: { extract: true }
}>

export interface Applications {
    value: Decimal,
    applications: Application[]
}


export interface ApplicationDatabaseInterface{
    
    create(data: Prisma.ApplicationUncheckedCreateInput): Promise<Application>

    delete(applicationId: string): Promise<Application>

    filterApplications(filter: Filter): Promise<ApplicationSummary>

    getAllInfo(applicationId: string): Promise<ApplicationWithExtract | null>

    getAllApllications(userId: string): Promise<Applications>

    getById(applicationId: string): Promise<Application | null >

    update(applicationId: string, data: Prisma.ApplicationUncheckedUpdateInput): Promise<Application>
}