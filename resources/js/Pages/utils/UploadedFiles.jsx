import React from 'react'

function UploadedFiles({name, size, icon, url}) {
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
        <div className='w-[250px] flex flex-row items-center gap-x-2'>
            <div className='h-[50px] w-[40px] flex items-center justify-center'>
                {icon?
                <img src={icon} alt="file" className='w-[40px] h-full object-contain '/>
                :
                <i class='bx bxs-file dark:text-white text-dark-secondary text-[30px]'></i>
                }
            </div>
            <div>
                <h1 className='upload_file_name flex flex-wrap '>{name}</h1>
                <p className='text-[10px]'>{formatFileSize(size)}</p>
            </div> 
        </div>
        {url&&
            <div className='py-1 w-full  flex gap-x-2'>
                <a href={url} target='_blank' className='flex-1 flex justify-center w-full py-1.5 rounded-[4px] dark:bg-dark-hover bg-light-thirdly hover:dark:bg-[#d8d8d822] hover:bg-[#29292922] font-bold'>
                    Ouvrir
                </a>
                {/* <a href={url} target='_blank' className='flex-1 flex justify-center w-full py-1.5 rounded-[4px] dark:bg-dark-hover bg-light-hover hover:dark:bg-[#d8d8d822] hover:bg-[#29292922] font-bold'>
                    Télécharger
                </a> */}
            </div>
        }
    </section>
   
  )
}

export default UploadedFiles