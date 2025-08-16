import React, { useEffect, useState,useRef }  from 'react'
import { TriangleAlert } from "lucide-react"
import axios from 'axios';
import { useToast } from "../../../../hooks/use-toast";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";


interface NewMemberDialogsProps {
    groupId: any;  // Assuming userId is a number
    groupName: string,
    allMembers: any;
    openNewGroupMemberDialog: boolean;
    setOpenNewGroupMemberDialog: React.Dispatch<React.SetStateAction<boolean>>;
    dataRefresh: () => void;
  }
const NewGroupMember: React.FC<NewMemberDialogsProps> = ({ 
    groupId, 
    groupName,
    allMembers,
    openNewGroupMemberDialog, 
    setOpenNewGroupMemberDialog,
    dataRefresh
  }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const triggerRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLInputElement>(null);
    const [selectedOptions, setSelectedOptions] =useState<any[]>([]);
    const [filter, setFilter] = useState('');

    const [usersList, setUsersList] = useState(allMembers);

    const handleRemoveOption = (id: number) => {
      const removedUser = usersList.find((user: any) => user.id === id);

      if (!removedUser) {
          console.error(`User with id ${id} not found`);
          return; // Early exit if user is not found
      }
        setMembers([...members, removedUser]); 
        setSelectedOptions(selectedOptions.filter(option => option !== id));
  };

    const handleOptionClick = (id: number) => {
      // if (!selectedOptions.includes(value)) {
        setSelectedOptions([...selectedOptions, id]);
        setMembers(usersList.filter((user: any) => user.id !== id));
      // }
    };

      const addMember = (e: React.FormEvent) =>{
          e.preventDefault();

         if(selectedOptions.length == 0 )
          return;

          setLoading(true);
    
          const formData = new FormData();
          formData.append("groupId", groupId);
          formData.append("newMembers", JSON.stringify(selectedOptions));
       
           axios.post('/groups/add-new-member', formData)
           .then(response => {
            setLoading(false);
            
             dataRefresh();
              //  toast({
              //    variant: "default",
              //    title: `le groupe "${groupName}" a été supprimé!!`,
              //  })
           })
           .catch(error => {
              setLoading(false);
                  toast({
                    variant: "destructive",
                     title: `Vous n'êtes pas autorisé à effectuer cette opération.`,
                });
           });
       }

       const handleDocumentClick = (e: MouseEvent) => {
        if (
          triggerRef.current &&
          optionsRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          !optionsRef.current.contains(e.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };
       
    useEffect(() => {
      if(openNewGroupMemberDialog)
        setIsDropdownOpen(true);

      document.addEventListener('click', handleDocumentClick);
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }, []);
  return (
    <Dialog open={openNewGroupMemberDialog} onOpenChange={setOpenNewGroupMemberDialog}>
      <DialogContent className="max-w-xs md:max-w-lg lg:max-w-[450px] max-h-[500px] min-h-[230px] border-none p-6" autoFocus={false}>
          <DialogTitle className="dark:text-white text-dark-secondary font-bold ">
              Ajouter un nouveau membre
          </DialogTitle>
        <form onSubmit={addMember} className='w-full flex flex-col items-center justify-center gap-y-4 '>
          <input
            type="text" id='dummy' name='dummy' className='hidden'/>
                          
              <div className='flex flex-col gap-y-2 w-full'>
                <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                   <div className='custom-select w-full mx-auto'>
                      <div className="multiple-select input_div">
                      <label htmlFor="selected_participants" className='dark:text-white text-dark-secondary opacity-[0.8]'>Membres :</label>
                      <div className=" custome_input  w-full mx-auto  dark:bg-dark-primary bg-light-primary  dark:text-white text-dark-secondary ">
                        <div id='participants_badges_wrapper'>
                          <input
                            type="hidden"
                            id="participants"
                            required/>
                          <div id="participants_badges_wrapper">
                            {selectedOptions.map(value => {
                              const text = usersList.find((option: any) => option.id === value)?.name || value;
                              return (
                                <div key={value} data-value={value} className="participants border border-[#356B8C]">
                                  <span>{text}</span>
                                  <span onClick={() => handleRemoveOption(value)}>
                                  <i className="fa-solid fa-x font-bold text-white text-[10px] p-1 opacity-[0.7] rounded-full bg-[#356B8C]"></i>
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                        <input
                            ref={triggerRef}
                            id="selected_participants"
                            name='selected_participants'
                            className="dark:text-white text-dark-secondary dark:bg-dark-primary bg-light-primary participants_input focus:outline-none text-[14px] select-placeholder"
                            onFocus={() => setIsDropdownOpen(true)}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                               setIsDropdownOpen(true)
                              setFilter((e.currentTarget.value).toLowerCase());
                            }}
                            placeholder="Ajouter des membres" 
                            autoComplete='off'
                            autoFocus={false}
                            />
                      </div>
                    </div>
                        {isDropdownOpen && (
                          <section className='options dark:bg-dark-primary bg-light-primary'>
                            <ScrollArea ref={optionsRef}  className="z-10 p-1  w-full  rounded h-[150px] shadow open">
                              <div className=" p-1 open">
                                {allMembers
                                  .filter((option: any) => 
                                    option.name.toLowerCase().includes(filter) &&
                                    !selectedOptions.includes(option.id) // Exclude users already in selectedUsers
                                  )
                                  .map((option: any) => (
                                    <div
                                      key={option.id}
                                      className="option dark:text-white text-dark-secondary flex items-center border-b dark:border-dark-hover border-light-hover hover:dark:bg-dark-hover hover:bg-light-hover"
                                      data-value={option.id}
                                      onClick={() => handleOptionClick(option.id)}>
                                        <img src={option.avatar} alt="avatar" className='w-[35px] h-[35px] rounded-full' />
                                        <div className=''>
                                          <h1 className='capitalize'>{option.name}</h1>
                                          <span className='text-[12px] pl-2 opacity-[0.6]'>{option.email}</span>
                                        </div>
                                    </div>
                                  ))}
                              </div>
                              </ScrollArea>
                          </section>
                        )}
                      </div>
                    </div> 
                </div>
              </div>
                    
              <button  disabled={loading}  type="submit" className='my-1 mt-3 w-full py-1.5 px-4 bg-[#356B8C] rounded-[4px] flex justify-center text-white text-[14px] font-bold'>
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
            </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewGroupMember