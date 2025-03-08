import React from 'react';
import { useToast } from "../../hooks/use-toast";
import {CircleCheck, CircleX} from 'lucide-react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast"

export function Toaster() {
  const { toasts } = useToast()
  const shadow = {
    boxShadow: 'rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px',
  };
  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast  swipeDirection="bottom" key={id} {...props} style={shadow} className="rounded-[8px] border-none  text-white font-bold">
            <div className="flex flex-col gap-x-4 items-center w-full h-full">
            {title && <ToastTitle className='flex flex-row items-center justify-center gap-x-2 text-center font-bold'>
              {variant == "default"?  <CircleCheck  color={"#fff"} />: <CircleX color={"#fff"} />}
             
              {title}
              </ToastTitle>
            }
              {description && (
                <ToastDescription className='flex items-center text-center gap-1 text-[12px] font-light'>
                   {description}
                </ToastDescription>
              )}
            </div>
            {/* {action && <div></div> } */}
            {/* <ToastClose /> */}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
