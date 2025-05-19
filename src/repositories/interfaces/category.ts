import { Category, Prisma } from "@prisma/client";


export interface CategoryDatabaseInterface{
    
    createMany(data: Prisma.CategoryUncheckedCreateInput[]): Promise<Category[]>

    getAllCategories(cursor: string | null): Promise<Category[]>
}