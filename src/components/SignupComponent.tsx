'use client';
import React, { useEffect } from 'react'
import { signup, verify } from '@/actions/signup';
import { Toaster } from '@/components/ui/sonner';
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import Link from "next/link"

const formSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6, {
        message: "Password length should be greater than 6.",
    })
  
  })

const SignupComponent = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
        },
      })

    useEffect(()=> {
        async function verifyToken(){
            const token = searchParams.get("token")
            console.log(token)
            const username = await verify(token || "")
            console.log(username)
           
            if(username){
                // @ts-ignore
                setUsername(username.username)
            }
            else{
                router.push("/")
                toast('Link may have expired subscribe again', {
                    action: {
                  label: 'Close',
                  onClick: () => toast.dismiss(),
                },
              });
            }
        }
        verifyToken()
    },[])

    async function onSubmit(values: z.infer<typeof formSchema>){
        const res = await signup( values.name, username.trim(), values.password.trim())
        if(res===true){
          
          router.push("/signin")
          router.refresh()
        }
        else{
          alert("Error while signing you in")
        }
    }
  return (
    <>
         <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:w-4/5 space-y-4">
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input {...field} value={username} disabled/>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} value={username} disabled/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create Password</FormLabel>
              <FormControl>
                <div className="flex relative">
                    <Input placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;" {...field} type={showPassword?"text":"password"}/>
                    <button type="button" onClick={()=> setShowPassword(!showPassword)}>{showPassword?<EyeOpenIcon className="absolute right-2 top-2.5"/>:<EyeClosedIcon className="absolute right-2 top-2.5"/>}</button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!form.formState.isValid} type="submit" className="w-full">Signup</Button>
      </form>
    </Form>
    <p className="pt-5 items-center text-center lg:text-left lg:pl-36">Already an account? <Link href="/signin" className="text-gray-600 dark:text-gray-400 underline">Signin</Link></p>
    
      <Toaster />
    </>
  )
}

export default SignupComponent