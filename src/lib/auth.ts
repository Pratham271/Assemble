import prisma from "@/db";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import { z } from "zod";
import { SignJWT, importJWK } from 'jose';

const schema = z.object({
    email: z.string().email().min(1),
    password: z.string().min(6)
})
const generateJWT = async (payload: any) => {
    const secret = process.env.JWT_SECRET_TOKEN || 'secret';
  
    const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
  
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('365d')
      .sign(jwk);
  
    return jwt;
};

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type:"email", placeholder: "john@gmail.com"},
                password: {label: "Password", type:"password"}
            },
            // @ts-ignore
            async authorize(credentials:any) {
                const parsedCredentials = schema.safeParse(credentials)
                if(!parsedCredentials.success){
                    return null
                }
                try {
                    const existingUser = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    });
                    if(existingUser){
                        const passwodValidation = await bcrypt.compare(credentials.password, existingUser.password!)
                        if(passwodValidation){
                            const jwt = await generateJWT({
                                id: existingUser.id,
                              });
                              await prisma.user.update({
                                where: {
                                  id: existingUser.id,
                                },
                                data: {
                                  token: jwt,
                                },
                              });
                  
                            return{
                                id: existingUser.id,
                                username: existingUser.email,
                                token: jwt
                            };
                        }
                        return null;
                    }
                    return null
                } catch (error) {
                    console.error(error)
                    
                }
                return null
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "secr3t",
    callbacks: {
        async session({ session, token}:any){
            if(session?.user){
            session.user.id = token.sub
            session.user.jwtToken = token.jwtToken;
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: token.sub
                }
            })
            session.user.name = existingUser?.email 
            }
            return session
        },
        jwt: async ({ user, token }: any) => {
            if (user) {
              token.uid = user.id;
              token.jwtToken = user.token;
            }
            return token;
          },
    },
    pages: {
        signIn: "/signin"
    }

}