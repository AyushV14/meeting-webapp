"use client"

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from './ui/textarea'
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input'


const MeetingTypeList = () => {
  const router = useRouter();
  const { toast } = useToast()
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const { user }  = useUser()
  const client = useStreamVideoClient();
  const [values, setvalues] = useState({
    dateTime : new Date(),
    description : '',
    link : ''
  })
  const [callDetails, setcallDetails] = useState<Call>()

  const createMeeting = async () => {
    if(!client || !user) return;

    try {
      if(!values.dateTime){
        toast({
          title: "Please select a date and time",
        })
        return;
      }

      const id = crypto.randomUUID();
      const call= client.call('default', id);

      if(!call) throw new Error('Failed to create call')

      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting'

      await call.getOrCreate({
        data:{
          starts_at: startsAt,
          custom:{
            description
          }
        }
      })

      setcallDetails(call)

      if(!values.description){
        router.push(`/meeting/${call.id}`)

      }
      toast({
        title: "Meeting Created!",
      })

    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create Meeting",
      })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard
        img='/icons/add-meeting.svg'
        title='New Meeting'
        description='Start an Instant Meeting'
        handleClick={() => setMeetingState('isInstantMeeting')}
        className='bg-orange-1'
      />
      <HomeCard
        img='/icons/schedule.svg'
        title='Schedule Meeting'
        description='Plan your Meeting'
        handleClick={() => setMeetingState('isScheduleMeeting')}
        className='bg-blue-1'
      />
      <HomeCard
        img='/icons/recordings.svg'
        title='New Recordings'
        description='Check out your Recordings'
        handleClick={() => router.push('/recordings')}
        className='bg-purple-1'
      />
      <HomeCard
        img='/icons/join-meeting.svg'
        title='Join Meeting'
        description='Via Invitation'
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className='bg-yellow-1'
      />

      {!callDetails ? (
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
      >
        <div className='flex flex-col gap-2.5'>
          <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
          <Textarea 
            className='border-none bg-dark-2 '
            onChange={(e)=>{
              setvalues({...values , description:e.target.value})
            }}  
          />
        </div>
        <div className='flex w-full flex-col gap-2.5'>
          <label className='text-base text-normal leading-[22px] text-sky-200'>Select Date and Time:</label>
          <ReactDatePicker
            selected={values.dateTime}
            onChange={(date)=> setvalues({...values, dateTime: date!})}
            showTimeSelect
            timeFormat='HH:mm'
            timeIntervals={15}
            timeCaption='time'
            dateFormat='MMMM d,yyyy h:mm aa'
            className='w-full rounded bg-dark-2 focus:outline-none p-3'
          />
        </div>
      </MeetingModal>
      ) : (
        <MeetingModal
        isOpen={meetingState === 'isScheduleMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Meeting Created"
        className="text-center"
        handleClick={()=>{
          navigator.clipboard.writeText(meetingLink)
          toast({ title: 'Link Copied'})
        } }
        image='/icons/checked.svg'
        buttonIcon='/icons/copy.svg'
        buttonText='Copy Meeting Link'
      />
      )}
      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link Meeting"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={()=> router.push(values.link)}
      >
        <Input
          placeholder='Meeting Link'
          className='border-none bg-dark-2 rounded'
          onChange={(e)=> setvalues({...values, link : e.target.value})}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList
