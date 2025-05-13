import { Prisma } from "@prisma/client";
import { InstallmentDatabaseInterface } from "../interfaces/installment";
import { prisma } from "@/libs/primsa";


export class InstallmentPrismaRepository implements InstallmentDatabaseInterface{

	async create(data: Prisma.InstallmentUncheckedCreateInput[]){
        
		const installments = await prisma.installment.createManyAndReturn({data});

		return installments;
	}

	async delete(installmentId: string[]){
		
		const installmentdDeleted = await prisma.installment.deleteMany({
			where: {
				id: {in: installmentId}
			}
		});

		return installmentdDeleted.count;
	}

	async getInstallmentsInOpen(shoppingId: string){
		
		const installments = await prisma.installment.findMany({
			where: {
				shopping_id: shoppingId,
				pay: false
			},
			orderBy: {
				due_date: "asc"
			}
		});

		return installments;
	}

	async payInstallments(invoiceId: string, installmentsToPay: string[]){
		
		const installmentsPaid = await prisma.installment.updateManyAndReturn({
			where: {
				id: { in: installmentsToPay},
				invoice_id: invoiceId
			},
			data: {
				pay: true
			},
			include: {
				shoppingId: {
					select: {
						total_installments: true
					}
				}
			}
		});

		return installmentsPaid;
	}

	async updateInstallment(InstallmentId: string, data: Prisma.InstallmentUncheckedUpdateInput){

		const installment = await prisma.installment.update({
			where: {
				id: InstallmentId
			},
			data
		});

		return installment;
	}
}