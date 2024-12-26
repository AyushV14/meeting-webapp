"use client"

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const EndCallButton = () => {

    const router = useRouter()
    const call = useCall()
    const { useLocalParticipant } = useCallStateHooks()
    const loaclParticipant = useLocalParticipant();

    const isMeetingOnwer = loaclParticipant && call?.state.createdBy && loaclParticipant.userId === call.state.createdBy.id;

    if(!isMeetingOnwer) return null;


  return (
    <Button 
        onClick={async () =>{
            await call.endCall()
            router.push('/')
        }}
        className='bg-red-500 hover:bg-red-500 rounded-xl'
    >
        End call for everyone
    </Button>
  )
}

export default EndCallButton