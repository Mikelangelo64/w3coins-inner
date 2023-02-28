document.addEventListener('DOMContentLoaded', function () {
  const isSafari = () => {
    return (
      ~navigator.userAgent.indexOf('Safari') &&
      navigator.userAgent.indexOf('Chrome') < 0
    );
  };

  const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  if (isMobile.any()) {
    document.querySelector('body').classList.add('v-mobile');
    document.querySelector('html').classList.add('v-mobile');
  } else {
    document.querySelector('body').classList.add('v-desk');
    document.querySelector('html').classList.add('v-desk');
  }

  //normal vh and vw
  let vh = window.innerHeight * 0.01;
  let vw = window.innerWidth;

  document.body.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    if (vh === window.innerHeight * 0.01) {
      return;
    }

    vh = window.innerHeight * 0.01;
    document.body.style.setProperty('--vh', `${vh}px`);
  });

  //change header when scroll
  const header = document.querySelector('.header');
  let isScrollHeader = true;

  header &&
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50 && isScrollHeader) {
        //console.log(1);
        header.classList.add('_scrolled');
        isScrollHeader = false;
        return;
      }

      if (window.scrollY <= 50 && !isScrollHeader) {
        header.classList.remove('_scrolled');
        isScrollHeader = true;
        return;
      }
    });

  //popup
  const makeTimelinePopup = (item) => {
    const popupInner = item.querySelector('.popup__scroll');
    if (!popupInner) {
      return;
    }

    const timelinePopup = gsap.timeline({
      defaults: { duration: 0.3, ease: 'power4.inOut' },
    });
    timelinePopup
      //.set(popupInner, { x: '150%' })
      .set(item, { display: 'none' })
      .from(item, { display: 'none' })
      .from(item, { opacity: 0 })
      .from(popupInner, { x: '150%' })
      .to(item, { display: 'flex' })
      .to(item, { opacity: 1 })
      .to(popupInner, { x: 0 }, '-=75%');

    return timelinePopup;
  };

  const popupAnimations = {};
  const popups = document.querySelectorAll('.popup');

  if (popups.length !== 0) {
    popups.forEach((popup) => {
      const timeline = makeTimelinePopup(popup);
      timeline.pause();
      popupAnimations[popup.dataset.popupname] = timeline;
    });
  }

  //open popup
  const popupOpenBtns = document.querySelectorAll('.popup-open');

  const openPopup = (evt) => {
    const popupClass = evt.target.dataset.popup;
    const popup = document.querySelector(`[data-popupname=${popupClass}]`);

    popupAnimations[popupClass].play();

    popup.classList.add('_opened');
    document.querySelector('html').classList.add('_lock');
    document.querySelector('body').classList.add('_lock');
  };

  if (popupOpenBtns) {
    popupOpenBtns.forEach((item) => {
      item.addEventListener('click', (evt) => {
        evt.preventDefault();
        // console.log(popupAnimations);
        openPopup(evt);
      });
    });
  }

  //close popup
  const popupCloseBtns = document.querySelectorAll('.popup__close');
  const popupArr = document.querySelectorAll('.popup');

  const closePopup = (popup) => {
    popup.classList.remove('_opened');
    const popupClass = popup.dataset.popupname;
    //console.dir(popup);
    popupAnimations[popupClass].reverse();

    document.querySelector('html').classList.remove('_lock');
    document.querySelector('body').classList.remove('_lock');
  };

  if (popupCloseBtns) {
    popupCloseBtns.forEach((item) => {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        const popup = this.parentElement.parentElement.parentElement;
        closePopup(popup);
      });
    });
  }

  if (popupArr) {
    popupArr.forEach((item) => {
      item.addEventListener('click', function (evt) {
        //if (evt.target === this) {
        closePopup(this);
        //}
      });
    });

    window.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 27) {
        const popup = document.querySelector('.popup._opened');
        if (popup) {
          closePopup(popup);
        }
      }
    });
  }

  //table add empty sales
  const tables = document.querySelectorAll('[data-table]');
  let lastColumnCount = getComputedStyle(document.body).getPropertyValue(
    '--table-count'
  );

  const removeEmptyCells = (table) => {
    const emptyCells = table.querySelectorAll('.stake-table__item._empty');

    if (emptyCells.length === 0) {
      return;
    }

    emptyCells.forEach((empty) => {
      empty.remove();
    });
  };

  const addEmptyCell = (childrenCount, columnCount, table) => {
    if (childrenCount % columnCount === 0) {
      return;
    }
    const counter = childrenCount + 1;

    const child = document.createElement('LI');
    child.setAttribute('class', 'stake-table__item _empty');
    table.appendChild(child);

    addEmptyCell(counter, columnCount, table);
  };

  const fixTable = (tables) => {
    if (tables.length === 0) {
      return;
    }

    tables.forEach((table) => {
      const columnCount = getComputedStyle(document.body).getPropertyValue(
        '--table-count'
      );
      let childrenCount = table.childElementCount;
      //console.log(columnCount);
      addEmptyCell(childrenCount, columnCount, table);
    });
  };

  tables.length !== 0 &&
    tables.forEach((table) => {
      removeEmptyCells(table);
    });

  fixTable(tables);

  window.addEventListener('resize', () => {
    if (vh !== window.innerHeight * 0.01) {
      return;
    }

    const columnCount = getComputedStyle(document.body).getPropertyValue(
      '--table-count'
    );

    if (lastColumnCount === columnCount || tables.length === 0) {
      return;
    }

    tables.forEach((table) => {
      removeEmptyCells(table);
    });

    lastColumnCount = columnCount;
    fixTable(tables);
  });

  //swipers
  const separateSections = document.querySelectorAll('.separate');

  const separateSlidersArray = [];

  if (separateSections.length !== 0) {
    separateSections.forEach((separate) => {
      const slider = separate.querySelector('.separate-slider.swiper');
      if (!slider) {
        return;
      }

      const paginationContainer = separate.querySelector(
        '.separate-header .separate-header__btn__container'
      );
      if (!paginationContainer) {
        return;
      }

      const bulletContentArray =
        paginationContainer.querySelectorAll('.separate-bullet');
      if (bulletContentArray.length === 0) {
        return;
      }

      const swiperInit = new Swiper(slider, {
        effect: 'fade',
        autoHeight: true,
        allowTouchMove: false,
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
          el: paginationContainer,
          clickable: true,
          renderBullet: function (index, className) {
            return `
              <button class="${className} _btn separate-bullet">
                ${
                  bulletContentArray[index]
                    ? bulletContentArray[index].innerHTML
                    : 'category'
                }
              </button>
            `;
          },
        },
      });

      separateSlidersArray.push(swiperInit);
    });
  }
});
