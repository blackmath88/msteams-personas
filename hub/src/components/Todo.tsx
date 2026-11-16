import type { ReactNode } from 'react';

/*
 * A visible placeholder where content is still missing. Kept in the page on purpose while the
 * hub is being filled, so gaps are found by reading it. Every use is listed in hub/CONTENT-TODO.md.
 */
export function Todo({ children }: { children: ReactNode }) {
  return <p className="todo"><b>Inhalt fehlt</b>{children}</p>;
}
/** Marks wording that was drafted during the build and still needs a trainer's review. */
export function Draft() {
  return <span className="draft" title="Beim Aufbau formuliert, noch nicht von einer Trainerin oder einem Trainer geprüft">Entwurf</span>;
}
