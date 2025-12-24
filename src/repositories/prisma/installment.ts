import { Prisma } from "@/generated/prisma/client";
import { InstallmentDatabaseInterface } from "../interfaces/installment";
import { prisma } from "@/libs/primsa";


export class InstallmentPrismaRepository implements InstallmentDatabaseInterface{

	async create(data: Prisma.InstallmentUncheckedCreateInput[]){
		return await prisma.installment.createManyAndReturn({data});
	}

	async delete(installmentId: string[]){

		const installmentdDeleted = await prisma.installment.deleteMany({
			where: { id: {in: installmentId} }
		});

		return installmentdDeleted.count;
	}

	async getInstallmentsInOpen(shoppingId: string){
		return await prisma.installment.findMany({
			where: { shoppingId: shoppingId, pay: false },
			orderBy: { dueDate: "asc" }
		});
	}

	async payInstallments(invoiceId: string, installmentsToPay: string[]){
		return await prisma.installment.updateManyAndReturn({
			where: {
				id: { in: installmentsToPay},
				invoiceId: invoiceId
			},
			data: { pay: true },
			include: {
				shopping: {
					select: { totalInstallments: true }
				}
			}
		});
	}

	async updateInstallment(InstallmentId: string, data: Prisma.InstallmentUncheckedUpdateInput){
		return await prisma.installment.update({
			where: { id: InstallmentId },
			data
		});
	}
}