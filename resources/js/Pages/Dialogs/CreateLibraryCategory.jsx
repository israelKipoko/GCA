import React, { useState } from 'react'
import axios from 'axios';
import { AlertTriangle } from "lucide-react";
import { useToast } from "../../../../hooks/use-toast";

function CreateLibraryCategory({dataRefresh,setOpenLibraryDialog}) {
    const [name, setName] = useState("");
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");
     const { toast } = useToast();

     const newLibraryCategory = (e)=>{
         e.preventDefault();
         
         setLoading(true);

         const formData = new FormData();
         formData.append("name", name);
     
         axios.post("/home/library/create-category", formData)
         .then(response => {
            dataRefresh();
            setOpenLibraryDialog(false);
            toast({
                variant: "default",
                title: `La catégorie "${name}" a été créée!!`,
            });
         })
         .catch(error => {
            if (error.response?.status === 422) {
                setError(error.response.data.errors.name?.[0]);
              } else {
                toast({
                    variant: "destructive",
                    title: `Ooups! Une erreur est survenue!`,
                })
              }
             setLoading(false);
         })
         .finally(() => {
             setLoading(false);
         });
        }
  return (
    <form onSubmit={newLibraryCategory} className=' border-none flex flex-col gap-y-6'>
        <div className='flex flex-col input_div mx-auto  w-full h-fit '>
            <label htmlFor="newEmail" className='dark:text-white text-dark-secondary opacity-[0.8]'>Nom:</label>
            <input  
                type="text"
                className="custome_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                id="name"
                name="name"
                value={name}
                onChange={(e)=> setName(e.target.value)}
                placeholder="Education,Pv,Histoires..."
                autoComplete='off'
                autoFocus
                required/>
                {error && <p className='text-sm dark:text-[#D84444] text-red-600 font-bold flex items-center gap-x-1 py-1'><AlertTriangle size={15}/>{error}</p>}
        </div>
        <div className='w-fit ml-auto'>
            <button  disabled={loading}  type="submit" className='ransition-transform duration-300 transform hover:scale-[1.035] w-[200px] py-1.5 px-4 bg-[#356B8C] rounded-[4px] flex justify-center text-white text-[14px] font-bold'>
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
                    "Créer la catégorie"
                )}
            </button>
        </div>
      
    </form>
  )
}

export default CreateLibraryCategory