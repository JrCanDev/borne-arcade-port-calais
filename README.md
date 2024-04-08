# Borne d'Arcade du Port de Calais

Ce projet à été développé par Joshua Vandaële lors d'un stage se déroulant dans le cadre d'un projet entre le Port Boulogne Calais, VIIA, La Société des Ports du Détroit, le SAS Coluche de la Ville de Calais, JrCanDev, l'Université du Littoral Côte d'Opale et le Lycée Professionnel Pierre de Coubertin.

- [Borne d'Arcade du Port de Calais](#borne-darcade-du-port-de-calais)
  - [Mise en marche](#mise-en-marche)
    - [Installation de Debian](#installation-de-debian)
    - [Installation du serveur X](#installation-du-serveur-x)
    - [Installation de Firefox](#installation-de-firefox)
    - [Installation de l'application](#installation-de-lapplication)
    - [Sortir de Firefox](#sortir-de-firefox)
  - [Remettre à zéro les scores](#remettre-à-zéro-les-scores)
  - [Liste des jeux](#liste-des-jeux)
  - [Outil de traduction](#outil-de-traduction)
  - [Licence](#licence)

## Mise en marche

Ce projet nécessite l'installation de Debian avec une installation non graphique (sans DE tels que GNOME), de Firefox, et d'un serveur X minimal. Pour la première mise en marche, certains paramètres ont besoin d'être changé.

### Installation de Debian

1. Téléchargez l'image ISO netinstall de Debian **standard** (Sans Desktop Environment) sur le site officiel de Debian : [https://www.debian.org/distrib/](https://www.debian.org/distrib/).
2. Flasher l'image ISO sur une clé USB en utilisant un logiciel tel que Rufus ou Etcher.
3. Démarrez votre ordinateur sur la clé USB.
4. Suivez les instructions d'installation de Debian.
   1. Lors de l'étape de sélection du nom de l'ordinateur, choisissez `borne`.
   2. Lors de l'étape de sélection du nom de l'utilisateur, choisissez `borne`.
   3. Lors de l'étape de sélection du mot de passe, choisissez `borne`.
5. Une fois l'installation terminée, redémarrez votre ordinateur, retirez la clé USB et connectez-vous en tant que l'utilisateur borne.
6. Retirez le mot de passe de l'utilisateur borne en utilisant la commande suivante dans le terminal : `sudo passwd -d borne`.
7. Installez les mises à jour en utilisant la commande suivante dans le terminal : `sudo apt-get update && sudo apt-get upgrade`.
8. Faite que l'utilisateur non-root se connecte automatiquement en utilisant la commande suivante dans le terminal : `sudo nano /etc/systemd/logind.conf`. Recherchez la ligne `#NAutoVTs=6` et remplacez-la par `NAutoVTs=1`. Enregistrez et quittez le fichier.
9. Créez un fichier override pour le service `getty@tty1` en utilisant la commande suivante dans le terminal : `sudo systemctl edit getty@tty1`. Ajoutez les lignes suivantes dans le fichier et enregistrez-le :

```conf
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin borne --noclear %I $TERM
```

Cela permettra à l'utilisateur non-root de se connecter automatiquement et de lancer l'interface graphique sur le premier terminal virtuel.

10. Cachez grub au démarrage en utilisant la commande suivante dans le terminal : `sudo nano /etc/default/grub`. Ajoutez les lignes suivantes dans le fichier et enregistrez-le :

```conf
GRUB_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT_QUIET=true
```

Enregistrez et quittez le fichier, puis mettez à jour grub en utilisant la commande suivante dans le terminal : `sudo update-grub`.

11. Suivez les étapes suivantes pour installer Firefox et le serveur X.
12. (Optionel): Désactivez les services inutiles afin d'accélerer le temps pour boot en utilisant la commande suivante dans le terminal : `sudo systemctl mask <service>`. Remplacez `<service>` par le nom du service que vous souhaitez désactiver. Par exemple, pour désactiver le service `bluetooth`, utilisez la commande suivante : `sudo systemctl mask bluetooth`. Quelques services que vous pouvez désactiver sont:
    - `bluetooth` - Si vous n'utilisez pas le Bluetooth.
    - `cups` - Si vous n'utilisez pas d'imprimante.
    - `exim4` - Si vous n'utilisez pas de serveur de messagerie.
13. Redémarrez votre ordinateur pour que les changements prennent effet.

### Installation du serveur X

1. Installez le serveur X et les outils que l'on utilisera en utilisant la commande suivante dans le terminal : `sudo apt-get install xorg xdotool`.
2. Créez un fichier `.xinitrc` dans le répertoire personnel de l'utilisateur non-root (`/home/borne/.xinitrc`) et ajoutez-y les lignes suivante :

```sh
# Lancer Firefox en mode kiosque
exec firefox --disable-pinch --kiosk /chemin/absolut/vers/index.html &
# Redimensionner et déplacer la fenêtre de Firefox
for win in $(xdotool search --sync "Firefox"); do
  xdotool windowsize $win 1920 1080 &
  xdotool windowmove $win 0 0 &
done
# Désactiver l'économiseur d'écran et l'extinction de l'écran
xset s off
xset s noblank
xset -dpms
# Attendre que Firefox se ferme
while pgrep "firefox" > /dev/null; do
  sleep 1
done
```

Cela permettra de lancer Firefox en mode kiosque au démarrage du serveur X, de redimensionner la fenêtre de Firefox à la taille de l'écran, et d'attendre que Firefox se ferme avant de fermer le serveur X.

`--disable-pinch` est utilisé pour désactiver le zoom sur les écrans tactiles.

`--kiosk` est utilisé pour ouvrir Firefox en mode kiosque, ce qui signifie que Firefox s'ouvrira en plein écran sans barre d'adresse ni barre d'onglets.

3. Rendez le fichier `.xinitrc` exécutable avec la commande : `sudo chmod +x .xinitrc`.

4. Ajoutez les lignes suivantes a la fin du fichier `.bashrc` de l'utilisateur non-root (`/home/borne/.bashrc`) pour lancer le serveur X au démarrage :

```bash
if [ -z "$DISPLAY" ] && [ $(tty) == /dev/tty1 ]; then
  startx -- -nocursor
fi
```

### Installation de Firefox

1. Installez Firefox en utilisant la commande suivante dans le terminal : `sudo apt-get install firefox-esr`.

Pour que le projet fonctionne correctement, vous devez changer certains paramètres de Firefox. Pour ce faire, suivez les étapes suivantes une fois que vous avez ouvert Firefox pour la première fois depuis le serveur X :

1. Accéder à l'URL `about:config`. Si vous êtes en mode kiosque, vous pouvez appuyer sur `Ctrl + L` pour accéder à la barre d'adresse.
2. Recherchez `security.fileuri.strict_origin_policy` et assurez vous que cette valeur soit à `false`. Cela permet à Firefox d'accéder aux fichiers locaux.
3. Recherchez `browser.translations.automaticallyPopup` et assurez vous que cette valeur soit à `false`. Cela empêche la traduction automatique des pages web.
4. Recherchez `dom.w3c_touch_events.enabled` et assurez vous que cette valeur soit à `1`. Cela permet de supporter les écrans tactiles.
5. Exécutez la commande `echo export MOZ_USE_XINPUT2=1 | sudo tee /etc/profile.d/use-xinput2.sh` pour activer le support des écrans tactiles.

### Installation de l'application

Si vous souhaitez clonez le dépot sur l'ordinateur de la borne, installez Git en utilisant la commande suivante dans le terminal : `sudo apt-get install git`. Sinon, vous pouvez télécharger le dépot sur une clé USB et le copier sur l'ordinateur.

1. Clonez ce dépôt en utilisant la commande suivante dans le terminal : `git clone https://github.com/JrCanDev/borne-arcade-port-calais.git` ou téléchargez le dépot avec le bouton "Code" en haut de la page.
2. Décompressez et extrayez le fichier téléchargé si vous avez téléchargé le dépot.
3. Si vous n'utilisez pas de clé USB, allez à l'étape 7. Sinon, branchez la clé USB sur l'ordinateur.
4. Montez la clé USB en utilisant la commande suivante dans le terminal : `sudo mount /dev/sdX /mnt`, où `/dev/sdX` est le périphérique de la clé USB. Vous pouvez trouver le périphérique de la clé USB en utilisant la commande `lsblk`.
5. Le contenu de la clé USB sera monté dans le répertoire `/mnt`. Copiez le dossier `borne-arcade-port-calais` dans le répertoire personnel de l'utilisateur non-root (`/home/borne`) en utilisant la commande suivante dans le terminal : `sudo cp -r /mnt/borne-arcade-port-calais /home/borne/borne-arcade-port-calais`.
6. Démontez la clé USB en utilisant la commande suivante dans le terminal : `sudo umount /mnt` et retirez la clé USB.
7. Changez le propriétaire du dossier `borne-arcade-port-calais` en utilisant la commande suivante dans le terminal : `sudo chown -R borne:borne /home/borne/borne-arcade-port-calais`.
8. L'application est maintenant prête à être utilisée. Pour lancer l'application, modifiez votre `.xinitrc` pour lancer Firefox avec le chemin absolu vers le fichier `index.html` de l'application. Par exemple, si vous avez copié le dossier `borne-arcade-port-calais` dans le répertoire personnel de l'utilisateur non-root (`/home/borne`), vous pouvez utiliser la commande suivante dans le fichier `.xinitrc` :

```sh
# Lancer Firefox en mode kiosque
exec firefox --disable-pinch --kiosk /home/borne/borne-arcade-port-calais/index.html &
# ...
```

### Sortir de Firefox

Afin de quitter Firefox et de revenir à l'interface en ligne de commande, vous pouvez utiliser le raccourci clavier `Ctrl + Shift + W`. Cela fermera Firefox et le serveur X, vous ramenant à l'interface en ligne de commande.

Hors, vous pouvez également changer de terminal virtuel en utilisant les raccourcis clavier `Ctrl + Alt + F1` à `Ctrl + Alt + F6`. Par défaut, le serveur X est lancé sur le premier terminal virtuel, donc pour revenir à l'interface en ligne de commande, vous pouvez utiliser le raccourci clavier `Ctrl + Alt + F1`.

Pour redémarrer le serveur X, vous pouvez utiliser la commande `startx -- -nocursor` dans le terminal, ou redémarrer l'ordinateur.

## Remettre à zéro les scores

Pour remettre à zéro les scores, cliquez dix fois sur le nom de l'application sur la page attributions. Un message de confirmation apparaîtra. Cliquez sur "OK" pour remettre à zéro les scores.

## Liste des jeux

| Jeu             | Repo                                                                                                        | License                                                                | Demo                                                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Pacman          | [github.com/luciopanepinto/pacman](https://github.com/luciopanepinto/pacman)                                | GPLv3                                                                  | [pacman-e281c.firebaseapp.com](https://pacman-e281c.firebaseapp.com/)                                                                           |
| Tetris          | [github.com/jakesgordon/javascript-tetris](https://github.com/jakesgordon/javascript-tetris/)               | MIT                                                                    | [jakesgordon.com/games/tetris/](https://jakesgordon.com/games/tetris/)                                                                          |
| Puzzle          | [github.com/flbulgarelli/headbreaker](https://github.com/flbulgarelli/headbreaker)                          | ISC                                                                    | [flbulgarelli.github.io/headbreaker](https://flbulgarelli.github.io/headbreaker/)                                                               |
| Où est charlie? | Fait à partir de zéro.                                                                                      | GPLv3                                                                  | N/A                                                                                                                                             |
| 7 erreurs       | Fait à partir de zéro.                                                                                      | GPLv3                                                                  | N/A                                                                                                                                             |
| Quiz            | [Fait à partir de zéro.](jeux/quiz/)                                                                        | GPLv3                                                                  | N/A                                                                                                                                             |
| Blind test      | Fait à partir de zéro.                                                                                      | GPLv3                                                                  | N/A                                                                                                                                             |
| Qui est-ce?     | [github.com/flbulgarelli/headbreaker](https://github.com/flbulgarelli/headbreaker)                          | ISC                                                                    | [flbulgarelli.github.io/headbreaker](https://flbulgarelli.github.io/headbreaker/)                                                               |
| Labyrinthe      | [https://www.the-art-of-web.com/javascript/maze-game](https://www.the-art-of-web.com/javascript/maze-game/) | [Free to use and adapt](https://www.the-art-of-web.com/copyright.html) | [https://www.the-art-of-web.com/javascript/maze-game-large/](https://www.the-art-of-web.com/javascript/maze-game-large/)                        |
| Snake           | [github.com/rembound/Snake-Game-HTML5](https://github.com/rembound/Snake-Game-HTML5)                        | MIT                                                                    | [rembound.com/articles/creating-a-snake-game-tutorial-with-html5](https://rembound.com/articles/creating-a-snake-game-tutorial-with-html5#demo) |
| Flappy Bird     | [github.com/surajondev/JavaScript](https://github.com/surajondev/JavaScript)                                | MIT                                                                    | None                                                                                                                                            |

## Outil de traduction

Ce projet inclut un outil de traduction afin de modifier les fichiers langues de manière plus simple.

Pour l'utiliser, ouvrez le fichier `traduction.html` dans votre navigateur. Vous pouvez ensuite ouvrir les fichiers de langue qui sont dans le dossier `langues` et les modifier.

Une fois que vous avez fini, cliquez sur le bouton "Télécharger" pour télécharger le fichier de langue modifié. Il vous suffit ensuite de remplacer le fichier de langue original par le fichier modifié.

**Attention**: Lors de l'ouverture des fichiers de langue, assurez-vous que le navigateur ait bien accès aux fichiers locaux. Si ce n'est pas le cas, vous pouvez soit utiliser un serveur local pour ouvrir le fichier `traduction.html`, soit ouvrir le fichier `traduction.html` avec un navigateur configuré pour accéder aux fichiers locaux.

Assurez-vous également de sélectionner tout les fichiers de langue que vous souhaitez modifier lors de l'ouverture de ceux-ci.

## Licence

Ce projet est sous la licence GPLv3. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.
