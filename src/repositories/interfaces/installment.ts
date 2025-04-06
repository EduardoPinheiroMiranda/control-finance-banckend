import { Installment, Prisma } from "@prisma/client";


export interface InstallmentDatabaseInterface{
    
    create(data: Prisma.InstallmentUncheckedCreateInput): Promise<Installment>
}