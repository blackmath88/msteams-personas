# Assistant-Bridge-Trial vom 31.10.2026

Vier von vier Läufen lieferten ohne manuelle JSON-Änderung ein valides Projekt und drei erfolgreich gerenderte PNGs. Das ist ein technischer Durchlaufnachweis; zwei Läufe haben eine Warnung mit sichtbarem Inhaltsverlust, und die Lehrqualität ist unterschiedlich. Die Bewertung stammt von einem KI-Worker, nicht von einer Trainerin oder einem Trainer.

## Methode und Abgrenzung

Arbeitsbasis: `5a6ece61947b43d7dd54c2063c16faa29734d94f`, eigener Orca-Worktree `bridge-trial`. Kein Code, Test, bestehendes Dokument oder Pack-Wortlaut wurde geändert; kein Commit und kein Push. Die frühere Weavr-Mission wurde nicht reaktiviert. Dies war der direkt beauftragte Orca-Versuch, keine neue Mission und keine Änderung der Governance.

Die unveränderte Funktion `require('./src/project-core.js').authoringPack(brief)` erzeugte die beiden exakten Packs. Ausgeführt wurde ein Node-Here-Document statt der im Auftrag genannten `node -e`-Schreibweise; Funktionsaufruf und Eingaben sind identisch. [Brief A](evidence-bridge-trial/brief-A.json) und [Brief B](evidence-bridge-trial/brief-B.json) enthalten die vorgegebenen vier deutschen Felder, [Pack A](evidence-bridge-trial/pack-A.txt) und [Pack B](evidence-bridge-trial/pack-B.txt) die unveränderten Rückgaben. Pack-Kennung in jedem Lauf: `msteams-personas/project`, `projectVersion 1`, `capabilityVersion 1`; eine separate Pack-Revision existiert nicht. Die Baseline und SHA-256-Datei identifizieren den tatsächlichen Wortlaut.

Jeder Lauf erhielt das Pack und genau die angehängte Zeile «Bitte nutze die Standards und gib direkt das fertige JSON-Projekt zurück.» Der Storyboard-Dialog wurde damit übersprungen. Claude A lieferte trotzdem drei Storyboard-Zeilen vor dem JSON, ohne eine Antwort abzuwarten. Es gab keine weitere inhaltliche Steuerung.

Zwei echte CLI-Umgebungen, keine Konsumenten-Chat-Oberflächen:

- Claude Code `2.1.303`: `claude -p --tools "" --strict-mcp-config`, ohne Werkzeuge und ohne konfigurierte MCP-Server in diesem Aufruf.
- Codex CLI `0.163.0`: `codex exec --sandbox read-only --skip-git-repo-check -C <emptydir> -o <answerfile> -`, Prompt auf stdin. Die normale lokale Konfiguration blieb aktiv. Beide Codex-Diagnoselogs zeigen einen MCP-Initialisierungsfehler mit einer HTML-Challenge; die Antworterzeugung endete trotzdem erfolgreich. Das ist keine nachgewiesen werkzeugfreie Codex-Umgebung.

Jeder Prozess startete in einem eigenen frischen leeren Verzeichnis unter `/tmp`, ausserhalb des Repositories. Das trennt den Arbeitskontext, ist aber insbesondere bei Codex keine Dateisystem-Isolation gegen lesenden Zugriff auf andere absolute Pfade. Die übergebenen Prompts enthielten keinen Repository-Pfad; das Ausgabeargument von Codex enthielt zwangsläufig den Evidence-Pfad. Es wird deshalb keine hermetische Isolation behauptet. Die vier unabhängigen Prozesse liefen gleichzeitig; Laufzeiten sind reale Prozess-Wandzeiten einschliesslich Start und CLI-Overhead, keine menschlichen Bearbeitungszeiten.

Fehlende Abhängigkeiten wurden mit `npm ci` installiert: 17 Pakete, Audit ohne gemeldete Schwachstellen. Validierung jeweils mit `node tools/cli.mjs validate <answerfile>`, direkt gegen die unveränderte komplette Antwort inklusive Begleitprosa und JSON-Fence. Danach `CHROMIUM=/usr/bin/chromium node tools/cli.mjs render <answerfile> --out <run>/render --scale 1`. Der Renderer wählt einen zufälligen lokalen Port; Port 8766 wurde nicht gezielt benutzt. Alle zwölf Original-PNGs wurden geöffnet und visuell betrachtet, nicht nur die Manifeste. Es gab keine Fit-Fehler, sichtbare Textabschneidung oder Editor-Steuerelemente im Export.

Bei Fehlern wären höchstens zwei neue One-Shots mit `repairPrompt(parseInput(answer).project, errors)` erfolgt, entsprechend der Website. Da alle vier Antworten bereits valide waren, gab es keine Reparaturrunde und keine Reparaturprompts. Warnungen wurden unverändert belassen. Der Reparaturpfad wurde durch diesen Versuch nicht erprobt.

## Ergebnisse

Alle vier Läufe haben null Validierungsfehler, null Reparaturrunden und null manuelle JSON-Eingriffe. Die Werte unten beziehen sich auf Runde 0; weitere Runden existieren nicht.

| Lauf und Belege | CLI | Zeit Runde 0 | Warnungen | Render | Technischer Pass |
| --- | --- | ---: | --- | --- | --- |
| [Claude A](evidence-bridge-trial/claude-A/round-0-execution.json) | Claude Code 2.1.303 | 97.611 s | keine | 3 PNG, 1920 × 1080, Fit leer | ja |
| [Claude B](evidence-bridge-trial/claude-B/round-0-execution.json) | Claude Code 2.1.303 | 83.822 s | `prinzip-lists`: 4 Personen, nur 3 sichtbar | 3 PNG, 1920 × 1080, Fit leer | ja, mit Inhaltswarnung |
| [Codex A](evidence-bridge-trial/codex-A/round-0-execution.json) | Codex CLI 0.163.0 | 52.959 s | keine | 3 PNG, 1920 × 1080, Fit leer | ja |
| [Codex B](evidence-bridge-trial/codex-B/round-0-execution.json) | Codex CLI 0.163.0 | 58.832 s | `prinzip-lists`: 4 Personen, nur 3 sichtbar | 3 PNG, 1920 × 1080, Fit leer | ja, mit Inhaltswarnung |

Die technischen Ergebnisse sind pro Lauf in `round-0-validation.json` und `render/manifest.json` dokumentiert. Die Manifeste enthalten Reihenfolge, Dateinamen, Dimensionen, Bytes, Fit-Ergebnisse und PNG-Prüfsummen. [Umgebung](evidence-bridge-trial/environment.json) und [Datei-Prüfsummen](evidence-bridge-trial/sha256.json) ergänzen die Nachvollziehbarkeit.

## Lehrnutzen: KI-Bewertung

Skala pro Kriterium: 0 = fehlt oder klar ungeeignet; 1 = teilweise erfüllt, relevante Einschränkung; 2 = im begrenzten Beispiel erfüllt. «Keine falschen M365-Aussagen» ist eine Inhaltsprüfung, kein Tenant-Test oder Beweis universeller Produktgültigkeit. Eine pauschale, unzureichend bedingte Aussage erhält 1.

| Lauf | Fiktiv und plausibel | Schweizer Schreibweise | Kohärente 3-Folien-Geschichte | Sinnvolles Vorher/Nachher | Annahmen deklariert | Keine falschen M365-Aussagen | Summe / 12 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Claude A | 1 | 2 | 1 | 2 | 2 | 1 | 9 |
| Claude B | 2 | 2 | 1 | 1 | 2 | 1 | 9 |
| Codex A | 2 | 2 | 2 | 2 | 2 | 2 | 12 |
| Codex B | 2 | 2 | 1 | 1 | 2 | 2 | 10 |

Die Bewertungen und die Zählung von ß stehen zusätzlich pro Lauf in `review.json`. Alle vier Antworten enthalten null ß. Alle Organisationen und Personen sind ausdrücklich als fiktiv bezeichnet; allfällige Namensgleichheiten wurden nicht recherchiert. Es gibt keine realen Patientendaten oder Mandatsdaten in diesem Versuch.

### Claude A: Spitex

[Antwort](evidence-bridge-trial/claude-A/round-0-answer.txt), [Validierung](evidence-bridge-trial/claude-A/round-0-validation.json), [Manifest und PNGs](evidence-bridge-trial/claude-A/render/manifest.json), [Bewertung](evidence-bridge-trial/claude-A/review.json).

Plausible Rollen mit Teilzeitpensen, erkennbare Übergabe und stabile Aufgaben über Board und Prinzip. Alle drei Bilder passen optisch. Allerdings steht im Beitrag um 14:12 «Bin erst ab 15 Uhr im Dienst», während der Hinweis behauptet, die Kollegin lese «erst nach Dienstbeginn». Das ist ein konkreter Zeitwiderspruch. Die Grenze «Vertrauliche Details zum Pflegeverlauf gehören ins Übergabeblatt, nicht in Aufgabentitel» widerspricht Titeln wie «Frau Lüthi: Kontrollbesuch nach Sturz am Abend» und «Herr Rossi: Insulin in der Apotheke nachbestellen». Auch mit erfundenen Personen ist dies ein schwaches Lehrvorbild. Daher Plausibilität und Kohärenz jeweils 1.

Die Aussage «Persönliche Aufgaben in Microsoft To Do sind nur für die eigene Person sichtbar» braucht die Bedingung einer nicht geteilten Liste. Als globale Produkteigenschaft wäre sie zu breit. Annahmen sind vorhanden, lösen aber solche Verallgemeinerungen nicht automatisch auf.

### Claude B: Treuhand

[Antwort](evidence-bridge-trial/claude-B/round-0-answer.txt), [Validierung](evidence-bridge-trial/claude-B/round-0-validation.json), [Manifest und PNGs](evidence-bridge-trial/claude-B/render/manifest.json), [Bewertung](evidence-bridge-trial/claude-B/review.json).

Die konkrete Verwechslung «Habe mir die Belege Moser notiert. Oder war das Noah?» führt sinnvoll zu eindeutiger Zuständigkeit. Persönliche Lernaufgaben bleiben persönlich; 5 + 6 + 4 Minuten passen zum Briefing. Das Board zeigt sechs Aufgaben lesbar.

Die Prinzip-Folie zeigt nur Reto, Lea und Mira im Vorher-Bereich. Noahs Bankauszüge und Lerndokumentation fehlen dort, obwohl der Vorher-Zustand sie enthält. Die Warnung sagt ausdrücklich «nur 3 passen auf die Folie, weitere werden nicht gezeigt». Deshalb nur 1 für Kohärenz und Vorher/Nachher. Die Annahme «Wer einer Aufgabe im Planner zugewiesen wird, erhält eine Benachrichtigung in Teams» ist ohne Benachrichtigungsbedingungen zu kategorisch. Ebenso fehlt bei der privaten To-Do-Liste die Bedingung «nicht geteilt». Das ist kein Renderer-Fehler, sondern eine Pack-/Inhaltslücke.

### Codex A: Spitex

[Antwort](evidence-bridge-trial/codex-A/round-0-answer.txt), [Validierung](evidence-bridge-trial/codex-A/round-0-validation.json), [Manifest und PNGs](evidence-bridge-trial/codex-A/render/manifest.json), [Bewertung](evidence-bridge-trial/codex-A/review.json).

Die drei Bilder bilden dieselben organisatorischen Aufgaben ab. Der Wechsel von Mila zu Luan bei den Materialtaschen ist nachvollziehbar. Der Text erklärt eine ausdrücklich bestätigte Übernahme; die eigene Sitzungsfrage bleibt persönlich. Die Annahme «Ein Teams-Beitrag erzeugt in diesem Schulungsbeispiel nicht automatisch eine Planner-Aufgabe» begrenzt die Darstellung sinnvoll. Uhrzeiten stehen ausdrücklich im Titel, das Fälligkeitsfeld zeigt den Tag. Es werden bewusst keine Angaben zu betreuten Personen gezeigt. Keine konkrete inhaltliche Störung gefunden; volle Punkte sind eine begrenzte KI-Einschätzung dieses Beispiels, kein Trainerurteil.

### Codex B: Treuhand

[Antwort](evidence-bridge-trial/codex-B/round-0-answer.txt), [Validierung](evidence-bridge-trial/codex-B/round-0-validation.json), [Manifest und PNGs](evidence-bridge-trial/codex-B/render/manifest.json), [Bewertung](evidence-bridge-trial/codex-B/review.json).

Klare Aufteilung zwischen Lernenden und fachlicher Prüfung, erfundene Mandate, 5 + 5 + 5 Minuten. Die Annahmen schliessen eine automatische Übernahme aus Beiträgen aus. Die Notizen unterscheiden Buckets von Fortschrittsstatus und verlangen eine Absprache für Vorbereitung und Kontrolle.

Im Prinzip-Vorher fehlen Levins Liste und die Aufgabe «Mandat Wolkenfaden: Bankabgleich kontrollieren». Nachher erscheint dieselbe Aufgabe im Plan. Die mündliche Erklärung «Vier gemeinsame Aufträge wechseln von persönlichen Listen in den Plan» ist auf dem Bild daher nur für drei Aufträge nachvollziehbar. Die Warnung ist korrekt vorhanden, verhindert aber keinen erfolgreichen Export. Deshalb jeweils 1 für Kohärenz und Vorher/Nachher, obwohl die Technik erfolgreich war.

## Konkrete Pack-Schwächen und Wortlautvorschläge

Diese Vorschläge wurden nicht angewendet und nicht erneut getestet.

1. **Die sichtbare Prinzip-Grenze fehlt im Pack.** Die allgemeinen acht erlaubten Personen verleiten zu vier Vorher-Listen. Ergänzen: «Für eine Prinzip-Folie dürfen im Zustand before höchstens drei Personen Aufgaben mit list personal besitzen. Alle für die Erklärung wesentlichen Aufgaben müssen im exportierten Bild sichtbar bleiben.» Belege: beide B-Läufe mit `prinzip-lists` und fehlender vierter Liste.
2. **Deklarierte Annahmen ersetzen keine bedingten Produktaussagen.** Ergänzen: «Formuliere Berechtigungen, Benachrichtigungen und Sichtbarkeit als Bedingungen dieses Beispiels. Persönlich bedeutet hier ausdrücklich nicht geteilt; behaupte keine garantierte Teams-Benachrichtigung ohne passende Konfiguration.» Belege: Claude A/B, `meta.assumptions`.
3. **Fiktiv bedeutet nicht automatisch didaktisch passend.** Ergänzen: «Nutze bei Pflegebeispielen organisatorische Aufgaben ohne Namen betreuter Personen oder Angaben zu Gesundheit und Behandlung. Prüfe, ob die Inhalte die eigene Grenze der Prinzip-Folie einhalten.» Beleg: Claude A, Aufgaben und Grenztext.
4. **Kohärenz wird nicht explizit geprüft.** Ergänzen: «Prüfe vor der Ausgabe Uhrzeiten, Namen, Zuständigkeiten und Aussagen in Hinweisen gegen die Beiträge und beide Zustände. Jede erklärte Änderung muss in den drei Folien nachvollziehbar sein.» Belege: Claude A, 14:12/15:00; beide B-Läufe, fehlende Vorher-Liste.
5. **Kleine Lehrbeispiele helfen gegen Inhaltsverlust.** Ergänzen: «Bevorzuge drei bis vier gemeinsame Aufgaben und höchstens eine persönliche Erinnerung. Nutze kurze Titel. Schreibe in presenterNotes eine zeitlich passende Frage oder Übung pro Folie.» Die aktuelle hohe Obergrenze ist eine Formatgrenze, kein sinnvolles Folienziel. Dieser Versuch zeigt insbesondere den Nutzen von kompakten, erklärbaren Übergängen.

Zur Einordnung der M365-Aussagen wurden am Versuchstag zwei offizielle Quellen nachgeschlagen. Microsoft beschreibt konfigurierbare Planner-Benachrichtigungen und Bedingungen für Teams; eine Benachrichtigung sollte deshalb nicht als unbedingte Garantie gelehrt werden: [Stay updated with notifications in Planner](https://support.microsoft.com/en-us/planner/stay-updated-with-notifications-in-planner). To Do unterstützt das Teilen von Listen; «persönliche Liste» muss hier eine nicht geteilte Liste bezeichnen: [Share a task list](https://support.microsoft.com/en-us/todo/share-a-task-list). Diese Recherche erfolgte durch den bewertenden Worker nach der Generierung und wurde keinem Assistenten als Prompt zugespielt. Die Quellen und Prüfnotizen stehen auch in [review-sources.json](evidence-bridge-trial/review-sources.json).

## Was dieser Versuch belegt und offenlässt

Belegt sind vier echte Ausgaben aus zwei zugänglichen CLI-Umgebungen, darunter Claude ohne Browsing und Werkzeuge, die unveränderte erste Validierung sowie zwölf tatsächliche PNG-Exporte. Der technische Pass ist definiert als valide plus erfolgreich gerendert ohne manuelle JSON-Eingriffe: 4/4. Ohne Warnungen sind es 2/4. Technischer Erfolg und vollständige sichtbare Lehrgeschichte sind getrennte Aussagen.

Nicht belegt sind Konsumenten-Chat-UIs, ein echter Storyboard-Dialog, Copy/Paste-Handhabung durch Nichttechniker, Datei-Import im Browser, tatsächliche Tenant-Berechtigungen, universelle M365-Produkteigenschaften oder Zuverlässigkeit über wiederholte Zufallsstichproben. Dies sind nicht die fünf beobachteten Traineraufgaben aus Slice 3. Es wurde kein Mensch beobachtet; geringe Reibung und der Zielwert «drei von fünf ohne Entwicklerhilfe» bleiben ungetestet. Reparaturqualität bleibt ebenfalls offen. Die nächsten Schritte sind eine menschliche inhaltliche Prüfung, Pack-Verbesserungen in einem separaten Auftrag und die fünf beobachteten Traineraufgaben.

Die Evidence enthält die exakten Antworten unverändert. Nur in den separaten Codex-Diagnoselogs wurden lange HTML-Challenge-Zeilen durch einen markierten Hinweis ersetzt, um ephemere Challenge-Payloads und unnötiges HTML nicht dauerhaft abzulegen. Das sind keine manuellen Eingriffe in Projekte. Alle übrigen Ergebnisdateien bleiben direkt prüfbar.

Nachträglich hat der Koordinator in beiden Codex-Diagnoselogs die Zeilen «model» und «session id» geschwärzt und die betroffenen Einträge in `sha256.json` neu berechnet. Antworten, Validierungen und Renderings sind davon nicht berührt.
