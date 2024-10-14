import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import { Toaster } from "../../../components/ui/toaster"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip"

const WorkSpace = (caseId) =>{

  const [messages, setMessages] = useState([]);
  const textareaRef = useRef(null);
  var transformedData;
 
  function getMessages(){
    axios.get('/cases/get-all-case-messages/'+caseId.caseId)
    .then(response => {
      console.log(response.data[0])
      transformedData = response.data[0].map(element => ({
        id:element.id,
        comment: element.comments,
        date: element.created_at,
        name: element.user.firstname +" "+ element.user.name,
        avatar: element.user.avatar_link,
        files: element.media,
      }));
      setMessages(transformedData);
    })
    .catch(error => {
      console.log('no')

    });
  }
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshParent = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };
  useEffect(() => {

    getMessages();
    const textarea = textareaRef.current;

    const handleInput = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };

    textarea.addEventListener('input', handleInput);
    textarea.dispatchEvent(new Event('input'));

    return () => {
      textarea.removeEventListener('input', handleInput);
    };
  }, [refreshKey]);

  const [newMessage, setNewMessage] = useState('');

  const [isFileUpoading, setIsFileUpoading] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState([]);
  const [fileProgress, setFileProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  var allUploaded;

  const handleFileChange = (event) => {
    setIsFileUpoading(true);
    const files = Array.from(event.target.files);
    
    transformedData = files.map(file => ({
        name: file.name,
        size: file.size,
    }));
    setFilesUploaded((prevFilesUploaded) => [...prevFilesUploaded, ...transformedData]);

    files.forEach((file, index) => {
      uploadFile(file, index + files.length); // Adjust index for new files
    });
     allUploaded = filesUploaded.length > 0 && filesUploaded.every((file, index) => uploadStatus[index] === 'uploaded');

  };
  const uploadFile = (file, index) => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('/cases/upload-file/'+caseId.caseId, formData, {
      onUploadProgress: (progressEvent) => {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setFileProgress((prevProgress) => ({
          ...prevProgress,
          [index]: percentage,
        }));
      },
    })
    .then((response) => {
      setFileProgress((prevProgress) => ({
        ...prevProgress,
        [index]: 100,
      }));
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [index]: 'uploaded',
      }));
    })
    .catch((error) => {
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [index]: 'failed',
      }));
    });

  };
  const formatFileSize = (bytes) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  const handleKeyDown = (event) => {

    if (event.key === 'Enter') {
      event.preventDefault(); 
      if(newMessage != "" && filesUploaded.length == 0){
        axios.post('/cases/create-new-message/'+caseId.caseId,{
          newComment: newMessage,
        })
        .then(response => {
          refreshParent();
          setNewMessage('');
        })
        .catch(error => {
          console.log('Could not create new client')
        });
      }else if(filesUploaded.length != 0){
          axios.post('/cases/create-new-message/'+caseId.caseId,{
            newComment: newMessage,
            fileLength: filesUploaded.length,
          })
          .then(response => {
            refreshParent();
            setNewMessage('');
            setIsFileUpoading(false);
            setFilesUploaded([]);
            setFileProgress({});
            setUploadStatus({})
          })
          .catch(error => {
            console.log('Could not create new client')
          });
      }
    }
  };
  return (
    <section className=" w-[600px]">
     <div>
      <div className='py-1 px-2' id='workspace_message_box_wrapper'>
        {messages.map((message) =>(
            <div className='flex flex-wrap gap-x-1'>
              <div className='w-[30px] h-[30px]'>
                <img src={message.avatar} alt="avatar"className=" object-fit-contain rounded-full" />
              </div>
              <div className='message_box'>
                <p className='text-[15px]  w-fit py-1 px-2 rounded-[4px] text-[#fff]'>{message.comment}</p>
                <div className='flex gap-x-2'>
                  {message.files.map((file)=>(
                    <div>
                      <a className='w-[ h-[50px] p-2 bg-[#335b74] text-[#fff] text-[12px] upload_file_name rounded-[4px]' href={file.original_url} download={file.file_name}>{file.file_name}</a>
                    </div>
                    
                ))}
                </div>
               
              </div>
          </div>
        ))}
      </div>
      <div className='mt-2  bg-[#313131]'>
        {isFileUpoading && (
          <div className='flex gap-x-2 items-center p-2  overflow-scroll  border-b'>
              {filesUploaded.map((file,index) =>(
                <div className=' w-[140px] h-[50px] p-2 bg-[#335b74] rounded-[4px] relative'>
                   <h1 className='text-[#fff] text-[12px] upload_file_name'>{file.name}</h1>
                   <span className='text-[#fff] text-[11px]'>{formatFileSize(file.size)}</span>
                   {/* <progress value={fileProgress[index] || 0} max="100">{fileProgress[index] || 0}%</progress> */}
                </div>
              ))}
          </div>
          )}
        <div className='relative'>
            <textarea 
            value={newMessage}
            onKeyDown={handleKeyDown} 
            onChange={(e)=> setNewMessage(e.target.value)}
            ref={textareaRef} 
            type="text" 
            className='auto_expand_textarea pr-6 h-[20px] w-full px-1 py-2 text-[15px] focus:outline-none text-[#fff] bg-[#313131] border-none' rows={1} placeholder='Type something'></textarea>
            <div className='absolute right-1 bottom-1 p-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <label htmlFor='file' className='cursor-pointer'><i className="fa-solid fa-paperclip text-[#fff]"></i></label>
                    <input type="file" accept=".pdf, .doc, .docx, .xls, .xlsx .txt" name='file' id='file' multiple className='hidden' onChange={handleFileChange} />
                  </div>
                </TooltipTrigger>
                <TooltipContent className='bg-[#313131] border-none text-[#fff]'>
                  <p className='text-[12px]'>Attachez un document</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </div>
        </div>
      </div>
     </div>
    </section>
  )
}

export default WorkSpace


