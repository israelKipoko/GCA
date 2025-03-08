<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Cases;
use Inertia\Response;
use App\Models\Client;
use App\Models\Profiles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContentController extends Controller
{
    public function index() {
        $user = Auth::user();
        $AllUsers = User::all();

        return Inertia::render('Layout',['user' => $user->only(
              'id',
              'name',
              'firstname',
            )]);
    }
     
    public function showFolders(){
        return Inertia::render('Table');
        // return view ('main.tabs.my-folders',[
        //     'profiles' => $profiles,
        //     'clients' => $clients,
        //     'users' => $users,
        // ]);
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
        
        return Inertia::render('ClientLayout');
    }

    public function GetConnections(){
        return Inertia::render('main/Connections');
    }
}
