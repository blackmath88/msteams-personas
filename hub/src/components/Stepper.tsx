import type { ReactNode } from 'react';

/* Step links are real links: every step has its own address and can be shared. */
export function Stepper({ label, steps, current, link }: { label: string; steps: string[]; current: number; link: (index: number, className: string, children: ReactNode) => ReactNode }) {
  return (
    <ol className="steps" aria-label={label}>
      {steps.map((s, i) => (
        <li key={s} style={{ display: 'contents' }}>
          {link(i, i === current ? 'on' : '', <><i aria-hidden="true">{i + 1}</i>{s}</>)}
        </li>
      ))}
    </ol>
  );
}
