import { Prisma } from "@/generated/prisma/client";
import { ExtractDatabaseInterface } from "../interfaces/extract";
import { prisma } from "@/libs/primsa";


export class ExtractPrismaRepository implements ExtractDatabaseInterface{

	async create(data: Prisma.ExtractUncheckedCreateInput){
		return await prisma.extract.create({data});
	}
}