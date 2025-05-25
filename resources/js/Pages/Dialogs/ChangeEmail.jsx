import React, { useEffect, useState,useRef } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { SlidersHorizontal, UserRoundCog, Users, SquareArrowUpRight, Camera } from "lucide-react"
import axios from 'axios';
import { Switch } from "../../../../components/ui/switch"
import { ScrollArea } from "../../../../components/ui/scroll-area";
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "../../../../components/ui/input-otp"
  import { cn } from "../../../../lib/utils";

const ChangeEmailDialog = ({ userEmail, openEmailDialod, setOpenEmailDialog }) =>{
   const [loading, setLoading] = useState(false);

   const [verificationCode, setVerificationCode] = useState("");
   const [verificationCodeeError, setVerificationCodeError] = useState(false);
   const [canEnterCodeVerification, setCanEnterCodeVerification] = useState(false);

   const [canEnterNewEmail, setCanEnterNewEmail] = useState(false);
   const [newEmail,setNewEmail] = useState("");
  
   const submitNewEmail = (e)=>{
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("newEmail", newEmail);

    axios.post("/Mobeko/verify-new-email", formData)
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


   const sendCodeVerification = () =>{
      setLoading(true);

        const formData = new FormData();
        formData.append("email", userEmail);

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

   const verifyVerificationCode = () =>{
    setLoading(true);

      const formData = new FormData();
      formData.append("code", verificationCode);

      axios.post("/Mobeko/verify-code", formData)
      .then(response => {
        setCanEnterCodeVerification(false);
        setCanEnterNewEmail(true);
      })
      .catch(error => {
          setVerificationCodeError(true);
          console.error("Upload failed:", error.message);
          setLoading(false);
      })
      .finally(() => {
          setLoading(false);
      });
    }
return (
    <Dialog open={openEmailDialod} onOpenChange={setOpenEmailDialog}>
          <DialogContent className="md:max-w-[350px] max-h-[400px] min-h-[200px]  border-none p-3">
            <DialogTitle className="text-white font-bold hidden">
            </DialogTitle>
                <form onSubmit={submitNewEmail} className='w-full flex flex-col items-center justify-center gap-y-4 '>
                    <h1 className='dark:text-white text-dark-secondary text-left text-[15px] text-center'>Votre e-mail actuel est <span className='font-bold underline'>{userEmail}</span>.
                      {canEnterCodeVerification?" Nous envons envoyé un code de vérification cet e-mail.":" Nous enverrons un code de vérification à cet e-mail."} 
                    </h1>
                    { canEnterCodeVerification && 
                     <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="password" className='dark:text-white text-dark-secondary  opacity-[0.8] text-[14px] mb-1'>Entrez le code de vérification:</label>
                         <div className="w-fit mx-auto">
                            <InputOTP 
                              maxLength={6}
                              value={verificationCode}
                              onChange={(value) =>{setVerificationCode(value)}}
                              >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator className='dark:text-white text-dark-secondary' />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                            {verificationCodeeError &&
                            <p className='dark:text-red-400 text-red-600 text-[14px]'>Le code de vérification entré est incorrecte!</p>}
                         </div>
                        
                      </div> }

                      {canEnterNewEmail && 
                        <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                          <label htmlFor="newEmail" className='dark:text-white text-dark-secondary opacity-[0.8]'>Nouveau Email:</label>
                          <input  
                              type="email"
                              className="custome_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                              id="newEmail"
                              name="newEmail"
                              value={newEmail}
                              onChange={(e)=> setNewEmail(e.target.value)}
                              placeholder="Entrez votre nouveau email"
                              autoComplete='off'
                              autoFocus/>
                      </div>}
                   {!canEnterNewEmail ? (
                      <button  disabled={loading} onClick={canEnterCodeVerification?verifyVerificationCode:sendCodeVerification} type="button" className=' w-full py-1.5 px-4 bg-[#356B8C] rounded-[4px] flex justify-center text-white text-[14px] font-bold'>
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
                              canEnterCodeVerification?"Vérifier":"Envoyer le code de verification"
                          )}
                      </button>):
                      (<button  disabled={loading}  type="submit" className=' w-full py-1.5 px-4 bg-[#356B8C] rounded-[4px] flex justify-center dark:text-white text-dark-secondary text-[14px] font-bold'>
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
                          "Changer d'Email"
                        )}
                  </button>
                      )}
                </form>
          </DialogContent>
    </Dialog>
)
}

export default ChangeEmailDialog