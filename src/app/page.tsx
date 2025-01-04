import Appbar from '@/components/Appbar'
import TaskManager from '@/components/TaskManager'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if(!session){
    redirect("/signin")
  }
  console.log(session.user.id)
  return (
    <main className="min-h-screen">
      <Appbar name={session.user.name}/>
      <TaskManager userId={session.user.id} name={session.user.name}/>
    </main>
  )
}

