import { User, Prisma } from "@prisma/client";


export interface UserDatabaseInterface{
    
    create(data: Prisma.UserCreateInput): Promise<User>
}