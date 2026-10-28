/*
 * Thin v3 adapter: builds the view model the library, Szene, Prinzip and Präsentieren share.
 * Legacy HE_WORLDS / HE_ATLAS content is read, never mutated. Customised names live in a
 * separate overrides object, so curated originals stay intact.
 */
(function (root) {
  var HE = root.HE_WORLDS, ATLAS = root.HE_ATLAS, LIB = root.LIB;

  function worldById(id) {
    if (id === LIB.business.id) return LIB.business;
    return HE.worlds.filter(function (w) { return w.id === id; })[0];
  }
  function situationById(id) { return LIB.situations.filter(function (s) { return s.id === id; })[0]; }
  function collectionOf(w) { return w.collection || 'hochschule'; }

  /* Replace {p:id}, {s} and {c} tokens with current names. */
  function fill(text, ctx) {
    if (text == null) return '';
    return String(text)
      .replace(/\{p:([a-z0-9-]+)\}/g, function (_, id) { return ctx.name(id); })
      .replace(/\{s\}/g, ctx.team)
      .replace(/\{c\}/g, ctx.active);
  }
  function first(list) { return list && list.length ? list[0] : null; }

  /* Derive a team/personal scene from legacy atlas content for worlds without a complete scene. */
  function legacyScene(w, a, sc) {
    var t = a.scenes.target, m = sc.m365_model || {};
    var note = function (mark) { var s = a.shifts[mark - 1]; return s ? s.to : null; };
    var notes = {};
    if (t.kind === 'personal') {
      (t.files || []).forEach(function (f) { if (f.mark) notes[f.mark] = note(f.mark); });
      return {
        personal: true, team: 'Persönliche Ablage', teamNote: t.note, active: 'Dateien',
        channels: [], members: [w.people[0].id], posts: [],
        files: t.files.map(function (f) { return { name: f.name, kind: /\/$/.test(f.name) ? 'folder' : 'doc', by: w.people[0].id, when: '', note: f.meta, mark: f.mark }; }),
        tasks: (t.todo || []).map(function (x) { return { title: x, owner: w.people[0].id, due: '', bucket: 'To Do', done: false }; }),
        outside: (t.systems || []).map(function (y) { return y.name; }), notes: notes
      };
    }
    var posts = (t.posts || []).map(function (q, i) {
      if (q.mark) notes[q.mark] = note(q.mark);
      return { id: 'p' + (i + 1), by: q.by, time: q.time, title: '', text: q.text, file: q.file, replies: [], mark: q.mark };
    });
    var files = (t.files || []).map(function (f) {
      if (f.mark) notes[f.mark] = note(f.mark);
      return { name: f.name, kind: /\/$/.test(f.name) ? 'folder' : /xlsx$/.test(f.name) ? 'table' : 'doc', by: null, when: '', note: f.meta, mark: f.mark };
    });
    posts.forEach(function (q) { if (q.file && !files.some(function (f) { return f.name === q.file; })) files.push({ name: q.file, kind: /xlsx$/.test(q.file) ? 'table' : /\/$/.test(q.file) ? 'folder' : 'doc', by: q.by, when: q.time, note: '', mark: q.mark }); });
    var ext = (a.map && a.map.external_people) || [];
    return {
      personal: false, team: m.team || w.name, teamNote: t.note || '', active: t.active,
      channels: m.channels || [t.active], members: w.people.filter(function (p) { return ext.indexOf(p.id) < 0; }).map(function (p) { return p.id; }),
      posts: posts, files: files, tasks: [],
      outside: (t.systems || []).map(function (y) { return y.name; }), notes: notes
    };
  }

  /* Principle bindings for legacy worlds: built from their curated model texts. */
  function legacyPrinciples(w, a, sc) {
    var ppl = w.people.map(function (p) { return p.id; });
    var shared = w.artefacts.filter(function (x) { return x.state === 'shared'; });
    var art = first(shared) || first(w.artefacts);
    var drafts = w.artefacts.filter(function (x) { return x.state === 'personal' || x.state === 'draft'; });
    var pick = first((sc.decision_points || []).map(function (d) { return d.pick && d.pick.label; }).filter(Boolean));
    var M = a.model;
    var or = function (x, y) { return x || y; };
    var base = art ? art.name.replace(/\s+/g, '_') : 'Dokument';
    return {
      chat: {
        problem: or(sc.current_state.frictions[0], w.tension),
        decision: or(pick, 'Entscheid zur Zusammenarbeit'),
        inChat: ppl.slice(0, Math.min(2, ppl.length)), later: ppl.slice(2, 5),
        recommend: or(M.communication.change, M.communication.stay),
        boundary: [M.communication.stay, M.communication.outside].filter(Boolean).join(' ')
      },
      doc: {
        problem: or(sc.current_state.frictions[1], sc.current_state.frictions[0]),
        artefact: art ? art.name : 'Dokument',
        copies: [base + '_v2.docx', base + '_final.docx', base + '_final_kommentiert.docx'],
        editors: art && art.owner && ppl.indexOf(art.owner) >= 0 ? [art.owner].concat(ppl.filter(function (x) { return x !== art.owner; }).slice(0, 2)) : ppl.slice(0, 3),
        drafter: (first(drafts) && ppl.indexOf(first(drafts).owner) >= 0) ? first(drafts).owner : ppl[0],
        draft: first(drafts) ? first(drafts).name : 'Rohentwurf',
        recommend: or(M.documents.change, M.documents.stay),
        boundary: [M.documents.stay, M.documents.outside].filter(Boolean).join(' ')
      },
      tasks: {
        problem: or(sc.current_state.frictions[2], sc.current_state.frictions[0]),
        personal: ppl.slice(0, 2).map(function (id, i) { return { who: id, items: [i ? 'Eigene Vorbereitung' : 'Persönliche Notizen'] }; }),
        shared: (sc.m365_model && sc.m365_model.planner_buckets ? sc.m365_model.planner_buckets.slice(0, 3) : []).map(function (b, i) { return { t: b, who: ppl[i % ppl.length], due: '' }; }),
        recommend: or(M.tasks.change, M.tasks.m365),
        boundary: [M.tasks.stay, M.tasks.m365].filter(Boolean).join(' ')
      }
    };
  }

  /*
   * build(situationId, {variant, names:{team, people:{id:name}}})
   * Returns everything the renderers need, with names resolved.
   */
  function build(id, opts) {
    opts = opts || {};
    var s = situationById(id);
    if (!s) return null;
    var w = worldById(s.world), a = ATLAS[s.world];
    var sc = s.world === LIB.business.id ? w.scenario : w.scenarios.filter(function (x) { return x.id === s.scenario; })[0];
    var variant = s.variants ? (s.variants.filter(function (v) { return v.id === opts.variant; })[0] || s.variants[0]) : null;
    var names = opts.names || {};
    var peopleNames = names.people || {};
    var scene, principles;

    if (s.complete) {
      scene = {
        personal: false, team: variant.team, teamNote: variant.teamNote, active: variant.active,
        channels: variant.channels, members: variant.members,
        posts: s.scene.posts, files: s.scene.files, tasks: s.scene.tasks, outside: s.scene.outside, notes: s.scene.notes
      };
      principles = s.principles;
    } else {
      scene = legacyScene(w, a, sc);
      principles = legacyPrinciples(w, a, sc);
    }

    var people = w.people.map(function (p, i) {
      return { id: p.id, idx: i, original: p.name, name: peopleNames[p.id] || p.name, role: p.role, external: !!p.external || ((a && a.map && a.map.external_people) || []).indexOf(p.id) >= 0, outside: ((a && a.map && a.map.outside) || []).indexOf(p.id) >= 0 || !!p.external };
    });
    var byId = {};
    people.forEach(function (p) { byId[p.id] = p; });
    var team = names.team || scene.team;
    var ctx = { name: function (pid) { return byId[pid] ? byId[pid].name : pid; }, team: team, active: scene.active };

    return {
      id: s.id, complete: !!s.complete, personal: !!s.personal || scene.personal,
      title: s.title, persona: s.persona, friction: s.friction, usecases: s.usecases,
      collection: collectionOf(w),
      world: { id: w.id, name: w.name, tagline: w.tagline, tension: w.tension, size: w.size },
      scenario: { id: sc.id, name: sc.name, trigger: sc.trigger, description: sc.description },
      variant: variant, variants: s.variants || [],
      people: people, person: function (pid) { return byId[pid] || { id: pid, name: pid, role: '' }; },
      team: team, teamOriginal: scene.team,
      scene: scene, principles: principles,
      fill: function (t) { return fill(t, ctx); },
      legacyHref: s.world === LIB.business.id ? null : 'atlas.html#/w/' + s.world
    };
  }

  function worlds() {
    return HE.worlds.concat([LIB.business]).map(function (w) {
      return {
        id: w.id, name: w.name, collection: collectionOf(w), tagline: w.tagline, tension: w.tension, size: w.size,
        label: w.id === LIB.business.id ? 'Abteilung mit Projekt' : (ATLAS[w.id] && ATLAS[w.id].label),
        people: w.people.map(function (p) { return p.name; }),
        situations: LIB.situations.filter(function (s) { return s.world === w.id; }).map(function (s) { return s.id; })
      };
    });
  }

  root.Model = { build: build, worlds: worlds, situationById: situationById, worldById: worldById, fill: fill };
})(typeof window !== 'undefined' ? window : globalThis);
