/*
 * Bridge to the existing renderers in ../../../src.
 *
 * Those files are plain scripts that attach themselves to `window` (Views, M365, Export,
 * ProjectCore, ...). Importing them here, in the same order as index.html, runs them once
 * and makes the same code that draws the slides available to the hub. Nothing is copied
 * or rewritten: a fix in a renderer shows up in the website, the CLI, the MCP server and here.
 *
 * Not imported on purpose: src/app.css (it resets every element) and the authoring UI.
 */
import '../../../assets/fonts.css';
import '../../../src/m365.css';
import '../../../src/m365-more.css';
import '../../../src/workspace.css';
import '../../../src/collaboration.css';

import '../../../src/views.js';
import '../../../src/m365.js';
import '../../../src/m365-more.js';
import '../../../src/workspace-view.js';
import '../../../src/export.js';
import '../../../src/workspace-core.js';
import '../../../src/workspace-examples.js';
import '../../../src/collaboration-core.js';
import '../../../src/business-catalogue.js';
import '../../../src/research-catalogue.js';
import '../../../src/collaboration-view.js';
import '../../../src/project-core.js';

/** A portable project (format "msteams-personas/project"). The engine validates the details. */
export type Project = {
  meta: { id?: string; title: string; assumptions?: string[] };
  scenes: { id: string; profile: string }[];
  slides: { id: string; scene: string; title?: string }[];
  [key: string]: unknown;
};
type ViewModel = Record<string, unknown>;
type Diagnostic = { code: string; path: string; message: string };

type Engine = {
  ProjectCore: {
    validate(p: unknown): { ok: boolean; errors: Diagnostic[]; warnings: Diagnostic[] };
    compile(p: Project, slideIndex: number): ViewModel | null;
    compileScene(p: Project, sceneId: string): ViewModel | null;
    slidePlan(p: Project, slideIndex: number): { params: Record<string, unknown>; kind: string; meta: unknown } | null;
    capabilities(): { profiles: Record<string, { label: string; renderer: string }> };
    workspaceExample(kind?: string): Project;
    template(): Project;
  };
  M365: { app(vm: ViewModel, renderer: string, options: { annot?: boolean }): string | null; W: number; H: number };
  Export: { compose(vm: ViewModel, params: Record<string, unknown>, kind: string, meta: unknown): string | null; W: number; H: number };
};
const engine = window as unknown as Engine;

export const ProjectCore = engine.ProjectCore;

/** Design size of an application window and of a slide, in CSS pixels. */
export const APP_SIZE = { width: 1440, height: 810 };
export const SLIDE_SIZE = { width: 1920, height: 1080 };

/** HTML of one application window (Teams, Planner, ...) for a scene, or null when it cannot be drawn. */
export function appHtml(project: Project, sceneId: string, marks = false): string | null {
  const scene = project.scenes.find((s) => s.id === sceneId);
  const profile = scene && ProjectCore.capabilities().profiles[scene.profile];
  const vm = scene && ProjectCore.compileScene(project, sceneId);
  if (!profile || !vm) return null;
  return engine.M365.app(vm, profile.renderer, { annot: marks });
}

/** HTML of a complete slide, composed exactly like the PNG export. */
export function slideHtml(project: Project, slideIndex: number): string | null {
  const plan = ProjectCore.slidePlan(project, slideIndex);
  const vm = ProjectCore.compile(project, slideIndex);
  if (!plan || !vm) return null;
  return engine.Export.compose(vm, plan.params, plan.kind, plan.meta);
}
