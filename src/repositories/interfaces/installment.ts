import { Installment, Prisma } from "@/generated/prisma/client";
import { InstallmentWithTotalInstallments } from "src/@types/prismaTypes";


export interface InstallmentDatabaseInterface{
    
    create(data: Prisma.InstallmentUncheckedCreateInput[]): Promise<Installment[]>

    delete(installmentId: string[]): Promise<number>

    getInstallmentsInOpen(shoppingId: string): Promise<Installment[]>

    payInstallments(invoiceId: string, installmentsToPay: string[]): Promise<InstallmentWithTotalInstallments[]>

    updateInstallment(InstallmentId: string, data: Prisma.InstallmentUncheckedUpdateInput): Promise<Installment>

}