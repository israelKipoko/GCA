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

const DeleteAccountDialog = ({ userId, openDeleteAccountDialog, setOpenDeleteAccountDialog }) =>{
   const [loading, setLoading] = useState(false);

   const deleteAccount = (e) =>{
        e.prevenDefault();

      setLoading(true);

        // const formData = new FormData();
        // formData.append("email", userEmail);

    axios.post("/Mobeko/send-verification-code", formData)
    .then(response => {
      setCanEnterCodeVerification(true);
    })
    .catch(error => {
        console.error("Upload failed:", error.message);
        setLoading(false);
    })
    .finally(() => {
        setLoading(false);
    });
   }

   
return (
    <Dialog open={openDeleteAccountDialog} onOpenChange={setOpenDeleteAccountDialog}>
          <DialogContent className="md:max-w-[450px] max-h-[500px] min-h-[200px] border-none p-3">
            <DialogTitle className="dark:text-white text-dark-secondary font-bold hidden">
            </DialogTitle>
            <form onSubmit={deleteAccount} className='w-full flex flex-col items-center justify-center gap-y-4 '>
                <div className='flex flex-col gap-y-2 items-center'>
                    <TriangleAlert  className='dark:text-[#D84444] text-red-600' size={35} />
                    <h1 className='dark:text-white text-dark-secondary text-left text-[15px] text-center'>
                        Cette action ne peut pas être annulée. Elle supprimera définitivement l'intégralité de votre compte et vous serez retiré de tous les dossiers partagés.
                    </h1>
                </div>
                       
                    <button  disabled={loading}  type="submit" className=' w-full py-1.5 px-4 dark:bg-[#D84444] bg-red-600 rounded-[4px] flex justify-center text-white text-[14px] font-bold'>
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
                          "Supprimer"
                        )}
                  </button>
                  <button onClick={()=>setOpenDeleteAccountDialog(false)} type='button' className=' dark:bg-[#d8d8d811] bg-[#29292922] w-full py-1.5 px-4  rounded-[4px] flex justify-center font-bold dark:text-white text-dark-secondary '>Annuler</button>
                </form>
          </DialogContent>
    </Dialog>
)
}

export default DeleteAccountDialog