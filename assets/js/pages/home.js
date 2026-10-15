// Page behavior for index.html: logo morph, pause button, slideshow, seasonal banner.
// Copied unchanged from the design canvas; run by ../dc-lite.js.

class Component extends DCLogic {
  state = { shown: 'plain', motion: null, slide: 0, hold: false, slidesOn: null };

  // Pause/play for every looping animation (WCAG 2.2.2). The choice is remembered
  // across pages; with no saved choice, the system's reduced-motion setting decides.
  goSlide(i) {
    this._lastNav = Date.now();
    this.setState({ slide: i });
  }
  slidesRolling() {
    const st = this.state || {};
    if (st.slidesOn === true || st.slidesOn === false) return st.slidesOn;
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !reduce;
  }
  tickSlide() {
    const st = this.state || {};
    if (st.hold || !this.slidesRolling()) return;
    if (this._lastNav && Date.now() - this._lastNav < 5000) return;
    this.setState({ slide: ((st.slide || 0) + 1) % 5 });
  }
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
  dur() {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduce ? 0 : Number(this.props.morphMs ?? 500);
  }
  base() {
    return this.props.homeM ?? 'villi';
  }
  go(key) {
    const st = this.state || {};
    if (key === st.shown) return;
    this.setState({ shown: key });
  }
  componentDidMount() {
    this._slides = setInterval(() => this.tickSlide(), 6000);
    this._onStorage = (e) => { if (e && e.key === 'olmlab-motion') this.setState({ motion: this.motionPref() }); };
    try { window.addEventListener('storage', this._onStorage); } catch (e) {}
    this._m = setTimeout(() => this.go(this.base()), 150);
  }
  componentDidUpdate(prevProps) {
    if (prevProps && prevProps.homeM !== this.props.homeM) this.go(this.base());
  }
  componentWillUnmount() {
    clearInterval(this._slides);
    try { window.removeEventListener('storage', this._onStorage); } catch (e) {}
    clearTimeout(this._m);
  }
  baseVals() {
    const shown = (this.state && this.state.shown) || 'plain';
    const d = this.dur();
    const on = (k) => shown === k;
    const go = (k) => () => this.go(k);
    const fOn = on('flatirons');
    const pick = this.props.season ?? 'Auto (by date)';
    const month = new Date().getMonth();
    const season = pick !== 'Auto (by date)' ? pick : (month === 11 || month <= 1 ? 'Winter' : month >= 8 ? 'Fall' : 'Spring/summer');
    const vals = {
      isSummer: season === 'Spring/summer',
      isFall: season === 'Fall',
      isWinter: season === 'Winter',
      morphDur: d,
      tongueOp: fOn ? 1 : 0,
      tongueS: fOn ? 1 : 0,
      tongueDelay: fOn && d > 0 ? Math.round(d * 0.75) : 0,
      tongueDur: d === 0 ? 0 : (fOn ? 380 : 120),
      showBars: go('bars'),
      showTree: go('tree'),
      showVolcano: go('volcano'),
      showPileup: go('pileup'),
      showFlatirons: go('flatirons'),
      showVilli: go('villi'),
      showHelix: go('helix'),
      showMatrix: go('matrix'),
      reset: () => this.go(this.base())
    };
    // the m that is showing is sharp and full size; the others wait slightly shrunk and blurred,
    // so swapping between them reads as one shape melting into the next
    for (const [k, K] of [['plain','Plain'],['bars','Bars'],['tree','Tree'],['volcano','Volcano'],['pileup','Pileup'],['flatirons','Flatirons'],['villi','Villi'],['helix','Helix'],['matrix','Matrix']]) {
      vals['op' + K] = on(k) ? 1 : 0;
      vals['bl' + K] = on(k) ? 0 : 6;
      vals['sc' + K] = on(k) ? 1 : 0.94;
    }
    const sl = (this.state && this.state.slide) || 0;
    const rolling = this.slidesRolling();
    for (let i = 0; i < 5; i++) {
      vals['slideOp' + i] = i === sl ? 1 : 0;
      vals['slideHidden' + i] = i === sl ? 'false' : 'true';
      vals['slideVis' + i] = i === sl ? 'visible' : 'hidden';
      vals['slideCur' + i] = i === sl ? 'true' : 'false';
      vals['slideDot' + i] = i === sl ? '#000000' : 'transparent';
      vals['goSlide' + i] = () => this.goSlide(i);
    }
    vals.slidesRunning = rolling;
    vals.slidesPaused = !rolling;
    vals.slideLive = rolling ? 'off' : 'polite';
    vals.toggleSlides = () => this.setState({ slidesOn: !this.slidesRolling() });
    vals.holdSlides = () => this.setState({ hold: true });
    vals.releaseSlides = () => this.setState({ hold: false });
    return vals;
  }
}

DCBoot(Component, {"homeM": "villi", "season": "Auto (by date)", "morphMs": 500});
