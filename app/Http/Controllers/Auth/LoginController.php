<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }
    
    public function login(Request $request)
    {
        $this->validateLogin($request);
        
        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);
            
            return $this->sendLockoutResponse($request);
        }
        
        if ($this->attemptLogin($request)) {
            $user = Auth::user();;
            $apiToken = str_random(60);
            $user->update(['api_token' => $apiToken]);
            
            return response()->json([
                'token' => $apiToken,
                'user' => $user
            ]);
        }
        
        $this->incrementLoginAttempts($request);
        
        return $this->sendFailedLoginResponse($request);
    }
    
    public function logout(Request $request)
    {
        $userId = Auth::id();
        $user = User::find($userId);
        $apiToken = str_random(60);
        $user->update(['api_token' => $apiToken]);
        
        $this->guard()->logout();
               
        $request->session()->invalidate();
                
        return $this->loggedOut($request) ?: response()->json();
    }
}
