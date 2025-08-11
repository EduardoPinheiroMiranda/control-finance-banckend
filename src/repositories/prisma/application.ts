import { Prisma } from "@/generated/prisma/client";
import { ApplicationDatabaseInterface } from "../interfaces/application";
import { prisma } from "@/libs/primsa";
import { Decimal } from "@prisma/client/runtime/library";
import { Filter } from "src/@types/customTypes";


export class ApplicationPrismaRepository implements ApplicationDatabaseInterface{

	async create(data: Prisma.ApplicationUncheckedCreateInput){
        
		const application = await prisma.application.create({data});
		return application;
	}

	async delete(applicationId: string){
		
		const application = await prisma.application.delete({ 
			where: {
				id: applicationId
			}
		});

		return application;
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
			amount: amount._sum.value ?? Decimal(0),
			extracts
		};
	}

	async getAllInfo(applicationId: string){
		
		const application = await prisma.application.findUnique({
			where: {
				id: applicationId
			},
			include: {
				extract: true
			}
		});

		return application;
	}

	async getAllApllications(userId: string){

		const [ applications, sumOfValues ] = await Promise.all([
			await prisma.application.findMany({
				where:{
					userId: userId
				},
			}),
			await prisma.application.aggregate({
				_sum:{
					value: true
				},
				where: {
					userId: userId
				}
			})
		]);


		return {
			value: sumOfValues._sum.value ?? Decimal(0),
			applications
		};
	}

	async getById(applicationId: string){
		
		const application = await prisma.application.findUnique({
			where: {
				id: applicationId
			}
		});

		return application;
	}

	async update(applicationId: string, data: Prisma.ApplicationUncheckedUpdateInput){
		
		const application = await prisma.application.update({
			where: {
				id: applicationId
			},
			data
		});

		return application;
	}
}