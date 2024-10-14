<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Task;
use App\Models\User;
use App\Models\Cases;
use App\Models\Client;
use App\Models\Profiles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContentController extends Controller
{
    public function index(){
        $profiles = Profiles::whereIn('user_id',[Auth::id()])->get();
        $nbOfUsers = User::count();
        $userPendingCases = Cases::where("status","pending")->whereJsonContains("assigned_to",Auth::id())->latest("updated_at")->get();
        $assignedTask = null;
        for($i=1; $i<=$nbOfUsers; $i++){
            $assignedTasksExists = Task::where('assigned_to->'.$i, Auth::id())->exists();
            if($assignedTasksExists) $assignedTask += Task::where('assigned_to->'.$i, Auth::id())->count();;
        }
        $personalTasks = Task::where('created_by', Auth::id())->count();
        $newsCollection = News::with('user.profiles')->where('company_id',1)->where('have_read','no')->latest()->take(3)->get();
        return view('main.index',[
            'profiles' => $profiles,
            'userPendingCases' => $userPendingCases,
            'personalTasks' => $personalTasks,
            'assignedTask' => $assignedTask,
            'newsCollection' => $newsCollection,
        ]);
    }
     
    public function showFolders(){
        $profiles = Profiles::whereIn('user_id',[Auth::id()])->get();
        $clients = Client::where('id',15)->get()->sortBy('name');
        $users = User::with('profiles')->whereIn('id',[1,2])->get();
        return view ('main.tabs.my-folders',[
            'profiles' => $profiles,
            'clients' => $clients,
            'users' => $users,
        ]);
    }
    /* TABS */
    public function models(){
        return view('main.tabs.models');
    }
    public function reports(){
        return view('main.tabs.reports');
    }
    public function library(){
        $profiles = Profiles::with('user')->whereIn('user_id',[Auth::id()])->get();
        return view('main.tabs.library',[
            'profiles' => $profiles
        ]);
    }
    public function clients(){
        $profiles = Profiles::with('user')->whereIn('user_id',[Auth::id()])->get();
        return view('main.tabs.clients',[
            'profiles' => $profiles,
        ]);
    }

    /* TABS */

    public function showCalendar(){
        return view('main.activities.calendar');
    }
}
