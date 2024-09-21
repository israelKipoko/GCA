<?php

namespace App\Http\Controllers;

use DateTime;
use App\Models\News;
use App\Models\Task;
use App\Models\User;
use App\Models\Cases;
use App\Models\Event;
use App\Models\Clients;
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
    public function showCaseDetails(Cases $case){
        
        $profiles = Profiles::whereIn('user_id',[Auth::id()])->get();
        
        $assigned_to;
        $hasMedia = false;
        foreach($case->assigned_to as $user){
            $assigned_to[] = User::with('profiles')->find($user);
        }
        $pendingCase = PendingCases::with("media")->where("case_number",$case->number)->where('action','add')->get();
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
        'profiles' => $profiles
     ]);   
    }
    public function updateCase(Request $request, Cases $case){
        
        $formFields['case_number'] = $case->number;
        $formFields['user_id'] = Auth::id();
        $formFields['comments'] = $request->input('comment');
        
        $pendingCase = PendingCases::where('case_number', $case->number)->get();

        $temporaryFile = TemporaryFile::get();
            foreach($temporaryFile as $file){
                $hyphenatedFileName = str_replace(' ', '-', $file->name);

                $fileExists = false;

                foreach($pendingCase as $item){
                    $media = $item->getMedia($case->number)
                                        ->where('file_name', $hyphenatedFileName)
                                        // ->where('size', $file->size)
                                        ->first();
                    if($media){
                        $fileExists = true;
                        $fileDetails = PendingCases::where('case_number',$case->number)->find($media->model_id);
                        break;
                    }
                }


                if($fileExists){
                    $fileDetails->clearMediaCollection($case->number);
                    $fileDetails->addMedia(public_path('/storage/'.$file->path))
                                ->toMediaCollection($case->number, 'pendingCases');
                    Storage::delete('/temporary'.$file->path);
                    $file->delete();
                    $formFields['action'] = "update";
                    $formFields['update_file_id'] = $fileDetails->id;
                     $caseDetails = PendingCases::create($formFields);
                     notify()->success('File updated succesfully!');
                }else{
                    $formFields['action'] = "add";
                    $caseDetails = PendingCases::create($formFields);
                    $caseDetails->addMedia(public_path('/storage/'.$file->path))
                                ->toMediaCollection($case->number, 'pendingCases');
                    Storage::delete('/temporary'.$file->path);
                    $file->delete();
                     notify()->success('File created succesfully!');
                }
            }
        
         return redirect()->back();
    }

    public function uploadFile(Request $request){
        if($request->hasFile('file')){
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            
                $filePath= $file->storeAs('temporary'.'/'.$fileName);
                TemporaryFile::create([
                    'name' => $fileName,
                    'path' => $filePath,
                    'size' => $fileSize,
                ]);
                return response()->json(['message' => 'File created succesfully!']);
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
    public function showTasks(){
        $nbOfUsers = User::count();
        $tasksCreatedExists = Task::where('created_by', Auth::id())->exists();
        // $tasksCreatedArray = null;
        if($tasksCreatedExists){
            $tasksCreatedArray[] = Task::where('created_by', Auth::id())->get();
        }else{
            $tasksCreatedArray = null;
        }
        
        $tasksAssignedArray = null;
        for($i=1; $i<=$nbOfUsers; $i++){
            $tasksAssignedExists = Task::where('assigned_to->'.$i, Auth::id())->exists();
            if($tasksAssignedExists){
                $tasksAssignedArray[] = Task::where('assigned_to->'.$i, Auth::id())->get();
            } 
        }
        return response()->json([$tasksCreatedArray,$tasksAssignedArray]);
    }

    public function storeTasks(Request $request){
        $formFields = $request->all();
        $formFields["created_by"] = Auth::id();

        try {
            $task = Task::create($formFields);

            if ($task) {
                $createdTasks = Task::where('created_by', Auth::id())->get();
                return response()->json([
                    'message' => 'Record created successfully',
                     201,
                    "updatedTasks" => $createdTasks
                ]);
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

    public function updateTaskStatus(Request $request, Task $task){
            $taskToUpdate = Task::find($task->id);
            if($request->task_status == "completed"){
                $taskToUpdate->status = "completed";
            }else{
                $taskToUpdate->status = "pending";
            }
            $taskToUpdate->save();
            return response()->json(['message' => 'Task updated succesfully']); 
    }

    public function createCase(Request $request){
        $formFields['number'] = fake()->numberBetween(1000, 9999);
        $formFields['title'] = $request->title;
        $formFields['company_id'] = 1;
        $formFields['description'] = $request->description;
        $formFields['client_id'] = $request->client;
        $formFields['assigned_to'] = $request->assigned_to;
        $formFields['created_by'] = Auth::id();
        $formFields['type'] = "juridique";
        $formFields['due_date'] = $request->due_date;
       

        $client = Cases::create($formFields);
         notify()->success('Folder created succesfully!');
         return redirect()->back();
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

        $client = Clients::create($formFields);
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

