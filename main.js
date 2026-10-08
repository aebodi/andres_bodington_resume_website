/* =============================================================================
 * main.js — Andres Bodington portfolio. Entry point.
 * ========================================================================== */

(function () {
	'use strict';

	var data = window.__BRAND__ || {};

	/* ---------- helpers ---------------------------------------------------- */
	var $ = function (sel, scope) { return (scope || document).querySelector(sel); };
	var $$ = function (sel, scope) {
		return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
	};
	var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
	var fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
	var ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
	var escHTML = function (v) {
		return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return ESC_MAP[c]; });
	};

	function safe(fn, name) {
		try { fn(); } catch (e) { console.warn('[' + name + ']', e); }
	}

	/* ---------- pointer state + one shared animation loop ------------------ */
	/* Both the background field and the circle cursor follow the pointer, so
	   they share a single rAF loop and a single mousemove listener rather than
	   running two of each.                                                    */
	var pointer = { x: 0, y: 0, hasMoved: false };
	var tickers = [];
	var loopRunning = false;

	function addTicker(fn) {
		tickers.push(fn);
		if (loopRunning) return;
		loopRunning = true;
		requestAnimationFrame(function frame(now) {
			for (var i = 0; i < tickers.length; i++) {
				try { tickers[i](now); } catch (e) { /* keep the loop alive */ }
			}
			requestAnimationFrame(frame);
		});
	}

	if (fineHover) {
		window.addEventListener('mousemove', function (e) {
			pointer.x = e.clientX;
			pointer.y = e.clientY;
			pointer.hasMoved = true;
		}, { passive: true });
	}

	/* ---------- 1. background field (signature effect) --------------------- */
	function initBackgroundField() {
		var root = document.documentElement;
		var mx = 50, my = 38, tx = 50, ty = 38;
		var start = performance.now();

		/* Touch device + reduced motion: an endless drift is intrusive, so the
		   field stays where it is instead of looping forever. */
		if (!fineHover && reduced) {
			root.style.setProperty('--mx', '50%');
			root.style.setProperty('--my', '38%');
			return;
		}

		addTicker(function (now) {
			if (fineHover) {
				tx = (pointer.x / window.innerWidth) * 100;
				ty = (pointer.y / window.innerHeight) * 100;
			} else {
				var t = (now - start) / 1000;
				tx = 50 + Math.sin(t * 0.16) * 18;
				ty = 42 + Math.cos(t * 0.11) * 14;
			}
			mx += (tx - mx) * 0.055;
			my += (ty - my) * 0.055;
			root.style.setProperty('--mx', mx.toFixed(2) + '%');
			root.style.setProperty('--my', my.toFixed(2) + '%');
		});
	}

	/* ---------- 1b. circle cursor ------------------------------------------ */
	/* The dot tracks the pointer exactly; the ring trails it with easing. Both
	   stay invisible until the first mousemove, or the page opens with a mark
	   stuck in the top-left corner.                                           */
	function initCursor() {
		var root = $('[data-cursor-root]');
		if (!root || !fineHover) return;

		var dot = $('.cursor-dot', root);
		var ring = $('.cursor-ring', root);
		var rx = 0, ry = 0, shown = false;

		document.documentElement.classList.add('has-cursor');

		addTicker(function () {
			if (!pointer.hasMoved) return;
			if (!shown) {
				shown = true;
				rx = pointer.x;
				ry = pointer.y;
				root.classList.add('is-ready');
			}
			rx += (pointer.x - rx) * 0.16;
			ry += (pointer.y - ry) * 0.16;
			dot.style.transform = 'translate3d(' + pointer.x + 'px,' + pointer.y + 'px,0)';
			ring.style.transform = 'translate3d(' + rx.toFixed(2) + 'px,' + ry.toFixed(2) + 'px,0)';
		});

		/* mouseover/mouseout + relatedTarget — enter/leave are unreliable here. */
		var HOVERABLES = 'a[href], button, .card, [data-glow]';
		document.addEventListener('mouseover', function (e) {
			if (e.target.closest && e.target.closest(HOVERABLES)) {
				root.classList.add('is-interactive');
			}
		});
		document.addEventListener('mouseout', function (e) {
			if (!e.target.closest || !e.target.closest(HOVERABLES)) return;
			var to = e.relatedTarget;
			if (to && to.closest && to.closest(HOVERABLES)) return;
			root.classList.remove('is-interactive');
		});

		/* Leaving the window should not leave a frozen ring behind. */
		document.addEventListener('mouseleave', function () { root.classList.remove('is-ready'); });
		document.addEventListener('mouseenter', function () {
			if (pointer.hasMoved) root.classList.add('is-ready');
		});
	}

	/* ---------- 2. nav ------------------------------------------------------ */
	function initNav() {
		var nav = $('[data-nav]');
		if (!nav) return;
		var on = function () {
			nav.classList.toggle('is-scrolled', window.scrollY > 60);
		};
		on();
		window.addEventListener('scroll', on, { passive: true });
	}

	/* ---------- 3. scroll progress ----------------------------------------- */
	function initScrollProgress() {
		var bar = $('[data-scroll-progress]');
		if (!bar) return;
		var raf = null;
		function update() {
			var max = document.documentElement.scrollHeight - window.innerHeight;
			var pct = max > 0 ? window.scrollY / max : 0;
			bar.style.transform = 'scaleX(' + pct.toFixed(4) + ')';
			raf = null;
		}
		window.addEventListener('scroll', function () {
			if (!raf) raf = requestAnimationFrame(update);
		}, { passive: true });
		window.addEventListener('resize', update);
		update();
	}

	/* ---------- 4. reveals -------------------------------------------------- */
	function initReveals() {
		var els = $$('[data-reveal]');
		if (!els.length) return;

		if (!('IntersectionObserver' in window)) {
			els.forEach(function (el) { el.classList.add('is-revealed'); });
			return;
		}

		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-revealed');
				io.unobserve(entry.target);
			});
		}, { threshold: 0.01, rootMargin: '0px 0px -2% 0px' });

		els.forEach(function (el) { io.observe(el); });

		/* Safety net — nothing above the fold stays invisible. */
		setTimeout(function () {
			$$('[data-reveal]:not(.is-revealed)').forEach(function (el) {
				if (el.getBoundingClientRect().top < window.innerHeight) {
					el.classList.add('is-revealed');
				}
			});
		}, 6000);
	}

	/* ---------- 5. hero word reveal ---------------------------------------- */
	function initSplit() {
		var el = $('[data-split]');
		if (!el) return;
		var text = el.textContent.trim();
		el.setAttribute('aria-label', text);
		el.innerHTML = text.split(/\s+/).map(function (word) {
			return '<span class="split-word" aria-hidden="true">' +
				'<span class="split-word-inner">' + word + '</span></span>';
		}).join(' ');

		var inners = $$('.split-word-inner', el);
		inners.forEach(function (inner, i) {
			inner.style.transitionDelay = (0.07 + i * 0.09).toFixed(2) + 's';
		});
		requestAnimationFrame(function () {
			requestAnimationFrame(function () { el.classList.add('is-split-in'); });
		});
		/* Safety net in case the class never lands. */
		setTimeout(function () { el.classList.add('is-split-in'); }, 2500);
	}

	/* ---------- 6. count-up -------------------------------------------------- */
	function initCountUp() {
		var els = $$('[data-count-to]');
		if (!els.length) return;

		function run(el) {
			var target = parseFloat(el.dataset.countTo);
			if (isNaN(target)) return;
			var decimals = (el.dataset.countTo.split('.')[1] || '').length;
			var plain = el.hasAttribute('data-count-plain');
			var from = plain ? Math.max(0, target - 40) : 0;
			var dur = 1300;
			var t0 = performance.now();

			function tick(now) {
				var p = Math.min(1, (now - t0) / dur);
				var eased = 1 - Math.pow(1 - p, 3);
				el.textContent = (from + (target - from) * eased).toFixed(decimals);
				if (p < 1) requestAnimationFrame(tick);
				else el.textContent = target.toFixed(decimals);
			}
			requestAnimationFrame(tick);
		}

		if (!('IntersectionObserver' in window)) {
			els.forEach(run);
			return;
		}

		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (!entry.isIntersecting) return;
				run(entry.target);
				entry.target.setAttribute('data-counted', '');
				io.unobserve(entry.target);
			});
		}, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });
		els.forEach(function (el) { io.observe(el); });

		/* Safety net — a stat on screen must never sit at its start value. */
		setTimeout(function () {
			$$('[data-count-to]:not([data-counted])').forEach(function (el) {
				if (el.getBoundingClientRect().top < window.innerHeight) {
					el.textContent = parseFloat(el.dataset.countTo)
						.toFixed((el.dataset.countTo.split('.')[1] || '').length);
					el.setAttribute('data-counted', '');
				}
			});
		}, 6000);
	}

	/* ---------- 7. card glow ------------------------------------------------- */
	function initCardGlow() {
		if (!fineHover) return;
		var cards = $$('[data-glow]');
		if (!cards.length) return;

		cards.forEach(function (card) {
			card.addEventListener('mousemove', function (e) {
				var r = card.getBoundingClientRect();
				card.style.setProperty('--gx', (e.clientX - r.left) + 'px');
				card.style.setProperty('--gy', (e.clientY - r.top) + 'px');
			}, { passive: true });
		});

		/* mouseover/mouseout + relatedTarget — mouseenter/leave are unreliable. */
		document.addEventListener('mouseover', function (e) {
			var card = e.target.closest ? e.target.closest('[data-glow]') : null;
			if (card) card.classList.add('is-glowing');
		});
		document.addEventListener('mouseout', function (e) {
			var card = e.target.closest ? e.target.closest('[data-glow]') : null;
			if (!card) return;
			var to = e.relatedTarget;
			if (to && to.closest && to.closest('[data-glow]') === card) return;
			card.classList.remove('is-glowing');
		});
	}

	/* ---------- 8. links: enrich from manifest, never ship a dead button ----- */
	function initLinks() {
		var contact = data.contact || {};
		$$('[data-link]').forEach(function (el) {
			var key = el.dataset.link;
			var href = el.getAttribute('href');
			/* Already pointing somewhere real in the HTML — leave it alone. */
			if (href && href !== '#') return;
			var url = contact[key];
			if (url) {
				el.href = url;
				el.target = '_blank';
				el.rel = 'noopener noreferrer';
				el.removeAttribute('data-todo');
				el.textContent = key === 'github' ? 'GitHub' : 'LinkedIn';
				return;
			}
			el.setAttribute('aria-disabled', 'true');
			el.title = 'Add your ' + key + ' URL in lib/manifest.js';
			el.addEventListener('click', function (ev) { ev.preventDefault(); });
		});
	}

	/* ---------- 9. resume button — mark clearly if the file is not there yet - */
	function initResume() {
		if (location.protocol.indexOf('http') !== 0) return;
		var links = $$('[data-resume]');
		if (!links.length || !window.fetch) return;
		var href = links[0].getAttribute('href');

		fetch(href, { method: 'HEAD' }).then(function (res) {
			if (res.ok) return;
			throw new Error('missing');
		}).catch(function () {
			links.forEach(function (el) {
				el.setAttribute('data-todo', '');
				el.setAttribute('aria-disabled', 'true');
				el.title = 'Drop your PDF at ' + href;
				el.textContent = 'Resume — add PDF';
				el.removeAttribute('download');
				el.addEventListener('click', function (ev) { ev.preventDefault(); });
			});
		});
	}

	/* ---------- 10. coursework index (coursework.html only) ----------------- */
	/* Renders from window.__COURSEWORK__. Idempotent: if the list already has
	   entries in the HTML, this leaves them alone.                            */
	function initCoursework() {
		var list = $('[data-coursework]');
		if (!list) return;

		var cw = window.__COURSEWORK__ || {};
		var items = cw.items || [];
		var empty = $('[data-cw-empty]');

		var courseEl = $('[data-course]');
		if (courseEl && cw.course) courseEl.textContent = cw.course;
		var noteEl = $('[data-course-note]');
		if (noteEl && cw.note) noteEl.textContent = cw.note;

		if (list.children.length > 0) {
			if (empty) empty.remove();
			return;
		}
		if (!items.length) return;

		/* Build the markup BEFORE touching the empty state, so a failure in here
		   leaves the "no assignments yet" card on the page instead of nothing. */
		var html = items.map(function (item) {
			var links = '';
			if (item.live) {
				links += '<a class="btn btn-sm btn-primary" href="' + escHTML(item.live) +
					'" target="_blank" rel="noopener noreferrer">Live on Azure</a>';
			}
			if (item.repo) {
				links += '<a class="btn btn-sm btn-ghost" href="' + escHTML(item.repo) +
					'" target="_blank" rel="noopener noreferrer">Source</a>';
			}

			var stack = (item.stack || []).map(function (t) {
				return '<li>' + escHTML(t) + '</li>';
			}).join('');

			return '' +
				'<li class="cw-item card" data-glow data-reveal>' +
					'<div class="cw-head">' +
						'<div>' +
							(item.label ? '<p class="cw-label">' + escHTML(item.label) + '</p>' : '') +
							'<h2 class="cw-title">' + escHTML(item.title) + '</h2>' +
						'</div>' +
						(item.date ? '<p class="cw-date">' + escHTML(item.date) + '</p>' : '') +
					'</div>' +
					(item.summary ? '<p class="cw-summary">' + escHTML(item.summary) + '</p>' : '') +
					(stack ? '<ul class="tags">' + stack + '</ul>' : '') +
					(links ? '<div class="cw-links">' + links + '</div>' : '') +
				'</li>';
		}).join('');

		list.innerHTML = html;
		if (empty) empty.remove();
	}

	/* ---------- 11. footer year --------------------------------------------- */
	function initYear() {
		var el = $('[data-year]');
		if (el) el.textContent = String(new Date().getFullYear());
	}

	/* ---------- boot --------------------------------------------------------- */
	function boot() {
		/* Mounts first — they inject [data-reveal] / [data-glow] elements that the
		   inits below need to see. */
		safe(initCoursework, 'initCoursework');

		safe(initBackgroundField, 'initBackgroundField');
		safe(initCursor, 'initCursor');
		safe(initNav, 'initNav');
		safe(initScrollProgress, 'initScrollProgress');
		safe(initReveals, 'initReveals');
		safe(initSplit, 'initSplit');
		safe(initCountUp, 'initCountUp');
		safe(initCardGlow, 'initCardGlow');
		safe(initLinks, 'initLinks');
		safe(initResume, 'initResume');
		safe(initYear, 'initYear');
		document.documentElement.classList.add('is-ready');
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else {
		boot();
	}
})();
