import { Category, Prisma } from "@prisma/client";


export interface CategoryDatabaseInterface{
    
    create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category>
}