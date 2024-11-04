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
        $userPendingCasesExist= Cases::with('user')->where("status","pending")->where(function($query) {
            $query->whereJsonContains('assigned_to', Auth::id())
                ->orWhere('created_by', Auth::id());
        })->latest('updated_at')->exists();
        $newsCollection = News::with('user.profiles')->where('company_id',1)->where('have_read','no')->latest()->take(3)->get();
        return view('main.index',[
            'profiles' => $profiles,
            'userPendingCasesExist' => $userPendingCasesExist,
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
