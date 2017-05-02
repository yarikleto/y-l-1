window.addEventListener('load', function DOMContentLoaded() {
  'use strict';
  document.querySelector('body.loaded').classList.remove('loaded');

  // Отображаем просроченные лекции
  const dateNow = Date.now();
  [].forEach.call(document.querySelectorAll('.main__lecture'), lecture => {
    const lectureDate = new Date(lecture.querySelector('.main__lecture-date').innerText).valueOf();
    dateNow > lectureDate && lecture.classList.add('main__lecture--ended');
  });


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

  // Открываем фильтр
  document.querySelector('.lectures-filter__toggle').addEventListener('mousedown', function(e) {
    e.target.classList.toggle('active');
  });

  // Кнопка фильтра по школам
  document.querySelector('.lectures-filter__school-title').addEventListener('mousedown', function(e) {
    e.target.classList.toggle('active');
  });

  // Кнопка фильтра по лекторам
  document.querySelector('.lectures-filter__lector-title').addEventListener('mousedown', function(e) {
    e.target.classList.toggle('active');
  });

  filter.init();
});