import React, { useState,useEffect } from 'react'
import { Input } from "../../../../../components/ui/input";
import { Button } from "../../../../../components/ui/button";
import { Plus, ChevronsRight, ChevronsLeft, MoreVertical, Trash2, SquareArrowOutUpRight, Share, NotebookPenIcon } from "lucide-react";
import axios from 'axios';
import wordIcon from "../../../../../public/images/logos/docx_icon.svg";
import powerpointIcon from "../../../../../public/images/logos/pptx.png";
import excelIcon from "../../../../../public/images/logos/excel.png";
import CreateFile from "../../Dialogs/CreateFile";
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../../hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../../components/ui/dropdown-menu";

function LibraryCategory({libraryID}) {
 const [openCreateFileDialog,setOpenCreateFileDialog] = useState();
 const [files, setFiles] = useState([]);
 const [filteredData, setFilteredData] = useState([]); // shown on screen
 const [search, setSearch] = useState(""); // the search input
 const [pagination, setPagination] = useState({});
  const [refreshParent, setRefreshParent] = useState(0);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalItems, setTotalItems] = useState(0);
  const [mimeType, setMimeType] = useState(null);
  const [sortBy, setSortBy] = useState('file_name');
  const [sortOrder, setSortOrder] = useState('asc');

  const [isDeleting, setIsDeleting] = useState(false);

 const dataRefresh = () => {
     setRefreshParent((oldKey) => oldKey + 1);
    };
 
    const { t, i18n } = useTranslation();
    const { toast } = useToast();
    var transformedData;
    function getData(page) {
           axios.get(`/home/library/get-all-category-documents/${libraryID}`, {
            params: {
              search,
              mime_type: mimeType,
              sort_by: sortBy,
              sort_order: sortOrder,
              page
            }
          }).then(response => {
               transformedData = response.data.data.map(element => ({
                 id:element.id,
                 name: element.name,
                 type: element.mime_type,
                 size: element.size,
                 modification_date: element.updated_at,
                 url: element.original_url,
                 thumb_url: element.thumb_url,
                 total: element.total_docs,
               }));
               setFiles(transformedData);
               setFilteredData(transformedData);
               setPagination({
                  current_page: response.data.current_page,
                  last_page: response.data.last_page,
               });
               setTotalItems(response.data.total);
             })
             .catch(error => {
               console.log(error);
             });
        return transformedData
       }

    async function deleteDocument(documentId, documentName) {
        setIsDeleting(true);
        const formData = new FormData();
        formData.append("media_id", documentId);

       await axios.post(`/home/library/delete-document/${libraryID}`, formData)
        .then(()=>{
            dataRefresh();
            setIsDeleting(false);
            toast({
                variant: "default",
                title: `${documentName} a été suprimé!!`,
            });
        }).catch(()=>{
            setIsDeleting(false);
        })
       }
      const shareFile = async (name,url)=>{
        if (navigator.share) {
            await navigator.share({
              title: name,
              url,
            });
          } else {
            await navigator.clipboard.writeText(url);
            alert("Link copied to clipboard!");
          }
      }

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

      const formatDate = (isoDate, lang = 'en') => {
        const locale = lang === 'fr' ? fr : enUS;
      
        return format(new Date(isoDate), 'd MMMM yyyy', { locale });
      };

      const filterTitles = [
        {
            title: t("all"),
            value: null
        },
        {
            title: "Word",
            value: ["application/vnd.oasis.opendocument.text","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
        },
        {
            title: "PDF",
            value: ["application/pdf"],
        },
        {
            title: "Excel",
            value: ["application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
        },
      ]
      
     useEffect(() => {
         getData(currentPage);
     }, [refreshParent,currentPage,search, mimeType, sortBy, sortOrder]);
  return (
   <div className="container mx-auto py-10 ">
    <div className="w-full ">
        <div className="flex px-3 mb-2 justify-between gap-x-4 items-center">
            <div>
                <div className='flex flex-row gap-x-3'>
                    {filterTitles.map((filter,index)=>{
                        const isActive = JSON.stringify(mimeType) === JSON.stringify(filter.value);
                        return (
                        <button key={index} onClick={()=>setMimeType(filter.value)} className={`transition-all duration-300 transform border-2  font-medium py-1 px-4 hover:border-[#356B8C] dark:hover:text-[#356B8C] hover:text-[#356B8C] rounded-[16px] text-[14px]  ${isActive? "border-2 border-[#356B8C] dark:text-[#356B8C] text-[#356B8C]": "dark:text-white text-dark-secondary dark:border-dark-hover border-light-hover"}`}>
                            {filter.title}
                        </button>
                        );
                    })}
                </div>
            </div>
            <div className='flex px-3 mb-2 justify-center gap-x-4 items-center '>
                <Input
                placeholder={t("Trouver un document")}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-[300px] px-[30px]"/>
                <Dialog open={openCreateFileDialog} onOpenChange={setOpenCreateFileDialog}>
                    <DialogTrigger asChild>
                    <Button size="sm" className="py-1 px-2 bg-[#356B8C] rounded-[4px] flex flex-row gap-x-1 text-white font-bold">
                        {t("Ajouter")} <Plus size={13}/>
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[450px] border-none">
                        <DialogHeader>
                            {/* <DialogTitle className="dark:text-white text-dark-secondary font-bold">Nouveau Document</DialogTitle> */}
                            {/* <DialogDescription className="dark:text-white text-dark-secondary font-bold">
                                Comment souhaitez-vous nommer cette catégorie ?
                            </DialogDescription> */}
                        </DialogHeader>
                        <CreateFile refreshData={dataRefresh} setOpenCreateFileDialog={setOpenCreateFileDialog} libraryID={libraryID}/>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
            <div className=' flex flex-col gap-x-4 gap-y-3 my-6 px-4'>
                {files.length ?(
                files.map((file,index)=>(
                    <div key={index} className='hover:cursor-pointer w-full dark:bg-[#313131] bg-light-thirdly border-none py-2 relative overflow-hidden rounded-md'>
                        <div className='flex flex-row justify-between items-center px-2 dark:text-white text-dark-secondary'>
                            <div className='flex flex-row items-center justify-center gap-x-2'>
                                <div className='h-[50px] w-[40px] '>
                                    {
                                        file.type == "application/vnd.openxmlformats-officedocument.presentationml.presentation"  || file.type == "application/vnd.ms-powerpoint"?
                                            <img src={powerpointIcon} alt="file" className='w-full h-full object-contain '/>
                                        :
                                        (file.type == "application/pdf"?
                                            <img src={file.thumb_url} alt="file" className='w-full h-full object-contain '/>
                                            :
                                        file.type == "application/vnd.oasis.opendocument.text" || file.type == "application/msword" || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"?
                                            <img src={wordIcon} alt="file" className='w-full h-full object-contain '/>
                                        :
                                        file.type == "application/vnd.ms-excel" || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
                                            <img src={excelIcon} alt="file" className='w-full h-full object-contain '/>
                                        )
                                    }
                                </div>
                                <div className=' w-[250px]'>
                                    <h1 className='font-bold capitalize text-sm upload_file_name'>{file.name}</h1>
                                    <p className='opacity-[0.7] text-[13px]'>{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <div className='w-[150px]'>
                                <h1 className='font-bold capitalize text-[12px] opacity-[0.6] text-center'>Type</h1>
                                <p className=' text-[14px] upload_file_name text-center'>{file.type}</p>
                            </div>
                            <div>
                                <h1 className='font-bold capitalize text-[12px] opacity-[0.6] text-center'>{t("Dernière modification")}</h1>
                                <p className=' text-[14px] text-center'>{formatDate(file.modification_date)}</p>
                            </div>
                            <div className='flex items-center justift-center gap-x-3'>
                                <div>
                                    <a href={file.url} target='_blank' className='py-1 px-4 text-[14px] flex flez-row items-center gap-x-2 dark:bg-dark-hover bg-light-hover transition-all hover:dark:bg-[#d8d8d866] hover:bg-[#29292966] opacity-[0.8] rounded-[4px]'>
                                        {t("Open")} <SquareArrowOutUpRight size={15}/>
                                    </a>
                                </div>
                                <div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className='w-[130px]'>
                                            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                                            {/* <DropdownMenuItem className="font-bold">
                                            <BookUser /> Gestion du groupe
                                            </DropdownMenuItem> */}
                                            <DropdownMenuItem className="font-bold"  onClick={()=>shareFile(file.name,file.url)}>
                                                <Share /> {t("Partager")}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={()=>deleteDocument(file.id, file.name)} className="dark:text-[#D84444] text-red-600 font-bold text-center " >
                                            <Trash2/> {isDeleting ? (
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
                                            ) :  t("Supprimer")}
                                            </DropdownMenuItem>
                                            {/* <DropdownMenuItem>View payment details</DropdownMenuItem> */}
                                        </DropdownMenuContent>
                                        </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                )
                ): 
                <div>
                    <h1 className='text-center dark:text-white text-dark-secondary font-bold'>{t("Aucun document trouvé.")}</h1>
                </div>
                }
            </div>
            <div className='flex items-center justify-between px-6'>
                <div>
                    <h1 className='dark:text-white text-dark-secondary font-bold'>Total: {totalItems}</h1>
                </div>
                <div className='flex items-center gap-x-6'>
                    <button disabled={!(pagination.current_page === 1 && totalItems === 0)}  className='text-sm flex items-center dark:text-white text-dark-secondary ' onClick={() => setCurrentPage(--pagination.current_page)}><ChevronsLeft size={20}/>{t("Précédent")}</button>
                    <button disabled={!(pagination.current_page === totalItems && pagination.current_page === pagination.last_page)}  className='text-sm flex items-center dark:text-white text-dark-secondary ' onClick={() => setCurrentPage(++pagination.current_page)}>{t("Suivant")}<ChevronsRight size={20}/></button>
                </div>
            </div>
        </div>
   </div>
  )
}

export default LibraryCategory