import React, {useRef, useState} from 'react'
import { FilePond, registerPlugin } from 'react-filepond';
import axios from 'axios'
import { useToast } from "../../../../hooks/use-toast";
// import { FilePondFile, FilePondInitialFile } from 'filepond';
import Uploader from '../utils/Uploader';

function CreateFile({refreshData,setOpenCreateFileDialog,libraryID}) {
    // const pondRef = useRef(null);
    // const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const [files, setFiles] = useState([]);
      const [loading, setLoading] = useState(false);

    //   const handleInit = () => {
    //     console.log('FilePond instance has initialized');
    // };

    //   const handleUpdateFiles = (fileItems) => {
    //     setFiles(fileItems.map(fileItem => fileItem.file));
    // };

     const { toast } = useToast();
    const CreateFiles = async(e)=>{
        e.preventDefault();
        if(files.length <= 0) return;

        setLoading(true);

        const fileLength = files.length;

        const formData = new FormData();
        formData.append("filesLength", fileLength);

         axios.post(`/home/library/create-documents/${libraryID}`, formData)
            .then(response => {
                refreshData();
                setOpenCreateFileDialog(false);
                //  toast({
                //      variant: "default",
                //       title: `Le document a été créé avec succès.`,
                //  });
            })
            .catch(error => {
                setLoading(false);
                toast({
                    variant: "destructive",
                     title: `Ooups! Une erreur est survenue!`,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    }
  return (
      <form onSubmit={CreateFiles} className=' border-none flex flex-col gap-y-6 myd-4'>
         <div className="input_div w-[400px] mx-auto">
            <label htmlFor="file" className='text-[14px] dark:text-white text-dark-secondary opacity-[0.8]'>Documents :</label>
          <Uploader multiple={true} files={files} setFiles={setFiles}/>
        </div>

        <div className=' w-full ml-auto'>
            <button  disabled={loading}  type="submit" className='w-full transition-transform duration-300 transform hover:scale-[1.035]  py-1.5 px-4 bg-action rounded-[4px] flex justify-center text-white text-[14px] font-bold'>
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
        </div>
     </form>
  )
}

export default CreateFile