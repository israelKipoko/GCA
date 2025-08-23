import React, {useState} from 'react'
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { cn } from '../../../../lib/utils'
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { Check,RotateCcw,CircleX, TriangleAlert } from 'lucide-react';
import wordIcon from "../../../../public/images/logos/docx_icon.svg";
import powerpointIcon from "../../../../public/images/logos/pptx.png";
import excelIcon from "../../../../public/images/logos/excel.png";
import pdfIcon from "../../../../public/images/icons/pdf-icon.png";
 import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../components/ui/tooltip";

function Uploader({className,multiple=false, allowedFiles, files, setFiles}) {
    const { t, i18n } = useTranslation();

  let maxFileUpload = 10;
  const [dragActive, setDragActive] = useState(false);
  const [showProgress, setShowProgress] = useState();
  const [isFileUpoading, setIsFileUpoading] = useState(false);
  const [isMouseOnLoader, setIsMouseOnloader] = useState(null);
  const [isUploadLimitReached, setIsUploadLimitReached] = useState("");
  const [fileCounter, setFileCounter] = useState(0);

    const uploadFile = (file,fileRetryIndex=null) => {
      const formData = new FormData();
      formData.append('file', file);
      console.log(fileCounter)

      setShowProgress(true);
      setIsUploadLimitReached("");

      let index = files.length;
        axios.post('/cases/upload-file', formData, {
          onUploadProgress: ({loaded, total}) => {
            setFiles(prevFilesUploaded => {
              const newFiles = [...prevFilesUploaded];
              newFiles.forEach((f) => {
                if(file.name == f.name){
                f.error = false;
                  if(f.loading != 100){
                    f.loading = Math.floor((loaded / total) * 100);
                  }
                }
              })
              return newFiles;
            });
            if(loaded == total){
              setShowProgress(false)
            }
          },
        }).catch((error) => {
        setFiles((prevFilesUploaded) => {
          const newFiles = [...prevFilesUploaded];
          if(fileRetryIndex == null){
            newFiles[index].error = true; // mark as error
            newFiles[index].loading = 0;      // reset progress
          }else{
            newFiles[fileRetryIndex].error = true; // mark as error
            newFiles[fileRetryIndex].loading = 0;      // reset progress
          }
          return newFiles;
        });

        setShowProgress(false);
      });;
     
    };

  const deleteUploaddFile = (file, indexToRemove) => {
    setIsMouseOnloader(null);
      const formData = new FormData();
      formData.append('file', file);  
      axios.post('/files/delete-uploaded-file', formData)
      .then((response) =>{
          setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
      }).catch((error)=>{
        console.log(error);
      })
  } 
const handleFileChange = (event) => {
  if(files.length <= (maxFileUpload - 1)){

    setIsFileUpoading(true);
    const newFiles = Array.from(event.target.files);
      const transformedData = newFiles.map(file => ({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        loading: 0,
        error: false,
        url: file.type.startsWith("image/") 
            ? URL.createObjectURL(file) 
            : null
    }));
    setFiles((prevFilesUploaded) => [...prevFilesUploaded, ...transformedData]);
    
    newFiles.forEach((file) => {
      uploadFile(file); // Adjust index for new files
    });
  }else{
      setIsUploadLimitReached("Vous ne pouvez pas ajouter plus de " + maxFileUpload + " fichiers.");
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setIsFileUpoading(true);
    const newFiles = Array.from(e.dataTransfer.files);
     const transformedData = newFiles.map(file => ({
        file: file,
        name: file.name,
        size: file.size,
        type: file.type,
        loading: 0,
        error: false,
        url: file.type.startsWith("image/") 
            ? URL.createObjectURL(file) 
            : null
    }));
    setFiles((prev) => [...prev, ...transformedData]);

      newFiles.forEach((file, index) => {
      uploadFile(file, index); // Adjust index for new files
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  
  const formatFileSize = (bytes) => {
    if(!bytes){
      return "";
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };
  return (
    <section className='w-full'>
        <div className='w-full flex flex-col gap-y-1 '>
            <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(`dark:text-white shadow-lg text-dark-secondary  md:text-[16px] text-[14px] flex items-center justify-center md:gap-x-1 w-full border border-dashed py-2 h-[80px] rounded-[4px] ${dragActive? "border-action ":" border-gray-400"}`, className)}>
                <p>{t("Drag & drop here")},</p>
                <input
                    type="file"
                    multiple={multiple}
                    accept={allowedFiles}
                    id="uploader"
                    name="uploader"
                    className='hidden'
                    onChange={handleFileChange}
                />
                <label htmlFor="uploader" className='underline cursor-pointer'>
                   {t("or click to select")}
                </label>
            </div>
             {isFileUpoading && (
            <div className='mt-3 w-full'>
                <ScrollArea className='max-h-[400px] w-full'>
                    <div className='flex flex-col gap-y-0.5 w-full '>    
                      <div className='px-2 flex flex-col gap-y-1'>
                       {
                       isUploadLimitReached !== ""&&
                       <div className='flex text-destructive  items-center justify-center gap-x-1'>
                          <TriangleAlert size={16}/>
                          <p className='text-[14px] text-center'>{isUploadLimitReached}</p>
                        </div>
                        }
                        <p className='font-bold dark:text-white text-dark-secondary text-right text-[14px]'>Fichiers téléchargés: {files.length}</p>
                      </div>
                        {files.map((file,index) =>(
                        <div  
                        onMouseEnter={()=>setIsMouseOnloader(index)} 
                        onMouseLeave={()=>setIsMouseOnloader(null)}  
                        // onTouchStart={() => setIsMouseOnloader(index)}
                        // onTouchEnd={() => setIsMouseOnloader(null)}     
                        key={index} className='flex flex-row cursor-pointer items-center justify-between dark:text-white text-dark-secondary w-full py-2 px-2 bg-[#356B8C] rounded-[4px]'>
                            <div className='flex items-center gap-x-2 '>
                              <div className='h-[40px] w-[30px] '>
                                      {
                                      file.type == "application/vnd.openxmlformats-officedocument.presentationml.presentation"  || file.type == "application/vnd.ms-powerpoint"?
                                          <img src={powerpointIcon} alt="file" className='w-[40px] h-full object-contain '/>
                                      :
                                      (file.type == "application/pdf"?
                                          <img src={pdfIcon} alt="file" className='w-full h-full object-contain '/>
                                          :
                                      file.type == "application/vnd.oasis.opendocument.text" || file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"?
                                          <img src={wordIcon} alt="file" className='w-[40px] h-full object-contain '/>
                                      :
                                      file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ?
                                          <img src={excelIcon} alt="file" className='w-[40px] h-full object-contain '/>
                                      :
                                    file.type.startsWith("image/") ? (
                                        <img src={file.url} alt="file" className="w-full h-full object-contain" />
                                      ) :
                                      <i class='bx bxs-file dark:text-white text-dark-secondary text-[20px]'></i>
                                      )
                                  }
                              </div>
                              <div className='text-white'>
                                  <h1 
                                  className='text-white upload_file_name text-[15px] md:w-[300px] w-[180px]'
                                   >
                                    {file.name}
                                  </h1> 
                                  <p className='text-[10px]'>{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <div className={`  shadow-md relative w-[40px] h-[40px]  ${file.error? "bg-destructive-secondary cursor-pointer":""}  flex items-center justify-center rounded-full overflow-hidden`}>
                                {file.loading == 100?
                                 isMouseOnLoader == index?
                                 <Tooltip>
                                  <TooltipProvider>
                                    <TooltipTrigger onClick={() => deleteUploaddFile(file.file, index)}  className='text-white absolute cursor-pointer z-10 font-bold text-[13px] p-1 rounded-full hover:text-dark-secondary hover:dark:bg-dark-hover hover:bg-light-hover'>
                                      <CircleX size={20}  />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                     <p>Annuler</p>
                                    </TooltipContent>
                                  </TooltipProvider>
                                 </Tooltip>
                                 :
                                 <Check size={16} className='absolute z-10 font-bold text-[13px] text-white'/>
                                :
                                file.error?
                                <div  onClick={() => uploadFile(file.file, index)}  className='text-white absolute cursor-pointer z-10 font-bold text-[13px] p-1 rounded-full hover:dark:bg-dark-hover hover:bg-light-hover'>
                                  <RotateCcw size={16}  />
                                </div>
                                :
                                <span className='absolute z-10 font-bold text-[12px] '>{file.loading || 0}%</span> 
                               }
                              <div className={`h-full w-full text-white  flex-1 rounded-full  ${file.loading == 100? "bg-green-700":"bg-blue-500"} transition-all`}
                                style={{ transform: `translateY(${100 - (file.loading || 0)}%)` }}>
                              </div>
                            </div>
                        </div>
                    ))}
                </div>
                </ScrollArea>
            </div>
            )}
        </div>
    </section>
  )
}

export default Uploader