import { Prisma } from "@prisma/client";
import { ApplicationDatabaseInterface } from "../interfaces/application";
import { prisma } from "@/libs/primsa";


export class ApplicationPrismaRepository implements ApplicationDatabaseInterface{

	async create(data: Prisma.ApplicationUncheckedCreateInput){
        
		const application = await prisma.application.create({data});
		return application;
	}
}