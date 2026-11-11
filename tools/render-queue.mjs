// One browser at a time, one short-lived waiter. Waiting must not consume the tunnel deadline.
export class RenderQueue {
  constructor({ maxWaiting = 1, waitMs = 10_000 } = {}) {
    this.maxWaiting = maxWaiting; this.waitMs = waitMs;
    this.active = 0; this.waiters = []; this.draining = false;
  }
  status() { return { active: this.active, queued: this.waiters.length, draining: this.draining }; }
  async run(fn) {
    if (this.draining) throw new Error('renderer_draining: retry as a new request after maintenance');
    if (this.active) {
      if (this.waiters.length >= this.maxWaiting) throw new Error('renderer_busy: bounded queue is full');
      await new Promise((resolve, reject) => {
        const waiter = { resolve, timer: setTimeout(() => {
          this.waiters = this.waiters.filter(w => w !== waiter);
          reject(new Error('queue_timeout: render has not started'));
        }, this.waitMs) };
        this.waiters.push(waiter);
      });
    } else this.active = 1;
    try { return await fn(); }
    finally {
      const next = this.waiters.shift();
      if (next) { clearTimeout(next.timer); next.resolve(); }
      else this.active = 0;
    }
  }
}
