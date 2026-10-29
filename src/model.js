/*
 * Thin v3 adapter: builds the view model the library, Szene, Prinzip and Präsentieren share.
 * Legacy HE_WORLDS / HE_ATLAS content is read, never mutated. Customised names live in a
 * separate overrides object, so curated originals stay intact.
 */
(function (root) {
  var HE = root.HE_WORLDS, ATLAS = root.HE_ATLAS, LIB = root.LIB;

  function worldById(id) {
    var bw = (LIB.businessWorlds || [LIB.business]).filter(function (w) { return w.id === id; })[0];
    if (bw) return bw;
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
    var fr = sc.current_state.frictions;
    /* Match frictions and decisions to each principle by keyword/module rather than by position. */
    var about = function (re) { return first(fr.filter(function (t) { return re.test(t); })); };
    var dpFor = function (mods) {
      var d = first((sc.decision_points || []).filter(function (x) { return x.pick && x.modules.some(function (m) { return mods.indexOf(m) >= 0; }); }));
      return d && d.pick.label;
    };
    /* Worlds with several scenarios share one atlas model; bind to the scenario's own decision instead. */
    var multi = w.scenarios.length > 1;
    var dpIn = function (order) {
      for (var i = 0; i < order.length; i++) {
        var d = first((sc.decision_points || []).filter(function (x) { return x.pick && x.modules.indexOf(order[i]) >= 0; }));
        if (d) return d;
      }
      return null;
    };
    var why = function (d) { var t = d && d.pick.why.replace(/^Unsere Wahl für diesen Kontext:\s*/, ''); return t && t.charAt(0).toUpperCase() + t.slice(1); };
    var own = multi ? { chat: dpIn(['communication', 'documents', 'teams']), doc: dpIn(['documents', 'teams', 'loop']), tasks: dpIn(['planner']) } : {};
    var pick = dpFor(['communication']) || dpFor(['teams']) || first((sc.decision_points || []).map(function (d) { return d.pick && d.pick.label; }).filter(Boolean));
    var M = a.model;
    var or = function (x, y) { return x || y; };
    var base = art ? art.name.replace(/\s+/g, '_') : 'Dokument';
    return {
      chat: {
        problem: or(about(/Chat|Mail|Entscheid|Absprache|Rückfrage|Verteiler/), w.tension),
        decision: own.chat ? own.chat.pick.label : [pick, M.communication.change].filter(Boolean).sort(function (x, y) { return x.length - y.length; })[0] || 'Entscheid zur Zusammenarbeit',
        inChat: ppl.slice(0, Math.min(2, ppl.length)), later: ppl.slice(2, 5),
        recommend: own.chat ? why(own.chat) : or(M.communication.change, M.communication.stay),
        boundary: [M.communication.stay, M.communication.outside].filter(Boolean).join(' ')
      },
      doc: {
        problem: or(about(/Fassung|Kopie|Anhang|Entwurf|OneDrive|Version|Ordner/), fr[0]),
        artefact: art ? art.name : 'Dokument',
        copies: [base + '_v2.docx', base + '_final.docx', base + '_final_kommentiert.docx'],
        editors: art && art.owner && ppl.indexOf(art.owner) >= 0 ? [art.owner].concat(ppl.filter(function (x) { return x !== art.owner; }).slice(0, 2)) : ppl.slice(0, 3),
        drafter: (first(drafts) && ppl.indexOf(first(drafts).owner) >= 0) ? first(drafts).owner : ppl[0],
        draft: first(drafts) ? first(drafts).name : 'Rohentwurf',
        recommend: own.doc ? own.doc.pick.label + '. ' + why(own.doc) : or(M.documents.change, M.documents.stay),
        boundary: [M.documents.stay, M.documents.outside].filter(Boolean).join(' ')
      },
      tasks: {
        problem: or(about(/Pendenz|Aufgabe|To-Do|To Do|erledigt|Frist/i), w.tension),
        personal: w.people.slice(0, 2).map(function (p, i) { return { who: p.id, items: [(p.stays_personal && p.stays_personal[0]) || (i ? 'Eigene Vorbereitung' : 'Persönliche Notizen')] }; }),
        lean: M.tasks.stay,
        shared: (sc.m365_model && sc.m365_model.planner_buckets ? sc.m365_model.planner_buckets.slice(0, 3) : []).map(function (b, i) { return { t: b, who: ppl[i % ppl.length], due: '' }; }),
        recommend: own.tasks ? own.tasks.pick.label + '. ' + why(own.tasks) : or(M.tasks.change, M.tasks.m365),
        boundary: [M.tasks.stay, M.tasks.m365].filter(Boolean).join(' ')
      }
    };
  }

  /*
   * Story: canonical shared document plus its travelling copies (names from principles.doc.copies),
   * so Outlook, Explorer, Teams, SharePoint and Prinzip refer to the same file identities.
   */
  function storyFor(s, scene, principles, content, ctx) {
    var st = LIB.stories && LIB.stories[s.id];
    if (!st || scene.personal) return null;
    var canonFile = scene.files.filter(function (f) { return f.name === st.canonical; })[0];
    if (!canonFile) return null;
    var docName = (content.docName || '').trim() || st.canonical;
    var copies = (principles.doc.copies || []).map(function (c, i) {
      var name = typeof c === 'string' ? c : c.n, m = st.mails[i] || st.mails[0];
      return { id: 'copy-' + (i + 1), name: name, copyOf: 'canonical', by: m.by, time: m.time, size: m.size, mail: i };
    });
    var mails = st.mails.map(function (m, i) {
      var first = i === 0;
      return {
        id: 'mail-' + (i + 1), by: m.by, to: m.to, time: m.time,
        subject: first && content.subject ? content.subject : m.subject,
        body: fill(first && content.body ? content.body : m.body, ctx),
        attachment: copies[i] || null
      };
    });
    return {
      viewer: st.viewer,
      doc: { id: 'canonical', original: st.canonical, name: docName, by: canonFile.by, when: canonFile.when },
      copies: copies, mails: mails, redownload: st.redownload,
      otherMail: st.otherMail
    };
  }

  /*
   * build(situationId, {variant, names:{team, people:{id:name}}, content:{docName, subject, body, postTitle, postText}})
   * Returns everything the renderers need, with names resolved.
   */
  function build(id, opts) {
    opts = opts || {};
    var s = situationById(id);
    if (!s) return null;
    var w = worldById(s.world), a = ATLAS[s.world];
    var sc = w.collection === 'business' ? w.scenario : w.scenarios.filter(function (x) { return x.id === s.scenario; })[0];
    var variant = s.variants ? (s.variants.filter(function (v) { return v.id === opts.variant; })[0] || s.variants[0]) : null;
    var names = opts.names || {};
    var peopleNames = names.people || {};
    var scene, principles;

    if (s.complete && s.personalScene) {
      var ps = s.personalScene, me = w.people[0].id;
      scene = {
        personal: true, team: w.people[0].name, teamNote: ps.note, active: 'Dateien', channels: [], members: [me], posts: [],
        files: ps.files.map(function (f) { return { name: f.name, kind: f.kind, by: me, when: '', note: f.note, mark: f.mark }; }),
        tasks: ps.todo.map(function (x) { return { title: x, owner: me, due: '', bucket: 'To Do', done: false }; }),
        outside: ps.outside || [], notes: ps.notes || {}
      };
      principles = s.principles;
    } else if (s.complete) {
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
      return { id: p.id, idx: i, original: p.name, name: peopleNames[p.id] || p.name, role: p.role, external: !!p.external || ((a && a.map && a.map.external_people) || []).indexOf(p.id) >= 0, outside: ((a && a.map && a.map.outside) || []).indexOf(p.id) >= 0 || !!p.outside };
    });
    var byId = {};
    people.forEach(function (p) { byId[p.id] = p; });
    var team = names.team || scene.team;
    var ctx = { name: function (pid) { return byId[pid] ? byId[pid].name : pid; }, team: team, active: scene.active };
    var content = opts.content || {};
    /* Task titles edited for the slide: same task identity in Teams, Planner, To Do and Prinzip. */
    var taskEdits = content.tasks || {};
    if (Object.keys(taskEdits).some(function (k) { return taskEdits[k]; })) {
      var renamed = {};
      scene = Object.assign({}, scene, { tasks: scene.tasks.map(function (t, i) {
        var nt = (taskEdits[i] || '').trim();
        if (!nt) return t;
        renamed[t.title] = nt;
        return Object.assign({}, t, { title: nt });
      }) });
      if (principles.tasks && principles.tasks.shared) principles = Object.assign({}, principles, { tasks: Object.assign({}, principles.tasks, {
        shared: principles.tasks.shared.map(function (x) { return renamed[x.t] ? Object.assign({}, x, { t: renamed[x.t] }) : x; })
      }) });
    }
    var postEdits = content.posts || {};
    if (Object.keys(postEdits).length) scene = Object.assign({}, scene, { posts: scene.posts.map(function (q, i) {
      var pe = postEdits[i]; if (!pe) return q;
      return Object.assign({}, q, { title: (pe.title || '').trim() || q.title, text: (pe.text || '').trim() || q.text });
    }) });
    var story = storyFor(s, scene, principles, content, ctx);
    if (story) {
      /* Apply targeted slide-content overrides to copies, never to the curated originals. */
      var canon = story.doc.original, docName = story.doc.name;
      scene = Object.assign({}, scene, {
        files: scene.files.map(function (f) { return f.name === canon ? Object.assign({}, f, { name: docName, canonical: true }) : f; }),
        posts: scene.posts.map(function (q) {
          if (q.file !== canon) return q;
          return Object.assign({}, q, { file: docName, title: content.postTitle || q.title, text: content.postText || q.text, canonical: true });
        })
      });
      if (content.docName && principles.doc) principles = Object.assign({}, principles, { doc: Object.assign({}, principles.doc, { artefact: docName.replace(/\.[a-z0-9]+$/i, '') }) });
    }

    return {
      id: s.id, complete: !!s.complete, personal: !!s.personal || scene.personal,
      title: s.title, persona: s.persona, friction: s.friction, usecases: s.usecases,
      collection: collectionOf(w),
      world: { id: w.id, name: w.name, tagline: w.tagline, tension: w.tension, size: w.size },
      scenario: { id: sc.id, name: sc.name, trigger: sc.trigger, description: sc.description },
      variant: variant, variants: s.variants || [],
      people: people, person: function (pid) { return byId[pid] || { id: pid, name: pid, role: '' }; },
      team: team, teamOriginal: scene.team,
      scene: scene, principles: principles, story: story,
      tools: toolsFor(s, scene, story),
      chat: chatFor(s, principles, content, ctx), todo: todoFor(s, scene, principles, story, people), ai: aiFor(s, ctx),
      fill: function (t) { return fill(t, ctx); },
      legacyHref: w.collection === 'business' ? null : 'atlas.html#/w/' + s.world
    };
  }

  function toolsFor(s, scene, story) {
    if (scene.personal) return ['onedrive', 'todo'];
    var t = ['teams', 'chat'];
    if (scene.tasks.length) t.push('planner', 'todo');
    if (story) t.push('outlook', 'explorer', 'sharepoint');
    if (LIB.ai && LIB.ai[s.id]) t.push('recap');
    return t;
  }
  /* 1:1 chat: curated where available, otherwise built from the «Chat oder Kanal?» binding. */
  function chatFor(s, principles, content, ctx) {
    var c = LIB.chats && LIB.chats[s.id], b = principles.chat;
    var edits = content.chat || {};
    if (!c) {
      if (!b || !b.inChat || b.inChat.length < 2) return null;
      var a = b.inChat[0], z = b.inChat[1];
      c = { viewer: a, partner: z, generated: true, others: [], messages: [
        { by: z, time: '09:02', text: 'Hast du kurz Zeit? Es geht um ' + ctx.team + '.' },
        { by: a, time: '09:03', text: 'Klar, worum geht es?' },
        { by: z, time: '09:05', text: 'Wollen wir es so machen: ' + b.decision + '?' },
        { by: a, time: '09:07', text: 'Ja, einverstanden: ' + b.decision + '.', mark: 1, decision: true }
      ] };
    }
    return {
      viewer: c.viewer, partner: c.partner, generated: !!c.generated, others: c.others || [],
      later: (b && b.later) || [], laterLabel: b && b.laterLabel,
      messages: c.messages.map(function (m, i) { return Object.assign({}, m, { text: (edits[i] || '').trim() || fill(m.text, ctx) }); })
    };
  }
  function todoFor(s, scene, principles, story, people) {
    var d = LIB.todos && LIB.todos[s.id], ids = people.map(function (p) { return p.id; });
    if (scene.personal) return { viewer: people[0].id, personal: scene.tasks.map(function (t) { return t.title; }), assigned: [], plan: null };
    if (!scene.tasks.length) return null;
    var tp = principles.tasks || {};
    var viewer = d ? d.viewer : (story && story.viewer) || (tp.personal && tp.personal[0] && tp.personal[0].who) || ids[0];
    var mine = (tp.personal || []).filter(function (x) { return x.who === viewer; })[0];
    return {
      viewer: viewer,
      personal: d ? d.personal : (mine ? mine.items : []),
      assigned: scene.tasks.filter(function (t) { return t.owner === viewer; }),
      plan: true
    };
  }
  function aiFor(s, ctx) {
    var a = LIB.ai && LIB.ai[s.id];
    if (!a) return null;
    return Object.assign({}, a, { suggestions: a.suggestions.map(function (x) { return Object.assign({}, x, { reason: x.reason ? fill(x.reason, ctx) : '' }); }) });
  }

  function worlds() {
    return HE.worlds.concat(LIB.businessWorlds || [LIB.business]).map(function (w) {
      return {
        id: w.id, name: w.name, collection: collectionOf(w), tagline: w.tagline, tension: w.tension, size: w.size,
        label: w.id === LIB.business.id ? 'Abteilung mit Projekt' : w.label || (ATLAS[w.id] && ATLAS[w.id].label),
        people: w.people.map(function (p) { return p.name; }),
        situations: LIB.situations.filter(function (s) { return s.world === w.id; }).map(function (s) { return s.id; })
      };
    });
  }

  root.Model = { build: build, worlds: worlds, situationById: situationById, worldById: worldById, fill: fill };
})(typeof window !== 'undefined' ? window : globalThis);
