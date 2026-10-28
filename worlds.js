/*
 * Higher-education worlds: single editable source for the fictional demo universe.
 *
 * - Edit the text freely (German, de-CH). Loaded via <script src>, so it works offline.
 * - ids are referenced elsewhere (artefact owners, decision modules, UI); change them carefully.
 * - Source tags on decision points: MS = Microsoft-dokumentiert, P = Praxiserfahrung,
 *   S = Unsere Synthese / beobachtetes Muster.
 * - After editing, run:  node check-worlds.mjs
 */
window.HE_WORLDS = {
  schema: "m365-toolbox.higher-education-worlds/v2",
  status: "content-v2",
  fictional: true,
  locale: "de-CH",
  purpose: "Recurring fictional higher-education work worlds for M365 Deep Dive training and consulting/adoption design.",
  sources: {
    MS: "Microsoft-dokumentiert",
    P: "Praxiserfahrung",
    S: "Unsere Synthese / beobachtetes Muster"
  },
  modules: [
    {
      id: "teams",
      nr: 1,
      title: "Teams sicher und sinnvoll nutzen",
      question: "Wo findet unsere gemeinsame Arbeit statt?"
    },
    {
      id: "communication",
      nr: 2,
      title: "Kommunikation in Teams",
      question: "Wo sollte diese Nachricht leben?"
    },
    {
      id: "documents",
      nr: 3,
      title: "Dokumente gemeinsam bearbeiten",
      question: "Wo sollte diese Datei leben?"
    },
    {
      id: "loop",
      nr: 4,
      title: "Gemeinsame Inhalte mit Loop erstellen und aktuell halten",
      question: "Wo sollte gemeinsames, sich veränderndes Wissen leben?"
    },
    {
      id: "planner",
      nr: 5,
      title: "Aufgaben sichtbar machen mit Planner & To Do",
      question: "Wo sollten gemeinsame Verpflichtungen sichtbar werden?"
    },
    {
      id: "balance",
      nr: 6,
      title: "Digital Balance",
      question: "Was verdient meine Aufmerksamkeit?"
    }
  ],
  worlds: [
    {
      id: "campus-people-development",
      type: "administrative-team",
      name: "Campus & People Development",
      tagline: "Kleines Zentralteam zwischen stabilem Betrieb, bereichsübergreifenden Projekten und gelegentlichen externen Gästen.",
      tension: "Das Leadership Forum gehört weder dem Team allein noch HR Services allein, und niemand hat entschieden, wo es wohnt.",
      unit_type: "Zentrale Servicestelle (Verwaltung)",
      rhythm: "Wochenbetrieb mit Jahreszyklus; das Leadership Forum bringt sechs Termine im Jahr 2027 und davor Monate Vorbereitung.",
      lifecycle: "Das Team ist dauerhaft, das Forum befristet (Vorbereitung ab Herbst 2026, Abschluss Anfang 2028).",
      size: 5,
      people: [
        {
          id: "lea-baumann",
          name: "Dr. Lea Baumann",
          role: "Teamleitung",
          focus: "Prioritäten, Budget, Abstimmung mit anderen Einheiten",
          stays_personal: [
            "Notizen aus Führungsgesprächen",
            "Budgetüberlegungen, bevor sie mit der Finanzstelle abgestimmt sind"
          ],
          shares: [
            "Prioritäten und Entscheide des Teams",
            "Budgetübersicht (freigegebener Stand)"
          ]
        },
        {
          id: "sophie-frei",
          name: "Sophie Frei",
          role: "Projektmanagerin",
          focus: "Universitätsweite Entwicklungsprogramme und Veranstaltungen",
          stays_personal: [
            "Rohkonzepte und Ablaufskizzen, bevor sie jemand sieht"
          ],
          shares: [
            "Konzept Leadership Forum",
            "Referierendenliste"
          ]
        },
        {
          id: "jonas-meier",
          name: "Jonas Meier",
          role: "Learning Specialist",
          focus: "Workshops, Trainings und digitale Lernangebote",
          stays_personal: [
            "Workshop-Entwürfe und Übungsideen"
          ],
          shares: [
            "Durchführungsunterlagen",
            "Feedbackauswertung nach den Terminen"
          ]
        },
        {
          id: "mara-conti",
          name: "Mara Conti",
          role: "Programmkoordination",
          focus: "Termine, Anmeldungen, Räume und interne Kommunikation",
          stays_personal: [
            "eigene Einarbeitungsnotizen mit den Fragen, die sie noch nicht laut stellen mag"
          ],
          shares: [
            "Termin- und Raumübersicht",
            "Anmeldeliste"
          ]
        },
        {
          id: "daniel-wyss",
          name: "Daniel Wyss",
          role: "Kommunikation & Administration",
          focus: "Webseiten, Einladungen und gemeinsame Unterlagen",
          stays_personal: [
            "Textentwürfe für Webseite und Newsletter"
          ],
          shares: [
            "Einladungsvorlagen",
            "Stand der Veröffentlichungen"
          ]
        },
        {
          id: "regula-aebi",
          name: "Regula Aebi",
          role: "Ansprechperson Leadership Forum, HR Services",
          focus: "Teilnehmendenkreis, Freigaben und HR-interne Kommunikation; gehört nicht zum Team",
          stays_personal: [
            "Abstimmung mit der HR-Leitung"
          ],
          shares: [
            "Vorgaben für HR-interne Teilnehmende",
            "Freigaben von Einladungen"
          ]
        }
      ],
      collaboration: {
        close_internal: [
          "HR Services (Ansprechperson: Regula Aebi)"
        ],
        occasional_internal: [
          "Fakultäten und Departemente",
          "Kommunikation & Marketing"
        ],
        external: [
          "Externe Trainer:innen und Referierende, jeweils nur für ihre Session"
        ]
      },
      work_mix: {
        individual_percent: 40,
        examples: [
          "Konzepte schreiben",
          "Einladungen und Webtexte",
          "Anmeldungen pflegen",
          "Abstimmung mit HR Services",
          "Workshops durchführen",
          "Teammeeting am Montag"
        ]
      },
      personal_vs_shared: {
        stays_personal: [
          "Rohkonzepte und Skizzen",
          "Textentwürfe",
          "eigene Einarbeitungs- und Gesprächsnotizen",
          "persönliche Aufgabenlisten"
        ],
        shared: [
          "Veranstaltungsplan",
          "Referierendenliste",
          "Einladungen (Endfassung)",
          "Budgetübersicht",
          "Pendenzen mit mehreren Beteiligten",
          "Entscheide zum Forum"
        ],
        moves_to_shared: [
          {
            when: "Ein Konzept wird von mehr als einer Person bearbeitet oder von Dritten gelesen.",
            why: "Sonst existieren ab diesem Moment zwei Fassungen, und niemand weiss, welche gilt."
          },
          {
            when: "Eine Aufgabe hat eine zweite verantwortliche Person oder einen Termin für andere.",
            why: "Persönliche Listen sind für andere unsichtbar, die Aufgabe fällt beim ersten Ausfall durch."
          },
          {
            when: "Ein Entscheid betrifft das Forum und nicht nur die Person, die ihn getroffen hat.",
            why: "Neue Kolleginnen und HR Services müssen ihn finden, ohne den Chatverlauf zu kennen."
          }
        ]
      },
      artefacts: [
        {
          id: "veranstaltungsplan",
          name: "Veranstaltungsplan",
          owner: "mara-conti",
          state: "shared",
          lifespan: "ein Jahr, pro Reihe",
          sensitivity: "intern",
          where_now: "Excel per E-Mail; Maras, Sophies und die Fassung von HR Services weichen voneinander ab.",
          where_better: "Eine Tabelle in den Dateien des Kanals «Leadership Forum», Link statt Anhang."
        },
        {
          id: "einladung",
          name: "Einladung",
          owner: "daniel-wyss",
          state: "shared",
          lifespan: "pro Termin, danach Archiv",
          sensitivity: "intern, vor Versand Entwurf",
          where_now: "Word-Dateien mit Namen wie «Einladung_v3_final_HR»; Entwürfe liegen im Postfach.",
          where_better: "Entwurf bei Daniel, ab Abstimmung mit HR eine Datei im Kanal; die versendete Fassung wird als PDF abgelegt."
        },
        {
          id: "referierendenliste",
          name: "Referierendenliste",
          owner: "sophie-frei",
          state: "shared",
          lifespan: "bis Forum-Ende",
          sensitivity: "enthält Kontaktdaten und Honorare",
          where_now: "Excel in Sophies OneDrive, Ausschnitte als Mailanhang an Daniel und HR.",
          where_better: "Im Kanal «Referierende» als eine Liste; Honorarspalten nur im gesonderten Budget."
        },
        {
          id: "budgetuebersicht",
          name: "Budgetübersicht",
          owner: "lea-baumann",
          state: "shared",
          lifespan: "Rechnungsjahr",
          sensitivity: "vertraulich",
          where_now: "Excel, Mailanhang an die Finanzstelle, daneben Leas persönliche Variante.",
          where_better: "Eine Datei in einem Kanal mit eingeschränktem Zugang (privater Kanal oder eigener Ordner), nicht im offenen Forum-Kanal."
        },
        {
          id: "praesentationen",
          name: "Präsentationen",
          owner: null,
          state: "shared",
          lifespan: "pro Termin",
          sensitivity: "teils vertraulich bis zum Auftritt",
          where_now: "Externe schicken PowerPoint-Dateien per Mail, Neufassungen kommen nach.",
          where_better: "Ein Ordner pro Referierende, freigegeben nur für die Person; nach dem Termin ins Archiv."
        },
        {
          id: "feedbackauswertung",
          name: "Feedbackauswertung",
          owner: "jonas-meier",
          state: "shared",
          lifespan: "bis zur Nachbereitung, dann Archiv",
          sensitivity: "anonymisiert, aber mit Freitexten",
          where_now: "Exportierte Tabelle im Download-Ordner, Zusammenfassung als Mail an Lea.",
          where_better: "Auswertung als eine Datei im Kanal «Nachbereitung»; Rohexport nach der Auswertung löschen."
        },
        {
          id: "pendenzen",
          name: "Pendenzen",
          owner: null,
          state: "shared",
          lifespan: "laufend",
          sensitivity: "intern",
          where_now: "Eine Excel-Liste mit einem Teil der Pendenzen, dazu persönliche Listen und Chat-Zusagen.",
          where_better: "Planner für gemeinsame Aufgaben mit Verantwortung und Termin; persönliche To-dos bleiben in To Do."
        },
        {
          id: "einarbeitung-neue-mitarbeitende",
          name: "Einarbeitungsliste für neue Mitarbeitende",
          owner: "lea-baumann",
          state: "shared",
          lifespan: "pro Eintritt, Vorlage dauerhaft",
          sensitivity: "intern",
          where_now: "Mara bekommt Mails mit Links, die schon veraltet sind, und eine Willkommensmail mit zwölf Anhängen.",
          where_better: "Eine lebende Liste (Loop oder Wiki-Seite) im Kanal «Interne Organisation», die Mara abhakt und Lea nachführt."
        },
        {
          id: "zugang-externe-trainer",
          name: "Zugang für externe Trainer:innen",
          owner: "sophie-frei",
          state: "shared",
          lifespan: "pro Einsatz",
          sensitivity: "personenbezogen, nur eigene Unterlagen",
          where_now: "Unterlagen per Mail; einmal wurde jemand von IT Services ins ganze Team eingeladen.",
          where_better: "Freigabe eines einzelnen Ordners per Link, befristet, ohne Zugang zum Team."
        },
        {
          id: "hr-abstimmung",
          name: "Abstimmung mit HR Services (Teilnehmendenkreis, Freigaben)",
          owner: "regula-aebi",
          state: "shared",
          lifespan: "bis Forum-Ende",
          sensitivity: "teils vertraulich (Nominationen)",
          where_now: "Mails zwischen Sophie, Regula und Lea; HR führt eine eigene Excel-Liste.",
          where_better: "Ein gemeinsamer Ort, an dem beide Seiten schreiben; Nominationsdetails bleiben bei HR Services."
        }
      ],
      scenarios: [
        {
          id: "leadership-forum-2027",
          name: "Leadership Forum 2027",
          trigger: "Die Universitätsleitung gibt das Forum 2027 frei, und HR Services schickt am selben Tag ihre eigene Excel-Liste mit.",
          description: "Eine universitätsweite Veranstaltungsreihe mit sechs Terminen, internen und externen Referierenden, Raumplanung, Budget, Kommunikation, Anmeldung, Präsentationen, Feedback und Nachbereitung.",
          stakes: "Sechs Termine mit je rund achtzig Teilnehmenden und externen Gästen. Wer beim dritten Termin den Stand nicht kennt, fragt per Mail nach, und dann gibt es zwei Versionen.",
          stages: [
            {
              id: "konzeption",
              stage: "Konzeption (Herbst 2026)",
              question: "Wer arbeitet mit, und wo wohnt das Forum?"
            },
            {
              id: "durchfuehrung",
              stage: "Durchführung (2027)",
              question: "Wie bleibt der Stand für alle gleich, auch für Externe?"
            },
            {
              id: "nachbereitung",
              stage: "Nachbereitung (Anfang 2028)",
              question: "Was wird archiviert, und wer räumt auf?"
            }
          ],
          current_state: {
            frictions: [
              "Termine werden per E-Mail abgestimmt.",
              "Einladungen liegen in mehreren Versionen vor.",
              "Entscheidungen stehen teilweise nur in Chats.",
              "Eine Excel-Liste enthält einen Teil der Pendenzen.",
              "Einzelne Mitarbeitende führen zusätzliche persönliche Listen.",
              "Eine neue Kollegin erkennt den aktuellen Stand nicht.",
              "HR Services führt eine eigene Teilnehmendenliste, die von der des Teams abweicht."
            ]
          },
          decision_points: [
            {
              id: "lf-where",
              question: "Wo wohnt das Leadership Forum: im bestehenden Team, in einem eigenen Team oder gemeinsam mit HR Services?",
              modules: [
                "teams"
              ],
              options: [
                {
                  label: "Kanal im bestehenden Team",
                  fits_when: "Das Forum ist praktisch Sache des Teams, HR Services liest nur mit oder arbeitet punktuell zu.",
                  tradeoff: "Am wenigsten Aufwand, aber HR Services muss ins ganze Team oder bleibt auf Mailanhängen."
                },
                {
                  label: "Eigenes Team für das Forum",
                  fits_when: "Beide Einheiten tragen es gleichberechtigt, es dauert über ein Jahr und hat Budget, Aufgaben und Externe.",
                  tradeoff: "Ein Container mehr; ohne Plan fürs Ende bleibt eine Leiche zurück."
                },
                {
                  label: "Geteilter Kanal zwischen den beiden Teams",
                  fits_when: "HR Services hat schon ein eigenes Team und will dort bleiben, arbeitet aber aktiv im Forum mit.",
                  tradeoff: "Jede Seite behält ihr Team; die Dateien liegen aber in einer separaten Ablage, und das Verständnis dafür muss man erst aufbauen."
                }
              ],
              pick: {
                label: "Eigenes Team für das Forum",
                why: "Unsere Wahl für diesen Kontext: gleichberechtigtes, befristetes Projekt über mehrere Monate; das Ende wird gleich mit eingeplant (Archivieren nach der Nachbereitung)."
              },
              not_do: [
                "Ein Team pro Termin",
                "Alles im Kanal «Allgemein» des bestehenden Teams ablegen, bis HR Services alles per Mail bekommt."
              ],
              source: "S"
            },
            {
              id: "lf-decisions-visible",
              question: "Wo steht, was entschieden wurde, damit eine neue Kollegin es später findet?",
              modules: [
                "communication"
              ],
              options: [
                {
                  label: "Beitrag im Kanal mit dem Ergebnis im Titel",
                  fits_when: "Der Entscheid betrifft mehrere und soll später auffindbar sein.",
                  tradeoff: "Verlangt Disziplin beim Titel; in einem lauten Kanal geht er trotzdem unter."
                },
                {
                  label: "Entscheidliste als Tabelle im Dokument",
                  fits_when: "Es gibt viele kleine Entscheide, die man chronologisch nachschlagen will.",
                  tradeoff: "Jemand muss pflegen; was nicht eingetragen wird, existiert nicht."
                },
                {
                  label: "Chat zwischen den Betroffenen",
                  fits_when: "Der Entscheid betrifft zwei Personen und hat keine Folgen für andere.",
                  tradeoff: "Schnell und leicht, aber nur für die zwei im Chat auffindbar."
                }
              ],
              pick: {
                label: "Beitrag im Kanal mit dem Ergebnis im Titel",
                why: "Unsere Wahl für diesen Kontext: wenige Entscheide mit Folgen, und die neue Kollegin sucht im Kanal, nicht in fremden Chats."
              },
              not_do: [
                "Entscheide im Chat belassen und später «nochmals kurz erklären»",
                "Einen langen Kanalbeitrag mit Fliesstext statt ein Ergebnis im Titel."
              ],
              source: "P"
            },
            {
              id: "lf-onboarding",
              question: "Wie findet Mara in der ersten Woche den Stand, ohne alle zu fragen?",
              modules: [
                "teams",
                "loop"
              ],
              options: [
                {
                  label: "Einarbeitungsliste als Loop-Seite im Kanal «Interne Organisation»",
                  fits_when: "Das Team passt die Liste laufend an und neue Personen sollen selber abhaken.",
                  tradeoff: "Braucht jemanden, der sie pflegt; Loop ist für manche noch neu."
                },
                {
                  label: "Gepinnter Beitrag im Kanal mit Links auf die wichtigen Dateien",
                  fits_when: "Es gibt wenige Eintritte, und die Liste ändert sich selten.",
                  tradeoff: "Leicht aufzusetzen, aber ohne Abhaken und ohne Status."
                },
                {
                  label: "Einarbeitungsgespräche und eine Mail mit einer Liste",
                  fits_when: "Das Team ist sehr klein und Einarbeitung läuft über Nähe.",
                  tradeoff: "Funktioniert, bis die Mail veraltet ist oder die Person im Homeoffice startet."
                }
              ],
              pick: {
                label: "Einarbeitungsliste als Loop-Seite im Kanal «Interne Organisation»",
                why: "Unsere Wahl für diesen Kontext: Mara ist nicht die letzte Neue, und die Liste lebt schon nach der ersten Woche weiter."
              },
              not_do: [
                "Maras Postfach mit weitergeleiteten Mails füllen",
                "Eine neue Teamstruktur nur für die Einarbeitung aufbauen."
              ],
              source: "S"
            },
            {
              id: "lf-external-trainers",
              question: "Wie kommen externe Trainer:innen an ihre Unterlagen und Termine?",
              modules: [
                "teams",
                "documents"
              ],
              options: [
                {
                  label: "Ordner pro Person, per Link freigegeben und befristet",
                  fits_when: "Die Person ist für einen Termin oder zwei dabei und braucht nur ihre Unterlagen.",
                  tradeoff: "Sophie verwaltet mehrere Links; die Person sieht sonst nichts vom Forum."
                },
                {
                  label: "Gastzugang zum Forum-Team",
                  fits_when: "Die Person ist mehrere Termine dabei und soll Absprachen mitlesen.",
                  tradeoff: "Sie sieht viel mehr als nötig, und das Konto muss aufgeräumt werden."
                },
                {
                  label: "Unterlagen per E-Mail",
                  fits_when: "Sehr kurzer Einsatz, eine einzige Datei.",
                  tradeoff: "Neufassungen verteilen sich in Postfächern, und niemand weiss, welche aktuell ist."
                }
              ],
              pick: {
                label: "Ordner pro Person, per Link freigegeben und befristet",
                why: "Unsere Wahl für diesen Kontext: wenig Berührungsfläche, kein Gastkonto, nach dem Termin ist die Freigabe weg."
              },
              not_do: [
                "Externe als Gäste ins ganze Forum-Team einladen",
                "Chat-Anhänge als Verteilweg für Präsentationen."
              ],
              source: "S"
            },
            {
              id: "lf-planner",
              question: "Planner für die Forum-Pendenzen oder bei Excel und persönlichen Listen bleiben?",
              modules: [
                "planner"
              ],
              options: [
                {
                  label: "Planner-Plan im Forum-Team, Aufgaben zugewiesen",
                  fits_when: "Mehrere Personen tragen Aufgaben mit Termin und brauchen einen gemeinsamen Stand.",
                  tradeoff: "Wer nicht mitzieht, macht den Plan zum Zweitsystem; zugewiesene Aufgaben erscheinen immerhin auch in To Do."
                },
                {
                  label: "Weiter eine gemeinsame Excel-Liste",
                  fits_when: "Die Liste ist klein und wird im Wochenmeeting durchgesprochen.",
                  tradeoff: "Keine Zuweisung, keine Erinnerung; wächst sie, wird sie unlesbar."
                },
                {
                  label: "Persönliche To-Do-Listen plus Besprechung am Montag",
                  fits_when: "Fast alle Aufgaben gehören einer einzigen Person.",
                  tradeoff: "Gemeinsame Verpflichtungen bleiben für andere unsichtbar."
                }
              ],
              pick: {
                label: "Planner-Plan im Forum-Team, Aufgaben zugewiesen",
                why: "Unsere Wahl für diesen Kontext: sechs Termine, mehrere Verantwortliche und eine zweite Einheit, die Status sehen muss. Persönliche Listen bleiben persönlich."
              },
              not_do: [
                "Einen Plan mit zwanzig Buckets anlegen, die niemand pflegt",
                "Persönliche Notizen als Planner-Aufgaben abbilden."
              ],
              source: "MS"
            }
          ],
          m365_model: {
            team: "Campus & People Development",
            channels: [
              "Allgemein",
              "Leadership Forum",
              "Learning Programme",
              "Interne Organisation"
            ],
            planner_buckets: [
              "Konzeption",
              "Referierende",
              "Kommunikation",
              "Organisation",
              "Durchführung",
              "Nachbereitung"
            ],
            notes: "Ausgangsmodell für die Diskussion. Die Entscheidung «eigenes Team» (lf-where) würde den Kanal «Leadership Forum» in ein eigenes Team verschieben."
          }
        }
      ],
      consulting_questions: [
        "Welche Zusammenarbeit ist dauerhaft und gehört in das bestehende Team?",
        "Wann braucht ein temporäres Projekt einen eigenen Arbeitsraum?",
        "Soll das Leadership Forum ein eigener Kanal, ein eigenes Team oder nur eine Dateiablage sein?",
        "Welche Entscheidungen müssen für neue Mitarbeitende später noch auffindbar sein?",
        "Wie viel Struktur ist genug, ohne das Team zu überladen?",
        "Wer räumt das Forum-Team auf, wenn das Projekt vorbei ist?",
        "Was sieht HR Services, und was soll bei HR Services bleiben?"
      ],
      boundary: "Nicht jede Veranstaltung braucht ein Team, und Anmeldedaten der Teilnehmenden gehören ins dafür vorgesehene Anmeldesystem, nicht in eine Liste im Kanal.",
      training_hooks: {
        teams: {
          prompt: "Eine neue Mitarbeiterin startet und muss aktuellen Stand, Unterlagen und Zuständigkeiten finden, während HR Services schon mitarbeitet.",
          decisions: [
            "lf-where",
            "lf-onboarding"
          ]
        },
        communication: {
          prompt: "Im Chat zwischen Sophie und Regula wird entschieden, dass der dritte Termin ein Online-Format wird; zwei Wochen später fragt Mara im Kanal nach.",
          decisions: [
            "lf-decisions-visible"
          ]
        },
        documents: {
          prompt: "Ein Referent schickt zum dritten Mal eine neue Fassung seiner Präsentation per Mail.",
          decisions: [
            "lf-external-trainers",
            "lf-where"
          ]
        },
        loop: {
          prompt: "Arbeitsnotizen, offene Fragen und die Einarbeitungsliste bleiben gemeinsam aktuell, ohne dass jemand sie nachführen muss.",
          decisions: [
            "lf-onboarding"
          ]
        },
        planner: {
          prompt: "Die Veranstaltungsreihe wird als gemeinsamer Arbeitsstand mit Verantwortung, Terminen und Status organisiert, und Sophies persönliche Liste bleibt trotzdem ihre.",
          decisions: [
            "lf-planner"
          ]
        },
        balance: {
          prompt: "Nicht jede Änderung am Forum soll bei allen sofort eine Benachrichtigung auslösen, schon gar nicht bei HR Services.",
          decisions: [
            "lf-planner",
            "lf-decisions-visible"
          ]
        }
      }
    },
    {
      id: "urban-health-analytics",
      type: "research-group",
      name: "Basel Center for Urban Health Analytics",
      tagline: "Forschungsgruppe mit gemeinsamer Infrastruktur und viel Einzelarbeit. Die Frage ist immer: Wer teilt was, und wann?",
      tension: "Das Paper wächst im OneDrive einer Person, und die Rohdaten gehören sowieso nicht in Teams.",
      unit_type: "Forschungsgruppe (drittmittelfinanziert)",
      rhythm: "Wöchentliches Gruppenmeeting; Projekte laufen zwei bis drei Jahre; Feldkampagnen im Sommer.",
      lifecycle: "Die Gruppe ist dauerhaft, Projekte sind befristet, die Personen wechseln (PhD drei bis vier Jahre, Postdoc zwei).",
      size: 7,
      people: [
        {
          id: "elena-rossi",
          name: "Prof. Dr. Elena Rossi",
          role: "Principal Investigator",
          focus: "Leitung der Forschungsgruppe",
          stays_personal: [
            "Skizzen für Förderanträge",
            "Notizen aus Personalgesprächen"
          ],
          shares: [
            "Gruppenagenda",
            "Stand der Anträge und Reiseregeln"
          ]
        },
        {
          id: "david-brunner",
          name: "Dr. David Brunner",
          role: "Senior Researcher",
          focus: "Koordination mehrerer Forschungsprojekte",
          stays_personal: [
            "Projektplanung, bis sie mit Elena abgestimmt ist"
          ],
          shares: [
            "Projektübersicht und Meilensteine"
          ]
        },
        {
          id: "amira-hassan",
          name: "Amira Hassan",
          role: "PhD Candidate",
          focus: "Luftqualität und Mobilität",
          stays_personal: [
            "Literaturnotizen",
            "frühe Analysen, die noch nichts bedeuten"
          ],
          shares: [
            "Analyse-Skripte, sobald Ergebnisse darauf aufbauen"
          ]
        },
        {
          id: "lukas-gerber",
          name: "Lukas Gerber",
          role: "PhD Candidate",
          focus: "Hitzeinseln und Gesundheit",
          stays_personal: [
            "Rohentwürfe von Kapiteln",
            "seine Literatursammlung"
          ],
          shares: [
            "Einsatzplan für die Feldkampagne"
          ]
        },
        {
          id: "nina-petrovic",
          name: "Dr. Nina Petrović",
          role: "Postdoc",
          focus: "Statistische Modelle und Publikationen",
          stays_personal: [
            "Modellexperimente und Zwischenstände"
          ],
          shares: [
            "Paper-Entwurf Heat & Health",
            "Hilfen für die Statistik der PhDs"
          ]
        },
        {
          id: "marc-schneider",
          name: "Marc Schneider",
          role: "Research Technician",
          focus: "Sensorik, Geräte und Datenerhebung",
          stays_personal: [
            "Kalibrierungs-Rohwerte und Gerätenotizen"
          ],
          shares: [
            "Sensor-Logbuch",
            "Gerätebuchung und Messprotokolle"
          ]
        },
        {
          id: "julia-weber",
          name: "Julia Weber",
          role: "Research Administration",
          focus: "Finanzen, Verträge, Reisekosten und Projektadministration",
          stays_personal: [
            "Abrechnungsentwürfe, bis sie geprüft sind"
          ],
          shares: [
            "Fristen und Kostenstände",
            "Formulare und Reisevorgaben"
          ]
        }
      ],
      collaboration: {
        close_internal: [
          "Forschungsadministration der Fakultät"
        ],
        occasional_internal: [
          "IT Services (Forschungsdateninfrastruktur)",
          "Ethikkommission"
        ],
        external: [
          "Kantonales Amt als Datenpartner (Messstellen, Stadtplanung)",
          "Forschungsgruppe an einer Partneruniversität (Coautorin)"
        ]
      },
      work_mix: {
        individual_percent: 55,
        examples: [
          "eigene Analysen und Modelle",
          "Schreiben und Literatur",
          "Feldarbeit zu zweit",
          "Gruppenmeeting",
          "Projektadministration",
          "Konferenzvorbereitung"
        ]
      },
      personal_vs_shared: {
        stays_personal: [
          "persönliche Notizen",
          "Literatur und Literaturverwaltung",
          "frühe Ideen und Analysen",
          "eigene Entwürfe",
          "individuelle Aufgaben"
        ],
        shared: [
          "Gruppensitzungen",
          "Geräte und Sensoren",
          "Sensor-Logbuch und Protokolle",
          "Onboarding",
          "Reiseregeln",
          "Projektanträge",
          "Publikationsplanung",
          "Konferenzen",
          "beschriebene Datenprozesse (nicht die Daten selbst)"
        ],
        moves_to_shared: [
          {
            when: "Ein Entwurf bekommt eine zweite Autorin oder ein Feedback von mehr als einer Person.",
            why: "Sonst entstehen Kopien, und der Entwurf bleibt bei einer Person hängen, auch wenn sie die Gruppe verlässt."
          },
          {
            when: "Ein Skript wird von jemand anderem für eine Analyse gebraucht.",
            why: "Wer anders rechnet als der Skriptautor, braucht die gleiche Fassung samt Beschreibung."
          },
          {
            when: "Eine Frage oder ein Entscheid betrifft die Geräte oder die Feldkampagne.",
            why: "Die Information ist dann Gruppenwissen und gehört nicht in einen Chat."
          },
          {
            when: "Jemand tritt neu in die Gruppe ein.",
            why: "Onboarding-Wissen muss ohne Nachfragen auffindbar sein; es gehört nicht in persönliche Notizen."
          }
        ]
      },
      artefacts: [
        {
          id: "sensordaten",
          name: "Sensordaten",
          owner: "marc-schneider",
          state: "institutional",
          lifespan: "Projektlaufzeit plus Aufbewahrungsfrist",
          sensitivity: "gross, teils mit Personenbezug",
          where_now: "Teilweise auf Geräten und lokalen Platten, teilweise «zur Sicherheit» in den Gruppenordner kopiert.",
          where_better: "Forschungsdateninfrastruktur der Universität; im Kanal nur Beschreibung, Pfade und aggregierte Resultate."
        },
        {
          id: "analyse-skripte",
          name: "Analyse-Skripte",
          owner: "amira-hassan",
          state: "personal",
          lifespan: "Projektlaufzeit",
          sensitivity: "nicht sensibel, aber wertvoll",
          where_now: "Lokal bei der jeweiligen Person, Versionen per Mail oder im Chat.",
          where_better: "In der Versionsverwaltung der Gruppe oder der Infrastruktur; in M365 nur die Beschreibung und ein Link."
        },
        {
          id: "paper-entwurf",
          name: "Paper-Entwurf",
          owner: "nina-petrovic",
          state: "personal",
          lifespan: "6 bis 12 Monate bis zur Einreichung, danach Archiv",
          sensitivity: "vertraulich bis zur Veröffentlichung",
          where_now: "OneDrive von Nina. Feedback kommt als heruntergeladene Kopie; ein Anhang im Gruppenchat landet im OneDrive der sendenden Person.",
          where_better: "Ab drei Beteiligten in den Dateien des Kanals «Publikationen»; Coautorin von der Partneruniversität per Link auf genau diese Datei."
        },
        {
          id: "praesentation",
          name: "Präsentation",
          owner: "lukas-gerber",
          state: "personal",
          lifespan: "bis zur Konferenz",
          sensitivity: "vor Auftritt vertraulich",
          where_now: "Lokal und auf einem USB-Stick; Feedback mündlich nach dem Gruppenmeeting.",
          where_better: "Im OneDrive des Vortragenden, für das Feedback als Link; nach der Konferenz die Endfassung im Kanal."
        },
        {
          id: "feldarbeitsaufgaben",
          name: "Feldarbeitsaufgaben",
          owner: "marc-schneider",
          state: "shared",
          lifespan: "Sommerkampagne",
          sensitivity: "intern",
          where_now: "Separate Excel-Liste, die Marc nachführt; Änderungen kommen per Chat.",
          where_better: "Planner-Plan nur für die Kampagne; danach archivieren."
        },
        {
          id: "meetingnotizen",
          name: "Meetingnotizen",
          owner: "david-brunner",
          state: "shared",
          lifespan: "laufend, Archiv nach Semester",
          sensitivity: "intern",
          where_now: "Mal in Word, mal im Chat; wer die Notizen macht, wechselt.",
          where_better: "Eine Loop-Seite oder ein Dokument im Kanal «Gruppenorganisation», in dem alle Fragen und Beschlüsse mitlesen."
        },
        {
          id: "administrative-deadlines",
          name: "administrative Deadlines",
          owner: "julia-weber",
          state: "shared",
          lifespan: "laufend",
          sensitivity: "intern",
          where_now: "Julias Kalender und ihre eigene Liste; die PhDs fragen, wann die Reiseabrechnung fällig ist.",
          where_better: "Gemeinsamer Kalender oder Liste im Kanal «Gruppenorganisation»; keine Planner-Aufgaben für Formularfristen."
        },
        {
          id: "sensor-logbuch",
          name: "Sensor-Logbuch",
          owner: "marc-schneider",
          state: "shared",
          lifespan: "Lebensdauer des Geräts",
          sensitivity: "intern",
          where_now: "Excel in Marcs OneDrive; wer eine Messung einträgt, schreibt ihm eine Nachricht.",
          where_better: "Eine Datei in den Dateien des Kanals «Infrastruktur & Geräte», von mehreren gleichzeitig bearbeitbar."
        },
        {
          id: "geraetebuchung",
          name: "Gerätebuchung",
          owner: "marc-schneider",
          state: "shared",
          lifespan: "laufend",
          sensitivity: "intern",
          where_now: "Zuruf, Chat und ein Kalender, den niemand abonniert hat.",
          where_better: "Ein gemeinsamer Ressourcenkalender pro Gerät, den alle sehen; die Buchung ist ein Termin."
        },
        {
          id: "messprotokolle",
          name: "Messprotokolle und Kalibrierung",
          owner: "marc-schneider",
          state: "shared",
          lifespan: "Gerät plus Aufbewahrungsfrist",
          sensitivity: "Qualitätsnachweis",
          where_now: "Papier am Gerät, teilweise abfotografiert; manche Fotos nur auf dem Handy.",
          where_better: "Seite im Kanal «Infrastruktur & Geräte»; Papier am Gerät bleibt, wenn es dort besser funktioniert."
        },
        {
          id: "gesundheitsdaten-teilnehmende",
          name: "Gesundheitsdaten der Teilnehmenden",
          owner: "david-brunner",
          state: "institutional",
          lifespan: "gemäss Ethikbewilligung",
          sensitivity: "hoch, personenbezogen",
          where_now: "Pseudonymisiert auf einem Institutslaufwerk, Auszüge als Excel für Analysen.",
          where_better: "Ausschliesslich in der Forschungsdateninfrastruktur der Universität; kein Auszug in Teams oder SharePoint."
        }
      ],
      scenarios: [
        {
          id: "heat-health-basel",
          name: "Heat & Health Basel",
          trigger: "Das Journal verlangt den Revisionstext in sechs Wochen, und das Feedback kommt von drei Personen in drei Dateien.",
          description: "Vier Forschende arbeiten gemeinsam an einer Studie zu Hitzebelastung und Gesundheit. Es gibt Sensoren, Teilnehmende, einen Datenpartner und ein Paper.",
          stakes: "Frist beim Journal, sensible Gesundheitsdaten und ein Datenpartner. Fehlt der Überblick, geht Zeit verloren, und im schlimmsten Fall landen Daten am falschen Ort.",
          stages: [
            {
              id: "feldarbeit",
              stage: "Feldarbeit und Messungen",
              question: "Wer bucht welches Gerät, und wo steht, was gemessen wurde?"
            },
            {
              id: "analyse",
              stage: "Analyse",
              question: "Was bleibt persönlich, was wird gemeinsame Grundlage?"
            },
            {
              id: "publikation",
              stage: "Publikation",
              question: "Wo entsteht das Paper, und wer darf darauf schreiben?"
            }
          ],
          current_state: {
            frictions: [
              "Der Paper-Entwurf liegt im persönlichen OneDrive einer Person.",
              "Feedback kommt als heruntergeladene Kopie zurück.",
              "Literaturhinweise werden im Chat geteilt.",
              "Sensor-Pendenzen stehen in einer separaten Excel-Liste.",
              "Administrative Deadlines werden getrennt geführt.",
              "Der gemeinsame Projektstand ist nicht sichtbar.",
              "Rohdaten wurden schon einmal «zur Sicherheit» in den Gruppenordner kopiert."
            ]
          },
          decision_points: [
            {
              id: "hh-chat-attachment",
              question: "Wo landet die Datei, wenn wir sie im Gruppenchat teilen, und wo, wenn wir sie im Kanal ablegen?",
              modules: [
                "documents",
                "communication"
              ],
              options: [
                {
                  label: "Als Anhang im Gruppenchat teilen",
                  fits_when: "Eine kurze Einmalansicht, niemand soll darauf aufbauen.",
                  tradeoff: "Die Datei landet im OneDrive der sendenden Person; wer geht, nimmt sie mit."
                },
                {
                  label: "In den Dateien des Kanals ablegen und den Link teilen",
                  fits_when: "Mehrere arbeiten an der Datei oder brauchen sie noch in einem Jahr.",
                  tradeoff: "Ein Schritt mehr beim Ablegen, dafür ist der Ort klar."
                },
                {
                  label: "Link aus dem eigenen OneDrive, gezielt an wenige freigegeben",
                  fits_when: "Zwei Personen arbeiten zeitlich begrenzt an einem Entwurf.",
                  tradeoff: "Rechte pro Datei verwalten; fällt die Besitzerin weg, ist die Datei weg."
                }
              ],
              pick: {
                label: "In den Dateien des Kanals ablegen und den Link teilen",
                why: "Unsere Wahl für diesen Kontext: Das Paper hat mehrere Autor:innen und läuft länger als ein Semester, die Datei darf nicht an einer Person hängen."
              },
              not_do: [
                "Das Paper als Anhang im Chat herumreichen und jede Rückmeldung als neue Datei zurückschicken",
                "Literaturhinweise im Chat sammeln, wenn sie nach der Einreichung noch gebraucht werden."
              ],
              source: "MS"
            },
            {
              id: "hh-lab-pattern",
              question: "Wo leben Sensor-Logbuch, Gerätebuchung und Messprotokolle?",
              modules: [
                "teams",
                "loop"
              ],
              options: [
                {
                  label: "Ein Kanal «Infrastruktur & Geräte» im Gruppenteam",
                  fits_when: "Marc betreut die Geräte, aber alle schreiben ins Logbuch und buchen.",
                  tradeoff: "Wenig Aufwand; andere Gruppen am Institut sind nicht dabei."
                },
                {
                  label: "Ein eigenes kleines Team für die Geräteinfrastruktur",
                  fits_when: "Mehrere Gruppen teilen die Geräte, und Marc ist zentraler Ansprechpartner.",
                  tradeoff: "Ein zusätzlicher Container und eine Verantwortung, die jemand tragen muss."
                },
                {
                  label: "Papierlogbuch am Gerät plus Foto ins Team",
                  fits_when: "Im Labor oder Feld ist ein Laptop unpraktisch.",
                  tradeoff: "Fotos sind nicht durchsuchbar, und es braucht Disziplin beim Hochladen."
                }
              ],
              pick: {
                label: "Ein Kanal «Infrastruktur & Geräte» im Gruppenteam",
                why: "Unsere Wahl für diesen Kontext: eine Gruppe, ein Techniker, wenige Geräte. Ein eigenes Team lohnt, wenn eine zweite Gruppe mitbucht."
              },
              not_do: [
                "Gerätebuchung im Chat auf Zuruf",
                "Ein Excel pro Gerät in Marcs OneDrive."
              ],
              source: "S"
            },
            {
              id: "hh-research-data",
              question: "Wohin mit den Rohdaten der Sensoren und den Gesundheitsdaten?",
              modules: [
                "teams",
                "documents"
              ],
              options: [
                {
                  label: "Rohdaten in der Forschungsdateninfrastruktur, im Kanal nur Beschreibung, Pfade und aggregierte Resultate",
                  fits_when: "Grosse oder sensible Daten, klare Zugriffsregeln.",
                  tradeoff: "Etwas mehr Aufwand beim Auffinden; dafür bleiben Daten dort, wo sie hingehören."
                },
                {
                  label: "Im Kanal strikt nur Verweise, auch keine Auszüge",
                  fits_when: "Kleine Fallzahlen, bei denen auch aggregierte Tabellen eine Person verraten könnten.",
                  tradeoff: "Das Team sieht kaum Inhalt, Zusammenarbeit läuft über die Infrastruktur."
                },
                {
                  label: "Kleine, unkritische Messreihen direkt in den Kanal-Dateien",
                  fits_when: "Wenige MB, keine Personenbezüge, etwa Kalibrierwerte.",
                  tradeoff: "Die Grenze muss klar benannt sein; sonst wandern grössere Daten nach."
                }
              ],
              pick: {
                label: "Rohdaten in der Forschungsdateninfrastruktur, im Kanal nur Beschreibung, Pfade und aggregierte Resultate",
                why: "Unsere Wahl für diesen Kontext. M365 organisiert die Arbeit um die Daten herum, es ist nicht ihr Speicher."
              },
              not_do: [
                "Grosse Rohdaten oder Gesundheitsdaten «kurz» in Teams oder SharePoint ablegen",
                "Ausschnitte als Excel per Mail an Coautor:innen schicken."
              ],
              source: "S"
            },
            {
              id: "hh-external-partner",
              question: "Wie bekommt die Ansprechperson des Kantons Einblick in Meilensteine und Zwischenresultate?",
              modules: [
                "teams"
              ],
              options: [
                {
                  label: "Geteilter Kanal «Heat & Health – Partner»",
                  fits_when: "Mehrere Personen des Partners arbeiten regelmässig mit.",
                  tradeoff: "Echter gemeinsamer Raum, aber Einrichtung, Abstimmung und Regeln mit beiden Organisationen."
                },
                {
                  label: "Gastzugang zum Gruppenteam",
                  fits_when: "Eine Person ist über Jahre fest dabei und soll vieles sehen.",
                  tradeoff: "Sie sieht alle Kanäle und Dateien, sofern nicht eingeschränkt."
                },
                {
                  label: "Kein Zugang: Quartalsupdate als Mail mit Link auf eine freigegebene Datei",
                  fits_when: "Eine einzige Kontaktperson, ein paar Berichte im Jahr.",
                  tradeoff: "Mehr Handarbeit für Julia oder David, dafür keine fremden Konten im Team."
                }
              ],
              pick: {
                label: "Kein Zugang: Quartalsupdate als Mail mit Link auf eine freigegebene Datei",
                why: "Unsere Wahl für diesen Kontext: eine Kontaktperson, vierteljährlicher Austausch. Bei Kooperation mit mehreren Personen wäre der geteilte Kanal richtig."
              },
              not_do: [
                "Den Partner als Gast ins ganze Gruppenteam einladen, damit er «alles sieht»",
                "Ein Kanal pro Partner anlegen, bevor klar ist, ob die Zusammenarbeit wächst."
              ],
              source: "S"
            },
            {
              id: "hh-fieldwork-tasks",
              question: "Wo stehen die Aufgaben der Sommerkampagne?",
              modules: [
                "planner"
              ],
              options: [
                {
                  label: "Planner-Plan nur für die Kampagne",
                  fits_when: "Mehrere Personen übernehmen Einsätze mit Datum und wollen den Stand sehen.",
                  tradeoff: "Aufwand für Aufbau; nach der Kampagne archivieren."
                },
                {
                  label: "Eine gemeinsame Excel-Liste im Kanal",
                  fits_when: "Marc plant die Einsätze allein, die anderen lesen mit.",
                  tradeoff: "Keine Zuweisung, keine Erinnerung, aber niemand muss etwas Neues lernen."
                },
                {
                  label: "Persönliche To Do und Absprache im Gruppenmeeting",
                  fits_when: "Die Kampagne ist klein, zwei Personen.",
                  tradeoff: "Der Stand ist für Dritte unsichtbar."
                }
              ],
              pick: {
                label: "Planner-Plan nur für die Kampagne",
                why: "Unsere Wahl für diesen Kontext: mehrere Beteiligte, klare Daten, Ende absehbar. Für administrative Fristen genügt eine Liste."
              },
              not_do: [
                "Ein dauerhafter Planner-Plan für alles, was in der Gruppe irgendwann anfällt",
                "Formularfristen und Reisetermine als Planner-Aufgaben."
              ],
              source: "MS"
            }
          ],
          m365_model: {
            team: "Urban Health Analytics",
            channels: [
              "Allgemein",
              "Infrastruktur & Geräte",
              "Heat & Health Basel",
              "Publikationen",
              "Gruppenorganisation"
            ],
            planner_buckets: [],
            notes: "Ein Team für die Gruppe, Kanäle nach Arbeitsbereichen. Rohdaten liegen ausserhalb in der Forschungsdateninfrastruktur; ein Planner-Plan nur für die Sommerkampagne, wenn die Gruppe ihn will."
          }
        }
      ],
      consulting_questions: [
        "Was sollte gruppenweit sichtbar sein und was darf persönlich bleiben?",
        "Wann wird aus einem persönlichen Entwurf ein gemeinsames Dokument?",
        "Wie organisieren wir Geräte-, Infrastruktur- und Serviceinformationen?",
        "Wann braucht ein Forschungsprojekt einen eigenen Arbeitsraum?",
        "Wo hilft Planner und wo wäre er zusätzliche Bürokratie?",
        "Wie integrieren wir externe Projektpartner ohne die Grundstruktur zu überladen?",
        "Welche Daten gehören nie in Teams oder SharePoint, und wer sagt das den PhDs am ersten Tag?",
        "Was passiert mit Ninas OneDrive, wenn ihr Vertrag endet?"
      ],
      boundary: "Grosse Rohdaten und sensible Gesundheitsdaten gehören in die Forschungsdateninfrastruktur der Universität, nicht in Teams oder SharePoint. M365 trägt Organisation, Entwürfe und Kommunikation rund um die Daten.",
      training_hooks: {
        teams: {
          prompt: "Ein neuer PhD tritt der Gruppe bei und muss Infrastruktur, Gruppenwissen und laufende Projekte verstehen, ohne Rohdaten im Team zu suchen.",
          decisions: [
            "hh-lab-pattern",
            "hh-external-partner"
          ]
        },
        communication: {
          prompt: "Amira schickt ihre Revision als Anhang in den Gruppenchat, und drei Leute arbeiten mit dem Anhang weiter.",
          decisions: [
            "hh-chat-attachment"
          ]
        },
        documents: {
          prompt: "Ein persönlicher Manuskriptentwurf wird zu einer gemeinsamen Publikation mit mehreren Autor:innen, und die Daten bleiben ausserhalb.",
          decisions: [
            "hh-chat-attachment",
            "hh-research-data"
          ]
        },
        loop: {
          prompt: "Die Messprotokolle und das Gerätewissen werden zu einer lebenden Seite, die Marc nicht mehr allein pflegen muss.",
          decisions: [
            "hh-lab-pattern"
          ]
        },
        planner: {
          prompt: "Feldarbeit und Projektmeilensteine werden für mehrere Beteiligte sichtbar, ohne dass die Gruppe jede Formularfrist in Planner abbildet.",
          decisions: [
            "hh-fieldwork-tasks"
          ]
        },
        balance: {
          prompt: "Die Forschungsgruppe trennt wichtige Projektupdates von allgemeinem Informationsrauschen, besonders in der Feldkampagne.",
          decisions: [
            "hh-chat-attachment",
            "hh-fieldwork-tasks"
          ]
        }
      }
    },
    {
      id: "nora-keller",
      type: "individual-knowledge-worker",
      name: "Dr. Nora Keller",
      tagline: "Weitgehend eigenständige Forscherin und Dozentin, die gezielt und selten zusammenarbeitet.",
      tension: "Siebzig Prozent ihrer Arbeit gehören nur ihr, und das ist in Ordnung, bis jemand anderes mitschreiben soll.",
      unit_type: "Einzelperson in einem Institut (Forschung und Lehre)",
      rhythm: "Semesterrhythmus; Schreibphasen in der vorlesungsfreien Zeit; der Workshop findet einmal im Jahr statt.",
      lifecycle: "Die Arbeit ist dauerhaft individuell; Zusammenarbeit tritt als Ereignis auf (Coautorin, Abwesenheit, Workshopreihe).",
      size: 1,
      people: [
        {
          id: "nora-keller",
          name: "Dr. Nora Keller",
          role: "Wissenschaftliche Mitarbeiterin, Institut für Europäische Geschichte",
          focus: "Migrations- und Grenzgeschichte; schreibt Artikel, gibt ein Seminar und betreut Abschlussarbeiten",
          stays_personal: [
            "Forschungsnotizen und Quellenexzerpte",
            "frühe Entwürfe",
            "ihre To-Do-Liste"
          ],
          shares: [
            "fertige Texte, wenn jemand Feedback geben soll",
            "das Workshop-Programm",
            "Seminarmaterial (über die Lernplattform der Universität)"
          ]
        }
      ],
      collaboration: {
        close_internal: [],
        occasional_internal: [
          "Institut für Europäische Geschichte",
          "Workshop «Borders & Mobility»",
          "Institutssekretariat"
        ],
        external: [
          "Coautorin an einer Partneruniversität (ab Herbst)",
          "Referierende des Workshops"
        ]
      },
      work_mix: {
        individual_percent: 70,
        examples: [
          "Forschungsartikel",
          "Seminar",
          "Betreuung von Studierenden",
          "kleine Arbeitsgruppe",
          "gelegentliche Workshop-Organisation",
          "Institutsmeetings"
        ]
      },
      personal_vs_shared: {
        stays_personal: [
          "To Do: Artikel überarbeiten",
          "To Do: Literatur bestellen",
          "To Do: Feedback für Studentin",
          "To Do: Reisekosten einreichen",
          "Forschungsnotizen und frühe Entwürfe"
        ],
        shared: [
          "Artikel, sobald eine zweite Person daran schreibt",
          "Workshop-Programm und Teilnehmendenliste",
          "Seminarmaterial über die Lernplattform"
        ],
        moves_to_shared: [
          {
            when: "Eine zweite Autorin schreibt am selben Text mit.",
            why: "Zwei Kopien desselben Entwurfs kosten am Schluss mehr Zeit als die Einrichtung eines Orts."
          },
          {
            when: "Nora fällt aus und jemand muss Termine oder Gutachten übernehmen.",
            why: "Die Übernahme darf nicht daran scheitern, dass etwas nur in ihrem Kopf oder ihrem OneDrive existiert."
          },
          {
            when: "Der Workshop wird zur Reihe und mehr als zwei Personen tragen Aufgaben.",
            why: "Dann braucht es einen Stand, den alle sehen, ohne dass Nora Mails zusammenträgt."
          }
        ]
      },
      artefacts: [
        {
          id: "forschungsnotizen",
          name: "Forschungsnotizen",
          owner: "nora-keller",
          state: "personal",
          lifespan: "Projektdauer, oft länger",
          sensitivity: "persönlich",
          where_now: "OneDrive",
          where_better: "Bleibt in OneDrive; eine Ordnerstruktur nach Projekt genügt."
        },
        {
          id: "fruehe-manuskriptentwuerfe",
          name: "frühe Manuskriptentwürfe",
          owner: "nora-keller",
          state: "personal",
          lifespan: "Monate bis zur ersten Gesamtfassung",
          sensitivity: "vertraulich",
          where_now: "OneDrive",
          where_better: "Bleibt in OneDrive, bis die erste Gesamtfassung steht; dann gezielt teilen."
        },
        {
          id: "lehrunterlagen-in-vorbereitung",
          name: "Lehrunterlagen in Vorbereitung",
          owner: "nora-keller",
          state: "personal",
          lifespan: "ein Semester",
          sensitivity: "intern",
          where_now: "OneDrive",
          where_better: "Bleibt in OneDrive; die freigegebene Fassung geht auf die Lernplattform der Universität."
        },
        {
          id: "persoenliche-arbeitsdokumente",
          name: "persönliche Arbeitsdokumente",
          owner: "nora-keller",
          state: "personal",
          lifespan: "laufend",
          sensitivity: "persönlich",
          where_now: "OneDrive",
          where_better: "Bleibt in OneDrive, ohne weitere Struktur."
        },
        {
          id: "gemeinsamer-artikel",
          name: "Artikel mit Coautorin",
          owner: "nora-keller",
          state: "shared",
          lifespan: "bis zur Einreichung, danach Archiv",
          sensitivity: "vertraulich bis zur Veröffentlichung",
          where_now: "Würde per Mail zwischen Wien und Basel pendeln: Noras Fassung, deren Fassung, und eine, die niemand mehr zuordnen kann.",
          where_better: "Eine Datei in Noras OneDrive, der Coautorin per Link mit Bearbeitungsrecht freigegeben, bis sie in der Fachgruppe oder einem Projekt gebraucht wird."
        },
        {
          id: "uebergabe-notiz",
          name: "Übergabe-Notiz bei Abwesenheit",
          owner: "nora-keller",
          state: "shared",
          lifespan: "für die Dauer der Abwesenheit",
          sensitivity: "vertraulich",
          where_now: "Noras Postfach mit offenen Mails; wer vertritt, weiss nicht, was dringend ist.",
          where_better: "Eine Seite mit Terminen, Betreuungen und den wenigen freigegebenen Dateien; das OneDrive bleibt zu."
        },
        {
          id: "betreuungsfeedback",
          name: "Feedback an Studierende",
          owner: "nora-keller",
          state: "personal",
          lifespan: "bis zur Abgabe der Arbeit",
          sensitivity: "personenbezogen",
          where_now: "Entwürfe in OneDrive, Kommentare in der Datei der Studentin und in Mails.",
          where_better: "Bleibt persönlich; die abgegebene Fassung und die Bewertung liegen im System der Universität."
        },
        {
          id: "workshop-unterlagen",
          name: "Unterlagen «Borders & Mobility»",
          owner: "nora-keller",
          state: "shared",
          lifespan: "pro Jahr, Archiv fortlaufend",
          sensitivity: "teils intern, teils öffentlich",
          where_now: "Programm als Word, Anmeldungen per Mail, Honorarfragen in einem Chat mit dem Sekretariat.",
          where_better: "Ein Ordner in der Institutsablage (SharePoint) mit Programm und Kontaktliste; Outlook-Serie für die Termine."
        }
      ],
      scenarios: [
        {
          id: "vom-persoenlichen-entwurf-zur-gemeinsamen-publikation",
          name: "Vom persönlichen Entwurf zur gemeinsamen Publikation",
          trigger: "Eine Kollegin aus Wien schreibt: «Ich würde das Kapitel gern mitschreiben.»",
          description: "Nora hat einen Artikel über Monate allein entwickelt. Jetzt soll eine Coautorin einsteigen, und Nora will weder die Kontrolle abgeben noch den Entwurf ausser Sicht verlieren.",
          stakes: "Ein Artikel mit Frist, eine Coautorin an einer anderen Universität und ein Entwurf mit mehr Versionen als Seiten.",
          stages: [
            {
              id: "solo",
              stage: "Solo",
              question: "Bleibt der Entwurf persönlich in OneDrive?"
            },
            {
              id: "punktuelles-feedback",
              stage: "Punktuelles Feedback",
              question: "Reicht gezieltes Teilen mit einer Kollegin?"
            },
            {
              id: "gemeinsame-autorenschaft",
              stage: "Gemeinsame Autorenschaft",
              question: "Braucht das Dokument nun einen gemeinsamen Projektkontext?"
            }
          ],
          current_state: {
            frictions: [
              "Der Entwurf liegt in OneDrive, die Coautorin bekommt Kopien per Mail.",
              "Kommentare stehen in der Mail, nicht im Dokument.",
              "Niemand weiss, welche Fassung die aktuelle ist."
            ]
          },
          decision_points: [
            {
              id: "nk-coauthor",
              question: "Wo liegt der Artikel, wenn eine Coautorin mitschreibt?",
              modules: [
                "documents"
              ],
              options: [
                {
                  label: "Datei bleibt in Noras OneDrive, Coautorin bekommt einen Link mit Bearbeitungsrecht",
                  fits_when: "Zwei Autorinnen, ein klarer Zeitraum, ein Dokument.",
                  tradeoff: "Die Datei hängt an Noras Konto; fällt Nora aus, hat die Coautorin keine eigene Kopie in der Ablage."
                },
                {
                  label: "Eigenes Team für den Artikel",
                  fits_when: "Drei oder mehr Autor:innen, Daten, Monate gemeinsamer Arbeit, ein Projekt mit Lebenslauf.",
                  tradeoff: "Ein Container mehr für ein Dokument; bei zwei Autorinnen steht der Aufwand im Missverhältnis."
                },
                {
                  label: "Das Tool der Coautorin verwenden (z. B. eine Schreibplattform)",
                  fits_when: "Die Coautorin hat bereits einen etablierten Ablauf, etwa mit LaTeX.",
                  tradeoff: "M365 hat dann keine Rolle, und die Schlussfassung muss wieder zurückgeführt werden."
                }
              ],
              pick: {
                label: "Datei bleibt in Noras OneDrive, Coautorin bekommt einen Link mit Bearbeitungsrecht",
                why: "Unsere Wahl für diesen Kontext: zwei Autorinnen, eine Datei. Ein gemeinsamer Raum lohnt sich erst, wenn eine dritte Person oder Daten dazukommen."
              },
              not_do: [
                "Ein Team gründen, nur weil ein Artikel zwei Autorinnen hat",
                "Fassungen per Mail hin- und herschicken und von Hand zusammenführen."
              ],
              source: "S"
            },
            {
              id: "nk-stay",
              question: "Müssen Notizen und frühe Entwürfe jetzt irgendwo anders hin?",
              modules: [
                "documents",
                "teams"
              ],
              options: [
                {
                  label: "Nichts mehr tun, alles bleibt in OneDrive",
                  fits_when: "Die Arbeit ist persönlich und nur das fertige Ergebnis soll geteilt werden.",
                  tradeoff: "Fällt Nora aus, ist das Material für andere unzugänglich; das ist gewollt."
                },
                {
                  label: "Einen Ordner «Zum Teilen» einrichten, gezielt freigeben",
                  fits_when: "Nora gibt regelmässig einzelne Dateien an dieselben Personen.",
                  tradeoff: "Etwas Disziplin beim Sortieren, dafür klare Freigaben."
                },
                {
                  label: "Ein Team für alle Forschungsprojekte",
                  fits_when: "Eine ganze Arbeitsgruppe will Notizen und Entwürfe offen teilen.",
                  tradeoff: "Das ist eine andere Arbeitsweise als Noras; für sie wäre es ein Zwang."
                }
              ],
              pick: {
                label: "Nichts mehr tun, alles bleibt in OneDrive",
                why: "Unsere Wahl für diesen Kontext: OneDrive ist für Dateien gedacht, an denen man selbst arbeitet. Persönliche Arbeit darf persönlich bleiben, auch wenn eine Kollegin dazukommt."
              },
              not_do: [
                "Alles vorsorglich in ein Team schieben, damit es «sauber» ist",
                "Ein Projektteam für jedes Forschungsthema anlegen."
              ],
              source: "MS"
            }
          ],
          m365_model: null
        },
        {
          id: "abwesenheit-drei-wochen",
          name: "Drei Wochen Abwesenheit",
          trigger: "Nora fällt wegen Krankheit drei Wochen aus; ein Gutachten, zwei Betreuungstermine und die Workshop-Einladung stehen an.",
          description: "Nora arbeitet so, dass alles in ihrem Kopf, ihrem Postfach und ihrem OneDrive liegt. Das hat Jahre funktioniert, bis jemand anderes etwas übernehmen muss.",
          stakes: "Termine verfallen, Studierende warten, und niemand weiss, was dringend ist. Gleichzeitig soll niemand ihr ganzes OneDrive durchsuchen.",
          stages: [
            {
              id: "vor-der-abwesenheit",
              stage: "Absehbar",
              question: "Was muss wer wissen, und was nicht?"
            },
            {
              id: "waehrend",
              stage: "Während der Abwesenheit",
              question: "Wie erreicht die Vertretung das Nötige, ohne alles zu sehen?"
            },
            {
              id: "danach",
              stage: "Rückkehr",
              question: "Was wird zurückgenommen, was bleibt gemeinsam?"
            }
          ],
          current_state: {
            frictions: [
              "Die offenen Aufgaben sind in Noras privater To-Do-Liste.",
              "Die Vertretung kennt nur Noras Mailbetreffs.",
              "Wichtige Dateien liegen verstreut in OneDrive."
            ]
          },
          decision_points: [
            {
              id: "nk-handover",
              question: "Wie übergibt Nora an die Vertretung, ohne ihr ganzes OneDrive zu öffnen?",
              modules: [
                "communication",
                "documents"
              ],
              options: [
                {
                  label: "Eine Übergabe-Notiz plus einzelne Dateien gezielt freigeben",
                  fits_when: "Kurze Abwesenheit, wenige konkrete Aufgaben.",
                  tradeoff: "Nora muss vorher zwei Stunden investieren; krankheitsbedingt geht das nicht immer."
                },
                {
                  label: "Ein Übergabe-Ordner im OneDrive, die Vertretung hat Leserecht",
                  fits_when: "Mehrere Dateien, wiederkehrende Fragen.",
                  tradeoff: "Der Ordner muss nachgeführt werden, sonst ist er schnell falsch."
                },
                {
                  label: "Zugriff der Vertretung auf das ganze OneDrive (Vorgesetzte oder IT-Freigabe)",
                  fits_when: "Lange Abwesenheit oder Ausfall ohne Vorbereitung.",
                  tradeoff: "Datenschutzseitig der grösste Eingriff; sollte die Ausnahme bleiben."
                }
              ],
              pick: {
                label: "Eine Übergabe-Notiz plus einzelne Dateien gezielt freigeben",
                why: "Unsere Wahl für diesen Kontext: drei Wochen, ein paar konkrete Dinge. Wer vertritt, braucht Termine und Kontext, nicht das ganze Archiv."
              },
              not_do: [
                "Zugriff auf das ganze OneDrive als Standard",
                "Übergabe per Weiterleitung von zwanzig Mails."
              ],
              source: "S"
            }
          ],
          m365_model: null
        },
        {
          id: "workshop-wird-zur-reihe",
          name: "«Borders & Mobility» wird zur Reihe",
          trigger: "Das Institut will den Workshop «Borders & Mobility» nächstes Jahr dreimal durchführen.",
          description: "Aus einem jährlichen Workshop mit einer Handvoll Gästen wird eine wiederkehrende Reihe mit externen Referierenden, Budget und einem Sekretariat, das mithilft.",
          stakes: "Aus «Nora macht das nebenbei» wird eine Aufgabe mit mehreren Beteiligten. Nora soll nicht zur Projektleiterin eines Systems werden, das sie nicht wollte.",
          stages: [
            {
              id: "einzelner-workshop",
              stage: "Einzelner Workshop",
              question: "Genügen Ordner und Mails?"
            },
            {
              id: "reihe",
              stage: "Reihe mit mehreren Beteiligten",
              question: "Ab wann braucht es einen gemeinsamen Raum?"
            }
          ],
          current_state: {
            frictions: [
              "Das Programm liegt als Word-Datei bei Nora und als Mailanhang beim Sekretariat.",
              "Anmeldungen und Rückfragen laufen über Noras Postfach.",
              "Aufgaben stehen in Noras To Do, das Sekretariat führt eine eigene Liste."
            ]
          },
          decision_points: [
            {
              id: "nk-series",
              question: "Wo wohnt die Workshopreihe: Ordner, Kanal oder eigenes Team?",
              modules: [
                "teams",
                "loop"
              ],
              options: [
                {
                  label: "Ordner in der Institutsablage plus Outlook-Terminserie",
                  fits_when: "Zwei bis drei Personen tragen Aufgaben, der Stand ändert sich selten.",
                  tradeoff: "Kein Überblick über Aufgaben; bei mehr Beteiligten reicht das nicht."
                },
                {
                  label: "Kanal im Team des Instituts",
                  fits_when: "Das Institut hat bereits ein Team und andere Anlässe laufen dort.",
                  tradeoff: "Nora muss sich in die Struktur des Instituts einfügen."
                },
                {
                  label: "Eigenes Team für die Reihe",
                  fits_when: "Mehr als drei Personen, externe Gäste, ein Budget und mehrere Jahre.",
                  tradeoff: "Ein Container, den jemand verantwortet und eines Tages archiviert."
                }
              ],
              pick: {
                label: "Ordner in der Institutsablage plus Outlook-Terminserie",
                why: "Unsere Wahl für diesen Kontext: drei Termine im Jahr. Wenn mehr als drei Personen aktiv Aufgaben tragen, kippt es in ein Team."
              },
              not_do: [
                "Ein Team mit sechs Kanälen für drei Termine",
                "Den Workshop in Noras OneDrive lassen, wenn das Sekretariat ihn mitbetreut."
              ],
              source: "S"
            },
            {
              id: "nk-todo",
              question: "Bleiben die Workshop-Aufgaben in Noras To Do, oder kommt Planner dazu?",
              modules: [
                "planner"
              ],
              options: [
                {
                  label: "To Do für Noras Aufgaben, Planner erst für Aufgaben, die andere übernehmen",
                  fits_when: "Nora behält die meisten Aufgaben, das Sekretariat übernimmt einzelne.",
                  tradeoff: "Zwei Orte; zugewiesene Planner-Aufgaben erscheinen aber auch in To Do bei den Zuständigen."
                },
                {
                  label: "Alles in Planner mit dem Sekretariat",
                  fits_when: "Beide teilen die Aufgaben regelmässig mit Terminen.",
                  tradeoff: "Nora sieht ihre persönlichen Pendenzen neben den Workshop-Aufgaben gemischt."
                },
                {
                  label: "Alles bleibt in Noras To Do und im Gespräch",
                  fits_when: "Der Workshop bleibt klein, Nora entscheidet fast alles allein.",
                  tradeoff: "Das Sekretariat sieht den Stand nicht und fragt nach."
                }
              ],
              pick: {
                label: "To Do für Noras Aufgaben, Planner erst für Aufgaben, die andere übernehmen",
                why: "Unsere Wahl für diesen Kontext: persönliche To-dos bleiben persönlich, und nur geteilte Verpflichtungen werden sichtbar."
              },
              not_do: [
                "Persönliche Pendenzen in einen gemeinsamen Plan kopieren",
                "Einen Plan anlegen, den nur Nora liest."
              ],
              source: "MS"
            }
          ],
          m365_model: null
        }
      ],
      consulting_questions: [
        "Wann ist OneDrive ausreichend?",
        "Wann lohnt sich ein gemeinsamer Teams-/SharePoint-Arbeitsraum?",
        "Wie unterstützen Planner und To Do eine Person mit wenig kollaborativer Arbeit?",
        "Wie vermeidet man sowohl 'alles persönlich' als auch unnötige Teams-Strukturen?",
        "Wie verändert sich der richtige Speicherort, wenn aus persönlicher Arbeit gemeinsame Arbeit wird?",
        "Was braucht eine Vertretung wirklich, um drei Wochen zu überbrücken?"
      ],
      boundary: "M365 bedeutet nicht, dass jede Arbeit kollaborativ werden muss. Persönliche Arbeit darf persönlich bleiben; gemeinsame Arbeit braucht einen gemeinsamen Kontext.",
      training_hooks: {
        teams: {
          prompt: "Nora steigt punktuell in einen gemeinsamen Arbeitsraum ein, weil das Institut die Workshopreihe organisiert, obwohl ihr Alltag überwiegend individuell ist.",
          decisions: [
            "nk-series"
          ]
        },
        communication: {
          prompt: "Vor der Abwesenheit entscheidet Nora, was sie ihrer Vertretung schreibt und was nicht.",
          decisions: [
            "nk-handover"
          ]
        },
        documents: {
          prompt: "Ein persönlicher Entwurf wird schrittweise zu einem gemeinsamen Arbeitsobjekt, und Nora weiss, was dabei persönlich bleibt.",
          decisions: [
            "nk-coauthor",
            "nk-stay"
          ]
        },
        loop: {
          prompt: "Für die Workshopreihe entsteht ein geteilter, leichter Arbeitsstand ohne ein schweres Projektsystem.",
          decisions: [
            "nk-series"
          ]
        },
        planner: {
          prompt: "Persönliche Aufgaben bleiben in To Do; nur Verpflichtungen mit gemeinsamem Status gehören in Planner.",
          decisions: [
            "nk-todo"
          ]
        },
        balance: {
          prompt: "Nora braucht wenige, gezielte Signale statt permanente Kollaborationsbenachrichtigungen, besonders während ihrer Abwesenheit.",
          decisions: [
            "nk-handover",
            "nk-todo"
          ]
        }
      }
    },
    {
      id: "commission-digital-collaboration",
      type: "university-commission",
      name: "Kommission Digitale Zusammenarbeit",
      tagline: "Periodisches Gremium, in dem Einfachheit wichtiger ist als maximale Werkzeugnutzung.",
      tension: "Sechs Sitzungen im Jahr, acht Pendenzen, und jedes Mal ein neuer Mailverteiler mit einer anderen Fassung.",
      unit_type: "Ständige Kommission (Milizgremium)",
      rhythm: "Sechs Sitzungen pro Jahr; Unterlagen eine Woche vorher; dazwischen kaum Austausch.",
      lifecycle: "Die Kommission ist dauerhaft, die Amtsperiode dauert vier Jahre, die Mitglieder wechseln gestaffelt.",
      size: 7,
      people: [
        {
          id: "martina-vogel",
          name: "Prof. Dr. Martina Vogel",
          role: "Vorsitz",
          focus: "Sitzungsleitung und Vertretung der Kommission gegenüber der Universitätsleitung",
          stays_personal: [
            "Notizen zu Gesprächen mit der Universitätsleitung"
          ],
          shares: [
            "Agenda-Vorschlag"
          ]
        },
        {
          id: "samuel-huber",
          name: "Dr. Samuel Huber",
          role: "Fakultätsvertretung",
          focus: "Anliegen und Rückmeldungen der Fakultäten",
          stays_personal: [
            "Stimmungsbilder aus der Fakultät, bevor sie offiziell sind"
          ],
          shares: [
            "Stellungnahmen der Fakultät"
          ]
        },
        {
          id: "anna-bachmann",
          name: "Anna Bachmann",
          role: "Administration",
          focus: "Kosten, Verwaltungsprozesse und Umsetzbarkeit",
          stays_personal: [
            "Kostenüberlegungen, bevor sie geprüft sind"
          ],
          shares: [
            "Kostenschätzungen für Beschlüsse"
          ]
        },
        {
          id: "karim-haddad",
          name: "Dr. Karim Haddad",
          role: "Forschung",
          focus: "Perspektive der Forschenden, Datenfragen",
          stays_personal: [
            "Entwürfe für Stellungnahmen"
          ],
          shares: [
            "Forschungsperspektive als Papier zur Sitzung"
          ]
        },
        {
          id: "sarah-baumgartner",
          name: "Sarah Baumgartner",
          role: "IT Services",
          focus: "Technische Einschätzung und Umsetzung; wird nächstes Jahr abgelöst",
          stays_personal: [
            "technische Einschätzungen vor der Abstimmung mit der IT-Leitung"
          ],
          shares: [
            "Stellungnahmen von IT Services"
          ]
        },
        {
          id: "claudia-gisler",
          name: "Claudia Gisler",
          role: "Sekretariat",
          focus: "Einladungen, Unterlagen, Protokoll und Ablage; hält die Kommission zusammen",
          stays_personal: [
            "Sitzungsvorbereitung und ihre Protokollentwürfe"
          ],
          shares: [
            "Agenda, Unterlagen, Protokolle, Entscheidsammlung, Mitgliederliste"
          ]
        },
        {
          id: "beat-kunz",
          name: "Dr. Beat Kunz",
          role: "Externes Mitglied (Partnerhochschule)",
          focus: "Aussenperspektive; hat kein Konto an der Universität",
          stays_personal: [
            "eigene Notizen zu den Sitzungen"
          ],
          shares: [
            "seine Stellungnahmen als Papier"
          ]
        }
      ],
      collaboration: {
        close_internal: [],
        occasional_internal: [
          "Universitätsleitung (Beschlüsse gehen dorthin)",
          "Fakultäten und IT Services (Stellungnahmen)"
        ],
        external: [
          "Dr. Beat Kunz, externes Mitglied einer Partnerhochschule"
        ]
      },
      work_mix: {
        individual_percent: 85,
        examples: [
          "Papiere lesen",
          "Stellungnahmen schreiben",
          "Sitzung (sechsmal pro Jahr)",
          "Protokoll lesen und freigeben",
          "wenige Pendenzen nachhalten"
        ]
      },
      personal_vs_shared: {
        stays_personal: [
          "eigene Notizen zu den Sitzungen",
          "Entwürfe von Stellungnahmen",
          "informelle Absprachen vor der Sitzung"
        ],
        shared: [
          "Agenda",
          "Sitzungsunterlagen",
          "Protokolle",
          "Entscheide",
          "Pendenzenliste",
          "Mitgliederliste"
        ],
        moves_to_shared: [
          {
            when: "Ein Papier geht in die Sitzungsunterlagen.",
            why: "Alle lesen dieselbe Fassung, und das Sekretariat kann sie einfrieren."
          },
          {
            when: "Ein Beschluss wird gefasst.",
            why: "Der Entscheid muss in drei Jahren noch auffindbar sein, auch wenn niemand von heute mehr dabei ist."
          },
          {
            when: "Ein Mitglied wechselt.",
            why: "Das neue Mitglied braucht Zugang zu den Dingen, die den Entscheid begründen, nicht zu Chats."
          }
        ]
      },
      artefacts: [
        {
          id: "agenda",
          name: "Agenda",
          owner: "claudia-gisler",
          state: "shared",
          lifespan: "pro Sitzung",
          sensitivity: "intern",
          where_now: "Word-Datei per Mail, jede Woche eine neue Version «v2_nach_Rückmeldung_Vogel».",
          where_better: "Eine Datei in der Bibliothek, vom Sekretariat gepflegt; Mail mit Link."
        },
        {
          id: "sitzungsunterlagen",
          name: "Sitzungsunterlagen",
          owner: "claudia-gisler",
          state: "shared",
          lifespan: "pro Sitzung, danach Archiv",
          sensitivity: "teils vertraulich",
          where_now: "Als Mailanhang an sieben Personen, drei davon antworten mit «Habe ich nicht erhalten».",
          where_better: "Ein Ordner pro Sitzung in der Bibliothek; Mail nur als Hinweis. Beschlossene Fassungen werden eingefroren."
        },
        {
          id: "protokolle",
          name: "Protokolle",
          owner: "claudia-gisler",
          state: "institutional",
          lifespan: "dauerhaft, Archivwert",
          sensitivity: "vertraulich",
          where_now: "Beim Sekretariat im Netzlaufwerk; Mitglieder bekommen eine PDF-Kopie per Mail.",
          where_better: "In der Bibliothek, Ordner nach Jahr; Vorgängerversionen bleiben versioniert, die verabschiedete Fassung als PDF."
        },
        {
          id: "entscheide",
          name: "Entscheide",
          owner: "claudia-gisler",
          state: "institutional",
          lifespan: "dauerhaft",
          sensitivity: "vertraulich",
          where_now: "Nur innerhalb der Protokolle zu finden; wer einen Entscheid sucht, blättert in Protokollen.",
          where_better: "Eine Übersichtstabelle der Entscheide mit Datum, Beschluss und Link zum Protokoll."
        },
        {
          id: "pendenzen",
          name: "Pendenzen",
          owner: "claudia-gisler",
          state: "shared",
          lifespan: "bis zur nächsten Sitzung",
          sensitivity: "intern",
          where_now: "Eine Liste am Schluss des Protokolls, die niemand zwischen den Sitzungen liest.",
          where_better: "Bleibt eine Tabelle am Ende des Protokolls; vor jeder Sitzung geht Claudia sie mit den Verantwortlichen durch."
        },
        {
          id: "mitgliederliste",
          name: "Mitgliederliste und Zugänge",
          owner: "claudia-gisler",
          state: "shared",
          lifespan: "Amtsperiode",
          sensitivity: "personenbezogen",
          where_now: "Ein Mailverteiler, den Claudia von Hand pflegt; nach einem Wechsel bekommt die alte Person noch Monate Unterlagen.",
          where_better: "Die Mitglieder des Teams entsprechen der Mitgliederliste; ein Wechsel wird an einem Ort nachgeführt."
        },
        {
          id: "zugang-externes-mitglied",
          name: "Zugang für das externe Mitglied",
          owner: "claudia-gisler",
          state: "shared",
          lifespan: "Amtsperiode",
          sensitivity: "externe Person, vertrauliche Unterlagen",
          where_now: "Claudia schickt die Unterlagen per Mail; Beat leitet sie manchmal an Kolleginnen weiter.",
          where_better: "Gastzugang zum Team oder Link pro Sitzung; entschieden wird in cm-external."
        }
      ],
      scenarios: [
        {
          id: "sitzungszyklus",
          name: "Sitzungszyklus",
          trigger: "Die Einladung zur nächsten Sitzung geht raus, und drei Mitglieder antworten mit «Habe ich nicht erhalten» oder mit einer neueren Version.",
          description: "Unterlagen vorbereiten, diskutieren, Entscheide dokumentieren und wenige Pendenzen nachhalten.",
          stakes: "Beschlüsse mit Wirkung auf die ganze Universität, auf einer Basis, die nicht jedes Mitglied gleich kennt. Die Kommission verliert Zeit mit Fassungen statt mit Inhalten.",
          stages: [
            {
              id: "vorbereiten",
              stage: "Vorbereitung",
              question: "Wer legt was bis wann ab?"
            },
            {
              id: "sitzung",
              stage: "Sitzung",
              question: "Welche Fassung gilt am Tisch?"
            },
            {
              id: "nachbereitung",
              stage: "Nachbereitung",
              question: "Wo steht, was beschlossen wurde?"
            }
          ],
          current_state: {
            frictions: [
              "Unterlagen gehen als Mailanhang an sieben Personen, jede:r hat eine andere Fassung.",
              "Protokolle liegen beim Sekretariat, Entscheide stehen nur in Protokollen.",
              "Pendenzen stehen am Ende des Protokolls und werden erst an der nächsten Sitzung gelesen.",
              "Der Mailverteiler stimmt nicht mit der Mitgliederliste überein."
            ]
          },
          decision_points: [
            {
              id: "cm-team",
              question: "Braucht die Kommission überhaupt ein Team?",
              modules: [
                "teams"
              ],
              options: [
                {
                  label: "Kein Team: Bibliothek auf einer SharePoint-Site und Outlook-Einladungen",
                  fits_when: "Die Mitglieder lesen vor allem und schreiben zwischen den Sitzungen nicht.",
                  tradeoff: "Sehr schlank; wer ohne Team mitlesen soll, braucht trotzdem einzelne Rechte."
                },
                {
                  label: "Ein Team mit einem Kanal «Allgemein»",
                  fits_when: "Zwischen den Sitzungen gibt es Nachfragen, und die Mitgliedschaft im Team ist der einfachste Weg zur Zugriffsverwaltung.",
                  tradeoff: "Mitglieder müssen Teams kennen; man muss sich dagegen wehren, mehr einzurichten."
                },
                {
                  label: "Volles Team mit mehreren Kanälen und Planner",
                  fits_when: "Die Kommission arbeitet auch operativ in Arbeitsgruppen mit eigenen Aufgaben.",
                  tradeoff: "Viel Struktur für wenig Verkehr; die Gefahr leerer Räume ist hoch."
                }
              ],
              pick: {
                label: "Ein Team mit einem Kanal «Allgemein»",
                why: "Unsere Wahl für diesen Kontext: Mitgliedschaft im Team ersetzt den Mailverteiler, und die Bibliothek liegt gleich dabei. Ohne Team wäre es ebenfalls vertretbar."
              },
              not_do: [
                "Ein Planner-Board für acht Pendenzen im Jahr",
                "Viele Kanäle (Agenda, Protokolle, Pendenzen, Allgemein), von denen nach zwei Sitzungen drei leer bleiben."
              ],
              source: "S"
            },
            {
              id: "cm-documents",
              question: "Wie kommen die Unterlagen zu den Mitgliedern: als Mailanhang oder als Link?",
              modules: [
                "documents",
                "communication"
              ],
              options: [
                {
                  label: "Mailanhang als PDF",
                  fits_when: "Alle lesen nur, niemand kommentiert, und die Mitglieder wollen nichts öffnen.",
                  tradeoff: "Jede Aktualisierung ist eine neue Mail; Rückmeldungen laufen in Einzelmails."
                },
                {
                  label: "Link auf die Bibliothek, beschlossene Fassung als PDF ins Archiv",
                  fits_when: "Papiere werden bis zur Sitzung noch kommentiert, und das Sekretariat friert am Schluss ein.",
                  tradeoff: "Eine Gewöhnung für Mitglieder; ein Link muss tatsächlich berechtigen."
                },
                {
                  label: "Link auf die Bibliothek plus PDF-Kopie per Mail",
                  fits_when: "Einige Mitglieder wollen unbedingt ein Papier im Posteingang.",
                  tradeoff: "Zwei Fassungen können abweichen; die Mail ist nur ein Hinweis."
                }
              ],
              pick: {
                label: "Link auf die Bibliothek, beschlossene Fassung als PDF ins Archiv",
                why: "Unsere Wahl für diesen Kontext: eine Quelle, kein «Habe ich nicht erhalten», und das Protokoll verweist auf eine unveränderliche Fassung."
              },
              not_do: [
                "Entwürfe mit Kommentaren per Mail jagen und selber zusammenführen",
                "Beschlossene Fassungen nur als bearbeitbares Dokument liegen lassen."
              ],
              source: "P"
            },
            {
              id: "cm-pendenzen",
              question: "Wohin mit den acht Pendenzen pro Jahr?",
              modules: [
                "planner",
                "loop"
              ],
              options: [
                {
                  label: "Tabelle am Ende des Protokolls, Claudia fragt vor der Sitzung nach",
                  fits_when: "Wenige Pendenzen, einmal im Quartal angeschaut.",
                  tradeoff: "Zwischen den Sitzungen sieht niemand den Stand."
                },
                {
                  label: "Eine einfache gemeinsame Liste im Kanal",
                  fits_when: "Pendenzen sollen zwischen den Sitzungen sichtbar sein.",
                  tradeoff: "Jemand muss sie pflegen; sonst veraltet sie."
                },
                {
                  label: "Planner-Plan mit Zuweisung",
                  fits_when: "Es gibt zwanzig oder mehr Pendenzen mit klaren Verantwortlichen und Terminen.",
                  tradeoff: "Aufwand und Lernkurve für sieben Personen, die den Plan zweimal im Jahr öffnen."
                }
              ],
              pick: {
                label: "Tabelle am Ende des Protokolls, Claudia fragt vor der Sitzung nach",
                why: "Unsere Wahl für diesen Kontext: weniger Aufwand als jedes System, und Claudia hält das ohnehin zusammen."
              },
              not_do: [
                "Ein Planner-Board für acht Pendenzen im Jahr",
                "Jede Pendenz als eigener Kanalbeitrag mit Erinnerungen an alle."
              ],
              source: "S"
            },
            {
              id: "cm-external",
              question: "Wie bekommt das externe Mitglied Zugang?",
              modules: [
                "teams",
                "documents"
              ],
              options: [
                {
                  label: "Gastzugang zum Team",
                  fits_when: "Beat bleibt vier Jahre dabei und liest alles.",
                  tradeoff: "Er sieht alle Unterlagen im Team; Gastkonto muss nach der Amtsperiode entfernt werden."
                },
                {
                  label: "Link pro Sitzung auf den Unterlagenordner",
                  fits_when: "Beat soll nur ausgewählte Sitzungen lesen, und die Universität will keine Konten für Externe.",
                  tradeoff: "Claudia muss jedes Mal den Link erneuern oder prüfen."
                },
                {
                  label: "Unterlagen weiterhin per Mail vom Sekretariat",
                  fits_when: "Beat will keine neue Plattform und ist selten dabei.",
                  tradeoff: "Er hat Fassungen im Postfach, die niemand kontrolliert."
                }
              ],
              pick: {
                label: "Gastzugang zum Team",
                why: "Unsere Wahl für diesen Kontext: vierjährige Mitgliedschaft, volle Beteiligung; die Mitgliedschaft im Team ist ohnehin die Zugriffsverwaltung."
              },
              not_do: [
                "Beat die Unterlagen als Mailanhang schicken und zusätzlich einen Link pro Sitzung",
                "Ein separates Team für Externe bauen."
              ],
              source: "S"
            },
            {
              id: "cm-turnover",
              question: "Wie kommt ein neues Mitglied an die Unterlagen der letzten Jahre?",
              modules: [
                "teams"
              ],
              options: [
                {
                  label: "Zum Team hinzufügen, Archiv nach Jahr in der Bibliothek",
                  fits_when: "Wechsel kommen vor, und neue Mitglieder sollen sich selbst einlesen.",
                  tradeoff: "Alle Altprotokolle sind sichtbar; nicht jede Sitzung ist für alle bestimmt."
                },
                {
                  label: "Nur die laufende Periode sichtbar, Archiv auf Anfrage beim Sekretariat",
                  fits_when: "Ältere Protokolle enthalten Personalfragen.",
                  tradeoff: "Mehr Arbeit für Claudia."
                },
                {
                  label: "Übergabegespräch zwischen Vorgänger:in und Nachfolger:in",
                  fits_when: "Das Wissen steckt in der Person, nicht in den Papieren.",
                  tradeoff: "Hängt an der Vorgängerin; verschwindet mit ihr."
                }
              ],
              pick: {
                label: "Zum Team hinzufügen, Archiv nach Jahr in der Bibliothek",
                why: "Unsere Wahl für diesen Kontext: wer neu eintritt, bekommt Entscheide und Protokolle ohne Umweg; Claudia entfernt Ausscheidende gleichzeitig."
              },
              not_do: [
                "Altmitglieder im Team lassen, «sie lesen ja nichts mehr»",
                "Dem neuen Mitglied einen Ordner mit fünfzig PDF-Dateien per Mail schicken."
              ],
              source: "S"
            }
          ],
          m365_model: {
            team: "Kommission Digitale Zusammenarbeit",
            channels: [
              "Allgemein"
            ],
            planner_buckets: [],
            notes: "Bewusst einfache Struktur. Ein zusätzlicher Planner oder viele Kanäle sind nicht automatisch sinnvoll."
          }
        }
      ],
      consulting_questions: [
        "Wie wenig Struktur reicht für eine Kommission aus?",
        "Braucht dieses Gremium überhaupt Planner?",
        "Wie bleiben Entscheide und Unterlagen dauerhaft auffindbar?",
        "Wie verhindern wir Overengineering durch zu viele Kanäle, Labels und Apps?",
        "Was passiert mit dem Zugang, wenn ein Mitglied die Kommission verlässt?",
        "Wer pflegt den Ort wirklich, wenn nicht das Sekretariat?"
      ],
      boundary: "Nicht jedes Team braucht die maximale M365-Nutzung. Ein Gremium mit sechs Sitzungen im Jahr braucht einen verlässlichen Ort für Unterlagen und Entscheide, mehr nicht.",
      training_hooks: {
        teams: {
          prompt: "Sarah Baumgartner wird abgelöst, und die Nachfolge muss einsteigen, ohne dass Claudia alles per Mail nachschickt.",
          decisions: [
            "cm-team",
            "cm-turnover"
          ]
        },
        communication: {
          prompt: "Zwischen den Sitzungen schreibt ein Mitglied eine Frage in den Chat; die Antwort sollte in den Unterlagen enden, nicht im Chatverlauf.",
          decisions: [
            "cm-documents"
          ]
        },
        documents: {
          prompt: "Unterlagen durchlaufen Vorbereitung, Kommentierung, Beratung und verabschiedeten Stand, und Beat Kunz liest mit, ohne Konto.",
          decisions: [
            "cm-documents",
            "cm-external"
          ]
        },
        loop: {
          prompt: "Leichte gemeinsame Notizen zu offenen Punkten genügen, solange die Kommission keine laufende operative Arbeit hat.",
          decisions: [
            "cm-pendenzen"
          ]
        },
        planner: {
          prompt: "Acht Pendenzen im Jahr: Tabelle im Protokoll, Liste oder Plan?",
          decisions: [
            "cm-pendenzen"
          ]
        },
        balance: {
          prompt: "Mitglieder brauchen nur Signale rund um Sitzungen und relevante Entscheide, nicht jede Dateiänderung.",
          decisions: [
            "cm-team",
            "cm-documents"
          ]
        }
      }
    },
    {
      id: "teaching-team",
      type: "teaching-team",
      name: "Lehrteam Seminar «Stadt, Raum, Gesellschaft»",
      tagline: "Ein Seminar, zwei Dozierende, eine Hilfsassistenz, und jedes Jahr dieselben Fragen von vorn.",
      tension: "Jedes Semester beginnt das Seminar bei null, weil das letzte im Postfach der Vorgängerin liegt.",
      unit_type: "Lehrteam für ein Modul (interdisziplinäres Bachelor-Seminar)",
      rhythm: "Herbstsemester mit vierzehn Wochen Lehre; Vorbereitung ab Sommer, Bewertung danach.",
      lifecycle: "Wiederkehrend: das Modul wird jedes Jahr neu aufgesetzt, und die Besetzung wechselt.",
      size: 3,
      people: [
        {
          id: "ruth-ammann",
          name: "Prof. Dr. Ruth Ammann",
          role: "Modulverantwortliche",
          focus: "Konzept, Prüfung, Absprache mit dem Studiendekanat",
          stays_personal: [
            "Prüfungsentwürfe, bis sie freigegeben sind"
          ],
          shares: [
            "Semesterplan und Lernziele",
            "Bewertungsraster"
          ]
        },
        {
          id: "simon-luethi",
          name: "Dr. Simon Lüthi",
          role: "Dozent (Lehrauftrag, verlässt das Modul nach diesem Semester)",
          focus: "Hälfte der Sitzungen, Betreuung der Arbeiten",
          stays_personal: [
            "Sitzungsideen und Folien in Arbeit"
          ],
          shares: [
            "Lesematerial",
            "Aufgabenstellungen"
          ]
        },
        {
          id: "fabian-steiner",
          name: "Fabian Steiner",
          role: "Hilfsassistent (Master-Student)",
          focus: "Organisation, Rückfragen der Studierenden, Korrekturunterstützung",
          stays_personal: [
            "eigene Notizen zu Rückfragen"
          ],
          shares: [
            "Rückfragen-Übersicht für die Dozierenden"
          ]
        }
      ],
      collaboration: {
        close_internal: [],
        occasional_internal: [
          "Studiendekanat / Studiensekretariat",
          "Nachfolgende Dozierende im nächsten Jahr"
        ],
        external: [
          "Studierende (ca. 40), nur über die Lernplattform der Universität",
          "Gastreferierende (punktuell)"
        ]
      },
      work_mix: {
        individual_percent: 60,
        examples: [
          "Sitzungen vorbereiten",
          "Material lesen und aufbereiten",
          "Korrigieren",
          "kurze Abstimmung zu dritt",
          "Fragen der Studierenden beantworten"
        ]
      },
      personal_vs_shared: {
        stays_personal: [
          "Sitzungsideen und Folienentwürfe",
          "Prüfungsentwürfe bis zur Freigabe",
          "eigene Korrekturnotizen"
        ],
        shared: [
          "Semesterplan",
          "Lesematerial",
          "Aufgabenstellungen",
          "Bewertungsraster",
          "Übergabedossier fürs nächste Jahr"
        ],
        moves_to_shared: [
          {
            when: "Eine Sitzung ist freigegeben und wird von jemand anderem gehalten oder ergänzt.",
            why: "Dann gibt es genau eine Fassung, die Studierende bekommen."
          },
          {
            when: "Das Semester endet.",
            why: "Was nächstes Jahr gebraucht wird, darf nicht bei einer Person im Postfach bleiben."
          }
        ]
      },
      artefacts: [
        {
          id: "syllabus",
          name: "Syllabus und Lernziele",
          owner: "ruth-ammann",
          state: "institutional",
          lifespan: "pro Jahr, Vorlage mehrjährig",
          sensitivity: "öffentlich für Studierende",
          where_now: "Word-Datei im Postfach von Ruth, Studiendekanat hat eine ältere Version.",
          where_better: "Die gültige Fassung liegt auf der Lernplattform der Universität; die Arbeitsfassung im Teamordner."
        },
        {
          id: "semesterplan",
          name: "Semesterplan",
          owner: "ruth-ammann",
          state: "shared",
          lifespan: "ein Semester",
          sensitivity: "intern, Auszug für Studierende",
          where_now: "Excel per Mail, Simon führt eine eigene Fassung.",
          where_better: "Eine Tabelle im Teamordner, die für Studierende auf der Lernplattform als Auszug erscheint."
        },
        {
          id: "lesematerial",
          name: "Lesematerial",
          owner: "simon-luethi",
          state: "shared",
          lifespan: "ein Semester, danach wiederverwendet",
          sensitivity: "urheberrechtlich geschützt",
          where_now: "Hochgeladen auf der Lernplattform und lokal bei Simon; zwei Fassungen.",
          where_better: "Quelle im Teamordner, Auslieferung über die Lernplattform."
        },
        {
          id: "aufgabenstellungen",
          name: "Aufgabenstellungen",
          owner: "simon-luethi",
          state: "shared",
          lifespan: "ein Semester",
          sensitivity: "vor Freigabe vertraulich",
          where_now: "Word-Dateien, die per Mail hin- und hergehen.",
          where_better: "Im Teamordner, Freigabe auf die Lernplattform nach Absprache."
        },
        {
          id: "bewertungsraster",
          name: "Bewertungsraster",
          owner: "ruth-ammann",
          state: "shared",
          lifespan: "mehrjährig",
          sensitivity: "intern, nur Dozierende",
          where_now: "In einer Datei, die Ruth Fabian für die Korrektur freigibt.",
          where_better: "Im Teamordner; sichtbar für Dozierende, Fabian nur lesend."
        },
        {
          id: "noten",
          name: "Noten und Einzelbewertungen",
          owner: "ruth-ammann",
          state: "institutional",
          lifespan: "gemäss Aufbewahrungsfrist",
          sensitivity: "hoch, personenbezogen",
          where_now: "Excel-Listen auf Laptops, parallel zum offiziellen System.",
          where_better: "Ausschliesslich im offiziellen Bewertungssystem bzw. der Lernplattform; keine Kopie im Team."
        },
        {
          id: "rueckfragen-studierende",
          name: "Rückfragen der Studierenden",
          owner: "fabian-steiner",
          state: "shared",
          lifespan: "ein Semester",
          sensitivity: "personenbezogen",
          where_now: "Mails an Fabian, an Simon und an Ruth; manche Fragen beantworten alle drei.",
          where_better: "Die Fragen laufen über das Forum der Lernplattform; das Team sieht nur die Zusammenfassung."
        },
        {
          id: "uebergabedossier",
          name: "Übergabedossier fürs nächste Jahr",
          owner: "ruth-ammann",
          state: "shared",
          lifespan: "mehrjährig",
          sensitivity: "intern",
          where_now: "Wäre ein Ordner im Postfach der Vorgängerin; die letzte Version stammt aus dem Jahr davor.",
          where_better: "Ein Ordner im Team mit einer Seite «Was ich nächstes Mal anders machen würde» und den freigegebenen Unterlagen."
        },
        {
          id: "studierendenfeedback",
          name: "Feedback der Studierenden",
          owner: "ruth-ammann",
          state: "institutional",
          lifespan: "bis zum Modulbericht",
          sensitivity: "anonymisiert, Freitexte",
          where_now: "Als PDF per Mail vom Studiendekanat.",
          where_better: "Beim Studiendekanat, im Team nur die Zusammenfassung für die Weiterentwicklung."
        }
      ],
      scenarios: [
        {
          id: "semesterstart-und-uebergabe",
          name: "Semesterstart und Übergabe",
          trigger: "Simon Lüthi hört nach diesem Semester auf, und die neue Dozentin fragt im Mai: «Wo ist das ganze Material?»",
          description: "Ein Seminar mit rund vierzig Studierenden, zwei Dozierenden und einer Hilfsassistenz. Das Team arbeitet zu dritt, die Studierenden sind nur über die Lernplattform erreichbar.",
          stakes: "Das Wissen eines Jahres steckt in drei Postfächern. Geht eine Person, geht ein Drittel davon mit. Gleichzeitig dürfen Noten und Studierendenkommunikation nicht in einem Chat landen.",
          stages: [
            {
              id: "vorbereitung",
              stage: "Vorbereitung (Sommer)",
              question: "Wo liegt die gemeinsame Arbeitsfassung?"
            },
            {
              id: "lehre",
              stage: "Lehre (Herbstsemester)",
              question: "Was geht an die Studierenden, und worüber?"
            },
            {
              id: "uebergabe",
              stage: "Übergabe (Semesterende)",
              question: "Was bekommt die Nachfolge und in welcher Form?"
            }
          ],
          current_state: {
            frictions: [
              "Material und Semesterplan existieren in mehreren Fassungen in drei Postfächern.",
              "Die Vorgängerin hat «alles in einem Ordner» abgelegt, den niemand findet.",
              "Fabian bekommt Bewertungsraster per Mail, unklar welche Version.",
              "Studierende schreiben dort, wo sie jemanden erreichen: Mail, manchmal Chat."
            ]
          },
          decision_points: [
            {
              id: "tt-where",
              question: "Braucht ein Seminar ein eigenes Team?",
              modules: [
                "teams"
              ],
              options: [
                {
                  label: "Ein Team pro Modul, jedes Jahr weiterverwendet (Mitglieder wechseln)",
                  fits_when: "Das Modul läuft mehrere Jahre, und die Übergabe ist das eigentliche Problem.",
                  tradeoff: "Ein Team zu dritt wirkt gross; dafür bleibt das Wissen am Modul statt an Personen."
                },
                {
                  label: "Ein neues Team pro Semester",
                  fits_when: "Jedes Jahr ändert sich das Modul grundlegend.",
                  tradeoff: "Das Wissen wandert nicht automatisch weiter, und es entstehen Leichen."
                },
                {
                  label: "Kein Team: ein Ordner in der Institutsablage und OneDrive für Entwürfe",
                  fits_when: "Das Institut hat bereits eine gepflegte Ablage, und die Dozierenden arbeiten kaum gleichzeitig.",
                  tradeoff: "Kein Chat und keine Mitgliederverwaltung, die Übergabe hängt am Ordner."
                }
              ],
              pick: {
                label: "Ein Team pro Modul, jedes Jahr weiterverwendet (Mitglieder wechseln)",
                why: "Unsere Wahl für diesen Kontext: Das Problem ist die Übergabe, und die löst ein Ort am Modul. Ohne gepflegte Instituts-Ablage ist ein Ordner trotzdem eine gute Alternative."
              },
              not_do: [
                "Pro Semester ein neues Team gründen und das alte vergessen",
                "Das Team zum Ort für Studierende machen."
              ],
              source: "S"
            },
            {
              id: "tt-lms",
              question: "Wo spielt sich die Arbeit mit den Studierenden ab?",
              modules: [
                "teams",
                "communication"
              ],
              options: [
                {
                  label: "Die Lernplattform der Universität bleibt der Ort für Studierende; das Team ist nur der Arbeitsraum der Dozierenden",
                  fits_when: "Es gibt eine offizielle Lernplattform, und Noten, Abgaben und Rückfragen laufen dort.",
                  tradeoff: "Zwei Orte für Dozierende; dafür keine Doppelstrukturen für Studierende."
                },
                {
                  label: "Studierende als Mitglieder in einem Teams-Kursteam",
                  fits_when: "Das Seminar ist klein und es gibt keine Lernplattform, die das leistet.",
                  tradeoff: "Noten, Abgaben und Datenschutz werden zur eigenen Aufgabe der Dozierenden."
                },
                {
                  label: "Teams nur punktuell für Sprechstunden und Gruppenarbeit (Besprechungslink)",
                  fits_when: "Einzelne Termine online, sonst alles über die Lernplattform.",
                  tradeoff: "Wenig Struktur, aber ein weiterer Link, den Studierende finden müssen."
                }
              ],
              pick: {
                label: "Die Lernplattform der Universität bleibt der Ort für Studierende; das Team ist nur der Arbeitsraum der Dozierenden",
                why: "Unsere Wahl für diesen Kontext: Teams ersetzt die Lernplattform nicht. Die Dozierenden vermeiden, dass Studierende zwischen zwei Systemen suchen."
              },
              not_do: [
                "Studierende in Teams holen, weil «die Plattform umständlich ist»",
                "Auf Rückfragen im Teams-Chat mit der Hilfsassistenz antworten, am Abend und am Wochenende."
              ],
              source: "S"
            },
            {
              id: "tt-ta-access",
              question: "Was darf Fabian sehen, und was bleibt bei den Dozierenden?",
              modules: [
                "teams",
                "documents"
              ],
              options: [
                {
                  label: "Fabian ist Mitglied; Bewertungsraster im Teamordner (lesend), Noten nur im Bewertungssystem",
                  fits_when: "Fabian korrigiert mit und braucht Raster und Aufgaben.",
                  tradeoff: "Er sieht auch Entwürfe der Dozierenden im Team."
                },
                {
                  label: "Privater Kanal «Bewertung» für Ruth und Simon",
                  fits_when: "Es liegen weitere vertrauliche Dateien im Team, etwa Prüfungsentwürfe.",
                  tradeoff: "Ein Kanal mehr mit eigener Ablage und eigenen Mitgliedern."
                },
                {
                  label: "Fabian nur per Link auf einzelne Dateien, nicht im Team",
                  fits_when: "Er hilft kurz und wechselt nach dem Semester.",
                  tradeoff: "Mehr Handarbeit bei der Freigabe."
                }
              ],
              pick: {
                label: "Fabian ist Mitglied; Bewertungsraster im Teamordner (lesend), Noten nur im Bewertungssystem",
                why: "Unsere Wahl für diesen Kontext: Noten liegen sowieso im offiziellen System, das Team enthält nur Arbeitsmaterial. Ein privater Kanal lohnt, wenn mehr Vertrauliches dazukommt."
              },
              not_do: [
                "Noten und Einzelbewertungen im Teamordner ablegen",
                "Fabian als Gast ins Team holen und ihm alles öffnen, «weil es einfacher ist»."
              ],
              source: "S"
            },
            {
              id: "tt-handover",
              question: "Wie übergibt Simon an die Nachfolge, ohne dass das Wissen mit ihm geht?",
              modules: [
                "documents"
              ],
              options: [
                {
                  label: "Übergabedossier im Team: freigegebene Unterlagen plus eine Seite «Was ich nächstes Mal anders machen würde»",
                  fits_when: "Das Modul wird weitergeführt und die Nachfolge ist bekannt.",
                  tradeoff: "Zwei Stunden Arbeit für Simon, bevor er geht."
                },
                {
                  label: "Kopie des ganzen Teamordners für die Nachfolge",
                  fits_when: "Die Nachfolge baut weitgehend neu und will nur Material.",
                  tradeoff: "Man übernimmt auch Altlasten, und niemand weiss, was wichtig war."
                },
                {
                  label: "Persönliches Gespräch und weiterleiten, was man findet",
                  fits_when: "Es gibt Zeit und gute Beziehungen, und die Übergabe ist klein.",
                  tradeoff: "Hängt am Gedächtnis und an Simons Zeit."
                }
              ],
              pick: {
                label: "Übergabedossier im Team: freigegebene Unterlagen plus eine Seite «Was ich nächstes Mal anders machen würde»",
                why: "Unsere Wahl für diesen Kontext: kurz, wiederholbar und nicht abhängig von Zeit und Gedächtnis."
              },
              not_do: [
                "Alles im Postfach lassen und «bei Fragen bin ich erreichbar»",
                "Den ganzen Teamordner kommentarlos weitergeben."
              ],
              source: "S"
            },
            {
              id: "tt-plan",
              question: "Wie steht der Semesterplan, und braucht er eine Aufgabenverwaltung?",
              modules: [
                "planner",
                "loop"
              ],
              options: [
                {
                  label: "Eine Tabelle im Teamordner, für Studierende als Auszug auf der Lernplattform",
                  fits_when: "Die Termine sind wenige, die Verantwortung klar.",
                  tradeoff: "Keine Zuweisung, keine Erinnerung."
                },
                {
                  label: "Planner-Plan mit Aufgaben und Terminen",
                  fits_when: "Viele Aufgaben pro Woche und wechselnde Zuständigkeiten.",
                  tradeoff: "Für drei Personen oft Aufwand ohne Gewinn."
                },
                {
                  label: "Persönliche To-Do-Listen plus Besprechung vor der Sitzung",
                  fits_when: "Die Dozierenden stimmen sich ohnehin wöchentlich ab.",
                  tradeoff: "Gemeinsame Verpflichtungen sind nicht für alle sichtbar."
                }
              ],
              pick: {
                label: "Eine Tabelle im Teamordner, für Studierende als Auszug auf der Lernplattform",
                why: "Unsere Wahl für diesen Kontext: drei Personen, ein Semester, klare Daten. Aufgabenverwaltung wäre Overhead."
              },
              not_do: [
                "Einen Planner-Plan für ein Seminar zu dritt aufbauen",
                "Aufgaben per Chat verteilen, ohne sie irgendwo abzulegen."
              ],
              source: "S"
            }
          ],
          m365_model: {
            team: "Lehrteam Seminar «Stadt, Raum, Gesellschaft»",
            channels: [
              "Allgemein",
              "Semester",
              "Bewertung"
            ],
            planner_buckets: [],
            notes: "Bewusst klein. Der Kanal «Bewertung» ist nur nötig, wenn tatsächlich vertrauliche Dateien dazukommen. Die Studierenden sind nicht im Team."
          }
        }
      ],
      consulting_questions: [
        "Welche Zusammenarbeit im Semester ist dauerhaft, und was gehört nur zum aktuellen Jahrgang?",
        "Wo endet der Arbeitsraum der Dozierenden, und wo beginnt die Lernplattform?",
        "Was würde die Nachfolge im Mai wirklich brauchen, um nicht bei null anzufangen?",
        "Welche Daten der Studierenden gehören unter keinen Umständen in ein Team?",
        "Was darf eine Hilfsassistenz sehen und was nicht?"
      ],
      boundary: "Teams ersetzt die Lernplattform der Universität nicht. Noten, Abgaben und die Kommunikation mit den Studierenden bleiben dort, wo sie organisatorisch und rechtlich hingehören.",
      training_hooks: {
        teams: {
          prompt: "Eine neue Dozentin übernimmt das Seminar im Mai und soll am ersten Tag wissen, wo das Material liegt und was Fabian darf.",
          decisions: [
            "tt-where",
            "tt-ta-access"
          ]
        },
        communication: {
          prompt: "Studierende schreiben Fabian am Sonntagabend im Chat, weil es schneller geht als über die Lernplattform.",
          decisions: [
            "tt-lms"
          ]
        },
        documents: {
          prompt: "Das Lesematerial hat drei Fassungen und das Bewertungsraster zwei. Welche geht an wen, und wer pflegt die Quelle?",
          decisions: [
            "tt-handover",
            "tt-ta-access"
          ]
        },
        loop: {
          prompt: "Der Semesterplan ist eine lebende Tabelle, die alle drei jederzeit aktuell halten, ohne ein Projektsystem aufzubauen.",
          decisions: [
            "tt-plan"
          ]
        },
        planner: {
          prompt: "Drei Personen und ein Semester: Wann lohnt sich Planner, und wann ist die Tabelle besser?",
          decisions: [
            "tt-plan"
          ]
        },
        balance: {
          prompt: "Die Hilfsassistenz soll nicht rund um die Uhr für Studierende erreichbar sein, nur weil Teams das technisch erlaubt.",
          decisions: [
            "tt-lms"
          ]
        }
      }
    }
  ]
};

/*
 * Atlas layer: what the showcase UI (index.html) needs on top of the worlds above.
 * Keyed by world id. Same rules as above: edit freely, run  node check-worlds.mjs  afterwards.
 *
 * pattern     continuous | mixed | solo | periodic | cyclic      (signature glyph)
 * flow        how the work moves:  sequence {steps, loop}  or  overlay {base, overlay.steps}
 *             step.z = zone of that step: personal | shared | institutional | outside
 * map         outside / external_people: person ids;  temporary: collaboration strings that are time-boxed
 * tools[]     role: valid | wrong | duplicate | dependency | specialist
 *             kind: mail | calendar | table | doc | chat | list | people | folder | laptop | building | box  (icon)
 * shifts[]    "heute → besseres Modell", each tied to real data: ref = artefact id (or null)
 *             kind: move (changes) | stay (deliberately stays);  zone: where it lives afterwards
 * zones       what lives in the institutional zone and in specialist systems outside M365
 * model.<pattern>  change / stay / m365 / outside   (null = nothing to say)
 * scenes      illustrative "heute" and M365 scenes on the Vergleich. who/by = person id (or plain text),
 *             mark = number of the shift it illustrates (1-based) or null
 * picks       decision-point ids shown as «Unsere Wahl für diesen Kontext»
 */
window.HE_ATLAS = {
  "campus-people-development": {
    "label": "Verwaltungsteam",
    "shape": "Festes Team, dazu ein befristetes Projekt",
    "pattern": "continuous",
    "footprint": "1 Team · 4 Kanäle · Planner",
    "flow": {
      "type": "overlay",
      "base": {
        "label": "Team, dauerhaft",
        "text": "Wochenbetrieb mit Jahreszyklus"
      },
      "overlay": {
        "label": "Leadership Forum 2027, befristet",
        "steps": [
          {
            "t": "Konzeption",
            "z": "shared",
            "n": "Herbst 2026"
          },
          {
            "t": "Durchführung",
            "z": "shared",
            "n": "sechs Termine 2027"
          },
          {
            "t": "Nachbereitung",
            "z": "shared",
            "n": "Anfang 2028, danach archivieren"
          }
        ]
      }
    },
    "map": {
      "outside": [
        "regula-aebi"
      ],
      "outside_label": "gehört zu HR Services, nicht zum Team",
      "external_people": [],
      "temporary": [
        "Externe Trainer:innen und Referierende, jeweils nur für ihre Session"
      ]
    },
    "tools": [
      {
        "name": "E-Mail",
        "use": "Termine abstimmen, Entwürfe und Anhänge verteilen",
        "role": "wrong",
        "kind": "mail"
      },
      {
        "name": "Outlook-Kalender",
        "use": "Termine und Räume",
        "role": "valid",
        "kind": "calendar"
      },
      {
        "name": "Excel",
        "use": "Veranstaltungsplan, Referierende, Budget: je nach Person eine andere Fassung",
        "role": "duplicate",
        "kind": "table"
      },
      {
        "name": "Word-Dateien",
        "use": "Einladungen wie «Einladung_v3_final_HR»",
        "role": "duplicate",
        "kind": "doc"
      },
      {
        "name": "Chat",
        "use": "Hier fallen Entscheide, später findet sie niemand",
        "role": "wrong",
        "kind": "chat"
      },
      {
        "name": "Persönliche Listen",
        "use": "Pendenzen einzelner Personen, für andere unsichtbar",
        "role": "dependency",
        "kind": "list"
      },
      {
        "name": "Anmeldesystem",
        "use": "Anmeldungen der Teilnehmenden",
        "role": "specialist",
        "kind": "box"
      }
    ],
    "shifts": [
      {
        "from": "Veranstaltungsplan als Excel per Mail, drei Fassungen",
        "role": "duplicate",
        "to": "Eine Tabelle im Forum-Kanal, Link statt Anhang",
        "zone": "shared",
        "kind": "move",
        "ref": "veranstaltungsplan"
      },
      {
        "from": "Entscheide fallen im Chat",
        "role": "wrong",
        "to": "Kanalbeitrag mit dem Ergebnis im Titel",
        "zone": "shared",
        "kind": "move",
        "ref": null
      },
      {
        "from": "Excel-Pendenzliste und persönliche Listen",
        "role": "duplicate",
        "to": "Planner für gemeinsame Pendenzen, To Do für persönliche",
        "zone": "shared",
        "kind": "move",
        "ref": "pendenzen"
      },
      {
        "from": "Rohkonzepte und Textentwürfe",
        "role": "valid",
        "to": "Bleiben persönlich, bis sie abgestimmt sind",
        "zone": "personal",
        "kind": "stay",
        "ref": null
      },
      {
        "from": "Anmeldedaten der Teilnehmenden",
        "role": "specialist",
        "to": "Bleiben im Anmeldesystem der Universität",
        "zone": "outside",
        "kind": "stay",
        "ref": null
      }
    ],
    "zones": {
      "institutional": [
        "Teilnehmendenkreis und Freigaben: bleiben bei HR Services"
      ],
      "outside": [
        "Anmeldedaten der Teilnehmenden: Anmeldesystem der Universität"
      ]
    },
    "model": {
      "communication": {
        "change": "Entscheide und Stand wandern in den Forum-Kanal, mit dem Ergebnis im Titel.",
        "stay": "Chat für Kurzabsprachen zu zweit.",
        "m365": "Kanalbeiträge, Chat, Teams-Meetings.",
        "outside": "Einladungen an Externe und Freigaben von HR laufen weiter per Mail."
      },
      "documents": {
        "change": "Eine Fassung pro Dokument im Kanal. Link statt Anhang.",
        "stay": "Rohkonzepte und Textentwürfe bleiben bei der Person, bis sie abgestimmt sind.",
        "m365": "Dateien im Team, OneDrive für Entwürfe, Versionsverlauf.",
        "outside": "Anmeldedaten gehören ins Anmeldesystem, nicht in eine Liste im Kanal."
      },
      "tasks": {
        "change": "Gemeinsame Pendenzen mit Verantwortung und Termin in einen Plan.",
        "stay": "Persönliche To-dos bleiben in To Do.",
        "m365": "Planner im Forum-Team, To Do persönlich.",
        "outside": null
      },
      "knowledge": {
        "change": "Die Einarbeitungsliste lebt als Loop-Seite weiter, nicht als Mail mit zwölf Anhängen.",
        "stay": "Verbindliche Informationen der Universität bleiben dort, wo sie veröffentlicht werden.",
        "m365": "Loop-Seite im Kanal «Interne Organisation».",
        "outside": null
      },
      "attention": {
        "change": "Der Stand steht vor dem Montagsmeeting im Kanal, nicht erst darin.",
        "stay": "Montagsmeeting und Forum-Termine.",
        "m365": "Kalenderserie, Teams-Meeting, Benachrichtigungen für den Forum-Kanal bewusst setzen.",
        "outside": null
      }
    },
    "picks": [
      "lf-where",
      "lf-decisions-visible",
      "lf-external-trainers",
      "lf-planner"
    ],
    "anti": [
      "Ein Team pro Termin",
      "Externe als Gäste ins ganze Forum-Team einladen",
      "Chat-Anhänge als Verteilweg für Präsentationen"
    ],
    "scenes": {
      "today": {
        "title": "Postfach und Ablage, eine Woche vor Termin 3",
        "items": [
          {
            "type": "mail",
            "who": "sophie-frei",
            "title": "AW: Veranstaltungsplan – welche Fassung gilt?",
            "meta": "Anhang: Veranstaltungsplan_Mara.xlsx",
            "role": "duplicate",
            "mark": 1
          },
          {
            "type": "mail",
            "who": "regula-aebi",
            "title": "Teilnehmende HR (unsere Liste)",
            "meta": "Anhang: Teilnehmende_HR.xlsx",
            "role": "duplicate",
            "mark": 1
          },
          {
            "type": "chat",
            "who": "sophie-frei",
            "title": "«Termin 3 machen wir online, ok?»",
            "meta": "Chat mit Regula",
            "role": "wrong",
            "mark": 2
          },
          {
            "type": "mail",
            "who": "mara-conti",
            "title": "Wer hat die aktuelle Pendenzenliste?",
            "meta": "an das ganze Team",
            "role": "duplicate",
            "mark": 3
          },
          {
            "type": "file",
            "who": "daniel-wyss",
            "title": "Einladung_v3_final_HR.docx",
            "meta": "Entwurf im Postfach",
            "role": "duplicate",
            "mark": null
          }
        ]
      },
      "target": {
        "kind": "team",
        "active": "Leadership Forum",
        "tabs": [
          "Beiträge",
          "Dateien",
          "Planner"
        ],
        "view": "posts",
        "posts": [
          {
            "by": "sophie-frei",
            "time": "Di 09:12",
            "text": "Entscheid: Termin 3 findet online statt.",
            "file": null,
            "mark": 2
          },
          {
            "by": "mara-conti",
            "time": "Di 09:40",
            "text": "Veranstaltungsplan nachgeführt, bitte nur noch diese Datei.",
            "file": "Veranstaltungsplan.xlsx",
            "mark": 1
          },
          {
            "by": "lea-baumann",
            "time": "Mi 08:05",
            "text": "Offene Pendenzen stehen ab jetzt im Planner, mit Verantwortung und Termin.",
            "file": null,
            "mark": 3
          }
        ],
        "systems": [
          {
            "name": "Anmeldesystem",
            "mark": 5
          }
        ]
      }
    }
  },
  "urban-health-analytics": {
    "label": "Forschungsgruppe",
    "shape": "Dauergruppe, befristete Projekte, viel Einzelarbeit",
    "pattern": "mixed",
    "footprint": "1 Team · 5 Kanäle · Planner nur für die Feldkampagne",
    "flow": {
      "type": "sequence",
      "loop": null,
      "steps": [
        {
          "t": "Eigene Forschung",
          "z": "personal",
          "n": "Analysen, Skripte, Entwürfe"
        },
        {
          "t": "Gemeinsames Projekt",
          "z": "shared",
          "n": "Paper, Geräte, Feldkampagne"
        },
        {
          "t": "Publikation",
          "z": "institutional",
          "n": "Rohdaten bleiben in der Forschungsinfrastruktur"
        }
      ]
    },
    "map": {
      "outside": [],
      "outside_label": "",
      "external_people": [],
      "temporary": []
    },
    "tools": [
      {
        "name": "Persönliches OneDrive",
        "use": "Das Paper wächst in Ninas OneDrive, Feedback kommt als Kopie",
        "role": "dependency",
        "kind": "folder"
      },
      {
        "name": "Chat und E-Mail",
        "use": "Paper-Anhänge, Literaturhinweise, Skript-Versionen",
        "role": "wrong",
        "kind": "mail"
      },
      {
        "name": "Lokale Platten, USB-Stick",
        "use": "Sensordaten, Skripte, Präsentationen",
        "role": "dependency",
        "kind": "laptop"
      },
      {
        "name": "Excel-Listen",
        "use": "Feldarbeit und Sensor-Logbuch, nachgeführt von Marc",
        "role": "dependency",
        "kind": "table"
      },
      {
        "name": "Papier am Gerät",
        "use": "Messprotokolle und Kalibrierung",
        "role": "valid",
        "kind": "doc"
      },
      {
        "name": "Institutslaufwerk",
        "use": "Pseudonymisierte Gesundheitsdaten, Auszüge als Excel",
        "role": "wrong",
        "kind": "folder"
      },
      {
        "name": "Forschungsdateninfrastruktur",
        "use": "Rohdaten, Gesundheitsdaten",
        "role": "specialist",
        "kind": "box"
      },
      {
        "name": "Versionsverwaltung",
        "use": "Analyse-Skripte der Gruppe",
        "role": "specialist",
        "kind": "box"
      }
    ],
    "shifts": [
      {
        "from": "Paper im OneDrive einer Person, Feedback als Kopie",
        "role": "dependency",
        "to": "Datei im Kanal «Publikationen», Link auf genau diese Datei",
        "zone": "shared",
        "kind": "move",
        "ref": "paper-entwurf"
      },
      {
        "from": "Gerätebuchung per Zuruf und Chat",
        "role": "wrong",
        "to": "Ressourcenkalender pro Gerät",
        "zone": "shared",
        "kind": "move",
        "ref": "geraetebuchung"
      },
      {
        "from": "Feldarbeit in einer Excel-Liste",
        "role": "dependency",
        "to": "Planner-Plan, nur für die Kampagne",
        "zone": "shared",
        "kind": "move",
        "ref": "feldarbeitsaufgaben"
      },
      {
        "from": "Skripte und frühe Entwürfe",
        "role": "valid",
        "to": "Bleiben bei der Person",
        "zone": "personal",
        "kind": "stay",
        "ref": "analyse-skripte"
      },
      {
        "from": "Sensordaten und Gesundheitsdaten",
        "role": "specialist",
        "to": "Bleiben in der Forschungsdateninfrastruktur, im Kanal nur Beschreibung und Link",
        "zone": "outside",
        "kind": "stay",
        "ref": "sensordaten"
      }
    ],
    "zones": {
      "institutional": [
        "Forschungsadministration der Fakultät und Ethikkommission bleiben eigene Stellen"
      ],
      "outside": [
        "Sensor-Rohdaten und Gesundheitsdaten: Forschungsdateninfrastruktur der Universität",
        "Analyse-Skripte: Versionsverwaltung",
        "Messprotokoll auf Papier, wenn es am Gerät besser funktioniert"
      ]
    },
    "model": {
      "communication": {
        "change": "Gruppenorganisation und Arbeitsbereiche bekommen je einen Kanal. Literatur und Absprachen landen dort statt im Chat.",
        "stay": "Chat für Kurzes zwischen zwei Personen.",
        "m365": "Ein Team, fünf Kanäle nach Arbeitsbereich.",
        "outside": "Quartalsupdate an den Datenpartner: Mail mit Link, kein Gastzugang."
      },
      "documents": {
        "change": "Das Paper zieht ab drei Beteiligten in den Kanal um. Die Coautorin bekommt einen Link auf genau diese Datei.",
        "stay": "Skripte und frühe Entwürfe bleiben bei der Person.",
        "m365": "OneDrive für Entwürfe, Kanaldateien für Gemeinsames, Link statt Kopie.",
        "outside": "Rohdaten und Gesundheitsdaten: Forschungsinfrastruktur. Im Kanal nur Beschreibung, Pfad, aggregierte Resultate."
      },
      "tasks": {
        "change": "Die Feldarbeit wird ein Planner-Plan, nur für die Kampagne.",
        "stay": "Formularfristen und Reisetermine bleiben im Kalender, nicht in Planner.",
        "m365": "Planner (Kampagne), gemeinsamer Kalender, To Do persönlich.",
        "outside": null
      },
      "knowledge": {
        "change": "Meetingnotizen werden eine Seite, in die alle schauen.",
        "stay": "Das Papierprotokoll am Gerät, wo es besser funktioniert.",
        "m365": "Loop-Seite oder Dokument im Kanal «Gruppenorganisation».",
        "outside": null
      },
      "attention": {
        "change": "Geräte werden als Ressource im Kalender gebucht, nicht per Zuruf.",
        "stay": "Das wöchentliche Gruppenmeeting.",
        "m365": "Ressourcenkalender pro Gerät, Teams-Meeting für das Gruppenmeeting.",
        "outside": null
      }
    },
    "picks": [
      "hh-chat-attachment",
      "hh-research-data",
      "hh-external-partner",
      "hh-fieldwork-tasks"
    ],
    "anti": [
      "Grosse Rohdaten oder Gesundheitsdaten «kurz» in Teams oder SharePoint ablegen",
      "Den Datenpartner als Gast ins ganze Gruppenteam einladen",
      "Ein dauerhafter Planner-Plan für alles, was in der Gruppe anfällt"
    ],
    "scenes": {
      "today": {
        "title": "Wo das Paper und die Daten gerade liegen",
        "items": [
          {
            "type": "file",
            "who": "nina-petrovic",
            "title": "Paper_HeatHealth_v7.docx",
            "meta": "OneDrive von Nina",
            "role": "dependency",
            "mark": 1
          },
          {
            "type": "file",
            "who": "david-brunner",
            "title": "Paper_HeatHealth_v7_DB.docx",
            "meta": "Download-Ordner, Kommentare als Kopie",
            "role": "duplicate",
            "mark": 1
          },
          {
            "type": "chat",
            "who": "marc-schneider",
            "title": "«Ist das Messgerät morgen frei?»",
            "meta": "Gruppenchat",
            "role": "wrong",
            "mark": 2
          },
          {
            "type": "file",
            "who": "marc-schneider",
            "title": "Feldarbeit_Sommer.xlsx",
            "meta": "OneDrive von Marc",
            "role": "dependency",
            "mark": 3
          },
          {
            "type": "local",
            "who": "amira-hassan",
            "title": "Sensordaten_Juli/",
            "meta": "Lokale Platte, Kopie im Gruppenordner",
            "role": "wrong",
            "mark": 5
          }
        ]
      },
      "target": {
        "kind": "team",
        "active": "Publikationen",
        "tabs": [
          "Beiträge",
          "Dateien"
        ],
        "view": "posts",
        "posts": [
          {
            "by": "nina-petrovic",
            "time": "Mo 10:20",
            "text": "Entwurf für Feedback: bitte direkt in der Datei kommentieren.",
            "file": "Paper_HeatHealth.docx",
            "mark": 1
          },
          {
            "by": "marc-schneider",
            "time": "Mo 13:02",
            "text": "Feldkampagne: Aufgaben stehen im Planner-Plan «Sommer».",
            "file": null,
            "mark": 3
          },
          {
            "by": "elena-rossi",
            "time": "Di 08:30",
            "text": "Rohdaten bleiben in der Forschungsdateninfrastruktur. Hier nur Pfad und aggregierte Resultate.",
            "file": null,
            "mark": 5
          }
        ],
        "systems": [
          {
            "name": "Forschungsdateninfrastruktur",
            "mark": 5
          },
          {
            "name": "Versionsverwaltung",
            "mark": 4
          }
        ]
      }
    }
  },
  "nora-keller": {
    "label": "Einzelne Forscherin",
    "shape": "Meist allein, Zusammenarbeit als Ereignis",
    "pattern": "solo",
    "footprint": "Kein Team · OneDrive und To Do",
    "flow": {
      "type": "sequence",
      "loop": null,
      "steps": [
        {
          "t": "Persönlicher Entwurf",
          "z": "personal",
          "n": "Monate allein"
        },
        {
          "t": "Feedback",
          "z": "shared",
          "n": "Link statt Kopie"
        },
        {
          "t": "Co-Autorschaft",
          "z": "shared",
          "n": "ab Herbst"
        },
        {
          "t": "Gemeinsame Publikation",
          "z": "shared",
          "n": "erst jetzt ein gemeinsamer Ort"
        }
      ]
    },
    "map": {
      "outside": [],
      "outside_label": "",
      "external_people": [],
      "temporary": [
        "Referierende des Workshops"
      ]
    },
    "tools": [
      {
        "name": "OneDrive",
        "use": "Notizen, Entwürfe, Lehrunterlagen",
        "role": "valid",
        "kind": "folder"
      },
      {
        "name": "Word",
        "use": "Manuskripte",
        "role": "valid",
        "kind": "doc"
      },
      {
        "name": "E-Mail",
        "use": "Würde zum Hin- und Herschicken von Fassungen mit der Coautorin",
        "role": "wrong",
        "kind": "mail"
      },
      {
        "name": "Postfach",
        "use": "Bei Abwesenheit die einzige Übersicht über Dringendes",
        "role": "dependency",
        "kind": "mail"
      },
      {
        "name": "Chat mit dem Sekretariat",
        "use": "Honorarfragen zum Workshop",
        "role": "wrong",
        "kind": "chat"
      },
      {
        "name": "Lernplattform der Universität",
        "use": "Seminarmaterial, Abgaben, Bewertungen",
        "role": "specialist",
        "kind": "building"
      }
    ],
    "shifts": [
      {
        "from": "Fassungen per Mail zwischen Basel und der Coautorin",
        "role": "wrong",
        "to": "Link mit Bearbeitungsrecht auf die Datei in OneDrive",
        "zone": "shared",
        "kind": "move",
        "ref": "gemeinsamer-artikel"
      },
      {
        "from": "Übergabe bei Abwesenheit liegt im Postfach",
        "role": "dependency",
        "to": "Eine Übergabeseite mit Terminen und Betreuungen",
        "zone": "shared",
        "kind": "move",
        "ref": "uebergabe-notiz"
      },
      {
        "from": "Notizen, Entwürfe, Lehrunterlagen",
        "role": "valid",
        "to": "Bleiben in OneDrive, ohne weitere Struktur",
        "zone": "personal",
        "kind": "stay",
        "ref": "forschungsnotizen"
      },
      {
        "from": "Workshop: Word, Mail und Chat",
        "role": "duplicate",
        "to": "Ordner in der Institutsablage, Outlook-Serie für die Termine",
        "zone": "shared",
        "kind": "move",
        "ref": "workshop-unterlagen"
      },
      {
        "from": "Abgaben und Bewertungen",
        "role": "specialist",
        "to": "Bleiben im System der Universität",
        "zone": "institutional",
        "kind": "stay",
        "ref": "betreuungsfeedback"
      }
    ],
    "zones": {
      "institutional": [
        "Seminarmaterial und Feedback an Studierende: Lernplattform der Universität",
        "Abgegebene Fassungen und Bewertungen: System der Universität"
      ],
      "outside": []
    },
    "model": {
      "communication": {
        "change": "Die Coautorin kommentiert direkt in der Datei, nicht per Mail.",
        "stay": "Mail für Studierende und Externe.",
        "m365": "Kommentare im Dokument, Outlook.",
        "outside": "Studierende erreicht sie über die Lernplattform."
      },
      "documents": {
        "change": "Erst wenn die Coautorin einsteigt: ein Link mit Bearbeitungsrecht auf die Datei in OneDrive.",
        "stay": "Notizen, Entwürfe und Lehrunterlagen bleiben persönlich in OneDrive.",
        "m365": "OneDrive. Workshop-Unterlagen in einem Ordner der Institutsablage.",
        "outside": "Abgaben und Bewertungen: System der Universität."
      },
      "tasks": {
        "change": null,
        "stay": "Die eigene To-do-Liste.",
        "m365": "Microsoft To Do. Kein Planner.",
        "outside": null
      },
      "knowledge": {
        "change": "Eine Übergabeseite für Abwesenheit: Termine, Betreuungen, wenige freigegebene Dateien.",
        "stay": "Forschungsnotizen bleiben persönlich.",
        "m365": "Eine Seite oder ein Dokument. Das OneDrive bleibt zu.",
        "outside": null
      },
      "attention": {
        "change": null,
        "stay": "Semester- und Schreibrhythmus bestimmen den Kalender.",
        "m365": "Outlook-Kalender, Serie für den Workshop, Abwesenheitsnotiz.",
        "outside": null
      }
    },
    "picks": [
      "nk-coauthor",
      "nk-stay"
    ],
    "anti": [
      "Ein Team gründen, nur weil ein Artikel zwei Autorinnen hat",
      "Alles vorsorglich in ein Team schieben, damit es «sauber» ist",
      "Ein Projektteam für jedes Forschungsthema"
    ],
    "scenes": {
      "today": {
        "title": "Noras Postfach im Oktober",
        "items": [
          {
            "type": "mail",
            "who": "Coautorin (Partneruniversität)",
            "title": "AW: Artikel – meine Kommentare",
            "meta": "Anhang: Artikel_Nora_v4_Kommentare.docx",
            "role": "wrong",
            "mark": 1
          },
          {
            "type": "mail",
            "who": "nora-keller",
            "title": "Artikel_v5_zusammengeführt.docx",
            "meta": "an die Coautorin, von Hand zusammengeführt",
            "role": "duplicate",
            "mark": 1
          },
          {
            "type": "mail",
            "who": "Vertretung",
            "title": "Was ist dringend, solange Nora weg ist?",
            "meta": "offene Mails als einzige Übersicht",
            "role": "dependency",
            "mark": 2
          },
          {
            "type": "chat",
            "who": "Institutssekretariat",
            "title": "«Honorar für die Referentin?»",
            "meta": "Chat zum Workshop",
            "role": "wrong",
            "mark": 4
          }
        ]
      },
      "target": {
        "kind": "personal",
        "files": [
          {
            "name": "Forschungsnotizen /",
            "meta": "nur Nora",
            "mark": null
          },
          {
            "name": "Artikel_Grenzen.docx",
            "meta": "geteilt mit der Coautorin, Link mit Bearbeitungsrecht",
            "mark": 1
          },
          {
            "name": "Lehrunterlagen /",
            "meta": "nur Nora",
            "mark": null
          },
          {
            "name": "Übergabe.docx",
            "meta": "für die Vertretung freigegeben",
            "mark": 2
          }
        ],
        "todo": [
          "Artikel überarbeiten",
          "Literatur bestellen",
          "Feedback für Studentin",
          "Reisekosten einreichen"
        ],
        "note": "Kein Team. Geteilt wird per Link, wenn jemand mitschreibt.",
        "systems": [
          {
            "name": "Lernplattform",
            "mark": 5
          }
        ]
      }
    }
  },
  "commission-digital-collaboration": {
    "label": "Kommission",
    "shape": "Sechs Sitzungen im Jahr, Mitglieder wechseln gestaffelt",
    "pattern": "periodic",
    "footprint": "1 Team · 1 Kanal · kein Planner",
    "flow": {
      "type": "sequence",
      "loop": "nächste Sitzung",
      "steps": [
        {
          "t": "Vorbereiten",
          "z": "shared",
          "n": "Unterlagen eine Woche vorher"
        },
        {
          "t": "Sitzung",
          "z": "shared",
          "n": "sechsmal im Jahr"
        },
        {
          "t": "Entscheid",
          "z": "institutional",
          "n": "Protokoll, Entscheidtabelle"
        },
        {
          "t": "Pendenzen",
          "z": "shared",
          "n": "Tabelle im Protokoll"
        },
        {
          "t": "Archiv",
          "z": "institutional",
          "n": "PDF, Ordner nach Jahr"
        }
      ]
    },
    "map": {
      "outside": [],
      "outside_label": "",
      "external_people": [
        "beat-kunz"
      ],
      "temporary": []
    },
    "tools": [
      {
        "name": "E-Mail mit Anhang",
        "use": "Agenda und Unterlagen an sieben Personen, drei haben sie «nicht erhalten»",
        "role": "wrong",
        "kind": "mail"
      },
      {
        "name": "Word-Dateien",
        "use": "Agenda in der Fassung «v2_nach_Rückmeldung_Vogel»",
        "role": "duplicate",
        "kind": "doc"
      },
      {
        "name": "Mailverteiler",
        "use": "Von Hand gepflegt, stimmt nicht mit der Mitgliederliste überein",
        "role": "duplicate",
        "kind": "people"
      },
      {
        "name": "Netzlaufwerk des Sekretariats",
        "use": "Protokolle, Mitglieder bekommen PDF-Kopien per Mail",
        "role": "valid",
        "kind": "folder"
      }
    ],
    "shifts": [
      {
        "from": "Unterlagen als Mailanhang an sieben Personen",
        "role": "wrong",
        "to": "Ordner pro Sitzung, Mail nur mit Link",
        "zone": "shared",
        "kind": "move",
        "ref": "sitzungsunterlagen"
      },
      {
        "from": "Agenda in jeder Woche eine neue Version",
        "role": "duplicate",
        "to": "Eine Datei in der Bibliothek, vom Sekretariat gepflegt",
        "zone": "shared",
        "kind": "move",
        "ref": "agenda"
      },
      {
        "from": "Entscheide nur in Protokollen auffindbar",
        "role": "dependency",
        "to": "Übersichtstabelle mit Link zum Protokoll",
        "zone": "institutional",
        "kind": "move",
        "ref": "entscheide"
      },
      {
        "from": "Pendenzen am Ende des Protokolls",
        "role": "valid",
        "to": "Bleiben so, kein Planner für acht Pendenzen",
        "zone": "shared",
        "kind": "stay",
        "ref": "pendenzen"
      },
      {
        "from": "Mailverteiler von Hand gepflegt",
        "role": "duplicate",
        "to": "Teammitglieder entsprechen der Mitgliederliste",
        "zone": "shared",
        "kind": "move",
        "ref": "mitgliederliste"
      }
    ],
    "zones": {
      "institutional": [
        "Protokolle: verabschiedete Fassung als PDF im Archiv",
        "Beschlüsse an die Universitätsleitung: offizieller Weg"
      ],
      "outside": []
    },
    "model": {
      "communication": {
        "change": "Mail nur noch als Hinweis mit Link.",
        "stay": "Mail bleibt der Weg für Einladung und Hinweis.",
        "m365": "Ein Team, ein Kanal «Allgemein».",
        "outside": "Beschlüsse gehen auf dem offiziellen Weg an die Universitätsleitung."
      },
      "documents": {
        "change": "Ein Ordner pro Sitzung. Die beschlossene Fassung wird als PDF eingefroren.",
        "stay": "Das Sekretariat pflegt Agenda und Protokoll.",
        "m365": "Bibliothek im Team, Versionsverlauf, Link statt Anhang.",
        "outside": null
      },
      "tasks": {
        "change": "Vor jeder Sitzung fragt das Sekretariat bei den Verantwortlichen nach.",
        "stay": "Die Pendenzentabelle am Ende des Protokolls.",
        "m365": "Kein Planner: acht Pendenzen im Jahr.",
        "outside": null
      },
      "knowledge": {
        "change": "Entscheide stehen in einer Übersichtstabelle mit Link zum Protokoll.",
        "stay": "Das Protokoll bleibt das verbindliche Dokument.",
        "m365": "Tabelle in der Bibliothek.",
        "outside": null
      },
      "attention": {
        "change": null,
        "stay": "Sechs Sitzungen im Jahr, dazwischen Ruhe.",
        "m365": "Sitzungsserie im Kalender. Keine Dauerbenachrichtigungen.",
        "outside": null
      }
    },
    "picks": [
      "cm-team",
      "cm-documents",
      "cm-pendenzen",
      "cm-external"
    ],
    "anti": [
      "Ein Planner-Board für acht Pendenzen im Jahr",
      "Viele Kanäle, von denen nach zwei Sitzungen drei leer bleiben",
      "Altmitglieder im Team lassen, «sie lesen ja nichts mehr»"
    ],
    "scenes": {
      "today": {
        "title": "Eine Woche vor Sitzung 4",
        "items": [
          {
            "type": "mail",
            "who": "claudia-gisler",
            "title": "Unterlagen Sitzung 4",
            "meta": "7 Anhänge an den Verteiler",
            "role": "wrong",
            "mark": 1
          },
          {
            "type": "mail",
            "who": "martina-vogel",
            "title": "Agenda_v2_nach_Rückmeldung_Vogel.docx",
            "meta": "dritte Fassung diese Woche",
            "role": "duplicate",
            "mark": 2
          },
          {
            "type": "mail",
            "who": "beat-kunz",
            "title": "Habe die Unterlagen nicht erhalten",
            "meta": "externes Mitglied",
            "role": "wrong",
            "mark": 1
          },
          {
            "type": "folder",
            "who": "claudia-gisler",
            "title": "Protokolle/2026/",
            "meta": "Netzlaufwerk, Entscheide nur im Protokoll",
            "role": "dependency",
            "mark": 3
          },
          {
            "type": "mail",
            "who": "claudia-gisler",
            "title": "Verteiler Kommission",
            "meta": "9 Empfänger, 7 Mitglieder",
            "role": "duplicate",
            "mark": 5
          }
        ]
      },
      "target": {
        "kind": "team",
        "active": "Allgemein",
        "tabs": [
          "Beiträge",
          "Dateien"
        ],
        "view": "files",
        "files": [
          {
            "name": "Sitzung 4 /",
            "meta": "Agenda, Unterlagen, Protokoll",
            "mark": 1
          },
          {
            "name": "Agenda.docx",
            "meta": "vom Sekretariat gepflegt",
            "mark": 2
          },
          {
            "name": "Entscheide.xlsx",
            "meta": "Datum, Beschluss, Link zum Protokoll",
            "mark": 3
          },
          {
            "name": "Protokolle / 2026 /",
            "meta": "verabschiedet als PDF",
            "mark": null
          }
        ],
        "note": "Ein Kanal, kein Planner.",
        "systems": []
      }
    }
  },
  "teaching-team": {
    "label": "Lehrteam",
    "shape": "Jedes Semester neu, Besetzung wechselt",
    "pattern": "cyclic",
    "footprint": "1 Team · 3 Kanäle · Studierende nicht im Team",
    "flow": {
      "type": "sequence",
      "loop": "nächstes Semester",
      "steps": [
        {
          "t": "Semester vorbereiten",
          "z": "shared",
          "n": "ab Sommer"
        },
        {
          "t": "Lehren",
          "z": "shared",
          "n": "14 Wochen, Studierende auf der Lernplattform"
        },
        {
          "t": "Bewerten",
          "z": "institutional",
          "n": "Noten nur im Bewertungssystem"
        },
        {
          "t": "Archivieren und verbessern",
          "z": "shared",
          "n": "Übergabedossier"
        }
      ]
    },
    "map": {
      "outside": [],
      "outside_label": "",
      "external_people": [],
      "temporary": [
        "Gastreferierende (punktuell)"
      ]
    },
    "tools": [
      {
        "name": "E-Mail und drei Postfächer",
        "use": "Material und Semesterplan in mehreren Fassungen",
        "role": "duplicate",
        "kind": "mail"
      },
      {
        "name": "Word und Excel",
        "use": "Syllabus, Aufgaben, Semesterplan: jede:r hat eine eigene Fassung",
        "role": "duplicate",
        "kind": "table"
      },
      {
        "name": "Excel-Listen auf Laptops",
        "use": "Noten parallel zum offiziellen System",
        "role": "wrong",
        "kind": "laptop"
      },
      {
        "name": "Postfach der Vorgängerin",
        "use": "Das Archiv des letzten Jahres",
        "role": "dependency",
        "kind": "mail"
      },
      {
        "name": "Lernplattform der Universität",
        "use": "Studierende, Lesematerial, Forum, Bewertung",
        "role": "specialist",
        "kind": "building"
      }
    ],
    "shifts": [
      {
        "from": "Material und Semesterplan in drei Postfächern",
        "role": "duplicate",
        "to": "Eine Quelle im Teamordner, die Lernplattform liefert aus",
        "zone": "shared",
        "kind": "move",
        "ref": "lesematerial"
      },
      {
        "from": "Noten in Excel auf Laptops",
        "role": "wrong",
        "to": "Nur im offiziellen Bewertungssystem",
        "zone": "institutional",
        "kind": "move",
        "ref": "noten"
      },
      {
        "from": "Rückfragen per Mail an alle drei",
        "role": "wrong",
        "to": "Forum der Lernplattform",
        "zone": "institutional",
        "kind": "move",
        "ref": "rueckfragen-studierende"
      },
      {
        "from": "Übergabe im Postfach der Vorgängerin",
        "role": "dependency",
        "to": "Übergabedossier im Team",
        "zone": "shared",
        "kind": "move",
        "ref": "uebergabedossier"
      },
      {
        "from": "Gültiger Syllabus",
        "role": "specialist",
        "to": "Bleibt auf der Lernplattform",
        "zone": "institutional",
        "kind": "stay",
        "ref": "syllabus"
      }
    ],
    "zones": {
      "institutional": [
        "Lernplattform: Studierende, Abgaben, Rückfragen",
        "Bewertungssystem: Noten und Einzelbewertungen",
        "Studiendekanat: Feedback der Studierenden"
      ],
      "outside": []
    },
    "model": {
      "communication": {
        "change": "Absprachen im Lehrteam laufen im Teamkanal statt in drei Postfächern.",
        "stay": "Studierende erreichen das Team nur über die Lernplattform.",
        "m365": "Ein Team, Kanäle «Allgemein», «Semester», «Bewertung».",
        "outside": "Rückfragen der Studierenden: Forum der Lernplattform."
      },
      "documents": {
        "change": "Eine Quelle im Teamordner. Die Lernplattform liefert aus.",
        "stay": "Der gültige Syllabus liegt auf der Lernplattform.",
        "m365": "Teamordner. Fabian ist Mitglied und sieht das Bewertungsraster nur lesend.",
        "outside": "Noten und Einzelbewertungen: offizielles Bewertungssystem."
      },
      "tasks": {
        "change": null,
        "stay": "Eine Tabelle im Teamordner genügt für drei Personen.",
        "m365": "Keine Planner-Struktur.",
        "outside": null
      },
      "knowledge": {
        "change": "Das Übergabedossier lebt im Team, mit einer Seite «Was ich nächstes Mal anders machen würde».",
        "stay": "Freigegebene Unterlagen bleiben die Basis fürs nächste Jahr.",
        "m365": "Seite im Team, Ordner pro Jahr.",
        "outside": "Feedback der Studierenden bleibt beim Studiendekanat. Im Team nur die Zusammenfassung."
      },
      "attention": {
        "change": null,
        "stay": "Feste Semesterwochen und Sprechstunden.",
        "m365": "Kalenderserie. Keine Chat-Erreichbarkeit der Hilfsassistenz am Abend.",
        "outside": null
      }
    },
    "picks": [
      "tt-where",
      "tt-lms",
      "tt-ta-access",
      "tt-handover"
    ],
    "anti": [
      "Pro Semester ein neues Team gründen und das alte vergessen",
      "Studierende in Teams holen, weil «die Plattform umständlich ist»",
      "Noten und Einzelbewertungen im Teamordner ablegen"
    ],
    "scenes": {
      "today": {
        "title": "Semesterstart in drei Postfächern",
        "items": [
          {
            "type": "mail",
            "who": "simon-luethi",
            "title": "Semesterplan (meine Fassung)",
            "meta": "Anhang: Semesterplan_Simon.xlsx",
            "role": "duplicate",
            "mark": 1
          },
          {
            "type": "mail",
            "who": "ruth-ammann",
            "title": "Lesematerial, neue Fassung",
            "meta": "Anhang, zweite Kopie auf der Lernplattform",
            "role": "duplicate",
            "mark": 1
          },
          {
            "type": "local",
            "who": "simon-luethi",
            "title": "Noten_HS.xlsx",
            "meta": "Laptop von Simon",
            "role": "wrong",
            "mark": 2
          },
          {
            "type": "mail",
            "who": "Studentin",
            "title": "Frage zu Aufgabe 2",
            "meta": "an alle drei Dozierenden",
            "role": "wrong",
            "mark": 3
          },
          {
            "type": "folder",
            "who": "Vorgängerin",
            "title": "Seminar alt/",
            "meta": "im Postfach der Vorgängerin",
            "role": "dependency",
            "mark": 4
          }
        ]
      },
      "target": {
        "kind": "team",
        "active": "Semester",
        "tabs": [
          "Beiträge",
          "Dateien"
        ],
        "view": "posts",
        "posts": [
          {
            "by": "ruth-ammann",
            "time": "Mo 08:10",
            "text": "Semesterplan und Lesematerial liegen unter «Dateien». Die Lernplattform zeigt den Auszug.",
            "file": "Semesterplan.xlsx",
            "mark": 1
          },
          {
            "by": "fabian-steiner",
            "time": "Do 16:45",
            "text": "Rückfragen laufen über das Forum der Lernplattform. Hier nur die Zusammenfassung.",
            "file": null,
            "mark": 3
          },
          {
            "by": "ruth-ammann",
            "time": "Fr 11:00",
            "text": "Übergabedossier fürs nächste Jahr angelegt.",
            "file": "Übergabedossier /",
            "mark": 4
          }
        ],
        "systems": [
          {
            "name": "Lernplattform",
            "mark": 3
          },
          {
            "name": "Bewertungssystem",
            "mark": 2
          }
        ]
      }
    }
  }
};
