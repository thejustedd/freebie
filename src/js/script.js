// import Swiper from 'swiper';
// import 'swiper/css';

const headerSlider = new Swiper('.header__slider', {
  autoplay: {
    delay: 10000,
  },
  loop: true,
  draggable: false,
  noSwiping: true,
  noSwipingClass: 'swiper-slide',
  effect: 'fade',
  preloadImages: false,
  lazy: true,
});

const aboutSlider = new Swiper('.about__slider', {
  autoplay: {
    delay: 5000,
  },
  loop: true,
  slidesPerView: 3,
  spaceBetween: 150,
  navigation: {
    nextEl: ".about__slider-next",
  },
  pagination: {
    el: ".about__slider-pagination",
    clickable: true,
  },
  grabCursor: true,
  effect: "creative",
  creativeEffect: {
    prev: {
      translate: ["-120%", 0, -500],
    },
    next: {
      translate: ["120%", 0, -500],
    },
  },
});

const header = document.querySelector('.header');
const mainMenu = document.querySelector('.main-menu');
const logoImg = document.querySelector('.logo__img');
const footerNav = document.querySelector('.footer__nav');

const headerObserver = new IntersectionObserver((entries, observer) => {
  if (!mainMenu) return;

  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      mainMenu.classList.add('nav-scrolled');
    } else {
      mainMenu.classList.remove('nav-scrolled');
    }
  });
}, { rootMargin: '-95px 0px 0px 0px' });
headerObserver.observe(header);

const footerNavObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      mainMenu.classList.add('main-menu--hide');
    } else {
      mainMenu.classList.remove('main-menu--hide');
    }
  });
}, { rootMargin: '0px 0px 0px 0px' });
if (footerNav) footerNavObserver.observe(footerNav);

const toggleBtn = document.querySelector('.menu__toggle-btn');
const menuList = document.querySelector('.menu__list');
const menuListLink = document.querySelector('.menu__list-link');

if (toggleBtn) toggleBtn.addEventListener('click', e => {
  toggleBtn.classList.toggle('menu__toggle-btn--active');
  menuList.classList.toggle('menu__list--active');
  document.body.classList.toggle('body--lock');
});

if (menuList) menuList.addEventListener('click', e => {
  if (!e.target.closest('.menu__list-link')) return;

  toggleBtn.classList.remove('menu__toggle-btn--active');
  menuList.classList.remove('menu__list--active');
  document.body.classList.remove('body--lock');
});

let touchstartX = 0;
let touchstartY = 0;
let touchendX = 0;
let touchendY = 0;
let timeStart = 0;

const gestureZone = document.body;

gestureZone.addEventListener('touchstart', function (event) {
  timeStart = Date.now();
  touchstartX = event.changedTouches[0].screenX;
  touchstartY = event.changedTouches[0].screenY;
}, false);

gestureZone.addEventListener('touchend', function (event) {
  const timeDiff = Date.now() - timeStart;
  touchendX = event.changedTouches[0].screenX;
  touchendY = event.changedTouches[0].screenY;
  handleGesture(timeDiff);
}, false);

function handleGesture(timeDiff) {
  if (touchendX - touchstartX > 100 && timeDiff < 300) {
    toggleBtn.classList.remove('menu__toggle-btn--active');
    menuList.classList.remove('menu__list--active');
    document.body.classList.remove('body--lock');
  }

  if (touchstartX - touchendX > 100 && timeDiff < 300) {
    toggleBtn.classList.add('menu__toggle-btn--active');
    menuList.classList.add('menu__list--active');
    document.body.classList.add('body--lock');
  }
}

/* TEST */
const mainWrapper = document.querySelector('.main-wrapper');

const pageSlider = new Swiper('.page', {
  wrapperClass: 'page__wrapper',
  slideClass: 'page__screen',
  direction: 'vertical',
  // slidesPerView: 'auto',
  parallax: true,
  keyboard: {
    enabled: true,
    onliInViewport: true,
    pageUpDown: true,
  },
  // mousewheel: {
  //     sensitivity: 1
  // },
  mousewheel: false,
  watchOverflow: true,
  speed: 500,
  observer: true,
  observerParents: true,
  observeSlideChildren: true,
  // freeMode: true,
  // pagination: {
  //     el: '.page__pagination',
  //     type: 'bullets',
  //     clickable: true,
  //     bulletClass: 'page__bullet',
  //     bulletActiveClass: 'page__bullet--active'
  // },
  scrollbar: {
    el: '.page__scroll',
    dragClass: 'page__drag-scroll',
    draggable: true
  },
  hashNavigation: true,
  simulateTouch: false,
  init: false,
  watchOverflow: true,
  on: {
    init: function () {
      const scrollBtn = document.querySelector('.header__scroll-btn')
      if (scrollBtn) scrollBtn.addEventListener('click', e => pageSlider.slideTo(1, 500));

      const logotypes = document.querySelectorAll('.logo');
      if (logotypes.length) logotypes.forEach(logo => logo.addEventListener('click', e => pageSlider.slideTo(0, 500)));

      menuSlider(headerMenuLinks);
      menuSlider(footerMenuLinks);
      mainWrapper.classList.add('main-wrapper--loaded');
      mousewheel();
      touchmove();
    },
    slideChange: function () {
      menuSliderRemoveActive();

      if (headerMenuLinks.length >= pageSlider.realIndex + 1) {
        headerMenuLinks[pageSlider.realIndex].classList.add('menu__list-link--active');
      }

      if (footerMenuLinks.length >= pageSlider.realIndex + 1) {
        footerMenuLinks[pageSlider.realIndex].classList.add('menu__list-link--active');
      }
    }
  }
});

const headerMenuLinks = document.querySelectorAll('.main-menu .menu__list-link');
const footerMenuLinks = document.querySelectorAll('.footer .menu__list-link');

function menuSlider(menuLinks) {
  const length = Math.min(menuLinks.length, pageSlider.slides.length)
  if (!length) return;

  if (headerMenuLinks.length >= pageSlider.realIndex + 1) {
    headerMenuLinks[pageSlider.realIndex].classList.add('menu__list-link--active');
  }

  for (let i = 0; i < length; i++) {
    const menuLink = menuLinks[i];

    menuLink.addEventListener('click', e => {
      menuSliderRemoveActive();
      pageSlider.slideTo(i, 500);
      menuLink.classList.add('menu__list-link--active');
      e.preventDefault();
    });
  }

  // if (!menuLinks.length) return;

  // menuLinks[pageSlider.realIndex].classList.add('menu__list-link--active');

  // for (let i = 0; i < menuLinks.length; i++) {
  //     const menuLink = menuLinks[i];

  //     menuLink.addEventListener('click', e => {
  //         menuSliderRemoveActive();
  //         pageSlider.slideTo(i, 500);
  //         menuLink.classList.add('menu__list-link--active');
  //         e.preventDefault();
  //     });
  // }
}

function menuSliderRemoveActive() {
  const menuLinksActive = document.querySelectorAll('.menu__list-link--active');

  if (!menuLinksActive.length) return;

  menuLinksActive.forEach(menuLink => menuLink.classList.remove('menu__list-link--active'));
}

pageSlider.init();

///////////////////////////////////////////////////
pageSlider.on('slideChangeTransitionEnd', e => {
  mousewheel();
  touchmove();
});

pageSlider.on('resize', e => {
  mousewheel();
  touchmove();
});

var isSomeKeyPressed = false;
document.addEventListener('keydown', e => {
  isSomeKeyPressed = true;
  pageSlider.mousewheel.disable();
});

document.addEventListener('keyup', e => {
  isSomeKeyPressed = false;
  pageSlider.mousewheel.enable();
});

function touchmove() {
  let startScroll, touchStart, touchCurrent;
  pageSlider.slides.on('touchstart', e => {
    startScroll = e.currentTarget.scrollTop;
    touchStart = e.targetTouches[0].pageY;
    startScroll = Math.floor(startScroll);
    // console.log('startScroll:', startScroll);
    // console.log('touchStart:', touchStart);
  }, true);
  pageSlider.slides.on('touchmove', e => {
    touchCurrent = e.targetTouches[0].pageY;
    let touchesDiff = touchCurrent - touchStart;
    // console.log('touchesDiff:', touchesDiff);
    let slide = e.currentTarget;
    let diffHeight = slide.scrollHeight - slide.offsetHeight;
    // console.log('diffHeight:', slide.scrollHeight - slide.offsetHeight);
    let onlyScrolling =
      (slide.scrollHeight > slide.offsetHeight) && (
        (touchesDiff < 0 && startScroll >= 0 && diffHeight - startScroll > 1) ||
        (touchesDiff > 0 && startScroll > 0 && startScroll <= diffHeight)
        // (touchesDiff < 0 && startScroll === 0) ||
        // (touchesDiff > 0 && startScroll === diffHeight) ||
        // (startScroll > 0 && startScroll < diffHeight)
      );
    if (onlyScrolling) e.stopPropagation();
  }, true);
}

function mousewheel() {
  pageSlider.mousewheel.enable();

  if (isSomeKeyPressed) {
    pageSlider.mousewheel.disable();
    return;
  }

  let acs = document.querySelector('.page__screen.swiper-slide-active');
  let hasVerticalScrollbar = acs.scrollHeight > acs.clientHeight;

  if (hasVerticalScrollbar) {
    // let scrollHeight = acs.scrollHeight;
    // let slideSize = acs.swiperSlideSize;
    // let scrollDifferenceTop = scrollHeight - slideSize;

    acs.addEventListener('wheel', findScrollDirectionOtherBrowsers);

    function findScrollDirectionOtherBrowsers(e) {
      if (isSomeKeyPressed) {
        pageSlider.mousewheel.disable();
        return;
      }

      let scrollHeight = acs.scrollHeight;
      let slideSize = acs.swiperSlideSize;
      let scrollDifferenceTop = scrollHeight - slideSize;

      let scrollDifference = scrollHeight - slideSize - acs.scrollTop;

      // Scroll wheel browser compatibility
      let delta = e.wheelDelta || -1 * e.deltaY;

      // Enable scrolling if at edges
      let spos = delta < 0 ? 0 : scrollDifferenceTop;

      // console.log('scrollDifference:', scrollDifference);
      // console.log('spos:', spos);
      if (Math.abs(scrollDifference) <= 1) scrollDifference = 0;
      if (scrollDifference != spos)
        pageSlider.mousewheel.disable();
      else {
        pageSlider.mousewheel.enable();
      }
    }
  }
}

function testWebP(callback) {
  const webP = new Image();
  webP.onload = webP.onerror = () => callback(webP.height == 2);
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(support => support ? document.body.classList.add('webp') : document.body.classList.add('no-webp'));