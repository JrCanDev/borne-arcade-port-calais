# Installation de Debian

## Préparation

1. Téléchargez l'image ISO netinstall de Debian **standard** (Sans [environnement de bureau](https://fr.wikipedia.org/wiki/Environnement_de_bureau)) sur le site officiel de Debian : [https://www.debian.org/CD/live/](https://www.debian.org/CD/live/).
1. Flasher l'image ISO sur une clé USB en utilisant un logiciel tel que [Rufus](https://github.com/pbatard/rufus/releases/latest) ou [Etcher](https://github.com/balena-io/etcher/releases/latest).

## Installation

1. Démarrez votre ordinateur sur la clé USB.
1. Suivez les instructions d'installation de Debian.
   - Lors de l'étape de sélection du nom de l'ordinateur, choisissez `borne`.
   - Lors de l'étape de sélection du nom de l'utilisateur, choisissez `borne`.
   - Lors de l'étape de sélection du mot de passe, choisissez `borne`.

## Configuration initiale

1. Une fois l'installation terminée, redémarrez votre ordinateur, retirez la clé USB et connectez-vous en tant que l'utilisateur borne.
2. Ajouter l'utilisateur borne au groupe `sudo` en utilisant la commande suivante dans le terminal : `su - -c "usermod -aG sudo borne"`.
3. Relancez la session de l'utilisateur borne en vous déconnectant et en vous reconnectant avec la commande `exit`.
4. Retirez le mot de passe de l'utilisateur borne en utilisant la commande suivante dans le terminal : `sudo passwd -d borne`.
5. Installez les mises à jour en utilisant la commande suivante dans le terminal : `sudo apt-get update && sudo apt-get upgrade`.

## Configuration de l'interface utilisateur

Pour activer la connexion automatique de l'utilisateur borne et le lancement de l'interface graphique au démarrage, vous devez modifier certains fichiers de configuration.

1. Ouvrez le fichier `/etc/systemd/logind.conf` en utilisant la commande suivante dans le terminal : `sudo nano /etc/systemd/logind.conf`. Recherchez la ligne `#NAutoVTs=6` et remplacez-la par `NAutoVTs=1`. Enregistrez et quittez le fichier.

2. Créez un fichier override pour le service `getty@tty1` en utilisant la commande suivante dans le terminal : `sudo systemctl edit getty@tty1`. Ajoutez les lignes suivantes dans le fichier et enregistrez-le :

```conf
[Service]
ExecStart=
ExecStart=-/sbin/agetty --autologin borne --noclear %I $TERM
```

## Configuration de grub

1. Cachez [grub](https://fr.wikipedia.org/wiki/GNU_GRUB) au démarrage en modifiant le fichier de configuration `/etc/default/grub` en utilisant la commande `sudo nano /etc/default/grub`. Ajoutez et modifiez les lignes suivantes dans le fichier et enregistrez-le :

```conf
GRUB_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT=0
GRUB_HIDDEN_TIMEOUT_QUIET=true
```

Enregistrez et quittez le fichier, puis mettez à jour la configuration de grub en utilisant la commande suivante dans le terminal : `sudo update-grub`.

## Optimisation du démarrage (Optionnel)

1. Désactivez les services inutiles afin d'accélerer le temps pour boot en utilisant la commande suivante dans le terminal : `sudo systemctl mask <service>`. Remplacez `<service>` par le nom du service que vous souhaitez désactiver. Par exemple, pour désactiver le service `bluetooth`, utilisez la commande suivante : `sudo systemctl mask bluetooth`. Quelques services que vous pouvez désactiver sont:

- `bluetooth` - Si vous n'utilisez pas le Bluetooth.
- `cups` - Si vous n'utilisez pas d'imprimante.
- `exim4` - Si vous n'utilisez pas de serveur de messagerie.

Une liste complète des services peut être trouvée en utilisant la commande suivante dans le terminal : `systemctl list-unit-files`.
