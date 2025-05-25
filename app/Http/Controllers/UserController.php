<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Cases;
use Inertia\Response;
use App\Models\Groups;
use App\Mail\AddMember;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Laravolt\Avatar\Facade as Avatar;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;


class UserController extends Controller
{
    public function register(){
        return view('auth.registerUser');
    }
    public function store(Request $request){
        $formFields = $request->validate([
            'firstname'  => ['required', 'string', 'max:255'],
            'name'  => ['required', 'string', 'max:255'],
            'lastname'  => ['required', 'string', 'max:255'],
            'role'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255','unique:'.User::class],
            'phone' => ['required','string'],
            'password' => ['required',Password::min(8)->letters()->numbers()->mixedCase()->symbols()],
        ],[
            'email.unique' => 'Cet email existe déjà!',
            'email.email' => "Ceci n'est pas un email!",
           'password.min' => 'Le mot de passe doit contenir au moins 8 caractères!',
            'password.letters' => 'Le mot de passe doit contenir au moins un lettre!',
            'password.numbers' => 'Le mot de passe doit contenir au moins un chiffre!',
            'password.mixedCase' => 'Le mot de passe doit contenir au moins une lettre minuscule et une lettre majuscule!',
            'password.symbols' => 'Le mot de passe doit contenir au moins un symbole!',
        ]);
         
        //  $sendVerifySms->sendVerificationCode(phone($request->phoneNumber)->formatE164());
       // Hash password
       $formFiels['password'] = bcrypt($formFields['password']);
       //Create user
       $user = User::create($formFields);
       return redirect()->back()->with('message','Vous avez créé avec succès!');

    }
    /* AUTHENTICATION */

    public function index():Response{
        return Inertia::render('Login');
    }

    public function authenticate(Request $request){
        $formFiels = $request->validate([
            'email' => ['required','email'],
            'password' => 'required'
        ]);
        if(auth()->attempt($formFiels)){
            
            $request->session()->regenerate();

            // notify()->success('Vous êtes maintenant connecté!!');
            return  to_route('app.home');
        }
        return back()->withErrors(['email'=>'Invalid credentials'])->onlyInput('email');
    }
    /* AUTHENTICATION */

    /* UPDATE USER NAME */
    public function updateName(Request $request){
        $user = Auth::user();

        if(sizeof($request->names) > 0){
            $user->firstname =  $request->names[0];
            $user->name = $request->names[1] ?? "";
            $user->lastname = $request->names[2] ?? "";

            $user->save();

            return response()->json([],201);
        }
        
        return response()->json(500);
    }

    public function updateProfilePicture(Request $request){
        $user = Auth::user();

        if($request->file('avatar')){
            if($user->hasMedia("profile_pictures")){
                $media = $user->getFirstMedia("profile_pictures");
                $media->delete(); 
            }

            $media = $user->addMedia($request->file('avatar'))
            ->toMediaCollection('profile_pictures');

            return response()->json(201);
        }

        return response()->json(500);
    }

    public function updateRememberSession(Request $request){
        $user = Auth::user();
        $credentials = $request->only('email','password');
        $remember = $request->input('remember');

        if(Auth::attempt($credentials,true)){
            $request->session()->regenerate();

            $user->remember = (!$user->remember);
            $user->save();

            return response()->json([],201); 
        }

        return response()->json(500);
    }

    public function addMember(Request $request){
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
        ], [
            'email.unique' => 'Cet email existe déjà!',
            'email.email' => "Ceci n'est pas un email!",
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        function generateSecurePassword($length = 12){
                $upper = Str::random(2, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // At least 2 uppercase letters
                $lower = Str::random(4, 'abcdefghijklmnopqrstuvwxyz'); // At least 4 lowercase letters
                $numbers = Str::random(2, '0123456789'); // At least 2 numbers
                $symbols = substr(str_shuffle('!@#$%^&*()-_=+[]{};:,.<>?'), 0, 2); 

                // Merge all characters and shuffle
                $password = str_shuffle($upper . $lower . $numbers . $symbols);

                return $password;
            }

        $filename = 'avatars/' . $request->name . '.png';
        $avatar = Avatar::create($request->name)->save(storage_path('app/public/' . $filename));

        $password = generateSecurePassword();

        $formFields = [
            "firstname" => "",
            "name" => $request->name,
            "avatar" => "/$filename",
            "email" => $request->email,
            "password" => bcrypt($password),
        ];

        $user = User::create($formFields);
 
         if($request->role === "Admin" || $request->role === "Super-Admin"){
             $user->assignRole($request->role);
         }

        Mail::to($request->email)->send(new AddMember($password, $request->email, $request->name, $request->sender, route('route_login')));

        return response()->json([],201); 
    }

    public function deleteMember(Request $request){
        //Remove user from all groups
        $userGroups = Groups::select('id','users')->whereJsonContains('users', (int) $request->userID)->get();

        foreach ($userGroups as $group) {
            $users = array_filter($group->users, fn($member)=> $member != $request->userID);
            $group->users = array_values($users);

            $group->save();
        }

        // Remove user from all folders
         $usersCases = Cases::select('id','assigned_to')->whereJsonContains('assigned_to', (int) $request->userID)->get();

         foreach ($usersCases as $case) {
             $cases = array_filter($case->assigned_to, fn($case)=> $case != $request->userID);
             $case->assigned_to = array_values($cases);

             $case->save();
         }

         if(Auth::id() == (int) $request->userID){
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
         }

         //Delete the user Account
         $user = User::find((int) $request->userID);
         $user->delete();

        return response()->json([],201); 
    }

    /* Change user's role */ 
    public function editUserRole(Request $request){
        $user = User::find($request->userID);
        $user->syncRoles($request->role);

        return response()->json([],201); 
    }

    public function updatePassword(Request $request){
        $user = Auth::user();

        $request->validate([
            'new_password' => ['required',Password::min(8)->letters()->numbers()->mixedCase()->symbols()],
            'current_password' => 'required',
        ],[
           'password.min' => 'Le mot de passe doit contenir au moins 8 caractères!',
            'password.letters' => 'Le mot de passe doit contenir au moins un lettre!',
            'password.numbers' => 'Le mot de passe doit contenir au moins un chiffre!',
            'password.mixedCase' => 'Le mot de passe doit contenir au moins une lettre minuscule et une lettre majuscule!',
            'password.symbols' => 'Le mot de passe doit contenir au moins un symbole!',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages(['current_password' => 'Current password is incorrect']);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();
    
        return response()->json(['message' => 'Password changed successfully']);
    }
    /* LOGOUT */
    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location('/GCA/welcome');
    }
    /* LOGOUT */
}
