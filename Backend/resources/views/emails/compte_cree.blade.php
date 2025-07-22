<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Bienvenue sur la plateforme OCP</title>
</head>
<body style="margin:0;padding:0; background: linear-gradient(135deg, #3a7d3b 0%, #b4e197 100%); min-height:100vh; width:100%;">
    <table width="100%" height="100vh" cellpadding="0" cellspacing="0" border="0" style="min-height:100vh; width:100%; border-collapse:collapse;">
        <tr>
            <td align="center" valign="middle" style="height:100vh; width:100%; padding:0;">
                <div style="display:inline-block; width:100%; max-width:520px; background:#fff; border-radius:18px; padding:40px 36px 32px 36px; box-shadow:0 6px 32px #0002; font-family:'Segoe UI', Arial, sans-serif;">
                    <h2 style="color:#3a7d3b; text-align:center; margin-bottom:8px; letter-spacing:1px; font-size:2rem;">
                        Bienvenue sur la plateforme OCP
                    </h2>
                    <hr style="border:none; border-top:2px solid #b4e197; width:60px; margin:16px auto 32px auto;">
                    <p style="font-size:17px; color:#222; text-align:center; margin-bottom:18px;">
                       Bonjour <strong>{{ mb_strtoupper($prenom) }} {{ mb_strtoupper($nom) }}</strong>,
                    </p>
                    <p style="font-size:16px; color:#333; text-align:center; margin-bottom:28px;">
                        Votre compte utilisateur a été <strong>créé avec succès</strong> sur notre plateforme.
                    </p>
                    <div style="margin:32px 0 24px 0; text-align:center;">
                        <div style="display:inline-block; background:#3a7d3b; color:#fff; padding:18px 36px; border-radius:12px; font-size:19px; letter-spacing:1px; box-shadow:0 2px 8px #0001;">
                            <span style="font-weight:bold;">Mot de passe temporaire</span><br>
                            <span style="font-size:24px; letter-spacing:2px; display:inline-block; margin-top:6px;">{{ $motdepasse }}</span>
                        </div>
                    </div>
                    <p style="color:#444; font-size:15px; text-align:center; margin-bottom:24px;">
                        Merci de <strong>modifier ce mot de passe</strong> dès votre première connexion pour garantir la sécurité de votre compte.
                    </p>
                    <div style="text-align:center; margin-bottom:32px;">
                        <a href="http://localhost:5173/login" style="background:linear-gradient(90deg, #3a7d3b 60%, #b4e197 100%); color:#fff; text-decoration:none; padding:12px 32px; border-radius:8px; font-size:16px; font-weight:bold; box-shadow:0 2px 8px #0001; display:inline-block;">
                            Se connecter à la plateforme
                        </a>
                    </div>
                    <hr style="border:none; border-top:1px solid #e0e0e0; margin:32px 0 18px 0;">
                    <p style="color:#888; font-size:14px; text-align:center; margin-bottom:6px;">
                        Pour toute question, contactez notre support :
                    </p>
                    <p style="color:#3a7d3b; font-size:15px; text-align:center; margin-bottom:0;">
                        <a href="mailto:support@ocp.com" style="color:#3a7d3b; text-decoration:underline;">support@ocp.com</a>
                    </p>
                    <p style="margin-top:32px; color:#3a7d3b; text-align:center; font-size:15px;">
                        Cordialement,<br>
                        <span style="font-weight:bold;">L'équipe OCP</span>
                    </p>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>