import { InstallmentWithTotalInstallments } from "@/@types/prismaTypes";
import { Installment, Prisma } from "@prisma/client";


export interface InstallmentDatabaseInterface{
    
    create(data: Prisma.InstallmentUncheckedCreateInput[]): Promise<Installment[]>

    delete(installmentId: string[]): Promise<number>

    getInstallmentsInOpen(shoppingId: string): Promise<Installment[]>

    payInstallments(invoiceId: string, installmentsToPay: string[]): Promise<InstallmentWithTotalInstallments[]>

    updateInstallment(InstallmentId: string, data: Prisma.InstallmentUncheckedUpdateInput): Promise<Installment>

}