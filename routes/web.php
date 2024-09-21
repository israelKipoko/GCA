<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ContentController;
use App\Http\Controllers\ActivityController;
use Illuminate\Support\Facades\Artisan;
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
Route::get('/GCA/welcome', [UserController::class, "index"])->name('route_login');
Route::post('/authenticate/user', [UserController::class, "authenticate"]);
Route::get('/GCA/auth/register/new_user',[UserController::class, "register"])->middleware('auth');
Route::post('/GCA/auth/register/new_user/store',[UserController::class, "store"])->middleware('auth'); 

Route::post('/logout/user', [UserController::class, "logout"])->middleware('auth');

Route::get('/home/models',[ContentController::class,"models"])->middleware('auth')->name('yes');
Route::get('/home/reports',[ContentController::class,"reports"])->middleware('auth');
Route::get('/home/library',[ContentController::class,"library"])->middleware('auth');


Route::group(['middleware' => ['auth','role:Admin|User']], function () { 
    Route::get('/home',[ContentController::class, "index"]);
    Route::get('/home/pending-cases/{case}',[ActivityController::class,"showCaseDetails"]);
    Route::post('/home/pending-cases/{case}/update-case/file',[ActivityController::class,"updateCase"]);

    Route::get('/home/calendar',[ContentController::class, "showCalendar"]);

    Route::post('/home/pending-cases/{case}/upload-file',[ActivityController::class,"uploadFile"])->middleware('auth');
    Route::delete('/home/pending-cases/{case}/delete-file',[ActivityController::class,"deleteUploadedFile"])->middleware('auth');

    Route::get('/home/tasks',[ActivityController::class,"showTasks"])->middleware('auth');
    Route::post('/home/tasks/add-task',[ActivityController::class,"storeTasks"])->middleware('auth');
    Route::delete('/home/tasks/delete-task/{task}',[ActivityController::class,"deleteTasks"])->middleware('auth');
    Route::put('/home/tasks/update-task-status/{task}',[ActivityController::class,"updateTaskStatus"]);
    
    Route::post('pending-cases/{case}/submit-case',[ActivityController::class,"submitCase"]);

    Route::get('/news/{news}',[ActivityController::class,"showNewsDetails"]);

    Route::post('/home/event/create',[ActivityController::class,"createEvent"]);

    Route::post('/home/event/check-availability',[ActivityController::class,"checkAvailability"]);
});

Route::group(['middleware' => ['auth','role:Super-Admin|Admin']], function () { 
    Route::get('/home/dashboard',[ContentController::class,"index"])->name('just');

    /* CLIENT */
    Route::get('/home/clients',[ContentController::class,"clients"]);
    Route::post('/home/clients/store-new-client',[ActivityController::class,"storeNewClient"]);
    Route::post('/home/client/upload-logo',[ActivityController::class,"storeClientLogo"]);
    Route::delete('/home/client/upload-logo',[ActivityController::class,"deleteClientLogo"]);
    /* CLIENT */ 
    
    Route::post('/home/cases/create',[ActivityController::class,"createCase"]);
    
 });

