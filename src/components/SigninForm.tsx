'use client';
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
import { redirect, useRouter } from "next/navigation"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { signIn } from "next-auth/react"
import Spinner from "./ui/spinner";
 
const formSchema = z.object({
  email: z.string().email().min(1,{
    message: "Enter a valid username.",
  }),
  password: z.string().min(6, {
      message: "Password length should be greater than 6.",
  })

})

const SigninForm = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password: "",
        },
      })
    
    async function onSubmit(values: z.infer<typeof formSchema>){
        try {
          setLoading(true)
          const res = await signIn('credentials', {
            email: values.email.trim(),
            password: values.password.trim(),
            redirect: false
          })
          if(res?.status===200){
            router.push("/")
            router.refresh()
          }
          else{
            alert("Error while signing you in")
            setLoading(false)
          }
        } catch (error) {
          console.log(error)
          alert("Error while signing you in")
          setLoading(false)
        }
    }
  return (
    <>
      {/* <div className="mb-3 w-full lg:w-4/5 space-y-4">
        <Button
          
          variant={"secondary"}
          className="flex items-center justify-center space-x-2 w-full"
          // onClick={async () => await signIn('github', { callbackUrl: '/dashboard' })}
        >
          <FaGithub />
          <span>Signin with GitHub</span>
        </Button>
        <Button
          variant={"secondary"}
          className="flex items-center justify-center space-x-2 w-full"
          // onClick={async () => await signIn('github')}
        >
          <FcGoogle />
          <span>Signin with Google</span>
        </Button>
      </div> */}
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:w-4/5 space-y-4">
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
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
              <FormLabel>Password</FormLabel>
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
        <Button disabled={!form.formState.isValid} type={loading?"button":"submit"} className="w-full">{loading?<div className="my-3">
          <Spinner/>
        </div>:"Signin"}</Button>
      </form>
    </Form>
    </>
  )
}

export default SigninForm