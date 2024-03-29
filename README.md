# Borne d'Arcade du Port de Calais

Ce projet à été développé par Joshua Vandaële lors d'un stage se déroulant dans le cadre d'un projet entre le Port Boulogne Calais, VIIA, La Société des Ports du Détroit, le SAS Coluche de la Ville de Calais, JrCanDev, l'Université du Littoral Côte d'Opale et le Lycée Professionnel Pierre de Coubertin.

- [Borne d'Arcade du Port de Calais](#borne-darcade-du-port-de-calais)
  - [Mise en marche](#mise-en-marche)
    - [Installation de Debian](#installation-de-debian)
    - [Installation de Firefox](#installation-de-firefox)
    - [Installation du serveur X](#installation-du-serveur-x)
  - [Remettre à zéro les scores](#remettre-à-zéro-les-scores)
  - [Liste des jeux](#liste-des-jeux)
  - [Outil de traduction](#outil-de-traduction)
  - [Licence](#licence)

## Mise en marche

Ce projet nécessite l'installation de Debian avec une installation non graphique (sans DE tels que GNOME), de Firefox, et d'un serveur X minimal. Pour la première mise en marche, certains paramètres ont besoin d'être changé.

### Installation de Debian

1. Téléchargez l'image ISO netinstall de Debian sur le site officiel de Debian : [https://www.debian.org/distrib/](https://www.debian.org/distrib/).
2. Flasher l'image ISO sur une clé USB en utilisant un logiciel tel que Rufus ou Etcher.
3. Démarrez votre ordinateur sur la clé USB.
4. Suivez les instructions d'installation de Debian. Lorsque vous arrivez à l'étape de sélection des paquets, décochez toutes les cases pour n'installer aucun paquet. Cela installera une installation minimale de Debian sans interface graphique.
5. Une fois l'installation terminée, redémarrez votre ordinateur, retirez la clé USB et connectez-vous en tant que root.
6. Installez les mises à jour en utilisant la commande suivante dans le terminal : `sudo apt-get update && sudo apt-get upgrade`.
7. Créez un utilisateur non-root en utilisant la commande suivante dans le terminal : `sudo adduser borne`. Cet utilisateur sera utilisé pour se connecter automatiquement et lancer l'interface graphique.
8. Faite que l'utilisateur non-root se connecte automatiquement en utilisant la commande suivante dans le terminal : `sudo nano /etc/systemd/logind.conf`. Recherchez la ligne `#NAutoVTs=6` et remplacez-la par `NAutoVTs=1`. Enregistrez et quittez le fichier.
9.  Créez un fichier override pour le service `getty@tty1` en utilisant la commande suivante dans le terminal : `sudo systemctl edit getty@tty1`. Ajoutez les lignes suivantes dans le fichier et enregistrez-le :

```conf
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin borne --noclear %I $TERM
```

Cela permettra à l'utilisateur non-root de se connecter automatiquement et de lancer l'interface graphique sur le premier terminal virtuel.

10. Suivez les étapes suivantes pour installer Firefox et le serveur X.
11. Redémarrez votre ordinateur pour que les changements prennent effet.

### Installation de Firefox

1. Installez Firefox en utilisant la commande suivante dans le terminal : `sudo apt-get install firefox`.

Pour que le projet fonctionne correctement, vous devez changer certains paramètres de Firefox. Pour ce faire, suivez les étapes suivantes une fois que vous avez ouvert Firefox pour la première fois depuis le serveur X :

1. Accéder à l'URL `about:config`. Si vous êtes en mode kiosque, vous pouvez appuyer sur `Ctrl + L` pour accéder à la barre d'adresse.
2. Recherchez `security.fileuri.strict_origin_policy` et assurez vous que cette valeur soit à `false`. Cela permet à Firefox d'accéder aux fichiers locaux.
3. Recherchez `browser.translations.automaticallyPopup` et assurez vous que cette valeur soit à `false`. Cela empêche la traduction automatique des pages web.

### Installation du serveur X

1. Installez le serveur X en utilisant la commande suivante dans le terminal : `sudo apt-get install xorg`.
2. Créez un fichier `.xinitrc` dans le répertoire personnel de l'utilisateur non-root (`/home/borne/.xinitrc`) et ajoutez la ligne suivante : `exec firefox --disable-pinch --kiosk /chemin/absolut/vers/index.html`. Cela permettra de lancer Firefox en mode kiosque au démarrage du serveur X.
3. Rendez le fichier `.xinitrc` exécutable avec la commande : `chmod +x ~/.xinitrc`.

`--disable-pinch` est utilisé pour désactiver le zoom sur les écrans tactiles.
  
`--kiosk` est utilisé pour ouvrir Firefox en mode kiosque, ce qui signifie que Firefox s'ouvrira en plein écran sans barre d'adresse ni barre d'onglets.

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
