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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../../../../components/ui/select";
import { useToast } from "../../../../hooks/use-toast";

const AddUser = ({ openAddUserDialog, setOpenAddUserDialog, dataRefresh }) =>{
   const [loading, setLoading] = useState(false);

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [role, setRole] = useState("Admin");

const [screenSize, setScreenSize] = useState({
        width: window.innerWidth - 25,
        height: window.innerHeight
    });

  const { toast } = useToast();
   const addUser = (e) =>{
        e.preventDefault();

      setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("role", role);

    axios.post("/members/add-new-member", formData)
    .then(response => {
        // refreshLayout();
        dataRefresh();
        setOpenAddUserDialog(false);
        setLoading(false);
        toast({
          variant: "default",
           title: `${name} est maintenant un membre!!`,
          });
    })
    .catch(error => {
      console.log(error)
        setLoading(false);
        toast({
           variant: "destructive",
            title: `${error.status == 422? "Cette adresse e-mail est déjà utilisée!":"Ooups! Une erreur est survenue!"}`,
           });
    })
    .finally(() => {
        setLoading(false);
    });
   }

   
return (
    <Dialog open={openAddUserDialog} onOpenChange={setOpenAddUserDialog}>
          <DialogContent className={`max-w-xs md:max-w-lg lg:max-w-[450px] max-h-[500px] min-h-[200px] border-none py-3 px-4`}>
            <DialogTitle className="dark:text-white text-dark-secondary font-bold ">
                Inviter un membre
            </DialogTitle>
            <form onSubmit={addUser} className='w-full flex flex-col items-center justify-center gap-y-4 '>
                <h1 className='dark:text-white text-dark-secondary text-left text-[15px] text-left'>
                    Le membre invité recevra un e-mail contenant ses informations de connexion.
                </h1>
                <div className='flex flex-col gap-y-2 w-full'>
                    <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="name" className='dark:text-white text-dark-secondary  opacity-[0.8] text-[14px] mb-1'>Nom:</label>
                        <input
                            type="text"
                            className="capitalize custome_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                            name="name"
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            placeholder="Entrez le nom du nouveau membre"
                            required
                            autoComplete='off'/>
                    </div>     
                    <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="email" className='dark:text-white text-dark-secondary  opacity-[0.8] text-[14px] mb-1'>Email:</label>
                        <input
                            type="email"
                            className="custome_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                            name="email"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            placeholder="Entrez l'addresse email du nouveau membre"
                            required
                            autoComplete='off'/>
                    </div> 
                    <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="role" className='dark:text-white text-dark-secondary  opacity-[0.8] text-[14px] mb-1'>Role:</label>
                        <Select value={role}  onValueChange={setRole} >
                            <SelectTrigger className="w-full dark:bg-[#d8d8d811] bg-[#29292922] transition-all hover:dark:bg-[#d8d8d833] opacity-[0.8] rounded-md outline-none focus:outline-none dark:text-white text-dark-secondary">
                                <SelectValue  placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent className=''>
                                <SelectItem value="Super-Admin" className='cursor-pointer max-w-[400px]  '>
                                    <h1 className='font-bold'>Administrateur</h1> 
                                </SelectItem>
                                <SelectItem value="Admin" className='cursor-pointer'>
                                    <h1 className='font-bold'>Gestionnaire</h1> 
                                </SelectItem>
                                <SelectItem value="user" className='cursor-pointer'>
                                    <h1 className='font-bold'>Simple utilisateur</h1> 
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <p className='text-[12px] italic dark:text-white text-dark-secondary'>
                            {role === "Super-Admin"?"*Dispose de tous les droits pour effectuer toute action sur Mobeko, sans restriction."
                            :role === "Admin"? "*Le Gestionnaire possède tous les droits de l'Administrateur, à l'exception de la création des clients."
                            :"*Ne peut pas créer de clients ni de dossiers et n'a pas la possibilité d'assigner des tâches."}
                        </p>
                    </div>
                </div>
                
                    <button  disabled={loading}  type="submit" className='my-1 mt-3 w-full py-1.5 px-4 bg-[#356B8C] rounded-[4px] flex justify-center text-white text-[14px] font-bold'>
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
                          "Ajouter"
                        )}
                  </button>
                </form>
          </DialogContent>
    </Dialog>
)
}

export default AddUser