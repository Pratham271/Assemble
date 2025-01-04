'use client';
import React from 'react'

import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button';
import logout from '@/actions/logout';

const Logout = () => {
    const router = useRouter()
    const session = useSession()
    const name = session.data?.user?.email
  return (
    <div>
        <Button className="mr-4" onClick={async()=> {
            await logout(name || "")
            signOut()
            router.push("/")
        }}>Logout</Button>
    </div>
  )
}

export default Logout