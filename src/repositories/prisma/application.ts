import { Prisma } from "@/generated/prisma/client";
import { ApplicationDatabaseInterface, Filter } from "../interfaces/application";
import { prisma } from "@/libs/primsa";


export class ApplicationPrismaRepository implements ApplicationDatabaseInterface{

	async create(data: Prisma.ApplicationUncheckedCreateInput){
		return await prisma.application.create({data});
	}

	async delete(applicationId: string){
		return await prisma.application.delete({ 
			where: { id: applicationId }
		});
	}

	async filterApplications(filter: Filter){

		const customWhere = {
			...(filter.type != null && {type: filter.type}),
			...(filter.date != null && {createdAt: {gte: new Date(filter.date)}}),
			...(filter.applicationId != null && {applicationId: filter.applicationId})
		};


		const [ extracts, amount] = await Promise.all([
			prisma.extract.findMany({
				where: customWhere,
				orderBy: { createdAt: "desc" }
			}),
			prisma.extract.aggregate({
				_sum: { value: true },
				where: customWhere
			})
		]);


		return {
			amount: amount._sum.value ?? Prisma.Decimal(0),
			extracts
		};
	}

	async getAllInfo(applicationId: string){
		return await prisma.application.findUnique({
			where: { id: applicationId },
			include: { extract: true }
		});
	}

	async getAllApllications(userId: string){

		const [ applications, sumOfValues ] = await Promise.all([
			await prisma.application.findMany({
				where:{ userId: userId },
			}),
			await prisma.application.aggregate({
				_sum:{ value: true },
				where: { userId: userId }
			})
		]);


		return {
			value: sumOfValues._sum.value ?? Prisma.Decimal(0),
			applications
		};
	}

	async getById(applicationId: string){
		return await prisma.application.findUnique({
			where: { id: applicationId }
		});
	}

	async update(applicationId: string, data: Prisma.ApplicationUncheckedUpdateInput){
		return await prisma.application.update({
			where: { id: applicationId },
			data
		});
	}
}