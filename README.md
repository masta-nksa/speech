# speech – Englisches Vokabel-Lernprogramm

Live: https://masta-nksa.github.io/speech/

Statische Seite auf GitHub Pages, kein Build-Schritt. Der Wortschatz kommt aus
`lessons.csv`; Anmeldung und Registrierung laufen über Firebase Authentication.

| Pfad | Inhalt |
|---|---|
| `index.html` | das Lernprogramm (Markup, Stil und Skript in einer Datei) |
| `login.html`, `register.html` | Anmeldung und Registrierung (Firebase Auth) |
| `lessons.csv` | Wortschatz, Semikolon-getrennt: `Lektion;Englisch;Deutsch` |
| `img/` | Heldenbilder (GIF) |
| `dev/` | überarbeitete Fassung mit ausgelagertem `app.js` und `styles.css`, wird unter `/speech/dev/` ausgeliefert |

Verwandt ist der [Vokabeltrainer](https://github.com/masta-nksa/vokabeltrainer):
mehrsprachig, mit denselben Lektionsdaten (etwa *2_0 Welcome back!*).
