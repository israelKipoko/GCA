import React from 'react'
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../../../components/ui/tooltip";
function MultiSelect({users,groups}) {
  return (
    <div>
        {groups.length && (
        <div>
            <p className='text-[14px] dark:text-white text-dark-secondary bordker-b border-[#ffffff66] font-bold border-light-secondary'>Groupes</p>
            <div className=" p-1 open">
            {groups
                .filter(group => 
                group.name.toLowerCase().includes(filter) &&
                !selectedGroups.includes(group.id) // Exclude users already in selectedUsers
                )
                .map(group => (
                <div
                    key={group.id}
                    className="ml-1 option rounded dark:text-white text-dark-secondary flex -center hover:dark:bg-dark-hover hover:bg-light-hover"
                    data-value={group.id}
                    onClick={() => handleGroupClick(group.id)}>
                    <div className=''>
                        <h1 className='capitalize'>{group.name}</h1>
                        <div className='ml-2 text-[12px] p-1 flex flex-row'>
                        {group.members.map((user,index) =>(
                            <TooltipProvider key={index} >
                            <Tooltip >
                                <TooltipTrigger asChild className='cursor-pointer '>
                                    <div key={index} className="-ml-2 element_tooltip_container w-[25px] h-[25px] rounded-full">
                                        <img src={user.avatar_link} alt="user-profile" className=" rounded-full w-full h-full object-contain"/>
                                    </div>
                                </TooltipTrigger>
                            <TooltipContent className=' z-10'>
                                <p className='text-[12px]'>{user.firstname+" "+ user.name}</p>
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        ))}
                        </div>
                    </div>
                </div>
                ))}
            </div>
            <p className='text-[14px] dark:text-white text-dark-secondary border-b border-[#ffffff66] font-bold border-light-secondary'></p>
        </div>
        )}
        <div className=" p-1 open">
        {users
            .filter(option => 
            option.name.toLowerCase().includes(filter) &&
            !selectedOptions.includes(option.id) // Exclude users already in selectedUsers
            )
            .map(option => (
            <div
                key={option.id}
                className="option rounded dark:text-white text-dark-secondary flex -center hover:dark:bg-dark-hover hover:bg-light-hover"
                data-value={option.id}
                onClick={() => handleOptionClick(option.id)}>
                <img src={option.avatar} alt="avatar" className='w-[30px] h-[30px] rounded-full' />
                <div className=''>
                    <h1 className='capitalize'>{option.fullname}</h1>
                    <span className='text-[12px] pl-2 opacity-[0.6]'>{option.email}</span>
                </div>
            </div>
            ))}
        </div>
    </div>
  )
}

export default MultiSelect