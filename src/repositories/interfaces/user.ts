import { User, Prisma } from "@prisma/client";


export interface UserDatabaseInterface{
    
    create(data: Prisma.UserCreateInput): Promise<User>

    findEmail(email: string): Promise<User | null>

    getById(userId: string): Promise<User | null>

    update(userId: string, data: Prisma.UserUncheckedUpdateInput): Promise<User>

    updateLimit(userId: string, limit: number, dueDay: number, closingDay: number): Promise<User>

    updatePassword(userId: string, password: string): Promise<User>
}