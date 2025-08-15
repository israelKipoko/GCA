import React, { useState, } from 'react';
import { router,usePage } from '@inertiajs/react'
import backgroud from "../../../public/images/bg-image-1.avif";
import logo from "../../../public/icons/Mobeko_logo1.png"
import logoIcon from "../../../public/icons/mobeko_logo2.png"
import { ArrowRight } from 'lucide-react';
import { useTranslation } from "react-i18next"

const Login = () =>{
    const { errors } = usePage().props

    const { t, i18n } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [seePassword, setSeePassword] = useState(false);

function handleSubmit(e) {
    e.preventDefault()
    const data = {email,password};
    router.post('/authenticate/user', data)
    }
return (
    <section>
        <img src={backgroud} alt="background-image" class="login_image"/>
        <section id="login_page" className="py-12 px-6">
            <section id="login_content" className=" flex lg:flex-basis flex-wrap lg:gap-y-4 gap-y-9  justify-around md:w-[75%] w-full">
                <div className=" md:w-[450px] px-4  text-center flex flex-col justify-around text-[#fff] font-bold">
                    <div className=" rounded-[4px] md:w-[100px] w-[200px] md:h-[40px] h-[50px] text-white w-fit mx-auto">
                        <img src={logo} className="w-full h-full object-contain" alt="logo"/>
                    </div>
                    <div className="overlay"></div>
                    <div className="mb-[2px] md:block hidden">
                        <h1 className="text-[25px] text-left mb-5">{t("welcome")}</h1>
                        <p className="text-[14px] text-center">
                        {t("welcome text description")}
                        </p>
                    </div>
                </div>
                <div className="bg-[#B1C9EF] px-4 py-6 rounded-[16px]">
                    <form name="form" onSubmit={handleSubmit} action="" method="POST" className="min-w-[300px] md:min-w-[350px]">
                        <header>
                            <h1 className="uppercase font-bold mb-6 text-center md:text-xl text-[15px]">{t("login")}</h1>
                        </header>
                        <section>
                            <div className="mb-4 px-2">
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
                                    {errors.email && <p className="text-red-500 text-xs ml-1 mt-1">{errors.email}</p>} 
                                </div>
                            </div>
                            <div className="mb-6 px-2">
                            <label htmlFor="password" className='ml-1 text-[#262626] font-bold text-[14px]'>{t("Mot de passe")}:</label>
                                <div className="input_div">
                                    <input
                                    id="password"
                                    type={seePassword?"text":"password"}
                                    className="input focus:outline-none"
                                    name="password" 
                                    value={password}
                                    onChange={(e)=> setPassword(e.target.value)}
                                    placeholder="Entre votre mot de passe"
                                    required/>
                                    <button onClick={()=> setSeePassword(!seePassword)} type='button' className="password_eye" ><i title="montrer le mot de passe" className=" eye fa-solid fa-eye fa-lg text-[#9a9996]"></i></button>
                                    <i className="fa-solid fa-lock credentials_icons"></i>
                                </div>
                                {/* <p className="mt-2 text-[#000] transition-all ease-in-out hover:text-[#395556] md:text-lg text-[13px]"><a href="/forgot-password" className="text-[16px]" title={{__('public.réinitialiser mon mot de passe')}}>
                                    Mot de passe oublié'?</a></p> */}
                            </div>
                            
                            <div className="mb-6 mx-auto w-fit">
                                <button type="submit" value="Se connecter" className="w-[200px] text-center bg-[#006DA4] text-[#fff] flex flex-row items-center justify-center gap-x-1 font-bold transition-all duration-200 ease-in-out rounded-[4px] py-2 cursor-pointer px-4 hover:bg-[#004d74]">
                                    {t("to login")} <ArrowRight size={18}/>
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

export default Login