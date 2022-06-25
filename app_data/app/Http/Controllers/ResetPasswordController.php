<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ResetPasswordController extends Controller
{
    public function __invoke(Request $request)
    {
        $token = $request->token;
        $email = urlencode($request->email);

        return redirect("/password/reset/{$token}?email={$email}");
    }
}
