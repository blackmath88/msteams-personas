Hier ist das Projekt für eure Schulung. Ich habe nichts gerendert oder geprüft; das macht die Website beim Import.

```json
{
  "format": "msteams-personas/project", "projectVersion": 1, "capabilityVersion": 1,
  "meta": {
    "id": "pflege-schichtuebergabe", "title": "Schichtübergabe auf Station 4B",
    "organisation": "Spital Seeblick (fiktiv)", "audience": "Stationsleitungen", "goal": "Offene Pflegeaufgaben bei der Übergabe sichtbar machen",
    "locale": "de-CH", "fictional": true,
    "source": { "kind": "assistant", "note": "Handgeschriebene Test-Antwort, nicht von einem echten Assistenten" },
    "assumptions": ["Die Station hat einen Teams-Kanal pro Schicht.", "Planner ist für das Team freigegeben."],
    "notes": "Für den Workshop im Januar"
  },
  "people": [
    { "id": "p-ruth", "name": "Ruth Zimmermann", "role": "Stationsleitung" },
    { "id": "p-samir", "name": "Samir Haddad", "role": "Pflege Nachtdienst" },
    { "id": "p-elena", "name": "Elena Graf", "role": "Pflege Frühdienst" }
  ],
  "documents": [{ "id": "d-protokoll", "name": "Übergabeprotokoll 4B.docx" }],
  "tasks": [
    { "id": "t-verband", "title": "Zimmer 12: Verbandswechsel" },
    { "id": "t-angehoerige", "title": "Angehörige Zimmer 7 informieren" },
    { "id": "t-bestellung", "title": "Infusionsständer bestellen" }
  ],
  "states": [
    { "id": "before", "label": "Heute", "tasks": {
      "t-verband": { "owner": "p-samir", "list": "personal" },
      "t-angehoerige": { "owner": "p-samir", "list": "personal" },
      "t-bestellung": { "owner": "p-ruth", "list": "personal" } } },
    { "id": "after", "label": "Mit Stationsplan", "tasks": {
      "t-verband": { "owner": "p-elena", "list": "plan", "bucket": "Frühdienst", "due": "Mo 07:30" },
      "t-angehoerige": { "owner": "p-elena", "list": "plan", "bucket": "Frühdienst", "due": "Mo 10:00" },
      "t-bestellung": { "owner": "p-ruth", "list": "plan", "bucket": "Material", "due": "Di" } } }
  ],
  "scenes": [
    { "id": "sc-kanal", "profile": "teams-posts", "team": "Station 4B", "channel": "Nachtdienst", "posts": [
      { "id": "q1", "by": "p-samir", "time": "06:40", "title": "Übergabe Nacht", "text": "Zimmer 12 Verband noch offen, Angehörige von Zimmer 7 rufen um 10 an.", "hint": "Zwei offene Aufgaben stehen nur im Text." },
      { "id": "q2", "by": "p-elena", "time": "06:55", "title": "", "text": "Übernehme beides und trage es im Stationsplan ein.", "document": "d-protokoll" } ] },
    { "id": "sc-plan", "profile": "planner", "team": "Station 4B", "state": "after" },
    { "id": "sc-prinzip", "profile": "prinzip-tasks", "team": "Station 4B", "before": "before", "after": "after" }
  ],
  "slides": [
    { "id": "s-1", "scene": "sc-kanal", "presenterNotes": "Was weiss der Frühdienst um 07:00?" },
    { "id": "s-2", "scene": "sc-plan", "presenterNotes": "" },
    { "id": "s-3", "scene": "sc-prinzip", "presenterNotes": "Persönliche Notizen bleiben persönlich.",
      "teaching": { "title": "Übergaben brauchen einen gemeinsamen Plan", "question": "Wer übernimmt was nach dem Schichtwechsel?",
        "problem": "Offene Aufgaben stehen in Beiträgen und persönlichen Notizen.",
        "recommendation": "Was eine andere Schicht übernimmt, kommt mit Person und Zeit in den Stationsplan.",
        "boundary": "Medizinische Dokumentation gehört ins Klinikinformationssystem, nicht in Planner." } }
  ]
}
```

Viel Erfolg mit der Schulung!
