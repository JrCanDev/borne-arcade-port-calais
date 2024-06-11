# Installation du serveur X

## Prérequis

Installez le serveur X et les outils que l'on utilisera en utilisant la commande suivante dans le terminal :

```bash
sudo apt-get install xorg xdotool pulseaudio
```

## Configuration du serveur X

Créez la configuration du serveur X par défaut en utilisant la commande suivante :

```bash
Xorg -configure
mv xorg.conf.new /etc/X11/xorg.conf.d/xorgconfigure.conf
```

Cela permettra de créer un fichier de configuration du serveur X qui correspond à la configuration actuelle de l'écran.

Créez un fichier `.xinitrc` dans le répertoire personnel de l'utilisateur non-root (`/home/borne/.xinitrc`) et ajoutez-y les lignes suivante en utilisant un editeur de texte tel que `nano` :

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

`/chemin/absolut/vers/index.html` doit être remplacé par le chemin absolu vers le fichier HTML que vous souhaitez afficher dans Firefox. Par exemple, `/home/borne/borne-arcade-port-calais/index.html`.

`--disable-pinch` est utilisé pour désactiver le zoom sur les écrans tactiles.

`--kiosk` est utilisé pour ouvrir Firefox en mode kiosque, ce qui signifie que Firefox s'ouvrira en plein écran sans barre d'adresse ni barre d'onglets.

## Rendre le fichier exécutable

Rendez le fichier `.xinitrc` exécutable avec la commande :

```bash
sudo chmod +x .xinitrc
```

## Lancer le serveur X au démarrage

Ajoutez les lignes suivantes a la fin du fichier `.bashrc` de l'utilisateur non-root (`/home/borne/.bashrc`) pour lancer le serveur X au démarrage :

```bash
if [ -z "$DISPLAY" ] && [ $(tty) == /dev/tty1 ]; then
  # On a besoin de sleep quelque millisecondes pour
  # laisser la fonctionalité de l'écran tactile s'initialiser.
  # On utilise 2 secondes pour être sûr.
  sleep 2
  startx -- -nocursor
fi
```

Le fichier `.bashrc` est exécuté à chaque connexion de l'utilisateur.
