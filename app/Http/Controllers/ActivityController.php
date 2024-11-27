<?php

namespace App\Http\Controllers;

use DateTime;
use App\Models\News;
use App\Models\Task;
use App\Models\User;
use App\Models\Cases;
use App\Models\Event;
use App\Models\Client;
use App\Events\Message;
use App\Models\Profiles;
use Spatie\PdfToImage\Pdf;
use App\Models\PendingCases;
use Illuminate\Http\Request;
use App\Models\TemporaryFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;
use Carbon\Carbon;

class ActivityController extends Controller
{
    public function showFolders(){
        $folders= Cases::with('user')->with('client')->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->latest('updated_at')->get();
        foreach ($folders as $folder){
            if($folder->user->hasMedia("profile")){
                $folder->user['avatar_link'] = $folder->user->getFirstMediaUrl();
            }else{
                $folder->user['avatar_link'] = asset('storage'.$folder->user->avatar);
            }
         }
         foreach ($folders as $folder){
            foreach($folder->assigned_to as $index=>$user){
                $assignedUser = User::find($user);
                if($assignedUser->hasMedia("profile")){
                    $folder->assigned_to[$index] = [
                        "avatar_link" => $assignedUser->getFirstMediaUrl(),
                        "name" => $assignedUser->firstname. " ".$assignedUser->name,
                    ];
                }else{
                    $t= $folder->assigned_to;
                    $t[$index] = [
                        "avatar_link" => asset('storage'.$assignedUser->avatar),
                        "name" => $assignedUser->firstname. " ".$assignedUser->name,
                    ];
                    $folder->assigned_to = $t;
                }
            }
         }
        return response()->json([$folders]);
    }
    function showPendingCases(){
        $folders= Cases::with('user')->with('client')->withCount('task')->where('status','pending')->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->latest('updated_at')->get();

        foreach($folders as $folder){
            $assignedTo = [];
            foreach ($folder->assigned_to as $id){
                $user = User::find($id);
                if($user->hasMedia("profile")){
                    $user['avatar_link'] = $user->getFirstMediaUrl();
                }else{
                    $user['avatar_link'] = asset('storage'.$user->avatar);
                }
                    $assignedTo[] = $user;
             }
             $folder->assigned_to = $assignedTo;
        }
        return response()->json([$folders]);
    }
    public function getUsers(){
        $users = User::whereNot('id',Auth::id())->get();
        foreach ($users as $user){
            if($user->hasMedia("profile")){
                $user['avatar_link'] = $user->getFirstMediaUrl();
            }else{
                $user['avatar_link'] = asset('storage'.$user->avatar);
            }
         }
         return response()->json([$users]);
    }
    public function getClients(){
        $clients = Client::all();
        foreach ($clients as $client){
            if($client->hasMedia("logo")){
                $client['logo_link'] = $client->getFirstMediaUrl();
            }else{
                $client['logo_link'] = null;
            }
         }
         return response()->json([$clients]);
    }
    public function newClient(Request $request){
        $client = Client::create([
            'name' => $request->input('createNewClient'),
            'sector' => 'undetermined',
            'location' => [
                'city' => "undetermined",
                'district' => "undetermined",
            ],
            'company_id' => 1,
        ]);
        $newClientId = $client->id;

        return response()->json(['id' => $newClientId]);
    }

    public function deleteCase(Request $request){
        $case = Cases::find($request->folderToDelete);
        $case->delete();

        return response()->json([201]);
    }
    public function showCaseDetails(Cases $case){

        $assigned_to;
        $hasMedia = false;
        foreach($case->assigned_to as $user){
            $assigned_to[] = User::with('profiles')->find($user);
        }
        $pendingCase = PendingCases::with("media")->where("id",$case->id)->get();
        foreach ($pendingCase as $item){
            if($item->hasMedia($case->number)){
                $hasMedia = true;
            }
         }
     return view("main.activities.case-details",[
        'case' => $case,
        'assigned_to' => $assigned_to,
        'pendingCase' => $pendingCase,
        'hasMedia' => $hasMedia,
     ]);
    }
    public function getAllCaseMessages(Cases $case){
        $messages = PendingCases::with('media')->with('user')->where('case_id',$case->id)->latest('created_at')->get();
        $users;
        foreach($case->assigned_to as $item){
            $user = User::find($item);
            if($user->hasMedia("profile")){
                $user['avatar_link'] = $user->getFirstMediaUrl('profile');
            }else{
                $user['avatar_link'] = asset('storage'.$user->avatar);
            }
            $users[] = $user;
        }
        if($messages != null){
            foreach ($messages as $message){
                if($message->user->hasMedia("profile")){
                    $message->user['avatar_link'] = $message->getFirstMediaUrl('profile');
                }else{
                    $message->user['avatar_link'] = asset('storage'.$message->user->avatar);
                }
                Carbon::setLocale('fr');
                $date = Carbon::createFromFormat('Y-m-d H:i:s', $message->created_at);
                 $difference =  $date->diffInDays(Carbon::now());
                 if ($difference < 6) {
                    if($difference <= 2){
                        $message['date'] =  $date->diffForHumans(['options' => Carbon::JUST_NOW | Carbon::ONE_DAY_WORDS]);
                    }else{
                        $message['date'] = $date->isoFormat('dddd');
                    }
                } else {
                    $message['date'] = $date->isoFormat('DD MMMM');
                }
             }
        }
        return response()->json([$messages,$users]);
    }
    public function createMessage(Cases $case,Request $request){
        $message = PendingCases::create([
            'case_id' => $case->id,
            'user_id' => Auth::id(),
            'comments' => $request->newComment,
        ]);
        if($request->input('fileLength') != 0){
            $files = TemporaryFile::take($request->input('fileLength'))->latest('created_at')->get();
            foreach($files as $file){
                $message->addMedia(public_path('/storage/'.$file->path))
                ->toMediaCollection($case->id, 'messages');
                Storage::delete('/temporary'.$file->path);
                $file->delete();
            }
        }
        broadcast(new Message());
        return response()->json([201]);
    }

    public function uploadFile(Request $request){
        if($request->hasFile('file')){
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $fileSize = $file->getSize();

                $filePath= $file->storeAs('temporary'.'/'.$fileName);
                TemporaryFile::create([
                    'user_id' => Auth::id(),
                    'name' => $fileName,
                    'path' => $filePath,
                    'size' => $fileSize,
                ]);
                return response()->json([201]);
            };
        }

    public function deleteUploadedFile(Cases $case){
        // $fileDetails = TemporaryFile::latest()->get();
        // foreach($fileDetails as $file){
        //     Storage::delete($file->path);
        //     $file->delete();
        // }
        // return response()->noContent();
    }

    public function submitCase(Request $request, Cases $case){
            $formFields['case_number'] = $case->number;
            $formFields['user_id'] = Auth::id();
            $formFields['action'] = "submit";
            PendingCases::create($formFields);
            $caseDetails = Cases::find($case->id);
            $caseDetails->status = "submitted";
            $caseDetails->save();
            notify()->success('Case submitted succesfully!');
            return redirect()->back();
    }

    /* CASE TASKS API */
    public function getAllTasks(Request $request, Cases $case){
        $tasks = Task::with('case')->where('case_id',$case->id)->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->orderByRaw("FIELD(status, 'pending', 'completed')")->latest('updated_at')->get();
        $role = 'User';
        if(Auth::user()->hasRole('Super-Admin') || Auth::user()->hasRole('Admin')){
            $role = 'Admin';
        }
        return response()->json([$tasks,Auth::id(),$role]);
    }
    public function createCaseTask(Request $request, Cases $case){
        $assignedTo = empty($request->users) ? null : $request->users;
       $task = Task::create([
            'title' => $request->title,
            'case_id' => $case->id,
            'due_date' => $request->dueDate,
            'created_by' => Auth::id(),
            'assigned_to' => $assignedTo,
        ]);
        return response()->json([201]);
    }
    /* CASE TASKS API */

    public function showTasks(){
        $tasks = Task::with('user')->with('case')->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->orderByRaw("FIELD(status, 'pending', 'completed')")->latest()->get();
        $role = 'User';
        if(Auth::user()->hasRole('Super-Admin') || Auth::user()->hasRole('Admin')){
            $role = 'Admin';
        }
        $users = User::get();
        foreach($users as $user){
            if($user->hasMedia("profile")){
                $user['avatar_link'] = $user->getFirstMediaUrl('profile');
            }else{
                $user['avatar_link'] = asset('storage'.$user->avatar);
            }
        }
        return response()->json([$tasks,Auth::id(),$role,$users]);
    }

    public function newTask(Request $request){
        try {
            $formFields['title'] = $request->title;
            $formFields["created_by"] = Auth::id();
            $formFields["due_date"] = $request->dueDate;
            $formFields['category'] = $request->category;

            if($request->dueDate == null && $request->category == "my_day"){
                $dateToday  = date('Y-m-d');
                $formFields["due_date"] = $dateToday;
            }
            if($request->dueDate == null && $request->category == "planned"){
                $dateToday  = date('Y-m-d', strtotime('+1 day'));
                $formFields["due_date"] = $dateToday;
            }
            if($request->caseId != null){
                $formFields['case_id'] = $request->caseId;
            }
            $task = Task::create($formFields);

            if ($task) {
                return response()->json([201]);
            }
        } catch (QueryException $e) {
            return response()->json(['message' => 'Failed to create record', 'error' => $e->getMessage()], 500);
        }
    }

    public function deleteTasks(Task $task){
        if($task->created_by == Auth::id()){
            Task::destroy($task->id);
            return response()->json(['message' => 'Task deleted succesfully']);
        }
    }

    public function updateTaskStatus(Request $request){
        try {
            $taskToUpdate = Task::find($request->task_id);
            if($taskToUpdate->status == "completed"){
                $taskToUpdate->status = "pending";
            }else{
                $taskToUpdate->status = "completed";
            }
            $status = $taskToUpdate->status;
            $taskToUpdate->save();
            return response()->json([$status],201);
        } catch (QueryException $e) {
            return response()->json([500]);
        }
    }

    public function createCase(Request $request){
        $formFields['title'] = $request->newFolder['title'];
        $formFields['company_id'] = 1;
        $formFields['description'] =  $request->newFolder['description'];
        $formFields['client_id'] =  $request->newFolder['clientId'];
        $formFields['priority'] =  $request->newFolder['priority'];
        $formFields['assigned_to'] =  $request->newFolder['selectedOptions'];
        $formFields['created_by'] = Auth::id();
        $formFields['type'] = "CJ";
        $formFields['due_date'] = $request->newFolder['formattedDate'];


         $folder = Cases::create($formFields);
         return response()->json(['folder' => $folder]);
    }

    /* NEWS */
    public function showNewsDetails(News $news){
        if($news->have_read == 'no' && $news->created_by != Auth::id()){
            $news->have_read = 'yes';
            $news->save();
        }
        $profiles = Profiles::whereIn('user_id',[Auth::id()])->get();
        return view('main.activities.news-details',[
            'profiles' => $profiles,
            'news' => $news
        ]);
    }

    /* CLIENTS */

    public function showClients(){
        $clients = Client::with('case')->withCount('case')->where('company_id',1)->get();
        return response()->json([$clients]);
    }
    public function storeNewClient(Request $request){
        $request->validate([
            'name' => 'required|string',
            'sector' => 'required|string',
            'city' => 'required|string',
            'district' => 'required|string',
        ]);

        $formFields['name'] = $request->name;
        $formFields['company_id'] = 1;
        $formFields['sector'] = $request->sector;
        $formFields['location'] = [
            'city' => $request->city,
            'district' => $request->district,
        ];
        $formFields['contacts'] = [
            'phone' => $request->phone,
            'email' => $request->email,
        ];
        $temporaryFile = TemporaryFile::where('name',$request->logo)->get();

        $client = client::create($formFields);
        $client->addMedia(public_path('/storage/'.$temporaryFile[0]->path))
                    ->toMediaCollection('client-logo', 'logos');
        Storage::delete('/temporary'.$temporaryFile[0]->path);
        $temporaryFile[0]->delete();
         notify()->success('Client created succesfully!');

         return redirect()->back();
    }
    public function storeClientLogo(Request $request){
        if($request->hasFile('logo')){
            $file = $request->file('logo');
            $fileName = $file->getClientOriginalName();
            $fileSize = $file->getSize();

                $filePath= $file->storeAs('temporary'.'/'.$fileName);
                TemporaryFile::create([
                    'name' => $fileName,
                    'path' => $filePath,
                    'size' => $fileSize,
                ]);
                return $fileName;
            };

        }
    public function deleteClientLogo(){

    }

    public function getAllEvents(){
        $events = Event::with('user')->where(function($query) {
            $query->whereJsonContains('participants', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->get();
        $users;
        if($events[0]->participants != null){
            foreach($events[0]->participants as $id){
                $user = User::find($id);
                if($user->hasMedia("profile")){
                    $user['avatar_link'] = $user->getFirstMediaUrl('profile');
                }else{
                    $user['avatar_link'] = asset('storage'.$user->avatar);
                }
                $users[] = $user;
            }
        }
        return response()->json([$events,$users]);
    }
    public function createEvent(Request $request){
      Event::create([
        'title' => $request->data['title'],
        'participants' => $request->data['selectedUsers'],
        'date' => $request->data['dataDate'],
        'meeting_link' => $request->data['eventLink'],
        'time' => [
            'start_time' => $request->data['hour'].":".$request->data['minute'],
        ],
        'created_by' => Auth::id(),
      ]);
      return response()->json([201]);
    }

    public function checkAvailability(Request $request){
        $months = [
            'janvier' => '01',
            'février' => '02',
            'mars' => '03',
            'avril' => '04',
            'mai' => '05',
            'juin' => '06',
            'juillet' => '07',
            'août' => '08',
            'septembre' => '09',
            'octobre' => '10',
            'novembre' => '11',
            'décembre' => '12'
        ];
        $dateParts = explode(' ', substr($request->calendar_date, strpos($request->calendar_date, ' ') + 1));
        $day = $dateParts[0];
        $month = $months[$dateParts[1]];
        $year  = date("Y");
        $date = DateTime::createFromFormat('d-m-Y', "$day-$month-$year");
        $date = $date->format('Y-m-d');
        $events = '';
        $participants = '';
        $eventExist = Event::whereDate('date', '=', $date)->where(function($query) {
            $query->whereJsonContains('participants', Auth::id())
                  ->orWhere('created_by', Auth::id());
        })->exists();

        if($eventExist){
            $events = Event::with('user')->whereDate('date', '=', $date)->where(function($query) {
                $query->whereJsonContains('participants', Auth::id())
                    ->orWhere('created_by', Auth::id());
            })->get();
            // $participants = $events[0]->created_by;
        }
        return response()->json([
            'eventExist' => $eventExist,
            'events' => $events
        ]);
    }
    public function AuthUser(){
        $user = Auth::user();

        $user['role'] = "User";
        if($user->hasRole('Super-Admin') || $user->hasRole('Admin')){
            $user['role'] = "Admin";
        }
        if($user->hasMedia("profile")){
            $user['avatar_link'] = $user->getFirstMediaUrl('profile');
        }else{
            $user['avatar_link'] = asset('storage'.$user->avatar);
        }

        return response()->json([$user]);
    }
    public function getAllUsers(){
        $users = User::get();
        foreach ($users as $user) {
            $user['role'] = "User";
            if($user->hasRole('Super-Admin') || $user->hasRole('Admin')){
                $user['role'] = "Admin";
            }
            if($user->hasMedia("profile")){
                $user['avatar_link'] = $user->getFirstMediaUrl('profile');
            }else{
                $user['avatar_link'] = asset('storage'.$user->avatar);
            }
        }
        return response()->json([$users]);
    }
}

