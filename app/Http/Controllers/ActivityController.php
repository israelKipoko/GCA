<?php

namespace App\Http\Controllers;

use DateTime;
use Carbon\Carbon;
use App\Models\News;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Cases;
use App\Models\Event;
use App\Models\Client;
use App\Models\Groups;
use App\Events\Message;
use App\Models\Library;
use App\Models\Profiles;
use Spatie\PdfToImage\Pdf;
use App\Models\PendingCases;
use Google\Service\Calendar;
use Illuminate\Http\Request;
use App\Models\TemporaryFile;
use Google\Client as GoogleClient;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

class ActivityController extends Controller
{
    public function showFolders(){
        $folders= Cases::with(['user:id,name,firstname,avatar'])->with('client')->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->latest('updated_at')->get();
        foreach ($folders as $folder){
            if($folder->user->hasMedia("profile_pictures")){
                $folder->user['avatar_link'] = $folder->user->getFirstMediaUrl();
            }else{
                $folder->user['avatar_link'] = asset('storage'.$folder->user->avatar);
            }
         }
        foreach ($folders as $folder){
            $assignedArray = [];
            $assignedGroupArray = [];
        
            foreach($folder->assigned_to as $userId){
                $assignedUser = User::with("media")->findOrFail($userId);
        
                if (!$assignedUser) continue;
        
                if($assignedUser->hasMedia("profile_pictures")){
                    $assignedArray[] = [
                        "avatar_link" => $assignedUser->getFirstMediaUrl(),
                        "name" => $assignedUser->firstname. " ".$assignedUser->name,
                    ];
                } else {
                    $assignedArray[] = [
                        "avatar_link" => asset('storage'.$assignedUser->avatar),
                        "name" => $assignedUser->firstname. " ".$assignedUser->name,
                    ];
                }
            }
        
            $folder->assigned_to = $assignedArray;

                // Groups
                $groups = [];
              foreach($folder->assigned_group as $id){
                $group = Groups::select("id","name","users")->findOrFail($id);
        
                if (!$group) continue;
                
                foreach($group->users as $userId){
                    $user = User::with("media")->findOrFail($userId);  

                    if (!$user) continue; // breaker 

                    if($user->hasMedia("profile_pictures")){
                        $assignedGroupArray[] = [
                            "avatar_link" => $user->getFirstMediaUrl(),
                            "name" => $user->firstname. " ".$user->name,
                        ];
                    } else {
                        $assignedGroupArray[] = [
                            "avatar_link" => asset('storage'.$user->avatar),
                            "name" => $user->firstname. " ".$user->name,
                        ];
                    }
                }
                  $group->users= $assignedGroupArray;
                  $groups[] = $group;
            }
                $folder->assigned_group = $groups;

        }
        
        return response()->json([$folders]);
    }
    public function showPendingCases(){
        $folders = Cases::withCount(['task as completed_tasks_count' => function($query) {
            $query->where('status', 'completed');
        }])->withCount(['task as uncompleted_tasks_count' => function($query) {
            $query->where('status', 'pending');
        }])->where('status','pending')->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->latest('updated_at')->get();
        // if($folders[0]->user->hasMedia("profile_pictures")){
        //     $folders[0]->user['avatar_link'] = $folders[0]->user->getFirstMediaUrl("profile_pictures");
        // }else{
        //     $folders[0]->user['avatar_link'] = asset('storage'. $folders[0]->user->avatar);
        // }
        // if($folders[0]->client != null){
        //     if($folders[0]->client->hasMedia("logo")){
        //         $folders[0]->client['logo'] = $folders[0]->client->getFirstMediaUrl("logos");
        //     }else{
        //         $folders[0]->client['logo'] = null;
        //     }
        // }
        // if(empty($folder->assigned_to)){
        //     foreach($folders as $folder){
        //         $assignedTo = [];
        //         foreach ($folder->assigned_to as $id){
        //             $user = User::find($id);
        //             if($user->hasMedia("profile_pictures")){
        //                 $user['avatar_link'] = $user->getFirstMediaUrl();
        //             }else{
        //                 $user['avatar_link'] = asset('storage'.$user->avatar);
        //             }
        //                 $assignedTo[] = $user;
        //          }
        //          $folder->assigned_to = $assignedTo;
        //     }
        // }
        return response()->json([$folders]);
    }
    public function getUsers(){
        $users = User::get();

        $groups= Groups::get();

        foreach ($users as $user){

            //Groups
            $userGroups = [];

             foreach($groups as $group){
                if(in_array($user->id, $group->users)){
                    $userGroups [] = $group->name;
                }
             }

             $user["groups"] = $userGroups;

            //Roles
                $user['role'] = $user->getRoleNames()->first();

            // Avatars
            if($user->hasMedia("profile_pictures")){
                $user['avatar_link'] = $user->getFirstMediaUrl("profile_pictures");
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
            'name' => $request->newClient['newClientName'],
            'sector' => $request->newClient['sector'] ?? "",
            'contacts' => [
                "email" => $request->newClient['email'] ?? "",
                "phone" => $request->newClient['phone'] ?? "",
            ],
            'location' => $request->newClient['address'] ?? null,
            'company_id' => 1,
        ]);
        if(isset($request->newClient['logo']) && $request->newClient['logo'] !== ""){
            $logo = TemporaryFile::where('name',$request->newClient['logo'])->where("user_id",Auth::id())->latest('created_at')->first();

            $client->addMedia(public_path('/storage/'.$logo->path))
            ->toMediaCollection("logos", 'logos');
            Storage::delete('/temporary'.$logo->path);
            $logo->delete();
        }
        $newClientId = $client->id;

        return response()->json(['id' => $newClientId,201]);
    }

    public function deleteCase(Request $request){
        $case = Cases::find($request->folderToDelete);
        $case->delete();

        return response()->json([201]);
    }
    public function showCaseDetails(Cases $case){
        $assigned_to = [];
        $users = [];
        if(!empty($case->assigned_to)){
            foreach($case->assigned_to as $user){
                $assigned_to[] = User::find($user);
            }
            foreach($assigned_to as $user){
                if($user->hasMedia("profile_pictures")){
                    $user['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
                }else{
                    $user['avatar_link'] = asset('storage'.$user->avatar);
                }
                $users[] = $user;
            }
        }
        $owner = User::find($case->created_by); 
        if($owner->hasMedia("profile_pictures")){
            $owner['avatar_link'] = $owner->getFirstMediaUrl('profile_pictures');
        }else{
            $owner['avatar_link'] = asset('storage'.$owner->avatar);
        }
        $users[] = $owner;
        
        if($case->hasMedia("CaseFolders")){
            $media = $case->getMedia("CaseFolders"); 
            foreach ($media as $item) {
                $folder =  [
                    'name' => $item->file_name,  
                    'size' => $item->size,       
                    'url'  => $item->getUrl()
                ];
                $allFolders[] = $folder;
            }
            $case['folders'] = $allFolders;
        }else{
            $case['folders'] =  [];
        }
         return Inertia::render('ForNow',['caseInfo'=>$case,'users'=>$users]);
    }
    public function getAllCaseMessages(Cases $case){
        $messages = PendingCases::with('media')->with('user')->where('case_id',$case->id)->latest('created_at')->get();
        $users = null;

        if(!empty($case->assigned_to)){
            foreach($case->assigned_to as $item){
                $user = User::find($item);
                if($user->hasMedia("profile_pictures")){
                    $user['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
                }else{
                    $user['avatar_link'] = asset('storage'.$user->avatar);
                }
                $users[] = $user;
            }
        }
        if($messages != null){
            foreach ($messages as $message){
                $user = User::find($message->user_id);
                if($user->hasMedia("profile_pictures")){
                    $message->user['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
                }else{
                    $message->user['avatar_link'] = asset('storage'.$user->avatar);
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
          $files = TemporaryFile::where('user_id', auth()->id()) // current user ID
                ->latest('created_at') // order newest first
                ->take($request->input('fileLength')) // limit
                ->get();
            foreach($files as $file){
                $message->addMedia(public_path('storage/'.$file->path))
                    ->toMediaCollection($case->id, 'messages');
                // Delete from temporary folder
                Storage::delete('temporary/'.$file->path);
                // Remove record from DB
                $file->delete();
            }
        }
        // broadcast(new Message());
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

    public function deleteUploadedFile(Request $request){
       if($request->hasFile('file')){
        $file = $request->file('file');
        $fileName = $file->getClientOriginalName();
        $fileSize = $file->getSize();

       $fileToDelete = TemporaryFile::where("user_id", Auth::id())
            ->where("name", $fileName)
            ->where("size", $fileSize)
            ->latest()
            ->first();
        Storage::delete('temporary/'.$fileToDelete->path);
        if ($fileToDelete) {
            $fileToDelete->delete();
        } 
        return response()->json([200]);
        };
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
       Task::create([
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
            if($user->hasMedia("profile_pictures")){
                $user['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
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
        $formFields['assigned_group'] =  $request->newFolder['selectedGroups'];
        $formFields['created_by'] = Auth::id();
        $formFields['type'] = "CJ";
        $formFields['due_date'] = $request->newFolder['formattedDate'];
        $folder = Cases::create($formFields);

        if(sizeof($request->newFolder['files']) != 0){
            $files = TemporaryFile::take($request->newFolder['fileLength'])->latest('created_at')->get();
            foreach($files as $file){
                $folder->addMedia(public_path('/storage/'.$file->path))
                ->toMediaCollection('CaseFolders', 'CaseFolders');
                Storage::delete('/temporary'.$file->path);
                $file->delete();
            }
        }

        if($request->newFolder['formattedDate']){
        Event::create([
            'title' => $request->newFolder['title'],
            'participants' => $request->newFolder['selectedOptions'],
            'date' => $request->newFolder['formattedDate'],
            'case_id' => $folder->id,
            'time' => [
            'start_time' =>null,
            'end_time' => null,
        ],
            'created_by' => Auth::id(),
          ]);
        }
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
        $clients = Client::withCount('case')->where('company_id',1)->orderBy('created_at', 'desc')->get();

        foreach($clients as $client){
            if($client->hasMedia("logos")){
                $client['logo'] = $client->getFirstMediaUrl('logos');
            }else{
                $client['logo'] = "";
            }
        }
        return response()->json([$clients]);
    }
  
    public function storeClientLogo(Request $request){
        if($request->hasFile('logo')){
            $file = $request->file('logo');
            $fileName = $file->getClientOriginalName();
            $fileSize = $file->getSize();

                $filePath= $file->storeAs('temporary'.'/'.$fileName);
                TemporaryFile::create([
                    'user_id' => Auth::id(),
                    'name' => $fileName,
                    'path' => $filePath,
                    'size' => $fileSize,
                ]);
                return response()->json($fileName);
            };

        }
    public function deleteClientLogo(Request $request, $logoName){
        if($logoName != ""){
            $logo = TemporaryFile::where("user_id",Auth::id())->where("name",$logoName)->latest("created_at")->first();
            Storage::delete('/temporary'.$logo->path);
            $logo->delete();
        }
        return response()->json(201);
    }

    public function getClientCases($clientId){
        $clientCases = Cases::where('client_id', $clientId)->orderBy('created_at','desc')->get();

        return response()->json([$clientCases]);
    }

    public function getAllEvents(){
        $users = null;
        $events = Event::with('user','cases')
        ->where(function($query) {
            $query->whereJsonContains('participants', Auth::id())
                  ->orWhere('created_by', Auth::id());
        })
        ->orderBy('date', 'asc')
        ->orderBy('time->start_time', 'asc')
        ->get();
        foreach($events as $event){
            $assignedGroupArray = [];

            if(!empty($event->participants)){
                foreach($event->participants as $id){
                    $user = User::find($id);
                    if($user->hasMedia("profile_pictures")){
                        $user['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
                    }else{
                        $user['avatar_link'] = asset('storage'.$user->avatar);
                    }
                    $users[] = $user;
                }
                $event['event_users'] = $users;
            }
            $users = [];
      
           // Groups
        $groups = [];
        foreach($event->group_participants as $id){
            $group = Groups::select("id","name","users")->findOrFail($id);

            if (!$group) continue;
        
            foreach($group->users as $userId){
                $user = User::with("media")->findOrFail($userId);  

                if (!$user) continue; // breaker 

                if($user->hasMedia("profile_pictures")){
                    $assignedGroupArray[] = [
                        "avatar_link" => $user->getFirstMediaUrl(),
                        "name" => $user->firstname. " ".$user->name,
                    ];
                } else {
                    $assignedGroupArray[] = [
                        "avatar_link" => asset('storage'.$user->avatar),
                        "name" => $user->firstname. " ".$user->name,
                    ];
                }
            }
            $group->users= $assignedGroupArray;
            $groups[] = $group;
        }
        $event->group_participants = $groups;
        }

        return response()->json([$events]);
    }
    public function createEvent(Request $request){
      Event::create([
        'title' => $request->data['title'],
        'participants' => $request->data['selectedUsers'],
        'group_participants' => $request->data['selectedGroups'],
        'date' => $request->data['dataDate'],
        'meeting_link' => $request->data['eventLink'],
        'time' => [
            'start_time' => $request->data['startTime'],
            'end_time' => $request->data['endTime'],
        ],
        'created_by' => Auth::id(),
      ]);
      return response()->json([],200);
    }

    public function deleteEvent(Request $request){
        $event = Event::find($request->id);
        $event->delete();

        return response()->json([200]);
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
           if($user->hasMedia("profile_pictures")){
               $user['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
           }else{
               $user['avatar_link'] = asset('storage'.$user->avatar);
           }
        //  $client = new GoogleClient();
        //  $client->setClientId(env('VITE_GOOGLE_CLIENT_ID'));
        //  $client->setClientSecret(env('VITE_GOOGLE_CLIENT_SECRET'));
        //  $client->setRedirectUri(env('VITE_GOOGLE_REDIRECT_URI'));
        //  $client->addScope('https://www.googleapis.com/auth/calendar'); // Ensure you have the right scope
        
        //  // Set the access token
        //  $client->setAccessToken($user->google_access_token);
        
        //  // Check if the access token is expired
        //  if ($client->isAccessTokenExpired()) {
        //      try {
        //          // Attempt to refresh the access token
        //          $client->fetchAccessTokenWithRefreshToken($user->google_refresh_token);
        //          $newToken = $client->getAccessToken();
        
        //          // Update the user's access token and expiration time in the database
        //    $user->update([
        //              'google_access_token' => $newToken['access_token'],
        //              // 'google_token_expires_at' => now()->addSeconds($newToken['expires_in']),
        //          ]);
        //      } catch (Exception $e) {
        //          // Log the error for debugging
        //          \Log::error('Google API Token Refresh Error: ' . $e->getMessage());
        //          return response()->json(['error' => 'Unable to refresh token'], 500);
        //      }
        //  }
        
        // // // Initialize the Google Calendar service
        //  $service = new Calendar($client);
        
        //  try {
        //      // Fetch the events from the primary calendar
        //      $events = $service->events->listEvents('primary');
        //      dd($events);
        
        //      // Check if events are retrieved
        //      if (count($events->getItems()) > 0) {
        //          // Return the events
        //          return response()->json($events->getItems());
        //      } else {
        //          return response()->json(['message' => 'No events found.']);
        //      }
        //  } catch (Exception $e) {
        //      // Log the error and return a response
        //      \Log::error('Google Calendar API Error: ' . $e->getMessage());
        //      return response()->json(['error' => 'Failed to fetch events'], 500);
        //  }
        return response()->json([$user]);
    }
    public function getAllUsers(){
        $users = User::get();
        foreach ($users as $user) {
            $user['role'] = "User";
            if($user->hasRole('Super-Admin') || $user->hasRole('Admin')){
                $user['role'] = "Admin";
            }
            if($user->hasMedia("profile_pictures")){
                $user['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
            }else{
                $user['avatar_link'] = asset('storage'.$user->avatar);
            }
        }
        return response()->json([$users]);
    }

    /* Get all groups */
    public function getGroups(){
        $user = Auth::user();
        $cases = [];

        if($user->hasRole('Super-Admin') || $user->hasRole('Admin')){
            $groups = Groups::get();

            foreach($groups as $group){
                if(!empty($group->users)){
                    $members = [];
                    foreach($group->users as $member){
                        $groupUser = User::with('media')->select('id','name', 'firstname', 'email', 'avatar')->find($member);
                        if($groupUser->hasMedia("profile_pictures")){
                            $groupUser['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
                        }else{
                            $groupUser['avatar_link'] = asset('storage'.$groupUser->avatar);
                        }

                        $members [] = $groupUser;
                    }

                  // Get cases assigned to the group
                    $groupCases = Cases::whereJsonContains('assigned_group', (int) $group->id)->select('id', 'title')->get();

                    // Only add if not null and not empty
                    if ($groupCases && $groupCases->isNotEmpty()) {
                       $group['groupCases'] = $groupCases;
                    }

                    $group['members'] = $members;
                    $group['membersCount'] = sizeof($members);
                }
            }
     
            return response()->json($groups,201);
        }

        $groups = Groups::whereJsonContains('users', (int) $user->id)->get();

        foreach($groups as $group){
            if(!empty($group->users)){
                $members = [];
                foreach($group->users as $member){
                    $groupUser = User::with('media')->select('id','name', 'firstname', 'email','avatar')->find($member);
                    if($groupUser->hasMedia("profile_pictures")){
                        $groupUser['avatar_link'] = $user->getFirstMediaUrl('profile_pictures');
                    }else{
                        $groupUser['avatar_link'] = asset('storage'.$groupUser->avatar);
                    }

                    $members [] = $groupUser;
                }
                $group['members'] = $members;
                $group['membersCount'] = sizeof($members);

               // Get cases assigned to the group
                $groupCases = Cases::whereJsonContains('assigned_group', (int) $group->id)->select('id', 'title')->get();

                // Only add if not null and not empty
                if ($groupCases && $groupCases->isNotEmpty()) {
                    $group['groupCases'] = $groupCases;
                }
            }
        }


        return response()->json($groups,201);
    }

    public function createGroup(Request $request){
        Groups::create([
            'name' => $request->name,
            'users' => json_decode($request->input('members'), true),
        ]);
        return response()->json([],201);
    }
    public function deleteGroup(Request $request){
        $group = Groups::find($request->groupId);

        //Remove a group from events
        $events = Event::select("id","group_participants")->whereJsonContains("group_participants",$group->id)->get();

        foreach ($events as $event) {
             $modifiedEvents = array_filter($event->group_participants, fn($eventGroupID)=> (int) $eventGroupID != (int) $group->id);
             $event->group_participants = array_values($modifiedEvents);

             $event->save();
         }
        // Remove a group from Case
        $cases = Cases::select("id","assigned_group")->whereJsonContains("assigned_group",$group->id)->get();
        foreach ($cases as $case) {
            $modifiedCases = array_filter($case->assigned_group, fn($casesGroupID)=> (int) $casesGroupID != (int) $group->id);
            $case->assigned_group = array_values($modifiedCases);

            $case->save();
        }
        // Remove a group from events
        $tasks = Task::select("id","assigned_group")->whereJsonContains("assigned_group",$group->id)->get();
        foreach ($tasks as $task) {
            $modifiedTasks = array_filter($task->assigned_group, fn($tasksGroupID)=> (int) $tasksGroupID != (int) $group->id);
            $task->assigned_group = array_values($modifiedTasks);

            $task->save();
        }
        

        $group->delete();

        return response()->json([],201);
    }

    public function addMember(Request $request){
        // Validate input
         $validated = $request->validate([
            'groupId' => 'required|exists:groups,id',
              'newMembers' => 'required',
        ]);

        // Find group
        $group = Groups::find($request->groupId);

        // Decode and sanitize newMembers
        $newMembers = json_decode($request->newMembers, true);

        // Get current members as array of user IDs
        $oldMembers = $group->users ?? [];
    
        // Remove duplicates
        $allMembers = array_unique(array_merge($oldMembers, $newMembers));

        $group->users = $allMembers;
        $group->save();

    return response()->json(['message' => 'Members added successfully.'], 201);
    }
    public function removeMember(Request $request){
           // Validate the request
        $validated = $request->validate([
            'groupId' => 'required|integer|exists:groups,id',
            'id' => 'required|integer||exists:users,id'
        ]);
        $group = Groups::find($validated['groupId']);

        $oldMembers = $group->users;
        $members = array_filter($oldMembers, fn($memberId) => (int) $memberId !== (int) $validated['id']);
        $group->users = array_values($members);

        $group->save();

        return response()->json([],201);
    }
    public function changeGroupName(Request $request){
          // Validate the request
        $validated = $request->validate([
            'groupId' => 'required|integer|exists:groups,id',
            'newName' => 'required|string|max:255'
        ]);

         // Find and update the group
        $group = Groups::find($validated['groupId']);
        $group->name = strip_tags($validated['newName']); // additional sanitization
        $group->save();

         return response()->json([],201);
    }
    public function googleCalendar(Request $request){
        $code = $request->token;
        $user = Auth::user();

        $response = Http::asForm()->post('https://oauth2.googleapis.com/token',[
            'code'    => $code,
            'client_id'    => env('VITE_GOOGLE_CLIENT_ID'),
            'client_secret'    => env('VITE_GOOGLE_CLIENT_SECRET'),
            'redirect_uri'    => env('VITE_GOOGLE_REDIRECT_URI'),
            'grant_type'   => 'authorization_code',
        ]);

        $tokens = $response->json();
        $user->google_access_token = $tokens['access_token'];
        // $user->google_token_expires_at = $tokens['expires_in'];
        $user->google_calendar = true;
        if(isset($tokens['refresh_token'])){
            $user->google_refresh_token = $tokens['refresh_token'];
            $user->save();
        }
        return response()->json([],201);
    }

    public function microsoftIntegration(){
        $user = Auth::user();

        $user->microsoft_todo = true;
        $user->save();

        return response()->json([],201); 
    }

    /* Library */
    public function getCategories(){
        $libraries = Library::select("id","category_name")->orderBy("category_name","asc")->paginate(12);
        foreach ($libraries as $library) {
            $count = $library->getMedia($library->category_name)->count();
            $library["total_docs"] = $count;
        }
        return response()->json($libraries,201);
    }

    public function createLibraryCategory(Request $request){
        $request->validate([
            'name' => 'required|string|unique:libraries,category_name',
        ],[
            'name.unique' => 'Cette catégorie existe déjà.', // custom message
        ]);

        Library::create([
            "category_name" => $request->name,
        ]);
        return response()->json([],201);
    }

    public function showCategoryDocuments(Library $library){

        return Inertia::render('main/library/Category',[
            'library' => $library,
        ]);
    }

    public function getCategoryDocuments(Request $request,Library $library){

        $query = $library->media()
            ->where('collection_name', $library->category_name)
            ->orderBy('file_name', 'asc');
        // 🔍 Search by file name
        if ($request->filled('search')) {
            $query->where('file_name', 'like', '%' . $request->search . '%');
        }

        // 🧾 Filter by MIME type
        if ($request->filled('mime_type')) {
            $mimeTypes = is_array($request->mime_type) ? $request->mime_type : [$request->mime_type];
        
            $query->whereIn('mime_type', $mimeTypes);
        }
        
        // To be added later
        
          // 🔁 Sort by created_at or file_name
        // $sortField = $request->get('sort_by', 'file_name'); // default: file_name
        // $sortOrder = $request->get('sort_order', 'asc');    // default: asc

        // if (in_array($sortField, ['file_name', 'created_at']) && in_array($sortOrder, ['asc', 'desc'])) {
        //     $query->orderBy($sortField, $sortOrder);
        // }
        $files = $query->paginate(10);

        $files->getCollection()->transform(function ($media) {
            $media->thumb_url = $media->hasGeneratedConversion('thumb')
                ? $media->getUrl('thumb')
                : null;
            return $media;
        });
        
        return response()->json($files,200);
    }

    public function createDocuments(Request $request, Library $library){

        if($request->filesLength == 0){
            return response()->json([],400);
        }

        $files = TemporaryFile::take($request->filesLength)->latest('created_at')->get();
        foreach($files as $file){
            $library->addMedia(public_path('/storage/'.$file->path))
            ->toMediaCollection($library->category_name, 'library');
            Storage::delete('/temporary'.$file->path);
            $file->delete();
        }

        return response()->json([],201);
    }

    public function deleteDocuments(Request $request, Library $library){
        $media = $library->media()->findOrFail($request->media_id);

        $media->delete();

        return response()->json([],200);
    }
}

