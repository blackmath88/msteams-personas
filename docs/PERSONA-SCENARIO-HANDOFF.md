# Morgenreview: Hochschulgruppen und verbundene Arbeit

9. November 2026. Implementierung auf `feat/researched-persona-scenarios`, aus aktuellem `main` bei `c3043a91ab5b84fb1facb7a213b0f7d3a58929a4`. Produktcode und Galerie-Renderbasis: `09ee3e2` (vollständige Identität und Laufzeit in [provenance.json](morning-review/provenance.json)). Danach folgen nur Review-Artefakte und dieser Handoff. Direkte Codex-Cloud-Ausführung; kein Orca-/Weavr-Dispatch, keine weiteren Agenten, keine neuen kostenpflichtigen API-Dienste, kein Merge oder Deployment. Review: eigene Diff-, Modell- und Sichtprüfung, kein unabhängiges Review.

## Zuerst ansehen

- [Vollständige Galerie](morning-review/index.html): vier Persona-Karten, Arbeitsflussstreifen und alle 32 Szenario-PNGs mit Links auf Originalgrösse und Projekt-JSON.
- [Wochenmeeting: Aufgaben und nächster Review](morning-review/meeting-comparison.html), [direkter PNG-Vergleich](morning-review/meeting-comparison.png).
- [Eine Loop-Tabelle in Outlook und Teams](morning-review/loop-comparison.html), [direkter PNG-Vergleich](morning-review/loop-comparison.png).
- [Persona-Karten](morning-review/persona-cards.png), [Bildsprache](morning-review/specimen.html) und [Piktogramm-PNG](morning-review/visual-language.png).
- [Auswahlmatrix und Recherche](research/PERSONA-SELECTION.md). Die vollständige Quellenkartei mit 23 Einträgen ist über Website, CLI und MCP abrufbar.

HTML und Website lokal mit `python3 -m http.server 8766 --bind 127.0.0.1` aus dem Repository öffnen: `http://127.0.0.1:8766/docs/morning-review/index.html` und `http://127.0.0.1:8766/index.html#/hochschule`. GitHub zeigt HTML-Dateien als Quelltext; die PNG-Links lassen sich direkt auf GitHub prüfen. Die Änderungen sind noch nicht auf GitHub Pages veröffentlicht.

## Geliefert

Vier Ergänzungen: **Campus-Service Lernräume**, **Antragsteam Brückenforschung**, **Campus-Konferenz Perspektiven**, **Netzwerk Lehrpraxis**. Jede beschreibt Zweck, Rollen, ungefähre Grösse, Dauer, Rhythmus, Grenzen, Artefakte, Reibung, Toolwahl und Lehrfrage. Die Projekte zeigen jeweils vier exemplarische Personen aus der Kerngruppe. Die Gruppen sind über Team-Personas und die neue Hochschulbibliothek erreichbar. Der Legacy-Atlas und sein Konfigurator behalten ihre ursprünglichen Welten; die neuen Gruppen leben im gemeinsamen Recherchekatalog.

Zwölf Szenarien: sechs renderbar, fünf recherchiert ohne zugesagtes Beispielprojekt, eines provisorisch (strukturierte Anfragen). Die sechs vollständigen Projekte:

| Beispiel | Folien | Kern |
| --- | ---: | --- |
| [Wochenmeeting](../examples/weekly-meeting.project.json) | 6 | Agenda, Entscheid, zugewiesene Folgeaufgaben, Notizenplan, To Do, Review und abgeschlossene Aufgabendetails |
| [Geteilte Loop-Tabelle](../examples/shared-loop.project.json) | 5 | Teams vor Änderung, Outlook vor/nach Änderung, Teams danach, Prinzip |
| [Förderantrag](../examples/grant-submission.project.json) | 5 | Gemeinsamer Entwurf, Beitragsplan, Budgetreview, persönliche Auswahl, manuelle Einreichung als Prinzip |
| [Konferenzübergabe](../examples/event-handover.project.json) | 5 | Übergabebeitrag, neue Zuständigkeit, konkrete Technikcheckliste, persönlicher Tag |
| [Service-Onboarding](../examples/service-onboarding.project.json) | 5 | Handbuchlink, gemeinsame Einführung, persönliche Erinnerung neben zugewiesener Aufgabe |
| [Methodenblatt](../examples/peer-resource.project.json) | 6 | Chat, Plan, persönliches Review, sichtbar abgeschlossene Prüfung, bewusste Publikation |

Die neuen Profile `meeting-notes`, `loop-component` und `workflow` ergänzen **Fähigkeitsversion 6**; Projektformat bleibt v1. Fähigkeitsversionen 1–5 bleiben gültig. Personen, Aufgaben und Komponenten behalten IDs über die Ansichten. Eine Loop-Tabelle ist ausdrücklich keine Planner-Aufgabenliste.

Website: Auswahl, Vor-/Zurück, Moderationsnotizen, JSON-Download, vollständiger PNG-Export und Übernahme als eigener Entwurf über die bestehende Importprüfung. Namen und Aufgaben bleiben im Formular editierbar. Komponenteninhalt und Arbeitsflussschritte sind ausdrücklich als erhaltene Metadaten bezeichnet: derzeit über JSON bearbeiten und erneut importieren. Keine stillschweigende Verwerfung dieser Daten.

CLI: `node tools/cli.mjs catalogue`, `example --kind weekly-meeting` oder `shared-loop` und die vier weiteren IDs, dann `validate` / `render`. MCP: `get_catalogue`, erweiterte `get_example`-Auswahl, bestehende `validate_project` / `render_project` / Ressourcenabruf. Der Authoring-Pack beschreibt die neuen Felder, Grenzen und Übergaben. MCP-Prozesse müssen mit dieser Revision neu starten. Die neuen Ansichten sind vollständige Folienprofile; die bisherige D1-Komponentenexport-Registry wurde nicht erweitert.

## Verifizierte Bedeutung

Die Quellen unterscheiden dokumentierte Hochschulpraxis, lokale Anleitung, Microsoft-Produktdokumentation, Vendor-Empfehlung und unsere fiktive Synthese. UCL und Teesside belegen Antragsteams; ASU belegt Konferenzrollen, empfiehlt aber andere Tools. Newcastle belegt Lehrgemeinschaften mit Teams-Kanälen. Unsere Namen, Grössen, Dialoge, Fristen und die konkreten M365-Geschichten bleiben erfunden.

Beim ersten Notizen-Aufgabeneintrag entsteht ein zugehöriger Planner-Plan. Wir zeigen diesen Plan, keine automatische Befüllung eines bestehenden beliebigen Teamboards. «In Planner öffnen», Link kopieren/einfügen, Zuweisung, Mein Tag und Publikation sind bewusste Handlungen. Beim nächsten Termin werden die bisherigen Notizen bewusst erneut geöffnet. Ein automatisches Fortschreiben in neue Terminnotizen wird nicht behauptet.

Voraussetzungen bleiben auf den Folien: erlaubtes Loop, passende Lizenzen und Speicherung, Exchange Online, Bearbeitungsrechte, interne direkt eingeladene Personen, unterstützte Clients sowie Planner-Lizenz, gleiche Arbeitsidentität, Smartliste und Planner-Verbindung für To Do. Keine Copilot- oder AI-Zusammenfassung wird vorausgesetzt. Synchronisationspfeile brauchen eine belegte Beziehung und passende Werkzeuge. Externe Notizenrechte werden nicht illustriert.

## Tatsächlich geprüft

Vollständige Logs: [checks/](morning-review/checks/). Neue Browser- und MCP-Ergebnisse: [browser-checks.json](morning-review/browser-checks.json), [mcp-checks.json](morning-review/mcp-checks.json).

| Prüfung | Ergebnis |
| --- | --- |
| `npm test` | 66/66 |
| `node check-worlds.mjs` | 0 Fehler, 0 Warnungen; ursprüngliche fünf Welten |
| `node tests/journey.mjs` | 110/110; alle ursprünglichen Welten/Ansichten, Varianten, PNGs, schmale Ansichten und Token-/Identitätsprüfung |
| `node tests/project-journey.mjs` | 51/51 |
| `node tests/mcp-e2e.mjs` | 49/49 über SDK-stdio, HTTP und CLI, inklusive Bytegleichheit, Fehler und Cleanup |
| `node tests/research-journey.mjs` | 30 Checks; sechs Abfolgen, Import-Roundtrip, vollständige Loop-PNGs, identisches Komponenten-DOM, Escaping, 390 px und 720 CSS-px bei DPR 2, Tastatur-Fokus |
| `node tests/research-mcp.mjs` | alle sechs Beispiele entdeckt und validiert; alle elf Meeting-/Loop-PNGs abgerufen und bytegleich mit CLI/Galerie |
| `node tests/components-e2e.mjs` | 25/25 |
| Workspace-Journey und Workspace-MCP | bestanden; Häuser-/Teams-/OneDrive-Projektionen und PNG-Abruf |
| Task-Profile Browser und MCP | bestanden; **direktes Dateiöffnen im Browser übersprungen**: Organisationsrichtlinie blockiert `file://` |
| Galerie-Build | sechs Projekte, 32 echte PNGs mit 1920×1080, keine Fit-Diagnostik |

Die erste parallele Ausführung zweier historischer Browser-Journeys kollidierte am festen CDP-Port. Beide verwenden jetzt automatisch gewählte Ports; Wiederholung erfolgreich. Historische Baseline-Screenshots bleiben im Repository erhalten, neue Belege liegen nur unter `morning-review`. PNGs und Kontaktbögen wurden tatsächlich geöffnet: Meeting, Loop, Planner/To Do, Aufgabendetails, Persona-Karten, Piktogramme und die zusätzlichen Geschichten. Beim Sichtreview wurden Reviewreihenfolge, persönliche Aufgabe und konkrete Checklisten verbessert.

## Offene Grenzen und nächster Schritt

Kein Live-Microsoft-Tenant-Test und **kein realer Assistant-Host-Trial** für Fähigkeit 6. SDK-/stdio-/HTTP-Tests sind davon getrennt. Eine aktuelle deutsche Tenant-Referenz für das Notizenpanel und ein vollständiger Screenreader-Test bleiben offen. Tatsächliche MicrosoftDocs-Teams-/Outlook-Bilder wurden als temporäre visuelle Referenz geprüft; die neue Oberfläche ist bewusst vereinfacht. Direkte Dateiöffnung konnte wegen der verwalteten Browserrichtlinie nicht bestätigt werden; Richtlinien wurden nicht verändert. Lokale Assets und konto-/backendfreie Ausführung bleiben erhalten.

Forms, Lists, Power Automate, Laborbetrieb, externe/private/shared Berechtigungsmodelle, Loop-Arbeitsräume und neue D1-Komponententypen wurden nicht gebaut. Die sechs übrigen Katalogeinträge bleiben ehrlich markiert. Kein neuer PPTX-Editor oder Hostingdienst.

Drei Entscheidungen für Achim: (1) Trennen Haus und Komponentenrahmen Gruppe und geteiltes Objekt klar genug? (2) Sind die beschrifteten Übergaben didaktisch lesbar? (3) Genügt das fokussierte Loop-/Notizenpanel als Lehrbild oder soll vor Freigabe der Tenant-Abgleich folgen? Danach Draft-PR prüfen, Tenant-Abgleich und Assistant-Host-Trial planen; Merge und Deployment bleiben separate Schritte. Keine laufenden oder unbeaufsichtigten Worker.
