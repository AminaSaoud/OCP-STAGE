<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ControleurTechniqueMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Vérifier si l'utilisateur est authentifié
            if (!$request->user()) {
                Log::info('ControleurTechniqueMiddleware - No authenticated user');
                
                // Vérifier si c'est une requête API ou web
                if ($request->expectsJson() || $request->is('api/*')) {
                    return response()->json([
                        'error' => 'Unauthenticated'
                    ], 401);
                }
                
                return redirect()->route('login');
            }

            $user = $request->user();
            
            // Debug: Log pour voir ce qui se passe
            Log::info('ControleurTechniqueMiddleware - User:', [
                'user_id' => $user->id_utilisateur ?? $user->id,
                'user_role' => $user->role,
                'expected_role' => 'controleur technique',
                'match' => $user->role === 'controleur technique'
            ]);
            
            if ($user->role !== 'controleur technique') {
                Log::info('ControleurTechniqueMiddleware - Unauthorized access attempt', [
                    'user_role' => $user->role,
                    'expected_role' => 'controleur technique'
                ]);
                
                // Vérifier si c'est une requête API ou web
                if ($request->expectsJson() || $request->is('api/*')) {
                    return response()->json([
                        'error' => 'Unauthorized - Insufficient permissions',
                        'debug' => [
                            'user_id' => $user->id_utilisateur ?? $user->id,
                            'user_role' => $user->role,
                            'expected_role' => 'controleur technique'
                        ]
                    ], 403);
                }
                
                // Rediriger vers la page d'accueil pour les requêtes web
                return redirect()->route('home')->with('error', 'Accès non autorisé. Vous devez être un contrôleur technique.');
            }

            return $next($request);
            
        } catch (\Exception $e) {
            Log::error('ControleurTechniqueMiddleware - Exception:', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'error' => 'Internal server error in middleware',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}