// src/components/Landing/LandingPage.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    root.classList.add('js');

    const KEY = 'chorus-theme';
    const applyTheme = (theme: string) => {
      root.setAttribute('data-theme', theme);
      localStorage.setItem(KEY, theme);
      const btn = root.querySelector('#themeToggle') as HTMLButtonElement | null;
      if (btn) {
        btn.setAttribute('aria-pressed', theme === 'light');
        btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      }
    };

    const saved = localStorage.getItem(KEY);
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(saved || (prefersLight ? 'light' : 'dark'));

    const themeBtn = root.querySelector('#themeToggle') as HTMLButtonElement | null;
    themeBtn?.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });

    const faqButtons = root.querySelectorAll('.faq-q');
    const faqClickHandlers: Array<() => void> = [];
    faqButtons.forEach((btn) => {
      const handler = () => {
        const item = btn.parentElement!;
        const wasOpen = item.classList.contains('open');
        root.querySelectorAll('.faq-item').forEach((i) => {
          i.classList.remove('open');
          i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      };
      btn.addEventListener('click', handler);
      faqClickHandlers.push(handler);
    });

    const revealIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            revealIO.unobserve(en.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    root.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

    const revealTimer = setTimeout(() => {
      root.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
          el.classList.add('in');
        }
      });
    }, 800);

    const countIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target as HTMLElement;
          countIO.unobserve(el);
          const to = +(el.dataset.to || '0');
          const dur = 1200;
          const t0 = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(to * e).toString();
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }),
      { threshold: 0.5 }
    );
    root.querySelectorAll('.count').forEach((el) => countIO.observe(el));

    const btt = root.querySelector('#backToTop') as HTMLButtonElement | null;
    const scrollHandler = () => btt?.classList.toggle('visible', window.scrollY > 400);
    window.addEventListener('scroll', scrollHandler, { passive: true });
    btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const ctaButtons = root.querySelectorAll('a[href="https://chorus-ai.asilvainnoovations.com"], a[href="https://app.chorus.ai"]');
    const ctaHandler = (e: Event) => {
      e.preventDefault();
      navigate('/chat');
    };
    ctaButtons.forEach((btn) => btn.addEventListener('click', ctaHandler));

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      revealIO.disconnect();
      countIO.disconnect();
      clearTimeout(revealTimer);
    };
  }, [navigate]);

  return (
    <div ref={containerRef} className="chorus-landing-root">
      <style>{`
        .chorus-landing-root {
          --navy:#f4f6fb; --navy-2:#eef1f8; --card:#ffffff;
          --blue:#0057c2; --sky:#0069a8; --gold:#8a6d00; --green:#0f7d51; --violet:#5b34c9; --red:#c62828;
          --link:#0052cc; --link-hover:#003d99;
          --text:#0d1224; --text-2:#2b3350; --text-3:rgba(20,26,46,.72);
          --glass:linear-gradient(135deg, rgba(10,20,60,.06), rgba(10,20,60,.025));
          --glass-strong:linear-gradient(135deg, rgba(255,255,255,.94), rgba(240,244,252,.9));
          --line:rgba(10,20,60,.16); --line-gold:rgba(140,110,0,.4); --divider:rgba(10,20,60,.12);
          --radius:14px;
          --accent:#0069a8; --accent-soft:rgba(0,105,168,.12); --on-gold:#ffffff;
          --header-bg:rgba(244,246,251,.9); --header-border:rgba(0,102,255,.3);
          --footer-bg:rgba(255,255,255,.94); --footer-border:rgba(0,102,255,.25);
          --input-bg:rgba(255,255,255,.85); --pill-bg:rgba(90,110,160,.1); --pill-bg-hover:rgba(90,110,160,.18);
          --font-display:'Montserrat', system-ui, sans-serif;
          --font-body:'Poppins', system-ui, sans-serif;
          --font-cond:'Roboto Condensed', system-ui, sans-serif;
          --font-mono:'JetBrains Mono', ui-monospace, monospace;
          --shadow-1:0 8px 32px rgba(20,30,60,.10), inset 0 1px 0 rgba(255,255,255,.6);
          --shadow-2:0 18px 48px rgba(20,30,60,.14), 0 6px 18px rgba(0,102,255,.12);
          --ease:cubic-bezier(.22,.8,.28,1);
          --body-bg:radial-gradient(1200px 600px at 85% -5%, rgba(0,102,255,.08), transparent 60%), radial-gradient(900px 500px at -10% 30%, rgba(0,191,255,.06), transparent 55%), linear-gradient(160deg, #f4f6fb 0%, #eef1fb 48%, #e9ecf7 100%);
        }
        .chorus-landing-root[data-theme="dark"] {
          --navy:#0a0e27; --navy-2:#0d1224; --card:#1a1f3a;
          --blue:#0066FF; --sky:#00BFFF; --gold:#FFD700; --green:#34D399; --violet:#A78BFA; --red:#F87171;
          --link:#4db8ff; --link-hover:#8ad4ff;
          --text:#ffffff; --text-2:#e0e6ed; --text-3:rgba(224,230,237,.62);
          --glass:linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.03));
          --glass-strong:linear-gradient(135deg, rgba(10,20,60,.62), rgba(10,14,39,.78));
          --line:rgba(255,255,255,.13); --line-gold:rgba(255,215,0,.28); --divider:rgba(255,255,255,.09);
          --accent:#00BFFF; --accent-soft:rgba(0,191,255,.14); --on-gold:#0a0e27;
          --header-bg:rgba(10,14,39,.86); --header-border:rgba(0,102,255,.45);
          --footer-bg:rgba(6,9,24,.96); --footer-border:rgba(0,102,255,.4);
          --input-bg:rgba(10,16,42,.7); --pill-bg:rgba(255,255,255,.06); --pill-bg-hover:rgba(255,255,255,.12);
          --shadow-1:0 8px 32px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.16);
          --shadow-2:0 18px 48px rgba(0,0,0,.55), 0 6px 18px rgba(0,102,255,.25);
          --body-bg:radial-gradient(1200px 600px at 85% -5%, rgba(0,102,255,.20), transparent 60%), radial-gradient(900px 500px at -10% 30%, rgba(0,191,255,.10), transparent 55%), linear-gradient(160deg, #0a0e27 0%, #0b1030 48%, #070b1d 100%);
        }
        .chorus-landing-root, .chorus-landing-root * { margin:0; padding:0; box-sizing:border-box; }
        .chorus-landing-root { font-family:var(--font-body); font-weight:400; line-height:1.65; font-size:1rem; color:var(--text); background:var(--body-bg); background-attachment:fixed; min-height:100vh; overflow-x:hidden; position:relative; }
        .chorus-landing-root img, .chorus-landing-root svg { max-width:100%; display:block; }
        .chorus-landing-root h1, .chorus-landing-root h2, .chorus-landing-root h3, .chorus-landing-root h4 { font-family:var(--font-display); line-height:1.15; letter-spacing:-.01em; }
        .chorus-landing-root a { color:var(--sky); }
        .chorus-landing-root button { font-family:inherit; }
        .chorus-landing-root ::selection { background:rgba(255,215,0,.35); color:#fff; }
        .chorus-landing-root ::-webkit-scrollbar { width:9px; height:9px; }
        .chorus-landing-root ::-webkit-scrollbar-track { background:transparent; }
        .chorus-landing-root ::-webkit-scrollbar-thumb { background:rgba(100,140,200,.35); border-radius:6px; }
        .chorus-landing-root :focus-visible { outline:3px solid var(--gold); outline-offset:2px; border-radius:4px; }

        .chorus-landing-root .wrap { width:100%; max-width:1280px; margin:0 auto; padding:0 clamp(1rem,4vw,2.5rem); }
        .chorus-landing-root .section { padding:clamp(3.5rem,8vw,6rem) 0; position:relative; }
        .chorus-landing-root .section-alt { background:linear-gradient(180deg, var(--navy-2) 0%, transparent 100%); opacity:.97; border-block:1px solid var(--divider); }
        .chorus-landing-root .kicker { font-family:var(--font-cond); font-size:.8rem; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--accent); margin-bottom:.9rem; display:flex; align-items:center; gap:.7rem; justify-content:center; }
        .chorus-landing-root .kicker::before, .chorus-landing-root .kicker::after { content:''; height:1px; width:34px; background:linear-gradient(90deg,transparent,var(--accent)); }
        .chorus-landing-root .kicker::after { transform:scaleX(-1); }
        .chorus-landing-root .section-title { font-size:clamp(1.7rem,4.6vw,2.6rem); font-weight:800; text-align:center; margin-bottom:.9rem; }
        .chorus-landing-root .section-title .hl, .chorus-landing-root .grad-text { background:linear-gradient(92deg, var(--sky) 0%, var(--blue) 45%, var(--gold) 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .chorus-landing-root .section-sub { text-align:center; color:var(--text-3); max-width:680px; margin:0 auto clamp(2rem,5vw,3.2rem); font-weight:300; font-size:clamp(.95rem,2.4vw,1.05rem); }

        .chorus-landing-root .glass { background:var(--glass); border:1px solid var(--line); backdrop-filter:blur(18px) saturate(160%); -webkit-backdrop-filter:blur(18px) saturate(160%); box-shadow:var(--shadow-1); }
        .chorus-landing-root .glass-strong { background:var(--glass-strong); border:1px solid var(--line); backdrop-filter:blur(24px) saturate(180%); -webkit-backdrop-filter:blur(24px) saturate(180%); box-shadow:var(--shadow-1); }
        .chorus-landing-root .glass-gold { background:linear-gradient(135deg, rgba(255,215,0,.14), rgba(255,215,0,.04)); border:1px solid var(--line-gold); backdrop-filter:blur(14px); }

        .chorus-landing-root .btn { display:inline-flex; align-items:center; justify-content:center; gap:.55rem; font-family:var(--font-display); font-weight:700; font-size:.92rem; letter-spacing:.03em; padding:.85rem 1.7rem; border-radius:999px; border:2px solid transparent; cursor:pointer; text-decoration:none; transition:transform .25s var(--ease), box-shadow .25s, background .25s, color .25s; position:relative; overflow:hidden; min-height:48px; }
        .chorus-landing-root .btn svg { width:17px; height:17px; flex:none; }
        .chorus-landing-root .btn-primary { background:linear-gradient(135deg, var(--blue), var(--sky)); color:#fff; box-shadow:0 8px 24px rgba(0,102,255,.35); }
        .chorus-landing-root .btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg, var(--sky), var(--gold)); opacity:0; transition:opacity .3s; }
        .chorus-landing-root .btn-primary span, .chorus-landing-root .btn-primary svg { position:relative; z-index:1; }
        .chorus-landing-root .btn-primary:hover::after { opacity:1; }
        .chorus-landing-root .btn-primary:hover { transform:translateY(-3px); box-shadow:0 14px 34px rgba(0,191,255,.45); }
        .chorus-landing-root .btn-gold { background:transparent; color:var(--gold); border-color:var(--gold); }
        .chorus-landing-root .btn-gold:hover { background:var(--gold); color:var(--on-gold); transform:translateY(-3px); box-shadow:0 12px 30px rgba(255,215,0,.35); }
        .chorus-landing-root .btn-ghost { background:var(--pill-bg); color:var(--text); border-color:var(--line); }
        .chorus-landing-root .btn-ghost:hover { background:var(--pill-bg-hover); transform:translateY(-2px); }

        .chorus-landing-root .chip { display:inline-flex; align-items:center; gap:.45rem; padding:.42rem 1rem; border-radius:999px; font-family:var(--font-cond); font-size:.82rem; font-weight:600; letter-spacing:.06em; border:1px solid var(--line); background:var(--pill-bg); color:var(--text-2); }

        .chorus-landing-root .site-header { position:sticky; top:0; z-index:1000; background:var(--header-bg); backdrop-filter:blur(20px) saturate(180%); -webkit-backdrop-filter:blur(20px) saturate(180%); border-bottom:1px solid var(--header-border); box-shadow:0 8px 30px rgba(0,0,0,.2); }
        .chorus-landing-root .nav { display:flex; align-items:center; justify-content:space-between; gap:1rem; padding:.8rem clamp(1rem,4vw,2.5rem); max-width:1400px; margin:0 auto; }
        .chorus-landing-root .brand { display:flex; align-items:center; gap:.7rem; text-decoration:none; min-width:0; }
        .chorus-landing-root .brand-mark { width:40px; height:40px; border-radius:11px; flex:none; background:linear-gradient(135deg, var(--blue), var(--sky), var(--gold)); display:flex; align-items:center; justify-content:center; }
        .chorus-landing-root .brand-mark svg { width:22px; height:22px; color:#fff; }
        .chorus-landing-root .brand-name { font-family:var(--font-display); font-weight:800; font-size:1.15rem; letter-spacing:.01em; color:var(--text); }
        .chorus-landing-root .brand-sub { font-family:var(--font-cond); font-size:.62rem; letter-spacing:.14em; text-transform:uppercase; color:var(--text-3); }
        .chorus-landing-root .nav-links { display:none; list-style:none; align-items:center; gap:.25rem; }
        .chorus-landing-root .nav-links a { font-family:var(--font-cond); font-size:.92rem; font-weight:600; letter-spacing:.06em; color:var(--text); text-decoration:none; padding:.55rem .85rem; border-radius:8px; transition:.25s; }
        .chorus-landing-root .nav-links a:hover { color:var(--gold); background:rgba(255,215,0,.08); }
        .chorus-landing-root .nav-cta { display:none; align-items:center; gap:.7rem; }
        .chorus-landing-root .theme-toggle { display:inline-flex; align-items:center; justify-content:center; width:42px; height:42px; border-radius:50%; border:1px solid var(--line); background:var(--pill-bg); color:var(--text); cursor:pointer; transition:.25s; flex:none; }
        .chorus-landing-root .theme-toggle:hover { border-color:var(--gold); transform:translateY(-2px); }
        .chorus-landing-root .theme-toggle svg { width:18px; height:18px; }
        .chorus-landing-root .icon-moon { display:block; } .chorus-landing-root .icon-sun { display:none; }
        .chorus-landing-root[data-theme="light"] .icon-moon { display:none; } .chorus-landing-root[data-theme="light"] .icon-sun { display:block; }
        .chorus-landing-root .menu-btn { display:inline-flex; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:.5rem; }
        .chorus-landing-root .menu-btn span { width:22px; height:2.5px; background:var(--text); border-radius:2px; }
        @media (min-width:900px) { .chorus-landing-root .nav-links { display:flex; } .chorus-landing-root .nav-cta { display:flex; } .chorus-landing-root .menu-btn { display:none; } }

        .chorus-landing-root .hero { position:relative; padding:clamp(3rem,8vw,5rem) 0 clamp(3.5rem,8vw,6rem); overflow:hidden; }
        .chorus-landing-root .hero::before { content:''; position:absolute; top:-20%; right:-10%; width:60%; height:140%; background:radial-gradient(circle, rgba(0,191,255,.16), transparent 65%); pointer-events:none; }
        .chorus-landing-root .hero-grid { display:grid; gap:2.4rem; grid-template-columns:1fr; position:relative; z-index:1; }
        .chorus-landing-root .eyebrow { font-family:var(--font-cond); font-size:.78rem; font-weight:600; letter-spacing:.24em; text-transform:uppercase; color:var(--gold); margin-bottom:.9rem; }
        .chorus-landing-root .hero h1 { font-size:clamp(2.1rem, 6.4vw, 3.6rem); font-weight:900; margin-bottom:1.1rem; }
        .chorus-landing-root .hero-sub { font-size:clamp(1rem, 2.4vw, 1.14rem); font-weight:300; color:var(--text-2); line-height:1.8; max-width:600px; margin-bottom:1.9rem; }
        .chorus-landing-root .cta-row { display:flex; flex-wrap:wrap; gap:.9rem; margin-bottom:1.6rem; }
        .chorus-landing-root .cta-row .btn { flex:1 1 100%; }
        @media (min-width:480px){ .chorus-landing-root .cta-row .btn { flex:1 1 220px; } }
        .chorus-landing-root .hero-note { font-family:var(--font-cond); font-size:.8rem; color:var(--text-3); letter-spacing:.04em; }

        .chorus-landing-root .hero-card { padding:1.7rem; border-radius:20px; }
        .chorus-landing-root .hc-title { font-family:var(--font-cond); font-size:.72rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--text-3); margin-bottom:1.2rem; }
        .chorus-landing-root .model-chips { display:flex; flex-wrap:wrap; gap:.5rem; margin-bottom:1.4rem; }
        .chorus-landing-root .model-chips .chip { font-size:.76rem; padding:.35rem .8rem; }
        .chorus-landing-root .stat-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.2rem; padding-top:1.2rem; border-top:1px dashed var(--line); }
        .chorus-landing-root .stat-num { font-family:var(--font-display); font-size:clamp(1.6rem,4vw,2rem); font-weight:800; background:linear-gradient(45deg, var(--gold), var(--sky)); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
        .chorus-landing-root .stat-label { font-family:var(--font-cond); font-size:.72rem; font-weight:500; letter-spacing:.06em; text-transform:uppercase; color:var(--text-3); margin-top:.15rem; }

        .chorus-landing-root .trust { padding:1.5rem 0; border-block:1px solid var(--divider); background:var(--navy-2); overflow:hidden; }
        .chorus-landing-root .trust-label { text-align:center; font-family:var(--font-cond); font-size:.7rem; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--text-3); margin-bottom:1rem; }
        .chorus-landing-root .trust-track { display:flex; gap:2.8rem; width:max-content; animation:marquee 26s linear infinite; padding-inline:1.3rem; }
        .chorus-landing-root .trust:hover .trust-track { animation-play-state:paused; }
        .chorus-landing-root .trust-item { font-family:var(--font-display); font-weight:700; font-size:1rem; color:var(--text-3); white-space:nowrap; }
        @keyframes marquee { to { transform:translateX(-50%); } }
        @media (prefers-reduced-motion:reduce) { .chorus-landing-root .trust-track { animation:none; flex-wrap:wrap; justify-content:center; width:100%; } }

        .chorus-landing-root .feat-grid { display:grid; gap:1.1rem; grid-template-columns:1fr; }
        @media (min-width:720px) { .chorus-landing-root .feat-grid { grid-template-columns:1fr 1fr; } }
        @media (min-width:1080px) { .chorus-landing-root .feat-grid { grid-template-columns:repeat(3,1fr); } }
        .chorus-landing-root .feat-card { border-radius:var(--radius); padding:1.5rem; position:relative; overflow:hidden; transition:transform .3s var(--ease), box-shadow .3s, border-color .3s; border:1px solid var(--line); }
        .chorus-landing-root .feat-card:hover { transform:translateY(-6px); box-shadow:var(--shadow-2); border-color:var(--line-gold); }
        .chorus-landing-root .feat-icon { width:48px; height:48px; border-radius:13px; display:flex; align-items:center; justify-content:center; margin-bottom:1rem; background:var(--accent-soft); border:1px solid var(--accent); }
        .chorus-landing-root .feat-icon svg { width:21px; height:21px; color:var(--accent); }
        .chorus-landing-root .feat-card h3 { font-size:1.04rem; font-weight:700; margin-bottom:.5rem; }
        .chorus-landing-root .feat-card p { font-size:.88rem; font-weight:300; color:var(--text-2); line-height:1.7; }

        .chorus-landing-root .demo-wrap { max-width:760px; margin:0 auto; border-radius:20px; padding:1.6rem; border:1px solid var(--line); }
        .chorus-landing-root .demo-q { display:flex; gap:.8rem; align-items:flex-start; margin-bottom:1.2rem; padding-bottom:1.2rem; border-bottom:1px solid var(--divider); }
        .chorus-landing-root .demo-avatar { width:34px; height:34px; border-radius:50%; flex:none; display:flex; align-items:center; justify-content:center; font-family:var(--font-display); font-weight:700; font-size:.8rem; }
        .chorus-landing-root .demo-avatar.user { background:var(--accent-soft); color:var(--accent); border:1px solid var(--accent); }
        .chorus-landing-root .demo-avatar.ai { background:linear-gradient(135deg, var(--blue), var(--sky)); color:#fff; }
        .chorus-landing-root .demo-label { font-family:var(--font-cond); font-size:.68rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:var(--text-3); margin-bottom:.3rem; }
        .chorus-landing-root .demo-text { font-size:.94rem; color:var(--text); line-height:1.7; }
        .chorus-landing-root .demo-a p { font-size:.92rem; font-weight:300; color:var(--text-2); line-height:1.8; margin-bottom:1rem; }
        .chorus-landing-root .demo-sources { display:flex; flex-wrap:wrap; gap:.5rem; }
        .chorus-landing-root .source-pill { display:inline-flex; align-items:center; gap:.4rem; padding:.32rem .75rem; border-radius:999px; font-family:var(--font-cond); font-size:.72rem; font-weight:600; letter-spacing:.03em; background:var(--pill-bg); border:1px solid var(--line); color:var(--text-2); }
        .chorus-landing-root .source-pill::before { content:''; width:6px; height:6px; border-radius:50%; background:var(--gold); }

        .chorus-landing-root .numbers { border-block:1px solid var(--divider); background:linear-gradient(135deg, rgba(0,102,255,.12), rgba(0,191,255,.05)); }
        .chorus-landing-root .numbers-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; }
        @media (min-width:720px) { .chorus-landing-root .numbers-grid { grid-template-columns:repeat(4,1fr); } }
        .chorus-landing-root .num-card { border-radius:var(--radius); padding:1.4rem 1rem; text-align:center; transition:transform .25s; border:1px solid var(--line); }
        .chorus-landing-root .num-card:hover { transform:translateY(-5px); }
        .chorus-landing-root .num-card .stat-num { font-size:clamp(1.7rem,5vw,2.2rem); }
        .chorus-landing-root .num-card .stat-label { margin-top:.35rem; }

        .chorus-landing-root .steps { display:grid; gap:1.2rem; grid-template-columns:1fr; max-width:920px; margin:0 auto; }
        @media (min-width:820px) { .chorus-landing-root .steps { grid-template-columns:repeat(3,1fr); } }
        .chorus-landing-root .step-card { border-radius:var(--radius); padding:1.5rem; position:relative; border:1px solid var(--line); }
        .chorus-landing-root .step-num { font-family:var(--font-mono); font-size:.75rem; color:var(--accent); letter-spacing:.1em; margin-bottom:.7rem; }
        .chorus-landing-root .step-card h3 { font-size:1rem; font-weight:700; margin-bottom:.5rem; }
        .chorus-landing-root .step-card p { font-size:.86rem; font-weight:300; color:var(--text-2); line-height:1.7; }

        .chorus-landing-root .uc-grid { display:grid; gap:1rem; grid-template-columns:1fr; }
        @media (min-width:720px) { .chorus-landing-root .uc-grid { grid-template-columns:repeat(3,1fr); } }
        .chorus-landing-root .uc-card { border-radius:var(--radius); padding:1.3rem 1.4rem; border:1px solid var(--line); }
        .chorus-landing-root .uc-card h3 { font-size:.98rem; font-weight:700; margin-bottom:.4rem; color:var(--text); }
        .chorus-landing-root .uc-card p { font-size:.85rem; font-weight:300; color:var(--text-2); line-height:1.6; }

        .chorus-landing-root .faq-list { max-width:820px; margin:0 auto; display:grid; gap:.8rem; }
        .chorus-landing-root .faq-item { border-radius:var(--radius); overflow:hidden; border:1px solid var(--line); }
        .chorus-landing-root .faq-q { width:100%; display:flex; justify-content:space-between; align-items:center; gap:1rem; text-align:left; background:none; border:none; color:var(--text); font-family:var(--font-display); font-weight:700; font-size:.96rem; padding:1.1rem 1.3rem; cursor:pointer; }
        .chorus-landing-root .faq-q .chev { width:11px; height:11px; flex:none; border-right:2.5px solid var(--gold); border-bottom:2.5px solid var(--gold); transform:rotate(45deg); transition:transform .3s; }
        .chorus-landing-root .faq-item.open .faq-q .chev { transform:rotate(225deg); }
        .chorus-landing-root .faq-a { max-height:0; overflow:hidden; transition:max-height .4s var(--ease); }
        .chorus-landing-root .faq-item.open .faq-a { max-height:300px; }
        .chorus-landing-root .faq-a p { padding:0 1.3rem 1.15rem; font-size:.88rem; font-weight:300; color:var(--text-2); line-height:1.75; }

        .chorus-landing-root .cta-final { border-radius:22px; padding:clamp(2rem,6vw,3.2rem); text-align:center; max-width:840px; margin:0 auto; border:1px solid var(--line); }
        .chorus-landing-root .cta-final h2 { font-size:clamp(1.6rem,4.4vw,2.3rem); font-weight:800; margin-bottom:.8rem; }
        .chorus-landing-root .cta-final p { color:var(--text-2); font-weight:300; max-width:520px; margin:0 auto 1.7rem; }
        .chorus-landing-root .cta-final .cta-row { justify-content:center; }
        .chorus-landing-root .cta-final .cta-row .btn { flex:0 1 220px; }

        .chorus-landing-root .site-footer { background:var(--footer-bg); border-top:1px solid var(--footer-border); padding:3rem 0 1.6rem; margin-top:2rem; }
        .chorus-landing-root .footer-grid { display:grid; gap:2rem; grid-template-columns:1fr; margin-bottom:2rem; }
        @media (min-width:820px) { .chorus-landing-root .footer-grid { grid-template-columns:1.4fr 1fr 1fr 1fr; } }
        .chorus-landing-root .footer-brand p { font-size:.86rem; font-weight:300; color:var(--text-3); line-height:1.7; margin-top:.8rem; max-width:320px; }
        .chorus-landing-root .footer-col h4 { font-family:var(--font-cond); font-size:.74rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--gold); margin-bottom:.9rem; }
        .chorus-landing-root .footer-col ul { list-style:none; }
        .chorus-landing-root .footer-col li { margin-bottom:.45rem; }
        .chorus-landing-root .footer-col a { color:var(--text-3); text-decoration:none; font-size:.88rem; transition:.2s; }
        .chorus-landing-root .footer-col a:hover { color:var(--sky); }
        .chorus-landing-root .footer-base { border-top:1px solid var(--divider); padding-top:1.3rem; display:flex; flex-direction:column; gap:.6rem; align-items:center; text-align:center; }
        .chorus-landing-root .footer-base p { font-size:.8rem; color:var(--text-3); font-weight:300; }

        .chorus-landing-root .back-to-top { position:fixed; bottom:1.2rem; right:1.2rem; z-index:900; width:46px; height:46px; border-radius:50%; border:none; cursor:pointer; background:linear-gradient(135deg, var(--blue), var(--sky)); display:flex; align-items:center; justify-content:center; opacity:0; visibility:hidden; transform:translateY(12px); transition:.3s; box-shadow:0 8px 22px rgba(0,102,255,.4); }
        .chorus-landing-root .back-to-top.visible { opacity:1; visibility:visible; transform:none; }
        .chorus-landing-root .back-to-top svg { width:19px; height:19px; fill:#fff; }

        .chorus-landing-root.js .reveal { opacity:0; transform:translateY(28px); transition:opacity .6s var(--ease), transform .6s var(--ease); }
        .chorus-landing-root.js .reveal.in { opacity:1; transform:none; }
        @media (prefers-reduced-motion:reduce) { .chorus-landing-root.js .reveal { opacity:1; transform:none; } }
      `}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <symbol id="i-layers" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></symbol>
          <symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></symbol>
          <symbol id="i-image" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></symbol>
          <symbol id="i-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 3 14h8l-1 8 10-12h-8z"/></symbol>
          <symbol id="i-save" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M7 3v6h9"/></symbol>
          <symbol id="i-doc" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></symbol>
          <symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14m-6-6 6 6-6 6"/></symbol>
          <symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></symbol>
          <symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.3M12 19.2v2.3M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></symbol>
          <symbol id="i-mesh" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M7.9 7.3 10 15.5M16.1 7.3 14 15.5M8.4 6h7.2"/></symbol>
        </defs>
      </svg>

      <header className="site-header">
        <nav className="nav" aria-label="Main navigation">
          <a href="#top" className="brand" aria-label="Chorus home">
            <span className="brand-mark"><svg><use href="#i-mesh"/></svg></span>
            <span><span className="brand-name">Chorus</span><br/><span className="brand-sub">Multi-Model AI</span></span>
          </a>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#models">Models</a></li>
            <li><a href="#how">How It Works</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
          <div className="nav-cta">
            <button className="theme-toggle" id="themeToggle" aria-label="Switch to light mode" aria-pressed="false">
              <svg className="icon-moon"><use href="#i-moon"/></svg>
              <svg className="icon-sun"><use href="#i-sun"/></svg>
            </button>
            <a href="https://app.chorus.ai" className="btn btn-primary" style={{ padding: '.65rem 1.3rem', minHeight: '40px', fontSize: '.85rem' }}><span>Start Chatting</span></a>
          </div>
          <button className="menu-btn" aria-label="Open menu"><span></span><span></span><span></span></button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <p className="eyebrow">Multi-Model Chat · Search · Image · Music</p>
                <h1>Every AI model, <span className="grad-text">one conversation.</span></h1>
                <p className="hero-sub">Chorus brings OpenAI, Anthropic, Google, xAI, DeepSeek, and Mistral into a single thread — with grounded web search, image generation, and original music, all in one place.</p>
                <div className="cta-row">
                  <a href="https://chorus-ai.asilvainnoovations.com" className="btn btn-primary"><span>Start Chatting Free</span><svg><use href="#i-arrow"/></svg></a>
                  <a href="#how" className="btn btn-gold"><span>See How It Works</span></a>
                </div>
                <p className="hero-note">No account required to try it. Bring your own API key, stay in control of your data.</p>
              </div>
              <aside className="hero-card glass-strong reveal">
                <div className="hc-title">Built into every conversation</div>
                <div className="model-chips">
                  <span className="chip">OpenAI</span><span className="chip">Anthropic</span><span className="chip">Google Gemini</span>
                  <span className="chip">xAI Grok</span><span className="chip">DeepSeek</span><span className="chip">Mistral</span>
                </div>
                <div className="stat-grid">
                  <div><div className="stat-num"><span className="count" data-to="6">0</span>+</div><div className="stat-label">Model Providers</div></div>
                  <div><div className="stat-num"><span className="count" data-to="30">0</span>+</div><div className="stat-label">Models Available</div></div>
                  <div><div className="stat-num"><span className="count" data-to="4">0</span></div><div className="stat-label">Creative Modes</div></div>
                  <div><div className="stat-num"><span className="count" data-to="0">0</span></div><div className="stat-label">Setup Steps Wasted</div></div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="trust" id="models" aria-label="Supported AI providers">
          <p className="trust-label">One key, every frontier lab</p>
          <div className="trust-track">
            <span className="trust-item">OpenAI</span><span className="trust-item">Anthropic</span><span className="trust-item">Google Gemini</span>
            <span className="trust-item">xAI Grok</span><span className="trust-item">DeepSeek</span><span className="trust-item">Mistral</span>
            <span className="trust-item">Stability AI</span><span className="trust-item">Black Forest Labs</span><span className="trust-item">Udio</span><span className="trust-item">Suno</span>
            <span className="trust-item" aria-hidden="true">OpenAI</span><span className="trust-item" aria-hidden="true">Anthropic</span><span className="trust-item" aria-hidden="true">Google Gemini</span>
            <span className="trust-item" aria-hidden="true">xAI Grok</span><span className="trust-item" aria-hidden="true">DeepSeek</span><span className="trust-item" aria-hidden="true">Mistral</span>
            <span className="trust-item" aria-hidden="true">Stability AI</span><span className="trust-item" aria-hidden="true">Black Forest Labs</span><span className="trust-item" aria-hidden="true">Udio</span><span className="trust-item" aria-hidden="true">Suno</span>
          </div>
        </section>

        <section className="section" id="features">
          <div className="wrap">
            <p className="kicker">What's Inside</p>
            <h2 className="section-title">Built for people who <span className="hl">outgrow one model</span></h2>
            <p className="section-sub">Every capability lives in the same thread — no tab-switching, no separate subscriptions, no re-explaining yourself to a different chatbot.</p>
            <div className="feat-grid">
              <article className="feat-card glass reveal">
                <div className="feat-icon"><svg><use href="#i-layers"/></svg></div>
                <h3>Multi-Model Intelligence</h3>
                <p>Switch between GPT, Claude, Gemini, Grok, DeepSeek, and Mistral mid-conversation — pick the right mind for the task, not just the one you're used to.</p>
              </article>
              <article className="feat-card glass reveal">
                <div className="feat-icon"><svg><use href="#i-search"/></svg></div>
                <h3>Grounded Web Search</h3>
                <p>Every claim comes with a source. Chorus searches the live web and shows its work, so you can verify instead of guess.</p>
              </article>
              <article className="feat-card glass reveal">
                <div className="feat-icon"><svg><use href="#i-image"/></svg></div>
                <h3>Image &amp; Music Generation</h3>
                <p>Turn a prompt into a picture or a track — DALL·E, Stable Diffusion, and FLUX for images; Udio and Suno for original music.</p>
              </article>
              <article className="feat-card glass reveal">
                <div className="feat-icon"><svg><use href="#i-bolt"/></svg></div>
                <h3>Built to Move Fast</h3>
                <p>Streaming responses, instant model switching, and a command palette (⌘K) so your hands never leave the keyboard.</p>
              </article>
              <article className="feat-card glass reveal">
                <div className="feat-icon"><svg><use href="#i-save"/></svg></div>
                <h3>Yours, Wherever You Are</h3>
                <p>Conversations and settings persist locally and sync your theme, so you pick up exactly where you left off.</p>
              </article>
              <article className="feat-card glass reveal">
                <div className="feat-icon"><svg><use href="#i-doc"/></svg></div>
                <h3>Reads What You Give It</h3>
                <p>Drop in a PDF or paste a link. Chorus reads it, summarizes it, and answers questions against it.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="wrap">
            <p className="kicker">See It Work</p>
            <h2 className="section-title">Answers you can <span className="hl">actually verify</span></h2>
            <p className="section-sub">A real exchange, start to finish — the model, the answer, and exactly where it came from.</p>
            <div className="demo-wrap glass-strong reveal">
              <div className="demo-q">
                <span className="demo-avatar user">Y</span>
                <div>
                  <div className="demo-label">You · asked Chorus</div>
                  <div className="demo-text">Compare DeepSeek V4 and Claude Sonnet for refactoring a large TypeScript codebase.</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '.8rem', alignItems: 'flex-start' }}>
                <span className="demo-avatar ai"><svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" strokeWidth="2"><use href="#i-mesh"/></svg></span>
                <div className="demo-a" style={{ flex: 1 }}>
                  <div className="demo-label">Chorus · grounded answer</div>
                  <p>DeepSeek V4 tends to be faster and cheaper for mechanical refactors — renames, type migrations, repetitive edits across many files. Claude Sonnet holds more context and reasons better about cross-file architectural changes where a mistake would ripple. For a large, tangled codebase, most teams run Sonnet for the plan and DeepSeek for bulk execution.</p>
                  <div className="demo-sources">
                    <span className="source-pill">DeepSeek V4 docs</span>
                    <span className="source-pill">Anthropic engineering blog</span>
                    <span className="source-pill">SWE-bench leaderboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section numbers">
          <div className="wrap">
            <p className="kicker">By The Design</p>
            <h2 className="section-title">Everything, <span className="hl">unbundled</span></h2>
            <div className="numbers-grid">
              <div className="num-card glass reveal"><div className="stat-num"><span className="count" data-to="6">0</span></div><div className="stat-label">Providers, One Key</div></div>
              <div className="num-card glass reveal"><div className="stat-num"><span className="count" data-to="5">0</span></div><div className="stat-label">Image Models</div></div>
              <div className="num-card glass reveal"><div className="stat-num"><span className="count" data-to="2">0</span></div><div className="stat-label">Music Generators</div></div>
              <div className="num-card glass reveal"><div className="stat-num"><span className="count" data-to="1">0</span></div><div className="stat-label">Place to Think</div></div>
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="wrap">
            <p className="kicker">Getting Started</p>
            <h2 className="section-title">Three steps, <span className="hl">no waiting on approval</span></h2>
            <p className="section-sub">Chorus doesn't sell you a seat — it's the interface. You bring the model access; Chorus makes it usable.</p>
            <div className="steps">
              <div className="step-card glass reveal">
                <div className="step-num">01</div>
                <h3>Connect your key</h3>
                <p>Add an OpenRouter key once. Chorus never sees or stores it anywhere but your own browser.</p>
              </div>
              <div className="step-card glass reveal">
                <div className="step-num">02</div>
                <h3>Pick your model</h3>
                <p>Start with a fast, cheap model and switch to something heavier the moment a question deserves it.</p>
              </div>
              <div className="step-card glass reveal">
                <div className="step-num">03</div>
                <h3>Just start typing</h3>
                <p>Chat, search, generate an image, or draft a track — same thread, same shortcut, zero context lost.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section section-alt">
          <div className="wrap">
            <p className="kicker">Where Chorus Helps</p>
            <h2 className="section-title">Real work, <span className="hl">not demos</span></h2>
            <div className="uc-grid">
              <div className="uc-card glass reveal"><h3>Research</h3><p>Summaries, comparisons, and sources — without twenty open tabs.</p></div>
              <div className="uc-card glass reveal"><h3>Coding</h3><p>Explain, generate, and fix code, with the model that's actually good at it.</p></div>
              <div className="uc-card glass reveal"><h3>Writing</h3><p>Draft, rewrite, and tighten copy in the tone you're going for.</p></div>
              <div className="uc-card glass reveal"><h3>Support &amp; Ops</h3><p>Answer with citations. Reduce the back-and-forth.</p></div>
              <div className="uc-card glass reveal"><h3>Learning</h3><p>Ask a follow-up, then another — explanations that build, not repeat.</p></div>
              <div className="uc-card glass reveal"><h3>Creative</h3><p>Sketch a visual or a track alongside the words, in the same thread.</p></div>
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="wrap">
            <p className="kicker">Straight Answers</p>
            <h2 className="section-title">Before you <span className="hl">ask</span></h2>
            <div className="faq-list">
              <div className="faq-item glass reveal">
                <button className="faq-q" aria-expanded="false">What is Chorus, exactly?<span className="chev"></span></button>
                <div className="faq-a"><p>A single chat interface that routes your questions to GPT, Claude, Gemini, Grok, DeepSeek, or Mistral — plus web search, image generation, and music generation, all in one thread.</p></div>
              </div>
              <div className="faq-item glass reveal">
                <button className="faq-q" aria-expanded="false">Do I need to know how to code?<span className="chev"></span></button>
                <div className="faq-a"><p>No. Pasting in an API key is the only setup step — after that it works like any chat app.</p></div>
              </div>
              <div className="faq-item glass reveal">
                <button className="faq-q" aria-expanded="false">Are my conversations stored on a server?<span className="chev"></span></button>
                <div className="faq-a"><p>Conversations and settings are kept in your browser's local storage. Nothing is sent anywhere except directly to the model provider you chose.</p></div>
              </div>
              <div className="faq-item glass reveal">
                <button className="faq-q" aria-expanded="false">Can it generate images and music?<span className="chev"></span></button>
                <div className="faq-a"><p>Yes — DALL·E, Stable Diffusion, and FLUX for images; Udio and Suno for music, from the same chat window.</p></div>
              </div>
              <div className="faq-item glass reveal">
                <button className="faq-q" aria-expanded="false">Do I have to pick a model every time?<span className="chev"></span></button>
                <div className="faq-a"><p>No — set a default and switch only when a question calls for something heavier or cheaper.</p></div>
              </div>
              <div className="faq-item glass reveal">
                <button className="faq-q" aria-expanded="false">Is Chorus free?<span className="chev"></span></button>
                <div className="faq-a"><p>Chorus itself is free and open — you only pay the model provider for what you actually use, at their rates.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="get-started">
          <div className="wrap">
            <div className="cta-final glass-strong reveal">
              <p className="kicker">Ready When You Are</p>
              <h2>Stop juggling <span className="grad-text">five different tabs</span>.</h2>
              <p>Six model providers, grounded search, image and music generation — one conversation, your key, your data.</p>
              <div className="cta-row">
                <a href="https://chorus-ai.asilvainnoovations.com" className="btn btn-primary"><span>Start Chatting Free</span><svg><use href="#i-arrow"/></svg></a>
                <a href="#features" className="btn btn-ghost"><span>Explore Features</span></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#top" className="brand" aria-label="Chorus home"><span className="brand-mark"><svg><use href="#i-mesh"/></svg></span><span><span className="brand-name">Chorus</span></span></a>
              <p>Every AI model, one conversation. Multi-model chat, grounded search, image and music generation — built for people who outgrow a single chatbot.</p>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#models">Models</a></li>
                <li><a href="#how">How It Works</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Resources</h4>
              <ul>
                <li><a href="#faq">FAQ</a></li>
                <li><a href="https://chorus-ai.asilvainnoovations.com">Get Started</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#top">About</a></li>
                <li><a href="#top">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-base">
            <p>© 2026 Chorus. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <button className="back-to-top" id="backToTop" aria-label="Back to top"><svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg></button>
    </div>
  );
};
