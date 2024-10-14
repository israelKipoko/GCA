<?php

namespace App\Http\Controllers;

use DateTime;
use App\Models\News;
use App\Models\Task;
use App\Models\User;
use App\Models\Cases;
use App\Models\Event;
use App\Models\Client;
use App\Models\Profiles;
use Spatie\PdfToImage\Pdf;
use App\Models\PendingCases;
use Illuminate\Http\Request;
use App\Models\TemporaryFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

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
            'sector' => 'not determined',
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
        
        foreach ($messages as $message){
            if($message->user->hasMedia("profile")){
                $message->user['avatar_link'] = $message->getFirstMediaUrl('profile');
            }else{
                $message->user['avatar_link'] = asset('storage'.$message->user->avatar);
            }
         }
        return response()->json([$messages]);
    }
    public function createMessage(Cases $case,Request $request){
        $message = PendingCases::create([
            'case_id' => $case->id,
            'user_id' => Auth::id(),
            'comments' => $request->newComment,
        ]);
        if($request->has('fileLength')){
            $files = TemporaryFile::take($request->input('fileLength'))->latest('created_at')->get();
            foreach($files as $file){
                $message->addMedia(public_path('/storage/'.$file->path))
                ->toMediaCollection($case->id, 'messages');
                Storage::delete('/temporary'.$file->path);
                $file->delete();
            }
        }

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
    
    public function NewTask(Request $request){
        try {
            $formFields['title'] = $request->new_task;
            $formFields["created_by"] = Auth::id();
            
            if($request->category == "my_day" || $request->category == "planned"){
                $dateToday  = date('Y-m-d');
                $formFields['due_date'] = $dateToday;
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
            $taskToUpdate->save();
            return response()->json([201]);
        } catch (QueryException $e) {
            return response()->json(['message' => 'Failed to create record', 'error' => $e->getMessage()], 500);
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

    public function createEvent(Request $request){
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
        $dateParts = explode(' ', substr($request->date, strpos($request->date, ' ') + 1));
        $day = $dateParts[0];
        $month = $months[$dateParts[1]];
        $year = $dateParts[2];
        $date = DateTime::createFromFormat('d-m-Y', "$day-$month-$year");
        $request->date = $date->format('Y-m-d');
      Event::create([
        'title' => $request->title,
        'participants' => $request->participants,
        'note' => $request->note,
        'date' => $request->date,
        'meeting_link' => $request->meeting_link,
        'time' => [
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ],
        'created_by' => Auth::id(),
        'reminder' => $request->reminder,
      ]);
      return redirect()->back()->with('message', 'Votre événement a été crée avec succès!');
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
}

