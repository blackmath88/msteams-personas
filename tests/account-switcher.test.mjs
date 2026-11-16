import { test } from 'node:test';
import assert from 'node:assert/strict';
import PC from '../src/project-core.js';
import View from '../src/account-switcher-view.js';

test('three scenes distinguish home organisation, guest organisation and another account', () => {
  const p = PC.accountSwitcherExample();
  assert.equal(PC.validate(p).ok, true);
  const model = id => PC.compileScene(p, id).accountSwitcher;
  assert.equal(model('uni-basel').organisation.role, 'home');
  assert.equal(model('als-gast').organisation.role, 'guest');
  assert.equal(model('uni-basel').account.email, model('als-gast').account.email);
  assert.notEqual(model('als-gast').account.id, model('privates-konto').account.id);
  assert.equal(model('uni-basel').highlightOrganisation, 'partner');

  const components = PC.validateComponents(p, p.scenes.map(scene => ({ scene: scene.id })));
  assert.equal(components.ok, true);
  assert(components.components.every(c => c.type === 'teams.account-switcher' && c.view === 'menu'));
  assert.equal(PC.slidePlan(p, 0).kind, 'account-switcher');

  const home = View.render(model('uni-basel'));
  const guest = View.render(model('als-gast'));
  assert.equal(home.height, guest.height);
  assert.match(home.svg, /data-entity="partner" data-entity-kind="organisation"/);
  assert.match(guest.svg, /Partneruniversität B · Gast/);
  assert.match(guest.svg, /data-entity="privat-konto" data-entity-kind="account"/);
});

test('validates the organisation against its account and restricts addresses to example domains', () => {
  const p = PC.accountSwitcherExample();
  p.capabilityVersion = 6;
  p.scenes[0].organisation = 'persoenlich';
  p.teamsAccounts[0].email = 'somebody@unibas.ch';
  const paths = PC.validate(p).errors.map(error => error.path);
  assert(paths.includes('scenes[0].profile'));
  assert(paths.includes('scenes[0].organisation'));
  assert(paths.includes('teamsAccounts[0].email'));
});

test('escapes authored labels in the exported markup', () => {
  const p = PC.accountSwitcherExample();
  p.teamsAccounts[0].name = '<script> & Name';
  const { svg } = View.render(PC.compileScene(p, 'uni-basel').accountSwitcher);
  assert.match(svg, /&lt;script&gt; &amp; Name/);
  assert.doesNotMatch(svg, /<script>/);
});
