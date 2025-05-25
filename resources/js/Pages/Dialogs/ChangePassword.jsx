import React, {useState} from 'react';
import { EyeOff, Eye } from "lucide-react";
import { useToast } from "../../../../hooks/use-toast"
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";

function ChangePassword({openPasswordDialog, setOpenPasswordDialog }) {
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeCurrentPassword, setSeeCurrentPassword] = useState(false);
  const [seeNewPassword, setSeeNewPassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    axios.post("/users/change-password", formData)
        .then(response => {
            setMessage(response.data.message);
            setOpenPasswordDialog(false);
            setLoading(false);
            toast({
                title: `Le mot de passe a été modifié avec succès!!`,
              })

        })
        .catch(error => {
            console.error("Upload failed:", error.message);
            setError(error.response?.data?.errors || "Something went wrong");
            setLoading(false);           
        })
        .finally(() => {
            setLoading(false);
        });
    };
  return (
    <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
        <DialogContent className="md:max-w-[450px] max-h-[500px] min-h-[200px] border-none p-3">
            <DialogTitle className="dark:text-white text-dark-secondary font-bold">Changer votre mot de passe</DialogTitle>
            <form onSubmit={handleSubmit} className='w-full flex flex-col items-center justify-center gap-y-4 '>
                <div className='flex flex-col gap-y-2 w-full'>
                    <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="current_password" className='dark:text-white text-dark-secondary  opacity-[0.8] text-[14px] mb-1'>Mot de passe actuel:</label>
                        <div className='relative w-full'>
                            <input
                            type={seeCurrentPassword?"text":"password"}
                            className="custome_input w-full focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                             name="current_password"
                            id="current_password"
                            value={formData.current_password}
                            onChange={handleChange}
                            placeholder="Entrez votre mot de passe actuel"
                            required
                            autoComplete='off'/>
                            <span onClick={()=>setSeeCurrentPassword(!seeCurrentPassword)} className='absolute top-1/2 -translate-y-1/2 right-2 text-light-hover cursor-pointer'>{seeCurrentPassword?<Eye/>:<EyeOff/>}</span>
                        </div>
                        {error && <p style={{ color: "red" }} className='text-[14px]'>{typeof error === "string" ? error : Object.values(error).join(", ")}</p>}
                    </div>     
                    <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="new_password" className='dark:text-white text-dark-secondary  opacity-[0.8] text-[14px] mb-1'>Nouveau mot de passe:</label>
                        <div className='relative w-full'>
                        <input
                           type={seeNewPassword?"text":"password"}
                            className="custome_input w-full focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                            name="new_password"
                            id="new_password"
                            value={formData.new_password}
                            onChange={handleChange}
                            placeholder="Entrez un nouveau mot de passe"
                            required
                            autoComplete='off'/>
                            <span onClick={()=>setSeeNewPassword(!seeNewPassword)} className='absolute top-1/2 -translate-y-1/2 right-2 text-light-hover cursor-pointer'>{seeNewPassword?<Eye/>:<EyeOff/>}</span>
                        </div>
                    </div> 
                    <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="new_password_confirmation" className='dark:text-white text-dark-secondary  opacity-[0.8] text-[14px] mb-1'>Confirmation:</label>
                        <div className='relative w-full'>
                            <input
                               type={seeConfirmPassword?"text":"password"}
                                className="custome_input w-full focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                                id="new_password_confirmation"
                                name="new_password_confirmation"
                                value={formData.new_password_confirmation}
                                onChange={handleChange}
                                placeholder="Confirmez le nouveau mot de passe"
                                required
                                autoComplete='off'/>
                            <span onClick={()=>setSeeConfirmPassword(!seeConfirmPassword)} className='absolute top-1/2 -translate-y-1/2 right-2 text-light-hover cursor-pointer'>{seeConfirmPassword?<Eye/>:<EyeOff/>}</span>
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
                          "Changer le mot de passe"
                        )}
                  </button> 
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default ChangePassword