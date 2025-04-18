import { Installment, Prisma } from "@prisma/client";


export interface InstallmentDatabaseInterface{
    
    create(data: Prisma.InstallmentUncheckedCreateInput[]): Promise<Installment[]>

    getInstallmentsInOpen(shoppingId: string): Promise<Installment[]>

    updateInstallment(InstallmentId: string, data: Prisma.InstallmentUncheckedUpdateInput): Promise<Installment>
    
}