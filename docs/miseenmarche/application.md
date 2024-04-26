# Installation de l'application

## Prérequis

Avant de commencer l'installation, assurez-vous d'avoir installé [Git](https://git-scm.com/) sur votre machine. Si ce n'est pas le cas, vous pouvez l'installer en utilisant la commande suivante dans le terminal :

```bash
sudo apt-get install git
```

Si vous ne souhaitez pas installer Git, vous pouvez également télécharger le dépôt sur une clé USB et le copier sur l'ordinateur.

## Clonage du dépôt

Pour obtenir une copie du dépôt sur votre machine, utilisez la commande suivante dans le terminal :

```bash
git clone https://github.com/JrCanDev/borne-arcade-port-calais.git
```

Si vous ne souhaitez pas utiliser Git, vous pouvez télécharger le dépôt en cliquant sur le bouton "Code" en haut de la [page du dépôt](https://github.com/JrCanDev/borne-arcade-port-calais).

## Extraction du dépôt

Si vous avez téléchargé le dépôt, décompressez et extrayez le fichier téléchargé.

## Utilisation d'une clé USB

Si vous n'utilisez pas de clé USB, vous pouvez passer à la section "Changement de propriétaire". Si vous utilisez une clé USB, suivez les étapes suivantes :

- Branchez la clé USB contenant le dossier `borne-arcade-port-calais` sur l'ordinateur de la borne d'arcade.
- Montez la clé USB en utilisant la commande suivante dans le terminal :

```bash
sudo mount /dev/sdX /mnt
```

Remplacez `/dev/sdX` par le nom de votre périphérique USB. Vous pouvez trouver ce nom en utilisant la commande `lsblk`.

- Copiez le dossier `borne-arcade-port-calais` dans le répertoire personnel de l'utilisateur non-root (`/home/borne`) en utilisant la commande suivante dans le terminal :

```bash
sudo cp -r /mnt/borne-arcade-port-calais /home/borne/borne-arcade-port-calais
```

- Démontez la clé USB en utilisant la commande suivante dans le terminal :

```bash
sudo umount /mnt
```

Retirez ensuite la clé USB.

## Changement de propriétaire

Pour que l'application fonctionne correctement, vous devez changer le propriétaire du dossier `borne-arcade-port-calais`. Utilisez la commande suivante dans le terminal :

```bash
sudo chown -R borne:borne /home/borne/borne-arcade-port-calais
```

Remplacez `borne` par le nom de l'utilisateur non-root et `/home/borne/borne-arcade-port-calais` par le chemin absolu vers le dossier contenant l'application.