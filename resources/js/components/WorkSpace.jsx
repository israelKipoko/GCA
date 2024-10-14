import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { Toaster } from "../../../components/ui/toaster"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip"

const WorkSpace = () =>{

  const textareaRef = useRef(null);
  function getMessages(){
    axios.get('cases/get-all-case-messages/{case}')
    .then(response => {
      transformedData = response.data[0].map(element => ({
        id:element.id,
        title: element.title,
        statut: element.status,
        client: element.client.name,
        dead_line: element.due_date,
        priority: element.priority,
        created_by: element.user.firstname +" "+ element.user.name,
        description: element.description,
        users: element.assigned_to,
      }));
     setData(transformedData);
    })
    .catch(error => {
      console.log('no')

    });
  }
  useEffect(() => {
    const textarea = textareaRef.current;

    const handleInput = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', handleInput);
    textarea.dispatchEvent(new Event('input'));

    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, []);

  return (
    <section className=" w-[550px]">
     <div>
      <div className='py-1 px-2' id='workspace_message_box_wrapper'>
        <div className='flex '>
            <div>
              <img src="" alt="avatar" />
            </div>
            <div className='message_box'>
              <p className='text-[15px] border w-fit py-1 px-2 rounded-[4px] text-[#fff]'>message</p>
            </div>
        </div>
        <div className='flex '>
            <div>
              <img src="" alt="avatar" />
            </div>
            <div className='message_box'>
              <p className='text-[15px] border w-fit py-1 px-2 rounded-[4px] text-[#fff]'>message</p>
            </div>
        </div>
      </div>
      <div className='mt-1'>
        <div className='relative'>
            <textarea  ref={textareaRef} type="text" className='auto_expand_textarea pr-6 h-[20px] w-full px-1 py-2 text-[15px] focus:outline-none text-[#fff] bg-[#313131] border-none' rows={1} placeholder='Type something'></textarea>
            <div className='absolute right-1 bottom-1 p-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <button><i class="fa-solid fa-paperclip text-[#fff]"></i></button>
                </TooltipTrigger>
                <TooltipContent className='bg-[#313131] border-none text-[#fff]'>
                  <p className='text-[12px]'>Attachez un document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </div>
        </div>
      </div>
     </div>
    </section>
  )
}

export default WorkSpace


