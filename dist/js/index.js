window.addEventListener('load', function DOMContentLoaded() {
  'use strict';
  document.querySelector('body.loaded').classList.remove('loaded');

  // Открывать окно с информацией о лекторе
  let lastOpenedLector = null;
  const lecturesList = document.querySelector('.main__lectures-list');
  lecturesList.addEventListener('mousedown', function clickOnLecturesList(e) {
    const target = e.target;
    if (target.classList.contains('main__name-of-lector')) {
      lastOpenedLector && lastOpenedLector.classList.remove('active');
      target.classList.add('active');
      lastOpenedLector = target;
    } else if (target.classList.contains('main__close-info')) {
      target.parentElement.previousElementSibling.classList.remove('active');
    }
  });

  filter.init();
});