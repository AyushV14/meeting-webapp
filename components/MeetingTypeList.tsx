"use client"

import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'

const MeetingTypeList = () => {
  const router = useRouter();
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
    } catch (error) {
      console.log(error);
      
    }
  }

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

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  )
}

export default MeetingTypeList
