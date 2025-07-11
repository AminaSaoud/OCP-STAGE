<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Vérifier si l'utilisateur est connecté
        if (!$user) {
            return response()->json(['error' => 'Authentification requise'], 401);
        }
        
        // Vérifier si l'utilisateur a le rôle admin
        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Accès administrateur requis'], 403);
        }
        
        return $next($request);
    }
}