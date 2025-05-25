import React from 'react'
import googleCalendarLogo from '../../../../public/icons/google-calendar.png';
import todoIcon from '../../../../public/icons/todo-icon.png';
import outlookCalendar from '../../../../public/images/logos/windows-calendar.png';
import googleDrive from '../../../../public/images/logos/google-drive.png';
import {RefreshCcw} from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { CircleCheckBig } from "lucide-react"
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../authConfigMicrosoft";

const Connections = ({ user,refreshParent }) => {
  const { instance } = useMsal();

  const MicrosoftLogin = async () => {
    try {
      const account = instance.getAllAccounts()[0];
      if (!account) {
        await instance.loginPopup(loginRequest);
      }
  
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: instance.getAllAccounts()[0],
      });
  
      // const accessToken = response.accessToken;
  
      await axios.get('/connections/api/auth/microsoft');
       refreshParent();
      // const result = await fetch('https://graph.microsoft.com/v1.0/me/todo/lists', {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
  
      // const data = await result.json();
      // setTasks(data.value);
    } catch (error) {
      console.error("Failed to silently acquire token:", error);
      // Fallback to login if silent fails (e.g., first time or token expired)
      const loginResponse = await instance.loginPopup(loginRequest);
      // const accessToken = loginResponse.accessToken;
  
      await axios.get('/connections/api/auth/microsoft');
      refreshParent();
      // const result = await fetch('https://graph.microsoft.com/v1.0/me/todo/lists', {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // });
  
      // const data = await result.json();
      // setTasks(data.value);
    }
  };

  const GoogleLogin = async () =>{

  }
  // const Googlelogin = useGoogleLogin({
  //   flow: 'auth-code',
  //   onSuccess: async (tokenResponse) => {
      
  //     // Example: Send the token to your backend for verification
  //     const response = await axios.post('/connections/api/auth/google', { token: tokenResponse.code });
  //     refreshParent();
  //   },
  //   onError: () => console.log('Login Failed'),
  // });
  const apps = [
    { 
        isConnected: user[0].googleCalendar,
        name: "Google Agenda", // Google Calendar ın english
        description: "Synchronisez vos événements Google Agenda avec Mobeko.",
        icon: googleCalendarLogo,
        function: GoogleLogin
    },
    { 
      isConnected: user[0].todo,
      name: "To-Do", // Google Calendar ın english
      description: "Les tâches créées sur Mobeko apparaîtront sur Microsoft To-Do, et vice versa.",
      icon: todoIcon,
      function: MicrosoftLogin
  },
  { 
    isConnected: user[0].microsoft_calendar,
    name: "Outlook Calendar", // Google Calendar ın english
    description: "Intégrez votre Outlook Calendar pour une gestion fluide de votre emploi du temps.",
    icon: outlookCalendar,
    function: MicrosoftLogin
  },
  { 
    isConnected: user[0].google_drive,
    name: "Google Drive", // Google Calendar ın english
    description: "Accédez et Gérer facilement à vos fichiers.",
    icon: googleDrive,
    function: GoogleLogin
  },
]




  return (
    <section>
      <div>
        <h1 className='font-bold opacity-[0.8] dark:text-white text-dark-secondary text-[20px]'>Mes Connections</h1>
        <p className='text-sm dark:text-white text-dark-secondary  opacity-[0.8]'>Mobeko peut interagir avec vos applications préférées. Intégrez-les Et découvrez une toute nouvelle expérience!</p>
      </div>
      <div className='mt-6 flex flex-row flex-wrap justify-evenly w-fit mx-auto gap-x-6 gap-y-9'>
        {apps.map((app,index)=>(
          <div key={index} className='shadow-lg flex flex-row gap-x-4  py-2 border-dark-secondary w-[320px] h-[170px] rounded-md '>
           <div className='flex flex-col justify-between '>
            <div className='flex items-center'>
                <div className='w-[65px] h-[60px] px-2'>
                  <img src={app.icon} alt="logo"  className='w-full h-full object-contain'/>
                </div>
                <h1 className='dark:text-white text-dark-secondary capitalize font-bold mb-'>{app.name}</h1>
            </div>
             <div className='px-2'>
              <p className='text-[14px] dark:text-white text-dark-secondary opacity-[0.8] w-fit leading-tight'>{app.description}</p>
              </div>
              {!app.isConnected ?
              <div className='w-fit ml-auto mt-4 px-2'>
                <button onClick={() => app.function()}  className=' bounceEffect w-[150px]  py-1.5 px-4 bg-[#356B8C] rounded-[4px] flex justify-center items-center gap-x-2 text-white text-[14px] font-bold'>Synchronisez <RefreshCcw  size={14}/></button>
              </div>
             :
             <div className='w-fit ml-auto my-1 mb-4 px-6'>
               <CircleCheckBig color='#00C951' size={32}/>
             </div>
             }
           </div>
        </div>   
        ))}
      </div>
    </section>
  )
}

export default Connections