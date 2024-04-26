# Mise en marche

## Prérequis

Ce projet nécessite l'installation de [Debian](https://www.debian.org/) avec une installation non graphique (sans [Environnement de bureau](https://fr.wikipedia.org/wiki/Environnement_de_bureau)), de [Firefox](https://www.mozilla.org/fr/firefox/), et d'un [serveur X](https://fr.wikipedia.org/wiki/X_Window_System) minimal. Pour la première mise en marche, une connexion internet est nécessaire pour télécharger les paquets nécessaires. Une fois l'installation terminée, la borne peut fonctionner hors ligne.

## Matériel nécessaire

Pour les étapes suivantes, vous aurez besoin de :

- Brancher la borne à internet via un câble Ethernet
- Connecter un clavier et une souris USB
- Brancher un écran à la borne
- Une clé USB pour installer Debian
- Un ordinateur pour télécharger l'image ISO de Debian et la flasher sur la clé USB

## Édition de fichiers de configuration

Pour éditer les fichiers de configuration, vous pouvez utiliser l'éditeur de texte `nano` en utilisant la commande suivante dans le terminal : `nano <fichier>`, où `<fichier>` est le fichier que vous souhaitez éditer. Vous pouvez également utiliser un autre éditeur de texte si vous le préférez. Pour enregistrer et quitter le fichier dans `nano`, appuyez sur `Ctrl + O`, puis sur `Entrée`, puis sur `Ctrl + X` pour quitter.

## Exécution de commandes en tant que superutilisateur

Pour exécuter des commandes en tant que [superutilisateur](https://fr.wikipedia.org/wiki/Utilisateur_root), vous pouvez utiliser la commande `sudo` suivi de la commande que vous souhaitez exécuter. Cela permet d'exécuter la commande en tant que l'utilisateur `root`, qui a les permissions nécessaires pour effectuer des tâches d'administration.

## Démarrage automatique

Pour démarrer automatiquement la borne lorsqu'elle est branchée, il est possible que vous deviez modifier les paramètres du BIOS de l'ordinateur pour qu'il démarre automatiquement lorsqu'il est branché. Les paramètres du BIOS varient en fonction du fabricant de l'ordinateur, donc vous devrez consulter le manuel de l'ordinateur ou le site Web du fabricant pour plus d'informations sur la façon de modifier les paramètres du BIOS. Le paramètre que vous devrez modifier est généralement appelé "Power On After Power Loss" ou quelque chose de similaire, et vous devrez le définir sur "On", "Always", ou "Enabled".