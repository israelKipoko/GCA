import React, { useEffect, useState,useRef } from 'react'
import { TriangleAlert } from "lucide-react"
import axios from 'axios';
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";
  import { cn } from "../../../../lib/utils";

  interface ConfirmationProps {
    text: string; 
    actionLabel:string;
    action:any;
    open: boolean;
    loading: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
  

const Confirmation: React.FC<ConfirmationProps> = ({ 
    text, 
    action,
    actionLabel,
    open, 
    setOpen,
    loading,
  }) => {
   
return (
    <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="md:max-w-[450px] max-h-[500px] min-h-[200px] border-none p-3">
            <DialogTitle className="dark:text-white text-dark-secondary font-bold hidden">
            </DialogTitle>
            <form className='w-full flex flex-col items-center justify-center gap-y-4 '>
                <div className='flex flex-col gap-y-2 items-center mb-4'>
                    <TriangleAlert  className='dark:text-[#D84444] text-red-600' size={35} />
                    <h1 className='dark:text-white text-dark-secondary font-bold text-[15px]'>
                         Êtes-vous sûr de vouloir continuer?
                    </h1>
                    <h1 className='dark:text-white text-dark-secondary text-left text-[15px] text-center'>
                        {text}
                    </h1>
                </div>
                <div className='w-full flex flex-row gap-x-2'>
                  <button onClick={()=>setOpen(false)} type='button' className=' dark:bg-[#d8d8d844] bg-[#29292922] scalling-animation w-full py-1.5 px-4  rounded-[4px] flex justify-center font-bold text-[15px] dark:text-white text-dark-secondary '>Annuler</button>
                   <button onClick={action} disabled={loading}  type="button" className=' w-full py-1.5 px-4  bg-destructive scalling-animation rounded-[4px] flex justify-center text-white text-[15px] font-bold'>
                        {loading ? (
                          <>
                            <svg 
                              className="animate-spin h-5 w-5 text-white" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                            >
                              <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                              ></circle>
                              <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                              ></path>
                            </svg>
                          </>
                        ) : (
                          actionLabel
                        )}
                  </button>
                </div>
                   
                </form>
          </DialogContent>
    </Dialog>
)
}

export default Confirmation;