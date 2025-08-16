import React, { useEffect, useState,useRef } from 'react'
import { TriangleAlert } from "lucide-react"
import axios from 'axios';
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { useToast } from "../../../../hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../../components/ui/dialog";

const CreateGroup = ({allUsers, openCreateGroup, setOpenCreateGroup, refreshLayout, dataRefresh,refreshGroups }) =>{
   const [loading, setLoading] = useState(false);

   const [name, setName] = useState("");
   const [members, setMembers] = useState([]);

   const [usersList, setUsersList] = useState(allUsers);
   const { toast } = useToast();
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const triggerRef = useRef(null);
   const optionsRef = useRef(null);
   const [selectedOptions, setSelectedOptions] = useState([]);
   const [filter, setFilter] = useState('');
const [screenSize, setScreenSize] = useState({
        width: window.innerWidth - 25,
        height: window.innerHeight
    });

   const handleRemoveOption = (id) => {
      const removedUser = usersList.find(user => user.id === id);

      if (!removedUser) {
          console.error(`User with id ${id} not found`);
          return; // Early exit if user is not found
      }
        setMembers([...members, removedUser]); 
        setSelectedOptions(selectedOptions.filter(option => option !== id));
  };

const handleOptionClick = (id) => {
  // if (!selectedOptions.includes(value)) {
    setSelectedOptions([...selectedOptions, id]);
    setMembers(usersList.filter(user => user.id !== id));
  // }
};

   const createGroup = (e) =>{
        e.preventDefault();

      setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("members", JSON.stringify(selectedOptions));

    axios.post("/groups/create-group", formData)
    .then(response => {
        // refreshLayout();
        refreshGroups();
        setOpenCreateGroup(false);
        toast({
          variant: "default",
          title: `Le groupe "${name}" a été créé!!`,
      });
    })
    .catch(error => {
      toast({
        variant: "destructive",
        title: `Ooups! Une erreur est survenue!`,
    });
        setLoading(false);
    })
    .finally(() => {
        setLoading(false);
    });
   }

   const handleDocumentClick = (e) => {
    if (
      triggerRef.current &&
      optionsRef.current &&
      !triggerRef.current.contains(e.target) &&
      !optionsRef.current.contains(e.target)
    ) {
      setIsDropdownOpen(false);
    }
  };

   
   useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);
return (
    <Dialog open={openCreateGroup} onOpenChange={setOpenCreateGroup}>
          <DialogContent className={`max-w-xs md:max-w-lg lg:max-w-[450px] max-h-[500px] min-h-[200px] border-none py-3 px-4`}>
            <DialogTitle className="dark:text-white text-dark-secondary font-bold ">
                Créer un groupe
            </DialogTitle>
            <form onSubmit={createGroup} className='w-full flex flex-col items-center justify-center gap-y-4 '>
                <h1 className='dark:text-white text-dark-secondary text-left text-[15px] text-left'>
                  Ajoutez des membres pour vivre pleinement l’expérience du travail collectif.
                </h1>
                <div className='flex flex-col gap-y-2 w-full'>
                    <div className='flex flex-col input_div mx-auto  w-full h-fit '>
                        <label htmlFor="name" className='dark:text-white text-dark-secondary  opacity-[0.8] text-[14px] mb-1'>Nom:</label>
                        <input
                            type="text"
                            className="custome_input focus:outline-none text-[14px] dark:bg-dark-primary bg-light-primary dark:text-white text-dark-secondary "
                            name="name"
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                            placeholder="Entrez le nom du groupe"
                            required
                            autoComplete='off'/>
                    </div>     
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
                              const text = usersList.find(option => option.id === value)?.name || value;
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
                            className="dark:text-white text-dark-secondary dark:bg-dark-primary bg-light-primary participants_input focus:outline-none text-[14px] select-placeholder"
                            onFocus={() => setIsDropdownOpen(true)}
                            onInput={(e) => setFilter((e.target).value.toLowerCase())}
                            placeholder="Ajouter des membres" autoComplete='off'/>
                      </div>
                    </div>
                        {isDropdownOpen && (
                          <section className='options dark:bg-dark-primary bg-light-primary'>
                            <ScrollArea ref={optionsRef}  className="z-10 p-1  w-full  rounded h-[150px] shadow open">
                              <div className=" p-1 open">
                                {allUsers
                                  .filter(option => 
                                    option.name.toLowerCase().includes(filter) &&
                                    !selectedOptions.includes(option.id) // Exclude users already in selectedUsers
                                  )
                                  .map(option => (
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

export default CreateGroup