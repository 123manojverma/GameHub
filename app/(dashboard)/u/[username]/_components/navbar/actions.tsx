import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

export const Actions = async() => {
  return (
    <div className='flex items-center justify-end gap-x-2'>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground hover:text-primary"
          asChild
        >
            <Link href="/">
                <LogOut />
                Exit
            </Link>
        </Button>
        <UserButton>
          afterSignOutUrl=&quot;/&quot;
        </UserButton>
    </div>
  )
}
