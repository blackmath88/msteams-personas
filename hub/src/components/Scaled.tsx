import { useLayoutEffect, useRef, useState } from 'react';
import { APP_SIZE, SLIDE_SIZE, appHtml, slideHtml, type Project } from '../engine';

/*
 * Renderer output is drawn at a fixed design size (like the PNG export) and scaled to the
 * available width, so a screen looks the same here as on a slide. The HTML comes from the
 * engine, which escapes every value; nothing from a URL or a form is inserted here.
 */
function Scaled({ html, width, height, label }: { html: string; width: number; height: number; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / width);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={box} className="scaled" role="img" aria-label={label} style={{ height: Math.round(height * scale) }}>
      <div inert style={{ width, height, transform: `scale(${scale})`, visibility: scale ? 'visible' : 'hidden' }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function Frame({ html, size, label, caption }: { html: string | null; size: { width: number; height: number }; label: string; caption?: string }) {
  return (
    <figure className="shot">
      {html ? <Scaled html={html} width={size.width} height={size.height} label={label} /> : <p className="shot-missing">Diese Ansicht kann der Renderer noch nicht zeichnen.</p>}
      {caption && <figcaption className="cap">{caption}</figcaption>}
    </figure>
  );
}

/** One application window (Teams, Planner, ...) from a scene of a portable project. */
export function AppScreen({ project, scene, marks, label, caption }: { project: Project; scene: string; marks?: boolean; label: string; caption?: string }) {
  return <Frame html={appHtml(project, scene, marks)} size={APP_SIZE} label={label} caption={caption} />;
}

/** A complete slide, composed like the PNG export. Interim: the house views exist only as slides. */
export function SlideView({ project, index, label, caption }: { project: Project; index: number; label: string; caption?: string }) {
  return <Frame html={slideHtml(project, index)} size={SLIDE_SIZE} label={label} caption={caption} />;
}
