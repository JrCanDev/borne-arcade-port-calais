# Borne d'Arcade du Port de Calais

Ce projet à été développé par Joshua Vandaële lors d'un stage se déroulant dans le cadre d'un projet entre le Port Boulogne Calais, VIIA, La Société des Ports du Détroit, le Sas Coluche de la Ville de Calais, JrCanDev, l'Université du Littoral Côte d'Opale et le Lycée Professionnel Pierre de Coubertin.

- [Borne d'Arcade du Port de Calais](#borne-darcade-du-port-de-calais)
  - [Mise en marche](#mise-en-marche)
    - [Préambule](#préambule)
    - [Installation de Debian](#installation-de-debian)
    - [Installation de Firefox](#installation-de-firefox)
      - [Configuration de Firefox](#configuration-de-firefox)
      - [Sortir de Firefox](#sortir-de-firefox)
    - [Installation de l'application](#installation-de-lapplication)
    - [Installation du serveur X](#installation-du-serveur-x)
    - [Démarrage automatique](#démarrage-automatique)
  - [Remettre à zéro les scores](#remettre-à-zéro-les-scores)
  - [Liste des jeux](#liste-des-jeux)
  - [Outil de traduction](#outil-de-traduction)
  - [Licence](#licence)

## Mise en marche

Ce projet nécessite l'installation de [Debian](https://www.debian.org/) avec une installation non graphique (sans [Environnement de bureau](https://fr.wikipedia.org/wiki/Environnement_de_bureau)), de [Firefox](https://www.mozilla.org/fr/firefox/), et d'un [serveur X](https://fr.wikipedia.org/wiki/X_Window_System) minimal. Pour la première mise en marche, une connexion internet est nécessaire pour télécharger les paquets nécessaires. Une fois l'installation terminée, la borne peut fonctionner hors ligne.

### Préambule

Pour les étapes suivantes, vous aurez besoin de brancher la borne à internet via un câble Ethernet, de connecter un clavier et une souris USB, et de brancher un écran à la borne. Vous aurez également besoin d'une clé USB pour installer Debian, et d'un ordinateur pour télécharger l'image ISO de Debian et la flasher sur la clé USB.

Pour éditer les fichiers de configuration, vous pouvez utiliser l'éditeur de texte `nano` en utilisant la commande suivante dans le terminal : `nano <fichier>`, où `<fichier>` est le fichier que vous souhaitez éditer. Vous pouvez également utiliser un autre éditeur de texte si vous le préférez. Pour enregistrer et quitter le fichier dans `nano`, appuyez sur `Ctrl + O`, puis sur `Entrée`, puis sur `Ctrl + X` pour quitter.

Pour exécuter des commandes en tant que [superutilisateur](https://fr.wikipedia.org/wiki/Utilisateur_root), vous pouvez utiliser la commande `sudo` suivi de la commande que vous souhaitez exécuter. Cela permet d'exécuter la commande en tant que l'utilisateur `root`, qui a les permissions nécessaires pour effectuer des tâches d'administration.

### Installation de Debian

1. Téléchargez l'image ISO netinstall de Debian **standard** (Sans [environnement de bureau](https://fr.wikipedia.org/wiki/Environnement_de_bureau)) sur le site officiel de Debian : [https://www.debian.org/CD/live/](https://www.debian.org/CD/live/).
2. Flasher l'image ISO sur une clé USB en utilisant un logiciel tel que [Rufus](https://github.com/pbatard/rufus/releases/latest) ou [Etcher](https://github.com/balena-io/etcher/releases/latest).
3. Démarrez votre ordinateur sur la clé USB.
4. Suivez les instructions d'installation de Debian.
   1. Lors de l'étape de sélection du nom de l'ordinateur, choisissez `borne`.
   2. Lors de l'étape de sélection du nom de l'utilisateur, choisissez `borne`.
   3. Lors de l'étape de sélection du mot de passe, choisissez `borne`.
5. Une fois l'installation terminée, redémarrez votre ordinateur, retirez la clé USB et connectez-vous en tant que l'utilisateur borne.
6. Retirez le mot de passe de l'utilisateur borne en utilisant la commande suivante dans le terminal : `sudo passwd -d borne`.
7. Installez les mises à jour en utilisant la commande suivante dans le terminal : `sudo apt-get update && sudo apt-get upgrade`.
8. Pour activer la connexion automatique de l'utilisateur borne et le lancement de l'interface graphique au démarrage, vous devez modifier certains fichiers de configuration. Ouvrez le fichier `/etc/systemd/logind.conf` en utilisant la commande suivante dans le terminal : `sudo nano /etc/systemd/logind.conf`. Recherchez la ligne `#NAutoVTs=6` et remplacez-la par `NAutoVTs=1`. Enregistrez et quittez le fichier.
9.  Créez un fichier override pour le service `getty@tty1` en utilisant la commande suivante dans le terminal : `sudo systemctl edit getty@tty1`. Ajoutez les lignes suivantes dans le fichier et enregistrez-le :

```conf
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin borne --noclear %I $TERM
```

Cela permettra à l'utilisateur non-root de se connecter automatiquement et de lancer l'interface graphique sur le premier terminal virtuel.

10. Cachez [grub](https://fr.wikipedia.org/wiki/GNU_GRUB) au démarrage en modifiant le fichier de configuration `/etc/default/grub` en utilisant la commande `sudo nano /etc/default/grub`. Ajoutez et modifiez les lignes suivantes dans le fichier et enregistrez-le :

```conf
GRUB_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT_QUIET=true
```

Enregistrez et quittez le fichier, puis mettez à jour la configuration de grub en utilisant la commande suivante dans le terminal : `sudo update-grub`.
 
11.  (Optionel): Désactivez les services inutiles afin d'accélerer le temps pour boot en utilisant la commande suivante dans le terminal : `sudo systemctl mask <service>`. Remplacez `<service>` par le nom du service que vous souhaitez désactiver. Par exemple, pour désactiver le service `bluetooth`, utilisez la commande suivante : `sudo systemctl mask bluetooth`. Quelques services que vous pouvez désactiver sont:

- `bluetooth` - Si vous n'utilisez pas le Bluetooth.
- `cups` - Si vous n'utilisez pas d'imprimante.
- `exim4` - Si vous n'utilisez pas de serveur de messagerie.

### Installation de Firefox

1. Installez Firefox en utilisant la commande suivante dans le terminal : `sudo apt-get install firefox-esr`.
2. Exécutez la commande `echo export MOZ_USE_XINPUT2=1 | sudo tee /etc/profile.d/use-xinput2.sh` pour activer le support des écrans tactiles.

#### Configuration de Firefox

Pour que le projet fonctionne correctement, vous devez changer certains paramètres de Firefox. Pour ce faire, suivez les étapes suivantes une fois que vous avez ouvert Firefox pour la première fois depuis le serveur X :

1. Accéder à l'URL `about:config`. Si vous êtes en mode kiosque, vous pouvez appuyer sur `Ctrl + L` pour accéder à la barre d'adresse.
2. Recherchez `security.fileuri.strict_origin_policy` et assurez vous que cette valeur soit à `false`. Cela permet à Firefox d'accéder aux fichiers locaux.
3. Recherchez `browser.translations.automaticallyPopup` et assurez vous que cette valeur soit à `false`. Cela empêche la traduction automatique des pages web.
4. Recherchez `dom.w3c_touch_events.enabled` et assurez vous que cette valeur soit à `1`. Cela permet de supporter les écrans tactiles.

#### Sortir de Firefox

Afin de quitter Firefox et de revenir à l'interface en ligne de commande, vous pouvez utiliser le raccourci clavier `Ctrl + Shift + W`. Cela fermera Firefox et le serveur X, vous ramenant à l'interface en ligne de commande.

Hors, vous pouvez également changer de terminal virtuel en utilisant les raccourcis clavier `Ctrl + Alt + F1` à `Ctrl + Alt + F6`. Par défaut, le serveur X est lancé sur le premier terminal virtuel, vous pouvez donc utiliser le raccourci clavier `Ctrl + Alt + F1` pour revenir à l'interface de la borne après avoir changé de terminal virtuel.

Pour redémarrer le serveur X après l'avoir quité, vous pouvez utiliser la commande `startx -- -nocursor` dans le terminal, ou plus simplement redémarrer l'ordinateur.

### Installation de l'application

Si vous souhaitez clonez le dépot sur l'ordinateur de la borne, installez [Git](https://git-scm.com/) en utilisant la commande suivante dans le terminal : `sudo apt-get install git`. Sinon, vous pouvez télécharger le dépot sur une clé USB et le copier sur l'ordinateur.

1. Clonez ce dépôt en utilisant la commande suivante dans le terminal : `git clone https://github.com/JrCanDev/borne-arcade-port-calais.git` ou téléchargez le dépot avec le bouton "Code" en haut de la page.
2. Décompressez et extrayez le fichier téléchargé si vous avez téléchargé le dépot.
3. Si vous n'utilisez pas de clé USB, allez à l'étape 7. Sinon, branchez la clé USB sur l'ordinateur.
4. Montez la clé USB en utilisant la commande suivante dans le terminal : `sudo mount /dev/sdX /mnt`, où `/dev/sdX` est le périphérique de la clé USB. Vous pouvez trouver le périphérique de la clé USB en utilisant la commande `lsblk`.
5. Le contenu de la clé USB sera monté dans le répertoire `/mnt`. Copiez le dossier `borne-arcade-port-calais` dans le répertoire personnel de l'utilisateur non-root (`/home/borne`) en utilisant la commande suivante dans le terminal : `sudo cp -r /mnt/borne-arcade-port-calais /home/borne/borne-arcade-port-calais`.
6. Démontez la clé USB en utilisant la commande suivante dans le terminal : `sudo umount /mnt` et retirez la clé USB.
7. Changez le propriétaire du dossier `borne-arcade-port-calais` en utilisant la commande suivante dans le terminal : `sudo chown -R borne:borne /home/borne/borne-arcade-port-calais` ou `borne` est le nom de l'utilisateur non-root et `/home/borne/borne-arcade-port-calais` est le chemin absolu vers le dossier contenant l'application.

### Installation du serveur X

1. Installez le serveur X et les outils que l'on utilisera en utilisant la commande suivante dans le terminal : `sudo apt-get install xorg xdotool`.
2. Créez un fichier `.xinitrc` dans le répertoire personnel de l'utilisateur non-root (`/home/borne/.xinitrc`) et ajoutez-y les lignes suivante en utilisant un editeur de texte tel que `nano` :

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

Le fichier `.bashrc` est exécuté à chaque connexion de l'utilisateur.

### Démarrage automatique

Pour démarrer automatiquement la borne lorsqu'elle est branchée, il est possible que vous deviez modifier les paramètres du BIOS de l'ordinateur pour qu'il démarre automatiquement lorsqu'il est branché. Les paramètres du BIOS varient en fonction du fabricant de l'ordinateur, donc vous devrez consulter le manuel de l'ordinateur ou le site Web du fabricant pour plus d'informations sur la façon de modifier les paramètres du BIOS. Le paramètre que vous devrez modifier est généralement appelé "Power On After Power Loss" ou quelque chose de similaire, et vous devrez le définir sur "On", "Always", ou "Enabled".

## Remettre à zéro les scores

Pour remettre à zéro les scores, cliquez dix fois sur le nom de l'application sur la page attributions. Un message de confirmation apparaîtra. Cliquez sur "OK" pour remettre à zéro les scores.

## Liste des jeux

| Jeu             | Repo                                                                                          | License | Demo                                                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Pacman          | [github.com/luciopanepinto/pacman](https://github.com/luciopanepinto/pacman)                  | GPLv3   | [pacman-e281c.firebaseapp.com](https://pacman-e281c.firebaseapp.com/)                                                                           |
| Tetris          | [github.com/jakesgordon/javascript-tetris](https://github.com/jakesgordon/javascript-tetris/) | MIT     | [jakesgordon.com/games/tetris/](https://jakesgordon.com/games/tetris/)                                                                          |
| Puzzle          | [github.com/flbulgarelli/headbreaker](https://github.com/flbulgarelli/headbreaker)            | ISC     | [flbulgarelli.github.io/headbreaker](https://flbulgarelli.github.io/headbreaker/)                                                               |
| Où est charlie? | Fait à partir de zéro.                                                                        | GPLv3   | N/A                                                                                                                                             |
| 7 erreurs       | Fait à partir de zéro.                                                                        | GPLv3   | N/A                                                                                                                                             |
| Quiz            | [Fait à partir de zéro.](jeux/quiz/)                                                          | GPLv3   | N/A                                                                                                                                             |
| Blind test      | Fait à partir de zéro.                                                                        | GPLv3   | N/A                                                                                                                                             |
| Qui est-ce?     | [github.com/flbulgarelli/headbreaker](https://github.com/flbulgarelli/headbreaker)            | ISC     | [flbulgarelli.github.io/headbreaker](https://flbulgarelli.github.io/headbreaker/)                                                               |
| Labyrinthe      | Fait à partir de zéro.                                                                        | GPLv3   | N/A                                                                                                                                             |
| Snake           | [github.com/rembound/Snake-Game-HTML5](https://github.com/rembound/Snake-Game-HTML5)          | MIT     | [rembound.com/articles/creating-a-snake-game-tutorial-with-html5](https://rembound.com/articles/creating-a-snake-game-tutorial-with-html5#demo) |
| Flappy Bird     | [github.com/surajondev/JavaScript](https://github.com/surajondev/JavaScript)                  | MIT     | None                                                                                                                                            |

## Outil de traduction

Ce projet comprend un outil de traduction pour faciliter la modification des fichiers de langue.

Voici comment l'utiliser :

1. Ouvrez le fichier `traduction.html` dans votre navigateur.
2. Sélectionnez les fichiers de langue que vous souhaitez modifier. Ces fichiers se trouvent dans le dossier `langues`.
3. Modifiez les fichiers de langue selon vos besoins.
4. Une fois terminé, cliquez sur le bouton "Télécharger" pour obtenir le fichier de langue modifié.
5. Remplacez le fichier de langue original par le fichier modifié. Veillez à ne pas changer le nom ou l'extension du fichier, sinon l'application ne pourra pas lire correctement le fichier de langue. (Exemple: `fr.json`, `en.json`, etc.)

**Note importante** : Lors de l'ouverture des fichiers de langue, assurez-vous que votre navigateur peut accéder aux fichiers locaux. Si ce n'est pas le cas, vous avez deux options :

- Utilisez un serveur local pour ouvrir le fichier `traduction.html`.
- Configurez votre navigateur pour accéder aux fichiers locaux. Par exemple, pour Firefox, ouvrez Firefox et accédez à l'URL `about:config`. Recherchez `security.fileuri.strict_origin_policy` et assurez-vous que cette valeur soit à `false`.

N'oubliez pas de sélectionner tous les fichiers de langue que vous souhaitez modifier lors de leur ouverture.

## Licence

Ce projet est sous la licence GPLv3. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.
