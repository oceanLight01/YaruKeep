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
    // ユーザに関するルーティング
    Route::get('/user', 'UserController@getLoginUserInfo');
    Route::get('/user/{id}', 'UserController@getUserInfo');
    Route::post('/user/image', 'UserController@storeProfileImage');

    // Habitに関するルーティング
    Route::post('/habits', 'HabitController@store');
    Route::post('/habits/done', 'HabitController@isDone');
    Route::get('/user/{screen_name}/habits/{id}', 'HabitController@show');
    Route::put('/habits/{id}', 'HabitController@update');
    Route::delete('/habits/{id}', 'HabitController@destroy');

    // Diaryに関するルーティング
    Route::get('/habits/{id}/diaries/{diary_id}', 'DiaryController@show');
    Route::post('/diaries', 'DiaryController@store');
    Route::put('/diaries/{diary_id}', 'DiaryController@update');
    Route::delete('/diaries/{diary_id}', 'DiaryController@destroy');

    // Commentに関するルーティング
    Route::post('/comments/habit', 'HabitCommentController@store');
    Route::delete('/comments/{id}/habit', 'HabitCommentController@destroy');

    Route::post('/comments/diary', 'DiaryCommentController@store');
    Route::delete('/comments/{id}/diary', 'DiaryCommentController@destroy');

    // Followに関するルーティング
    Route::get('/following/{screen_name}', 'FollowController@getFollowingUser');
    Route::get('/followed/{screen_name}', 'FollowController@getFollowedUser');
    Route::post('/follow', 'FollowController@follow');
    Route::post('/unfollow', 'FollowController@unfollow');
});
