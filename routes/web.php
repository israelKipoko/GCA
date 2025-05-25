<?php

use App\Models\User;
use App\Events\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmailsController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\ActivityController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
Route::get('/foo', function () {
    Artisan::call('storage:link');
});
Route::get('/', function(){
    return redirect('/GCA/welcome');
});

Route::get('/foot', function(){
    broadcast(new Message());
});

Route::get('/email', function(){
    return view('emails/add-member');
});
Route::get('/GCA/welcome', [UserController::class, "index"])->name('route_login');
Route::post('/authenticate/user', [UserController::class, "authenticate"]);
Route::get('/GCA/auth/register/new_user',[UserController::class, "register"])->middleware('auth');
Route::post('/GCA/auth/register/new_user/store',[UserController::class, "store"])->middleware('auth'); 

// Update User Infos Routes//
Route::post('/Mobeko/update/user-name',[UserController::class, "updateName"])->middleware('auth');
Route::post('/Mobeko/update/profile-picture',[UserController::class, "updateProfilePicture"])->middleware('auth');
Route::post('/Mobeko/update/remember-session',[UserController::class, "updateRememberSession"])->middleware('auth');

Route::post('/Mobeko/send-verification-code',[EmailsController::class, "sendCodeVerification"])->middleware('auth');
Route::post('/Mobeko/verify-code',[EmailsController::class, "verifyCodeVerification"])->middleware('auth');
Route::post('/Mobeko/verify-new-email',[EmailsController::class, "verifyNewEmail"])->middleware('auth');

Route::post('/Mobeko/register-newly-changed-email',[EmailsController::class, "registerNewEmail"])->name('new-email');

Route::post('/logout/user', [UserController::class, "logout"])->middleware('auth')->name('loggingOut-user');

Route::get('/home/models',[ContentController::class,"models"])->middleware('auth')->name('yes');
Route::get('/home/reports',[ContentController::class,"reports"])->middleware('auth');
Route::get('/home',[ContentController::class, "index"])->middleware('auth')->name('app.home');

Route::get('/tasks/get-all-tasks',[ActivityController::class, "showTasks"])->middleware('auth');
Route::post('/tasks/create-new-task',[ActivityController::class, "newTask"])->middleware('auth');
Route::post('/tasks/update-status',[ActivityController::class,'updateTaskStatus'])->middleware('auth');

/* Folders */
Route::get('/home/my-folder',[ContentController::class,"showFolders"])->middleware('auth');
Route::get('/folders/show-my-folders',[ActivityController::class,"showFolders"])->middleware('auth');
Route::get('/users/get-all-users',[ActivityController::class,"getUsers"])->middleware('auth');
Route::get('/clients/get-all-clients',[ActivityController::class,"getClients"])->middleware('auth');

Route::get('/home/pending-cases/{case}',[ActivityController::class,"showCaseDetails"])->middleware('auth');

Route::get('/cases/get-all-case-messages/{case}',[ActivityController::class,"getAllCaseMessages"]);
Route::post('/cases/create-new-message/{case}',[ActivityController::class,"createMessage"]);
Route::post('/cases/upload-file',[ActivityController::class,"uploadFile"])->middleware('auth');

Route::get('/folders/show-pending-folders',[ActivityController::class,"showPendingCases"])->middleware('auth');

Route::get('/users/get-information',[ActivityController::class,"AuthUser"])->middleware('auth');

Route::post('/users/change-password',[UserController::class, "updatePassword"])->middleware('auth');

/* TASKS */
Route::get('/tasks/get-all-case-tasks/{case}',[ActivityController::class,"getAllTasks"])->middleware('auth');
Route::post('/tasks/create-new-task/{case}',[ActivityController::class,"createCaseTask"])->middleware('auth');

/* EVENTS */
Route::get('/event/get-user-events',[ActivityController::class,"getAllEvents"]);
Route::post('/event/create-new-event',[ActivityController::class,"createEvent"]);
Route::post('/event/delete-event',[ActivityController::class,"deleteEvent"])->middleware('auth');
Route::post('/home/event/check-availability',[ActivityController::class,"checkAvailability"]);

/* GROUPS */
Route::get('/groups/get-all-groups',[ActivityController::class,"getGroups"])->middleware('auth');
Route::post('/groups/create-group',[ActivityController::class,"createGroup"])->middleware('auth');
Route::post('/groups/delete-group',[ActivityController::class,"deleteGroup"])->middleware('auth');
Route::post('/groups/add-new-member',[ActivityController::class,"addMember"])->middleware('auth');

/* Connections */ 
Route::post('/connections/api/auth/google',[ActivityController::class,"googleCalendar"])->middleware('auth');;
Route::get('/connections/api/auth/microsoft',[ActivityController::class,"microsoftIntegration"])->middleware('auth');;

// <!-- Route::get('/news/{news}',[ActivityController::class,"showNewsDetails"]); -->

Route::group(['middleware' => ['auth','role:Super-Admin|Admin|User']], function () { 
    Route::post('/home/pending-cases/{case}/update-case/file',[ActivityController::class,"updateCase"]);

    Route::get('/home/calendar',[ContentController::class, "showCalendar"]);

    Route::delete('/home/pending-cases/{case}/delete-file',[ActivityController::class,"deleteUploadedFile"])->middleware('auth');

    Route::get('/home/tasks',[ActivityController::class,"showTasks"])->middleware('auth');
    Route::post('/home/tasks/add-task',[ActivityController::class,"storeTasks"])->middleware('auth');
    Route::delete('/home/tasks/delete-task/{task}',[ActivityController::class,"deleteTasks"])->middleware('auth');
    Route::put('/home/tasks/update-task-status/{task}',[ActivityController::class,"updateTaskStatus"]);
    
    Route::post('pending-cases/{case}/submit-case',[ActivityController::class,"submitCase"]);

     /* Library */
     Route::get('/home/library',[ContentController::class,"library"])->middleware('auth');
     Route::get('/home/library/get-all-categories',[ActivityController::class,"getCategories"])->middleware('auth');
     Route::post('/home/library/create-category',[ActivityController::class,"createLibraryCategory"])->middleware('auth');
     Route::get('/home/library/show-category-documents/{library}',[ActivityController::class,"showCategoryDocuments"])->middleware('auth');
     Route::get('/home/library/get-all-category-documents/{library}',[ActivityController::class,"getCategoryDocuments"])->middleware('auth');
     Route::post('/home/library/create-documents/{library}',[ActivityController::class,"createDocuments"])->middleware('auth');
     Route::post('/home/library/delete-document/{library}',[ActivityController::class,"deleteDocuments"])->middleware('auth');
});

Route::group(['middleware' => ['auth','role:Super-Admin|Admin']], function () { 
    /* CLIENT */
    Route::get('/home/clients',[ContentController::class,"clients"]);
    Route::post('/home/clients/store-new-client',[ActivityController::class,"storeNewClient"]);
    Route::post('/home/client/upload-logo',[ActivityController::class,"storeClientLogo"]);
    Route::delete('/home/client/delete-logo/{logoName}',[ActivityController::class,"deleteClientLogo"]);

    Route::post('/clients/create-new-client',[ActivityController::class,"newClient"]);

    Route::get('/clients/show-my-clients',[ActivityController::class,"showClients"]);

    Route::get('/clients/get-client-cases/{clientId}',[ActivityController::class,"getClientCases"]);

    /* CLIENT */ 
    
    Route::post('/folders/create-new-folder',[ActivityController::class,"createCase"]);
    Route::post('/folders/delete-folder',[ActivityController::class,"deleteCase"]);

    /* User */ 
    Route::post('/members/add-new-member',[UserController::class,"addMember"]);
    Route::post('/users/delete-member-account',[UserController::class, "deleteMember"]);

    /* Roles */
    Route::post('/users/change-user-role',[UserController::class,"editUserRole"]);

   

 });

