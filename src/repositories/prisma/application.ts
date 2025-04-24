import { Prisma } from "@prisma/client";
import { ApplicationDatabaseInterface } from "../interfaces/application";
import { prisma } from "@/libs/primsa";
import { Decimal } from "@prisma/client/runtime/library";


export class ApplicationPrismaRepository implements ApplicationDatabaseInterface{

	async create(data: Prisma.ApplicationUncheckedCreateInput){
        
		const application = await prisma.application.create({data});
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
}