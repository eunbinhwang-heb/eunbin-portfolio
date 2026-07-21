(function () {
	'use strict';

	/* Navbar scroll state ------------------------------------------------- */
	var navbar = document.querySelector('.navbar');
	var backToTop = document.querySelector('.back-to-top');

	function onScroll() {
		var y = window.scrollY || document.documentElement.scrollTop;
		if (navbar) navbar.classList.toggle('scrolled', y > 20);
		if (backToTop) backToTop.classList.toggle('show', y > 500);
	}
	document.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	if (backToTop) {
		backToTop.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	/* Mobile nav toggle ----------------------------------------------------- */
	var navToggle = document.querySelector('.nav-toggle');
	var mobilePanel = document.querySelector('.mobile-panel');
	if (navToggle && mobilePanel) {
		navToggle.addEventListener('click', function () {
			mobilePanel.classList.toggle('open');
		});
		mobilePanel.querySelectorAll('a').forEach(function (a) {
			a.addEventListener('click', function () { mobilePanel.classList.remove('open'); });
		});
	}

	/* Active nav link on scroll -------------------------------------------- */
	var sections = document.querySelectorAll('section[id]');
	var navAnchors = document.querySelectorAll('.nav-links a, .mobile-panel a');

	if ('IntersectionObserver' in window && sections.length) {
		var sectionObserver = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					var id = entry.target.getAttribute('id');
					navAnchors.forEach(function (a) {
						a.classList.toggle('active', a.getAttribute('href') === '#' + id);
					});
				}
			});
		}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

		sections.forEach(function (s) { sectionObserver.observe(s); });
	}

	/* Typing role rotator ----------------------------------------------------*/
	var TxtRotate = function (el, toRotate, period) {
		this.toRotate = toRotate;
		this.el = el;
		this.loopNum = 0;
		this.period = parseInt(period, 10) || 2000;
		this.txt = '';
		this.isDeleting = false;
		this.tick();
	};

	TxtRotate.prototype.tick = function () {
		var i = this.loopNum % this.toRotate.length;
		var fullTxt = this.toRotate[i];

		this.txt = this.isDeleting
			? fullTxt.substring(0, this.txt.length - 1)
			: fullTxt.substring(0, this.txt.length + 1);

		this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

		var that = this;
		var delta = 300 - Math.random() * 100;
		if (this.isDeleting) delta /= 2;

		if (!this.isDeleting && this.txt === fullTxt) {
			delta = this.period;
			this.isDeleting = true;
		} else if (this.isDeleting && this.txt === '') {
			this.isDeleting = false;
			this.loopNum++;
			delta = 500;
		}

		setTimeout(function () { that.tick(); }, delta);
	};

	document.querySelectorAll('.txt-rotate').forEach(function (el) {
		var toRotate = el.getAttribute('data-rotate');
		var period = el.getAttribute('data-period');
		if (toRotate) new TxtRotate(el, JSON.parse(toRotate), period);
	});

	/* AOS init ----------------------------------------------------------------*/
	if (window.AOS) {
		window.AOS.init({ duration: 600, easing: 'ease-out-cubic', once: true, offset: 60 });
	}
})();
