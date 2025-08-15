import React, {useState} from 'react'
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { cn } from '../../../../lib/utils'
import { useTranslation } from "react-i18next";
import axios from 'axios';
import wordIcon from "../../../../public/images/logos/docx_icon.svg";
import powerpointIcon from "../../../../public/images/logos/pptx.png";
import excelIcon from "../../../../public/images/logos/excel.png";
import pdfIcon from "../../../../public/images/icons/pdf-icon.png";


function Uploader({className,multiple=false, allowedFiles, files, setFiles}) {
    const { t, i18n } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [showProgress, setShowProgress] = useState();
  const [isFileUpoading, setIsFileUpoading] = useState(false);

    const uploadFile = (file,index) => {
      const formData = new FormData();
      formData.append('file', file);
      setShowProgress(true);
      axios.post('/cases/upload-file', formData, {
        onUploadProgress: ({loaded, total}) => {
          setFiles(prevFilesUploaded => {
            const newFiles = [...prevFilesUploaded];
            newFiles.forEach((file) => {
              if(file.loading != 100){
                file.loading = Math.floor((loaded / total) * 100);
              }
            })
            return newFiles;
          });
          if(loaded == total){
            setShowProgress(false)
          }
        },
      }).catch(console.log);
    };
  
const handleFileChange = (event) => {
    setIsFileUpoading(true);
    const newFiles = Array.from(event.target.files);
      const transformedData = newFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        loading: 0,
        url: file.type.startsWith("image/") 
            ? URL.createObjectURL(file) 
            : null
    }));
    setFiles((prevFilesUploaded) => [...prevFilesUploaded, ...transformedData]);

    newFiles.forEach((file, index) => {
      uploadFile(file, index); // Adjust index for new files
    });

  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setIsFileUpoading(true);
    const newFiles = Array.from(e.dataTransfer.files);
     const transformedData = newFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        loading: 0,
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
        <div className='w-full flex flex-col gap-y-1'>
            <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(`dark:text-white text-dark-secondary  flex items-center justify-center gap-x-1 w-full border border-dashed py-2 h-[80px] rounded-[4px] ${dragActive? "border-action ":" border-gray-400"}`, className)}>
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
                <label htmlFor="uploader" className='cursor-pointer'>
                   {t("or click to select")}
                </label>
            </div>
             {isFileUpoading && (
            <div className='mt-3'>
                <ScrollArea className='max-h-[400px] '>
                    <div className='flex flex-col gap-y-0.5'>                 
                        {files.map((file,index) =>(
                        <div key={index} className='flex flex-row gap-x-2 dark:text-white text-dark-secondary w-full py-2 px-2 bg-[#356B8C] rounded-[4px]'>
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
                                    file.type = "image" ?
                                        <img src={file.url} alt="file" className='w-full h-full object-contain '/>
                                    :
                                    <i class='bx bxs-file dark:text-white text-dark-secondary text-[20px]'></i>
                                    )
                                }
                            </div>
                            <div>
                                <h1 className='upload_file_name text-[15px]'>{file.name}</h1> 
                                <p className='text-[10px]'>{formatFileSize(file.size)}</p>
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