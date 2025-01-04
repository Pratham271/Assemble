"use server"
import jwt from 'jsonwebtoken';
import prisma from '@/db';
import bcrypt from 'bcryptjs';

export async function verify(token:string){
   try {
    const verfified = jwt.verify(token,process.env.NEXTAUTH_SECRET || "")
    console.log(verfified)
    if(verfified){
        const username =  jwt.decode(token)
        return username;
    }
    else{
        return null;
    }
   } catch (error) {
        console.log(error)
        return null
   }
}

export async function signup(name:string, email:string, password:string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(user){
            // console.log("user already exists")
            return false
        }
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: await bcrypt.hash(password,10)
            }
        });
        console.log(newUser);
        return true
    } catch (error) {
        console.log(error);
        return false;
    }
}