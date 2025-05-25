import React, { useEffect, useState,useRef } from 'react'
import { TriangleAlert } from "lucide-react"
import axios from 'axios';
import { useToast } from "../../../../hooks/use-toast";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";
  import { cn } from "../../../../lib/utils";

  interface DeleteAccountDialogProps {
    userId: any;  // Assuming userId is a number
    userName:any;
    openDeleteAccountDialog: boolean;
    setOpenDeleteAccountDialog: React.Dispatch<React.SetStateAction<boolean>>;
    dataRefresh: () => void;
  }
  

const DeleteAccountDialog: React.FC<DeleteAccountDialogProps> = ({ 
    userId, 
    userName,
    openDeleteAccountDialog, 
    setOpenDeleteAccountDialog,
    dataRefresh
  }) => {
    const { toast } = useToast();
   const [loading, setLoading] = useState(false);
   const deleteAccount = (e: React.FormEvent) =>{
        e.preventDefault();

      const formData = new FormData();
       formData.append("userID", userId);
   
       setLoading(true);
       axios.post('/users/delete-member-account', formData)
       .then(response => {

        setLoading(false);

         dataRefresh();
          toast({
            variant: "default",
            title: `"${userName}" n'est plus un membre!!`,
          })
       })
       .catch(error => {
         console.log(error.message)
          setLoading(false);
             toast({
               variant: "destructive",
                title: `Vous n'êtes pas autorisé à effectuer cett opération.`,
           });
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
                    Ce compte sera définitivement supprimé, et l'utilisateur sera retiré de tous les dossiers partagés ainsi que de tous les groupes auxquels il appartenait.
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