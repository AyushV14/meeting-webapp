import React, { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';



interface MeetingModalProps {
    isOpen :boolean,
    onClose: ()=> void ,
    title: string,
    className ?: string ,
    children?: ReactNode,
    handleClick?: ()=> void;
    buttonText?: string,
    image?: string,
    buttonIcon?: string,
}

const MeetingModal = ({ isOpen , onClose , title , className , buttonText , handleClick , children , image, buttonIcon }: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 rounded-2xl text-white">
        <div className='flex flex-col gap-6 '>
          {image && (
            <div className='flex justify-center'>
              <Image 
                src={image}
                alt=''
                width={72}
                height={72}
              />
            </div>
          )}
          <DialogHeader>
          <DialogTitle className={cn('text-3xl font-bold leading-[42px]', className)}>
            {title}
          </DialogTitle>
          </DialogHeader>
              {children}
              <Button className='bg-blue-1 hover:bg-blue-900 rounded-xl' onClick={handleClick}>
                {buttonIcon && (
                  <Image
                    src={buttonIcon}
                    alt=''
                    width={13}
                    height={13}
                  />
                )} &nbsp;
                {buttonText || 'Schedule Meeting'}
              </Button>
            </div>
          
        
      </DialogContent>
    </Dialog>
  )
}

export default MeetingModal