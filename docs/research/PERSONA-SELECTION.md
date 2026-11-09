# Auswahl und Evidenz, 9. November 2026

Basis: `main` bei `c3043a9`. Direkter Codex-Cloud-Auftrag, keine Wiederaufnahme der archivierten Mission. Die Quellenkartei in `src/research-catalogue.js` ist die gemeinsame Grundlage für Website, CLI und MCP. Alle Grössen, Personen, Dialoge, Termine und Arbeitsabläufe sind unsere fiktive Synthese. Hochschulquellen belegen Bedürfnisse oder lokale Empfehlungen, keine Basler Richtlinie und keine Interviews.

## Kandidatenvergleich

| Kandidat | Abgrenzung zum Bestand | Evidenz / Lehrwert / Aufwand | Entscheidung |
| --- | --- | --- | --- |
| Departements- oder Programmkommission | Bereits Kommission Digitale Zusammenarbeit | UCT-Gremien; gute Entscheide, geringe neue Vielfalt | Bestehenden Archetyp behalten |
| Lehrkoordination | Bereits Semesterstart mit kleinem Lehrteam | UCT-Lehre; Lernplattform-Grenze wertvoll | Recherchiertes Szenario, kein neuer Archetyp |
| Forschungsverbund | Nähe zu Urban Health Analytics | UCT-Forschung; externe Zugriffe brauchen eigenes Modell | Zurückgestellt |
| Forschungsförderung / Antragsteam | Befristete Beiträge unter harter Einreichungsfrist | Edinburgh-Förderanträge und UCT-Projekte; hohe Abgrenzung | **Ausgewählt** |
| Konferenzorganisation | Temporäre, rollenübergreifende Durchführung und Abschluss | UCT-Projekte und Colorado-Kollaboration; Adoption-Eventleitfaden | **Ausgewählt** |
| Laborbetrieb | Laufende Ressourcen und Wartung statt Publikationen | UCT-PASS nur indirekt; fachspezifische Evidenz dünn | Provisorisch; keine Labor-Sicherheitsprozesse illustrieren |
| Community of Practice | Freiwilliger Austausch, wiederverwendbares Wissen | UCT-Gruppen und KU-Leuven-Loop; konkrete Wissenspflege | **Ausgewählt** als Lehrpraxis-Netzwerk |
| Studienberatung / Onboarding | Wiederkehrende Anfragen, vertrauliche Einzelfälle | UCT-PASS und Cornell-Notizen; personenbezogene Fälle vermeiden | Onboarding als Service-Szenario |
| Campus-Servicebetrieb | Dauerhafte operative Koordination, Wochenrhythmus | UCT-PASS und Cornell; ausgeprägter Meeting-/Aufgabenzyklus | **Ausgewählt** |
| Einzelarbeit / persönlicher Entwurf | Nora deckt diesen Kontrast bewusst ab | KU Leuven erklärt Speicherorte; kein Team-Zwang | Bestehende Persona bewahren |

Die vier Ergänzungen erweitern Campus & People Development, Urban Health Analytics und Nora um Antrag, Durchführung, freiwilliges Netzwerk und Betrieb. Zwei Quellen pro Ergänzung sind in der Kartei verknüpft; dort ist auch sichtbar, wo nur ein allgemeines Arbeitsmuster und keine identische Hochschulgruppe belegt ist.

## Verifizierte Beziehungen und Grenzen

- **Notizen → Planner:** erste Aufgabe erzeugt einen zugehörigen Plan. Aufgabenlisten entsprechen Buckets. Ein neuer Planner-Bucket erzeugt keine Notizenliste. Verschieben in einen anderen Plan entfernt die Aufgabe aus den Notizen. Wir zeigen ausdrücklich den erzeugten Notizenplan, keinen automatisch befüllten beliebigen Teamplan. [Microsoft Support](https://support.microsoft.com/en-au/loop/manage-your-tasks-from-loop-task-lists-and-collaborative-notes-in-planner).
- **Planner → To Do:** zugewiesene Aufgaben über dieselbe Arbeitsidentität und aktivierte Planner-Verbindung. «Mein Tag» wird bewusst ausgewählt. [Microsoft Support](https://support.microsoft.com/en-us/planner/see-planner-tasks-in-microsoft-to-do).
- **Loop über Ansichten:** Komponentenlink von Hand kopieren und in unterstützter Teams-Chat-/Outlook-Oberfläche einfügen; anschliessend dasselbe Objekt bearbeiten. Keine zusätzliche Kopie, keine automatische Publikation. Tabellen sind keine Planner-Aufgabenlisten. [Teams](https://support.microsoft.com/en-us/teams/apps-service/send-a-loop-component-in-microsoft-teams-chats), [Outlook](https://support.microsoft.com/en-us/loop/use-loop-components-in-outlook).
- **Voraussetzungen:** passende OneDrive-/SharePoint-Lizenz, Exchange Online für volle Funktionen, erlaubte Loop-Richtlinien und WebSockets, Bearbeitungszugriff und unterstützte Clients. Eine Loop-Arbeitsraum-Lizenz ist eine eigene Frage. [Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365/loop/loop-requirements?view=o365-worldwide).
- **Besprechungsgrenze:** interne direkt eingeladene Personen, geplante persönliche Teams-Terminserie. Keine externen Teilnehmenden in Notizen. Die Serie und der Einzeltermin sind unterschiedliche Bearbeitungsziele; wir öffnen beim nächsten Termin die bisherigen Notizen bewusst erneut. Kein AI-Recap, keine Copilot-Voraussetzung. [Microsoft Support](https://support.microsoft.com/en-us/teams/meetings/take-meeting-notes-in-microsoft-teams).
- Cornell beschreibt teils ältere Einschränkungen (Notizen nur vorab aktivieren, Outlook). Bei abweichendem aktuellem Microsoft-Support gilt für die Darstellung die aktuelle Produktdokumentation. Cornell bleibt lokaler Praxisbeleg.
- Forms → Lists → Teams ist **kein** mitgelieferter Automatismus: expliziter Power-Automate-Flow, Verbindungen, Berechtigungen, Fehlerbehandlung und gegebenenfalls Lizenzprüfung wären nötig. Dieses Szenario bleibt Recherche, ohne erfundene Forms-/Lists-Oberfläche.

## GitHub und Wiederverwendung

Direkt geprüft: [Fluent System Icons](https://github.com/microsoft/fluentui-system-icons) (MIT, LICENSE-Blob `bc9c36b28f467f7006c4e5f1be4ca0a1a0b895f3`); vorhandene lokale Pfade und bestehender Lizenzhinweis werden wiederverwendet. Haus-, Entscheid- und Übergabesymbole sind eigene SVG-Geometrie.

[OfficeDev/Microsoft-Teams-Samples](https://github.com/OfficeDev/Microsoft-Teams-Samples) (MIT, LICENSE-Blob `9e841e7a26e4eb057b24511e7b92d42b257a80e5`) geprüft und verworfen: App-/Bot-/Graph-Beispiele benötigen einen Tenant und implementieren keine offline Schulungsoberfläche. Kein Code daraus übernommen. [MicrosoftDocs Loop-UX](https://github.com/MicrosoftDocs/microsoft-365-docs/blob/public/microsoft-365/loop/loop-ux-examples.md) dient als dokumentierte Referenz für eingebettete Komponenten; keine Screenshots oder Dokumentation kopiert. GitHub-Sterne sind kein Praxisbeleg.

## UI-Referenzprofil

Beobachtung 2026-11-09: Microsoft-Support-Abbildungen für Besprechungsnotizen (Agenda/Notizen/Folgeaufgaben), Teams-Komponenten (Karte mit Titel und Link) und Outlook-Komponenten. Eigene vereinfachte deutsche Light-Theme-Nachbildung, keine pixelgenaue Tenant-Aufnahme. Trainerhinweise, Objekt-ID und Synchronisationspfeile bleiben ausserhalb des App-Inhalts. Die aktuelle deutsche Beschriftung kann je Client abweichen. Keine Microsoft-Screenshots werden ausgeliefert.

Edinburgh ist im Suchindex lesbar, Vollabruf lieferte 403; der Förderantragsbeleg ist deshalb als eingeschränkt und ergänzend markiert. UCT-Abfragen hatten einzelne Timeouts; alternative Vollabrufe werden als solche protokolliert. Nicht aus Suchfragmenten auf Implementierungsdetails schliessen.
