import { columns } from "./groupsColumns"
import { DataTable } from "../goups/groupsDataTable"
import CreateGroup from "../../Dialogs/CreateGroup";

const GroupsTable = ({data, allUsers, openCreateGroup, setOpenCreateGroup, dataRefresh, refreshGroups, refreshLayout}) =>{
  return (
    <div className="w-full mx-auto py-10 ">
        <CreateGroup allUsers={allUsers} openCreateGroup={openCreateGroup} setOpenCreateGroup={setOpenCreateGroup} refreshLayout={refreshLayout} dataRefresh={dataRefresh} refreshGroups={refreshGroups}/>
        <DataTable columns={columns(dataRefresh, allUsers,refreshGroups)} data={data} dataRefresh={dataRefresh} refreshGroups={refreshGroups}/>
    </div>
  )
}

export default GroupsTable


