<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\VerifyNewEMail;
use Illuminate\Http\Request;
use App\Mail\CodeVerificationMail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class EmailsController extends Controller
{
    public function sendCodeVerification(Request $request){
        
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $code = rand(100000, 999999);

        $user = User::where('email', $request->email)->first();
        $user->verification_code = Hash::make($code);
        $user->save();

        $userName = $user->firstname." ".$user->name;

        Mail::to($request->email)->send(new CodeVerificationMail($code, $userName));

        return response()->json(201);
    }

    public function verifyCodeVerification(Request $request){
        $user = Auth::user();


        if(!Hash::check($request->code, $user->verification_code)){
            return response()->json([],400);
        }

        $user->verification_code = null;
        $user->save();

        return response()->json([],201);
    }

    public function verifyNewEmail(Request $request){

        $request->validate([
            'newEmail' => 'required|email|unique:users,email',
        ], [
            'newEmail.unique' => 'Cet email existe déjà.',
        ]);

        $user = Auth::user();
        $userName = $user->firstname." ".$user->name;
        $oldEmail = $user->email;
        $newEmail = $request->email;

        Mail::to($request->newEmail)->send(new VerifyNewEMail($userName, $newEmail, $oldEmail));

        return response()->json([],201);
    }

    public function registerNewEmail(Request $request){
        $newEnail = $request->query('newEmail'); 
        $oldEmail = $request->query('oldEmail'); 

        $user = User::where('email', $oldEmail)->first();
        $user->email = $newEmail;
        $user->save();

        DB::table('sessions')->where('user_id', $user->id)->delete();

        return view('main/activities/verified-email');
    }
}
