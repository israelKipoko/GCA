import React, { useState,useEffect } from 'react'
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Plus, ChevronsRight, ChevronsLeft, Phone, MapPin, BriefcaseBusiness, SquareArrowOutUpRight } from "lucide-react";
import { cn } from "../../../../lib/utils";
import books from '../../../../public/images/books.png';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../../../components/ui/card"
import CountUp from "../utils/CounterUp";
import AnimatedContent from '../utils/AnimatedContent';
import axios from 'axios';
import CreateLibraryCategory from "../Dialogs/CreateLibraryCategory";
import { Link } from '@inertiajs/react';
import { Skeleton } from "../../../../components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";
function LibraryCategory() {
 const [openLibraryDialog,setOpenLibraryDialog] = useState();
 const [categories, setCategories] = useState([]);
 const [filteredData, setFilteredData] = useState([]); // shown on screen
 const [search, setSearch] = useState(""); // the search input
 const [refreshParent, setRefreshParent] = useState(0);
 const [pagination, setPagination] = useState({});
 const [currentPage, setCurrentPage] = useState(1);
 const [totalItems, setTotalItems] = useState(0);
 const [isDataLoading, setIsDataLoading] = useState(false);

   const dataRefresh = () => {
    setRefreshParent((oldKey) => oldKey + 1);
   };

   const [screenSize, setScreenSize] = useState({
           width: window.innerWidth - 25,
           height: window.innerHeight
       });
   var transformedData;
     async function getData(page) {
        try{
            setIsDataLoading(true);
            const response = await axios.get(`/home/library/get-all-categories?page=${page}`)
              transformedData = response.data.data.map(element => ({
                id:element.id,
                name: element.category_name,
                total: element.total_docs,
              }));
              setCategories(transformedData);
              setFilteredData(transformedData);
              setPagination({
                 current_page: response.data.current_page,
                 last_page: response.data.last_page,
              });
              setTotalItems(response.data.total);
            }catch(error){
              console.log(error);
            }finally{
                setIsDataLoading(false);
            }
       return transformedData
      }

    useEffect(() => {
        getData(currentPage);
    }, [refreshParent,currentPage]);
  return (
   <div className="w-full mx-auto  md:py-10 py-4">
    <div className="w-full  ">
        <div className="flex md:px-3 px-0 mb-2 md:justify-end justify-center gap-x-4 items-center ">
            <div className='md:w-fit w-full'>
                <Input
                placeholder="Trouver une categorie..."
                value={search}
                onChange={(event) => {
                    const value = event.target.value;
                    setSearch(value);
                    
                    const filtered = categories.filter(item =>
                    item.name.toLowerCase().includes(value.toLowerCase())
                    );
                    setFilteredData(filtered);
                }}
                className="md:w-[300px] w-full px-[30px]"
                />
            </div>
            <div className='md:flex  md:static absolute right-2 z-10 bottom-20 items-center gap-x-3'>
                <Dialog open={openLibraryDialog} onOpenChange={setOpenLibraryDialog}>
                    <DialogTrigger asChild>
                    <Button size="sm" className="py-2 px-2 bg-action  md:rounded-[4px] rounded-full md:w-fit w-12 md:h-fit h-12  flex flex-row gap-x-1 text-white font-bold">
                       <span className='md:flex hidden'> Créer une catégorie </span><Plus size={18}/>
                    </Button>
                    </DialogTrigger>
                    <DialogContent className={`md:w-[450px]  w-[${screenSize.width}px] border-none`}>
                        <DialogHeader>
                            <DialogTitle className="dark:text-white text-dark-secondary font-bold">Nouvelle Catégorie</DialogTitle>
                            <DialogDescription className="dark:text-white text-dark-secondary font-bold">
                                Comment souhaitez-vous nommer cette catégorie ?
                            </DialogDescription>
                        </DialogHeader>

                        <CreateLibraryCategory dataRefresh={dataRefresh} setOpenLibraryDialog={setOpenLibraryDialog}/>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
         {isDataLoading?
              <div  className='grid md:grid-cols-3 grid-cols-1 place-items-center gap-x-4 gap-y-6 my-6'>
                <Skeleton className="h-[100px] w-[350px] rounded-lg border" />
                <Skeleton className="h-[100px] w-[350px] rounded-lg border" />
                <Skeleton className="h-[100px] w-[350px] rounded-lg border" />
                <Skeleton className="h-[100px] w-[350px] rounded-lg border" />
                <Skeleton className="h-[100px] w-[350px] rounded-lg border" />
                <Skeleton className="h-[100px] w-[350px] rounded-lg border" />
              </div>
              :
            <div className=' grid md:grid-cols-3 grid-cols-1 place-items-center gap-x-4 gap-y-6 my-6'>
            
                {filteredData.map((category,index)=>(
                    // <AnimatedContent
                    // key={index}
                    // distance={100}
                    // direction="vertical"
                    // reverse={false}
                    // config={{ tension: 50, friction: 25 }}
                    // initialOpacity={0.2}
                    // animateOpacity
                    // scale={1.1}
                    // threshold={0.1}>
                    <Link href={`/home/library/show-category-documents/${category.id}`}>
                        <Card className='hover:cursor-pointer dark:bg-[#313131] bg-light-thirdly border-none py-2 relative overflow-hidden w-[350px]'>
                            <CardHeader className='px-2 '>
                                <CardTitle className='h-[30px] opacity-[0.8] font-bold md:text-[16px] text-[14px] capitalize dark:opacity-[0.8] dark:text-[#fff] text-dark-secondary'>
                                    {category.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className=" flex flex-col h-[80px] justify-end items-start px-6">
                                <div className='flex flex-col  items-start gap-x-1 w-fit'>
                                <CountUp
                                    from={0}
                                    to={category.total}
                                    separator=","
                                    direction="up"
                                    duration={1}
                                    className="count-up-text font-bold text-[25px] text-right dark:opacity-[0.8] dark:text-[#fff] text-dark-secondary"/>
                                    <p className='text-[12px] text-left dark:text-[#fff] text-dark-secondary opacity-[0.7] -mb-1'>Documents</p>
                                </div>
                            </CardContent>
                                <div className='h-[120px] absolute top-6 -right-6 z-10'>
                                    <img src={books} alt='books' className='w-full h-full object-contain '/>
                                </div>
                        </Card>
                    </Link>
                    // </AnimatedContent>
                )
                )
                }
            </div>
        }
            <div className='flex items-center justify-between md: px-9 px-6'>
                <div className='flex items-center gap-x-6'>
                    <button disabled={pagination.current_page === 1}  className='text-sm flex items-center dark:text-white text-dark-secondary ' onClick={() => setCurrentPage(--pagination.current_page)}><ChevronsLeft size={20}/>Précédent</button>
                    <button disabled={!(pagination.current_page === totalItems && pagination.current_page === pagination.last_page)}  className='text-sm flex items-center dark:text-white text-dark-secondary ' onClick={() => setCurrentPage(++pagination.current_page)}>Suivant<ChevronsRight size={20}/></button>
                </div>
                <div>
                    <h1 className='dark:text-white text-dark-secondary font-bold'>Total: {totalItems}</h1>
                </div>
            </div>
        </div>
   </div>
  )
}

export default LibraryCategory