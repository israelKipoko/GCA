import React, {useState} from 'react'
import backgroud from "../../../public/images/register_image.jpg";
import logo from "../../../public/icons/Mobeko_logo1.png"
import { router,usePage, Link } from '@inertiajs/react'
import { useTranslation } from "react-i18next"
import { ArrowRight, TriangleAlert, Loader, Info } from 'lucide-react';

function ForgotPassword() {

  const { errors } = usePage().props

  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e) {
      e.preventDefault();

       const data = {email};
       router.post('/Mobeko/reset-password', data, {
        preserveState: true,
        onStart: () => setLoading(true),   // when request starts
        onFinish: () => setLoading(false), // when request finishes (success or error)
        onSuccess: () => setIsSuccess(true),
        // onError: () => console.log("❌ Validation error"),
      });
    }
  return (
    <section>
           <img src={backgroud} alt="background-image" class="login_image"/>
           <section id="login_page" className="py-12 px-6">
               <section id="login_content" className="p-4 flex flex-col lg:flex-basis flex-wrap lg:gap-y-4 gap-y-9  justify-center items-center  w-fit">
                   <div className=" md:w-[450px] px-4  text-center flex flex-col justify-around text-[#fff] font-bold">
                       <div className=" rounded-[4px]  w-[200px] md:h-[40px] h-[50px] text-white w-fit mx-auto">
                           <img src={logo} className="w-full h-full object-contain" alt="logo"/>
                       </div>
                       <div className="full_overlay"></div>
                   </div>
                   <div className="bg-[#B1C9EF] px-4 py-6 rounded-[16px]">
                       <form name="form" onSubmit={handleSubmit} action="" method="POST" className="w-[300px] md:w-[350px]">
                           <header>
                               <h1 className=" font-bold mb-6 text-center md:text-xl text-[14px]">{t("Réinitialiser le mot de passe")}</h1>
                           </header>
                           <section>
                               <div className="mb-9 px-2">
                                   <label htmlFor="email" className='ml-1 text-[#262626] font-bold text-[14px]'>Email:</label>
                                   <div className="input_div">
                                       <input
                                           id='email'
                                           type="email"
                                           className="input focus:outline-none"
                                           name="email" 
                                           value={email}
                                           onChange={(e)=> setEmail(e.target.value)}
                                           placeholder="Entrez votre email"
                                           required/>
                                       <i className="fa-solid fa-user credentials_icons"></i>
                                       {errors.email && 
                                        <div className='flex ml-1 mt-1 text-destructive  items-center justify-center gap-x-1'>
                                            <TriangleAlert size={16}/>
                                            <p className="text-[14px] ">{errors.email}</p>
                                        </div>
                                        } 
                                       {isSuccess && (
                                        <div className="flex flex-col justify-center items-center gap-y-1 text-[14px] text-center bg-green-100 text-green-800 p-2 rounded-md mt-2">
                                            <Info />
                                            <p >{t("Votre demande de réinitialisation de mot de passe a été prise en compte.")}</p> 
                                            <p>{t("Veuillez vérifier votre boîte mail pour consulter votre nouveau mot de passe")}</p> 
                                        </div>
                                    )}
                                   </div>
                               </div>
                               <div className="mb-6 mx-auto w-fit">
                                   <button type="submit" value="Se connecter" className="w-[200px] text-center bg-[#006DA4] text-[#fff] flex flex-row items-center justify-center gap-x-1 font-bold transition-all duration-200 ease-in-out rounded-[4px] py-2 cursor-pointer px-4 hover:bg-[#004d74]">
                                      {loading?
                                      <Loader size={18} className="text-white animate-spin [animation-duration:2s]"/>
                                       :
                                       <span className='flex flex-row items-center justify-center gap-x-1 '>
                                        {t("Rénitialiser")} <ArrowRight size={18}/>
                                       </span>
                                      }
                                    </button>   
                               </div>
                           </section>
                       </form>
                   </div>
               </section>
           </section>
       </section>
  )
}

export default ForgotPassword