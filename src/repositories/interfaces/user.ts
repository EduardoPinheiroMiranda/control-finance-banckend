import { User, Prisma } from "@prisma/client";


export interface UserDatabaseInterface{
    
    create(data: Prisma.UserCreateInput): Promise<User>

    findEmail(email: string): Promise<User | null>

    getById(userId: string): Promise<User | null>

    update(userId: string, name: string, email: string): Promise<User>

    updateLimit(userId: string, limit: number, dueDay: number): Promise<User>

}