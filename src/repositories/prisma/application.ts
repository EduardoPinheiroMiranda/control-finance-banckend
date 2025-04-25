import { Prisma } from "@prisma/client";
import { ApplicationDatabaseInterface } from "../interfaces/application";
import { prisma } from "@/libs/primsa";
import { Decimal } from "@prisma/client/runtime/library";
import { Filter } from "@/@types/customTypes";


export class ApplicationPrismaRepository implements ApplicationDatabaseInterface{

	async create(data: Prisma.ApplicationUncheckedCreateInput){
        
		const application = await prisma.application.create({data});
		return application;
	}

	async filterApplications(filter: Filter){

		const customWhere = {
			...(filter.type != null && {type: filter.type}),
			...(filter.date != null && {created_at: {gte: filter.date}}),
			...(filter.institutionId != null && {application_id: filter.institutionId})
		};


		const [ extracts, amount] = await Promise.all([
			prisma.extract.findMany({
				where: customWhere,
				orderBy: { created_at: "desc" }
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
					user_id: userId
				},
			}),
			await prisma.application.aggregate({
				_sum:{
					value: true
				},
				where: {
					user_id: userId
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