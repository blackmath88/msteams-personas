# Verwaltung und technischer Service: Referenzpaar

Veröffentlichung: Am 10. November 2026 hat der Benutzer Merge, Veröffentlichung und das Entfernen erledigter Branches autorisiert. Die [Business-Beispiele](https://blackmath88.github.io/msteams-personas/index.html#/beispiele) und die [vollständige Galerie](https://blackmath88.github.io/msteams-personas/docs/business-review/index.html) werden aus `main` bereitgestellt. Der folgende Buildbericht bewahrt die ursprünglichen Checkpoints und Prüfgrenzen.

10. November 2026, Europe/Zurich. Direkter Codex-Cloud-Build auf `feat/business-reference-stories`, aus `main` bei `9a017f59ac7a9792f797d9195c98f6646960066a`. Die zwei Planungscommits wurden auf den isolierten Branch übernommen. Produkt-Checkpoint: `26ea512`; Sicht-/Responsive-Korrekturen: `8d5a6e7`. Die Galerie wurde mit dieser zweiten Revision gerendert; vollständige Renderbasis in [provenance.json](business-review/provenance.json). Kein Merge und kein Deployment. Eigene Modell-, Diff- und Sichtprüfung, kein unabhängiges Review. Keine weiteren Agenten oder laufenden Worker, keine zusätzlichen kostenpflichtigen APIs.

## Zuerst ansehen

- [Vollständige Galerie](business-review/index.html): zwei Persona-Karten, Arbeitsflussstreifen und alle zehn PNG-Folien mit Projekt-JSON und Moderationsnotizen.
- [Verwaltung: Kontaktbogen](business-review/municipal-opening-hours-contact.png), [Notizen beim nächsten Review](business-review/municipal-opening-hours/04-municipal-opening-hours-meeting-notes.png).
- [Service: Kontaktbogen](business-review/service-appointment-change-contact.png), [Ninas bestätigte Übernahme](business-review/service-appointment-change/03-service-appointment-change-planner-task.png).
- [Persona-Karten](business-review/persona-cards.png), [Rechercheentscheidungen](research/BUSINESS-DOMAINS-CH-DE-REVIEW-DECISIONS.md), [ursprüngliches Sparring](research/PERPLEXITY-BUSINESS-DOMAINS-CH-DE-REVIEW-2026-11-10.md).
- [Katalog mit Filtern](business-review/catalogue-filtered.png), [mobile Auswahl](business-review/catalogue-mobile.png).

Lokal aus dem Repository: `python3 -m http.server 8766 --bind 127.0.0.1`. Dann `http://127.0.0.1:8766/docs/business-review/index.html`, `http://127.0.0.1:8766/index.html#/beispiele` oder `#/personas` öffnen. GitHub zeigt HTML-Dateien als Quelltext; die PNGs lassen sich direkt ansehen. Für die veröffentlichte HTML-Galerie den GitHub-Pages-Link oben verwenden.

## Implementiert

**Gemeinde Lindenried: «Abgestimmt ist noch nicht veröffentlicht»** verbindet einen Vorschlag im Kanal, gemeinsame Agenda und Folgeaufgaben, die erledigte Textvorbereitung und den nächsten Review derselben Notizen. Besetzung und Text sind erledigt; Martins lokale Freigabeaufgabe bleibt offen. Es wird weder eine allgemeine kommunale Rechtsregel noch ein erforderlicher Ratsbeschluss behauptet.

**Brunner Haustechnik AG: «Termin verschoben: Wer übernimmt den Rest?»** beginnt mit einer unklaren Kundenzusage. Samuel fragt im Kanal nach, Nina bestätigt die Übernahme im Kommentar der Koordinationsaufgabe. Material ist geprüft; Auftrag aktualisieren und Kunden informieren bleiben offen. Das Board zählt die erledigte Klärung mit eingeklappten erledigten Karten. Bestehende Namen, IDs und Rollen werden weiterverwendet; Nina ist eine neue fiktive Person.

Beide Geschichten haben fünf Folien und je zwei vollständige Zustände. Aufgaben- und Komponenten-IDs bleiben über die Ansichten stabil. Fachanwendung, Freigabeweg und Website werden im Prinzip erklärt, nicht als neue Produktoberflächen oder funktionierende Integrationen ausgegeben. Einfachere Alternativen und typische Fehlinterpretationen sind im Katalog sichtbar. Zwei zusätzliche Rechercheeinträge beschreiben Ferienvertretung und eine geprüfte Serviceanleitung, ohne Exportfunktionen zu versprechen.

Die bestehende Bildsprache bleibt erhalten: Haus für die Gruppe, Fluent-Symbole, gemeinsame Objekte und beschriftete manuelle Übergaben. Keine neuen Renderer, D1-Komponententypen oder Projektversionen. Fähigkeit bleibt 6, Projektformat v1.

## Ein gemeinsamer Katalog

Die Website bietet unter Team-Personas die kombinierbaren Filter **Branche / Umfeld** und **Zusammenarbeit**, Ergebniszahlen, leere Auswahl und Zurücksetzen. Filter stehen im Hash; Browser-Zurück stellt die Auswahl wieder her. Native Auswahlfelder behalten bei Filteränderungen den Fokus. Einzelarbeit mit Zusammenarbeit findet weiterhin Nora. Bestehende Arbeitswelten werden per ID referenziert, ihre Szenen nicht kopiert. Die neuen Beispiele sind auch über Tools und Use Cases erreichbar. `#/hochschule` bleibt eine Sammlung mit vier Ergänzungen und zwölf Rechercheeinträgen.

Der Gesamtkatalog enthält jetzt sechs recherchierte Gruppen, sechzehn Szenarioeinträge und acht renderbare Projekte, dazu sieben Referenzen auf bestehende Arbeitswelten. Organisation, Zielgruppe und Quellenhinweis sind für neue Projekte parametrisierbar; alle sechs bisherigen generierten Projekt-JSONs bleiben unverändert. Neue Quellen führen eigene Zugriffs-, Publikations- und Datenperioden; alte Zugriffsdaten werden nicht überschrieben.

```sh
node tools/cli.mjs catalogue --collection business
node tools/cli.mjs catalogue --domain administration --team-pattern committee
node tools/cli.mjs example --kind municipal-opening-hours --out gemeinde.json
node tools/cli.mjs validate gemeinde.json
node tools/cli.mjs render gemeinde.json --out gemeinde-folien
```

MCP: `get_catalogue({domain:"administration",teamPattern:"committee"})` → `get_example({kind:"municipal-opening-hours"})` → `validate_project` → `render_project` → Ressourcen abrufen. Entsprechend `service-appointment-change`. Filter kombinieren mit UND; unbekannte Werte liefern keine Treffer. Optionen und Status kommen aus derselben Definition wie in Website und CLI. Der Authoring-Pack nennt die neuen Beispiele. Einen installierten MCP-Prozess mit der neuen Revision neu starten; SDK-Prüfungen ersetzen keinen echten Assistant-Host-Trial.

## Quellen und Grenzen

Die Quellenkartei in `get_catalogue` enthält direkte URLs, Herausgeber, Zugriff, beanspruchte Aussage und Grenzen. Neu direkt geprüft: Bitkoms Handwerksbericht mit 504 telefonischen Interviews aus KW 23–29/2025, SECOs KMU-Orientierung mit Grundlagen 2017/2018, Kölns Ratsinformationssystem sowie Microsofts Anleitung zu verknüpften Lightweight-Plänen. Bitkom liefert deutschen Branchenkontext, SECO allgemeine Schweizer Orientierung. Keines belegt unsere konkreten Terminabsprachen oder eine verbreitete Teams-/Planner-Nutzung. Köln belegt ein separates kommunales Informationssystem, nicht Lindenrieds erfundenen Freigabeweg. Die Geschichten und Personen sind fiktive Synthese.

Bei gemeinsamen Notizen erzeugt der erste Aufgabeneintrag den zugehörigen Plan. Kein beliebiger vorhandener Plan wird automatisch gefüllt. Der Lightweight-Plan hat keinen Planbesitzer; Mitglieder können ihn löschen. Fachsystemeinträge, Linkweitergabe und Publikation bleiben bewusste Handlungen. Lizenz, Client, interne Bearbeitungsrechte und lokale Richtlinien sind Voraussetzungen, keine implementierten Rechte. Der Servicefall ist kein Notfall und keine getestete mobile Oberfläche.

## Prüfbelege

Logs und maschinenlesbare Ergebnisse: [checks/](business-review/checks/). Die Prüfungen unterscheiden Produktdokumentation, lokale Automatisierung und tatsächliche Sichtprüfung.

| Prüfung | Ergebnis |
| --- | --- |
| `npm test` | 71 bestanden, 0 Fehler; neue Identitäts-, Zustands-, Quellen- und Filterprüfungen |
| `node check-worlds.mjs` | 0 Fehler, 0 Warnungen; ursprüngliche fünf Welten |
| `node tests/journey.mjs` | 110/110; bestehende Welten, Ansichten, Varianten, Export und responsive Nutzung |
| `node tests/project-journey.mjs` | 51/51 |
| `node tests/business-journey.mjs` | 38 Checks; Filter, Zurück/Reset/leere Auswahl, Einzelarbeit, drei Einstiege, alle zehn Folien, Import-Roundtrip, bytegleiche Website-PNGs und 390 px / 720 CSS-px bei DPR 2 |
| `node tests/business-mcp.mjs` | Filtergleichheit CLI/MCP; beide Projekte validiert; zehn PNGs abgerufen und bytegleich mit CLI/Galerie |
| `node tests/mcp-e2e.mjs` | 49 bestanden, 0 Fehler; stdio, HTTP und CLI, inklusive isolierter Cleanup-Prüfung |
| `node tests/research-journey.mjs` | 30 Checks; bestehende Hochschul- und Loop-Beziehungen bleiben gültig |
| `node tests/components-e2e.mjs` | 25 bestanden, 0 Fehler |
| `node tests/workspace-mcp.mjs` | Haus-/Arbeitsbereich-PNGs und Ressourcenabruf bestanden |
| Galerie | Zwei Projekte, zehn echte 1920×1080-PNGs, keine Fit-Diagnostik |

Kontaktbögen aller zehn Folien, Persona-Karten und ausgewählte PNGs in Originalgrösse wurden geöffnet. Ein überfülltes Notizenpanel wurde durch eine kürzere Agenda korrigiert; alle drei Aufgaben und die offene Freigabe bleiben sichtbar. Die fünfstufige Workflow-Vorschau wird unter 900 px vertikal, damit lange Wörter bei 200% Zoom nicht überlaufen. Bei der Selbstprüfung wurde der Servicekontext nach Bestätigung präzisiert und der Hinweis auf eingeklappte erledigte Karten ergänzt.

Parallele Ausführungen des bestehenden MCP-End-to-End-Tests meldeten fremde Browserprozesse als Cleanup-Fehler. Der anschliessende isolierte Lauf bestand 49/49 inklusive Prozess- und Profil-Cleanup. Ein Test auf die ausführliche Entscheidformulierung wurde an die kürzere, weiterhin explizit offene Freigabe im Notizenpanel angepasst. Historische Screenshot-Dateien, die Tests überschreiben, werden nicht als neue Belege eingecheckt. Neue Belege liegen unter `business-review`.

## Offen

Keine Practitioner-Interviews, keine beobachteten Traineraufgaben, kein Live-Tenant-Test, kein neuer realer Assistant-Host-Trial und kein vollständiger Screenreader-Test. Direkte Dateiöffnung wurde in dieser Sitzung nicht erneut geprüft; die verwaltete Browserrichtlinie hatte sie zuvor blockiert. Die lokalen Assets bleiben erhalten. Länderübergreifende Wiedererkennbarkeit ist eine begründete Hypothese, keine repräsentativ validierte Marktabdeckung.

Handel folgt erst nach dem Referenzpaar. Ingenieurbüro bleibt ein Kandidat für Platz vier; eine überzeugende Produktionsgeschichte kann es ersetzen. Die sechs weiteren Briefe im Sparring bleiben Recherchematerial. Keine neuen mobilen, externen oder Freigabe-/ERP-Berechtigungsmodelle, keine Forms/Lists-/Automate-Integration, kein PPTX-Editor und kein neuer Hostingdienst. Die erste Lieferung ist zur Prüfung vorbereitet; breitere Portfolio- und Tenant-Akzeptanz bleibt offen.
