import { Prisma } from "@prisma/client";
import { ExtractDatabaseInterface } from "../interfaces/extract";
import { prisma } from "@/libs/primsa";


export class ExtractPrismaRepository implements ExtractDatabaseInterface{

	async create(data: Prisma.ExtractUncheckedCreateInput){
        
		const extract = await prisma.extract.create({data});
		return extract;
	}
}