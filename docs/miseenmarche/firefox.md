# Installation de Firefox

## Installation

Pour installer Firefox, utilisez la commande suivante dans le terminal :

```bash
sudo apt-get install firefox-esr
```

Pour activer le support des écrans tactiles, exécutez la commande suivante :

```bash
echo export MOZ_USE_XINPUT2=1 | sudo tee /etc/profile.d/use-xinput2.sh
```

## Configuration

Pour que le projet fonctionne correctement, vous devez changer certains paramètres de Firefox. Suivez les étapes suivantes une fois que vous avez ouvert Firefox pour la première fois depuis le serveur X :

1. Accéder à l'URL `about:config`. Si vous êtes en mode kiosque, vous pouvez appuyer sur `Ctrl + L` pour accéder à la barre d'adresse.
2. Recherchez `security.fileuri.strict_origin_policy` et assurez vous que cette valeur soit à `false`. Cela permet à Firefox d'accéder aux fichiers locaux.
3. Recherchez `browser.translations.automaticallyPopup` et assurez vous que cette valeur soit à `false`. Cela empêche la traduction automatique des pages web.
4. Recherchez `dom.w3c_touch_events.enabled` et assurez vous que cette valeur soit à `1`. Cela permet de supporter les écrans tactiles.

## Quitter Firefox

Pour quitter Firefox et revenir à l'interface en ligne de commande, utilisez le raccourci clavier `Ctrl + Shift + W`. Cela fermera Firefox et le serveur X, vous ramenant à l'interface en ligne de commande.

Vous pouvez également changer de terminal virtuel en utilisant les raccourcis clavier `Ctrl + Alt + F1` à `Ctrl + Alt + F6`. Par défaut, le serveur X est lancé sur le premier terminal virtuel, vous pouvez donc utiliser le raccourci clavier `Ctrl + Alt + F1` pour revenir à l'interface de la borne après avoir changé de terminal virtuel.

Pour redémarrer le serveur X après l'avoir quitté, utilisez la commande suivante dans le terminal :

```bash
startx -- -nocursor
```

Ou, plus simplement, redémarrez l'ordinateur.