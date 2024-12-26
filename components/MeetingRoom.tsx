import { cn } from '@/lib/utils'
import { CallControls, CallingState, CallParticipantsList, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'


type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {

  const searchParams = useSearchParams();
  const ispersonalRoom = !!searchParams.get('personal')
  const router = useRouter()
  const [layout, setlayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setshowParticipants] = useState(false)
  
  const {useCallCallingState} = useCallStateHooks()
  const callingState = useCallCallingState();

  if(callingState !== CallingState.JOINED) return <Loader/>

  const CallLayout = () =>{
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout/>
      case 'speaker-right':
        return <SpeakerLayout participantsBarPosition='left' />
      default:
        return <SpeakerLayout participantsBarPosition='right' />
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center'>
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout/>
        </div>
        <div className={cn('h-[cal(100vh-86px)] hidden ml-2' , {'show-block': showParticipants})}>
          <CallParticipantsList  onClose={()=> setshowParticipants(false)}/>
        </div>
      </div> 

      <div className='fixed bottom-0 flex w-full flex-wrap justify-center items-center gap-5'>
        <CallControls onLeave={()=> router.push('/')}/>

        <DropdownMenu>
          <div className='flex items-center'>
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535d]'>
              <LayoutList size={20} className='text-white'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white rounded-xl'>
              {['Grid' , 'Speaker-Left' , 'Speaker-Right'].map((item , index) => (
                <div key={index}>
                  <DropdownMenuItem className='cursor-pointer' onClick={()=> setlayout(item.toLowerCase() as CallLayoutType)}>
                    {item}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className='border-dark-1' />
                </div>
              ))}
            </DropdownMenuContent>
          </div>
      </DropdownMenu>
      <CallStatsButton/>
      <button onClick={()=> setshowParticipants((prev)=> !prev)}>
        <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535d]'>
          <Users size={20} className='text-white'/>
        </div>
      </button>
      {!ispersonalRoom && <EndCallButton/>}
      </div>
    </section>
  )
}

export default MeetingRoom