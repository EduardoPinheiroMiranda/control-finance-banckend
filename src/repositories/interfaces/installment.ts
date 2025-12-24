import { Installment, Prisma } from "@/generated/prisma/client";


export type InstallmentWithTotalInstallments = Prisma.InstallmentGetPayload<{
    include: {
        shopping: {
            select: { totalInstallments: true }
        }
    }
}>


export interface InstallmentDatabaseInterface{
    
    create(data: Prisma.InstallmentUncheckedCreateInput[]): Promise<Installment[]>

    delete(installmentId: string[]): Promise<number>

    getInstallmentsInOpen(shoppingId: string): Promise<Installment[]>

    payInstallments(invoiceId: string, installmentsToPay: string[]): Promise<InstallmentWithTotalInstallments[]>

    updateInstallment(InstallmentId: string, data: Prisma.InstallmentUncheckedUpdateInput): Promise<Installment>

}