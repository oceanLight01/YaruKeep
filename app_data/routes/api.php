<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['middleware' => ['auth:sanctum']], function () {
    //ユーザに関するルーティング
    Route::get('/user', 'UserController@getLoginUserInfo');
    Route::get('/user/{id}', 'UserController@getUserInfo');

    //Habitに関するルーティング
    Route::post('/habits', 'HabitController@store');
    Route::post('/habits/done', 'HabitController@isDone');
    Route::get('/habits/status/{id}', 'HabitController@show');
    Route::delete('/habits/{id}', 'HabitController@destroy');
});
