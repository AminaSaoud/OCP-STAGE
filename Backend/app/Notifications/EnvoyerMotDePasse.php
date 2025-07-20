<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class EnvoyerMotDePasse extends Notification
{
    use Queueable;

    private $motdepasse;

    public function __construct($motdepasse)
    {
        $this->motdepasse = $motdepasse;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new \Illuminate\Notifications\Messages\MailMessage)
            ->subject('Bienvenue sur la plateforme OCP - Votre compte a été créé')
            ->view(
                'emails.compte_cree',
                [
                    'prenom' => $notifiable->prenom,
                    'nom' => $notifiable->nom,
                    'motdepasse' => $this->motdepasse,
                ]
            );
    }
}
