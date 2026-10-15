// Page behavior for join.html: logo morph, pause button, seasonal banner.
// Copied unchanged from the design canvas; run by ../dc-lite.js.

class Component extends DCLogic {
  state = { on: false, motion: null };

  // Pause/play for every looping animation (WCAG 2.2.2). The choice is remembered
  // across pages; with no saved choice, the system's reduced-motion setting decides.
  motionPref() {
    let saved = null;
    try { saved = window.localStorage.getItem('olmlab-motion'); } catch (e) {}
    if (saved === 'paused' || saved === 'on') return saved;
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduce ? 'paused' : 'on';
  }
  motionNow() {
    const st = this.state || {};
    return st.motion || this.motionPref();
  }
  toggleMotion() {
    const next = this.motionNow() === 'paused' ? 'on' : 'paused';
    try { window.localStorage.setItem('olmlab-motion', next); } catch (e) {}
    this.setState({ motion: next });
  }
  renderVals() {
    const paused = this.motionNow() === 'paused';
    return Object.assign({}, this.baseVals(), {
      motionClass: paused ? 'motion-paused' : 'motion-on',
      motionPaused: paused,
      motionRunning: !paused,
      toggleMotion: () => this.toggleMotion()
    });
  }
  componentDidMount() {
    this._onStorage = (e) => { if (e && e.key === 'olmlab-motion') this.setState({ motion: this.motionPref() }); };
    try { window.addEventListener('storage', this._onStorage); } catch (e) {}
    this._t = setTimeout(() => this.setState({ on: true }), 150);
  }
  componentWillUnmount() {
    try { window.removeEventListener('storage', this._onStorage); } catch (e) {}
    clearTimeout(this._t);
  }
  baseVals() {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const half = reduce ? 0 : Math.round(Number(this.props.morphMs ?? 500) / 2);
    const on = reduce || !!(this.state && this.state.on);
    const pick = this.props.season ?? 'Auto (by date)';
    const month = new Date().getMonth();
    const season = pick !== 'Auto (by date)' ? pick : (month === 11 || month <= 1 ? 'Winter' : month >= 8 ? 'Fall' : 'Spring/summer');
    return {
      isWinter: season === 'Winter',
      isNotWinter: season !== 'Winter',
      plainOp: on ? 0 : 1,
      mOp: on ? 1 : 0,
      morphDur: half,
      tongueOp: on ? 1 : 0,
      tongueS: on ? 1 : 0,
      tongueDelay: on && !reduce ? half + 80 : 0,
      tongueDur: reduce ? 0 : (on ? 380 : 120),
    };
  }
}

DCBoot(Component, {"season": "Auto (by date)", "morphMs": 500});
