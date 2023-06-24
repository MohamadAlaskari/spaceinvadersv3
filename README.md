Space Invaders: Benutzer- und Entwicklerhandbuch
Einführung
"Space Invaders" ist ein actionreiches Arcade-Spiel, entwickelt mit Phaser, npm und Vite.js. In diesem Spiel steuert der Spieler einen Charakter, der auf Feinde schießt. Durch das Besiegen der Feinde erhöht der Spieler seinen Punktestand.

GAME PLAY
Charaktere
Es gibt zwei Arten von Charakteren in "Space Invaders": den Spielercharakter und die Feinde. Der Spielercharakter kann auf die Feinde schießen und die Feinde können auf den Spielercharakter schießen.

Punktesystem
Für jeden besiegten Feind erhält der Spieler Punkte. Bei einem Punktestand von 15 und jeweils weiteren 15 Punkten steigt das Level des Spiels um eins.

Update-Bubbles
Mit jedem Levelaufstieg wird eine Update-Bubble im Spiel freigeschaltet. Der Spielercharakter kann diese Update-Bubble sammeln, um ein Upgrade zu erhalten, das es ihm ermöglicht, zwei Geschosse gleichzeitig abzufeuern.

Level und Endgegner
Das Spiel besteht aus insgesamt vier Leveln. In jedem Level werden die Feinde stärker. Im vierten und letzten Level muss der Spieler einen Endgegner, das Monster, bekämpfen. Das Monster kann mehr Geschosse abfeuern als normale Feinde und um das Spiel zu gewinnen, muss der Spieler das Monster zehnmal treffen.

INSTALLATION UND SETUP
Voraussetzungen
Um das Spiel auf einem lokalen Computer zu starten oder weiterzuentwickeln, muss eine Umgebung eingerichtet werden, die Node.js und npm unterstützt. Darüber hinaus wird Vite.js für die Entwicklung des Spiels benötigt.

Node.js und npm: Sie können Node.js und npm von der offiziellen Website herunterladen: HTTPS://NODEJS.ORG
Vite.js: Sie können Vite.js mit dem folgenden Befehl installieren:
npm install -g create-vite
Projekt Setup
Sobald Node.js und Vite.js auf Ihrem Computer installiert sind, folgen Sie den unten stehenden Anweisungen, um "Space Invaders" einzurichten:

Klonen Sie das "Space Invaders" Projekt aus dem Repository auf Ihren lokalen Computer.
Navigieren Sie in das Projektverzeichnis.
Installieren Sie alle Projekt-Abhängigkeiten mit dem Befehl npm install.
Nach erfolgreicher Installation der Abhängigkeiten können Sie das Spiel mit dem Befehl npm run dev npm run dev starten.
Das Spiel sollte jetzt in Ihrem Standard-Webbrowser laufen und auf localhost (meistens auf Port 5000 oder 3000) verfügbar sein.