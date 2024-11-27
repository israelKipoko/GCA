<?php

namespace App\Http\Controllers;

use App\Models\User;
use Laravolt\Avatar\Facade as Avatar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;


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

    public function index(){
        return view('auth.login');
    }
    public function authenticate(Request $request){
        $formFiels = $request->validate([
            'email' => ['required','email'],
            'password' => 'required'
        ]);
        if(auth()->attempt($formFiels)){
            
            $request->session()->regenerate();

            // notify()->success('Vous êtes maintenant connecté!!');
            return redirect('/home');
        }
        return back()->withErrors(['email'=>'Invalid credentials'])->onlyInput('email');
    }
    /* AUTHENTICATION */

    /* LOGOUT */
    public function logout(Request $request){
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/GCA/welcome');
    }
    /* LOGOUT */
}
