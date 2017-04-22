document.addEventListener('DOMContentLoaded', function DOMContentLoaded() {
  'use strict';


  // Отображаем просроченные лекции
  const dateNow = Date.now();
  [].forEach.call(document.querySelectorAll('.main__lecture'), lecture => {
    const lectureDate = new Date( lecture.querySelector('.main__lecture-date').innerText ).valueOf();
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


 // Запуск всех фильтров
  const lectures = document.querySelectorAll('.main__lecture');

  function filteredAllLecture() {
    [].forEach.call(lectures, lecture => {
      let isValidLecture = filteredAllLecture.allFilters.every( filterFunc => {
        return filterFunc(lecture);
      } );
      if (isValidLecture) lecture.style.display = 'block';
      else lecture.style.display = 'none';
    });
  }
  filteredAllLecture.allFilters = [filterDate, filterSchool, filterLector];



  // фильтр по дате
  const filterDateInput = document.querySelector('.lectures-filter__date-input');
  function filterDate(lecture) {
    /*
    * return type : boolean
    */
    const lectureDate = lecture.querySelector('.main__lecture-date');
    const correctInputDate = filterDateInput.value.replace(/-/g, '.');
    if (correctInputDate === '' || lectureDate.innerText === correctInputDate) return true;
    return false;
  }

  filterDateInput.addEventListener('change', () => {
    filteredAllLecture();
  });



  // фильтр по школам
  function filterSchool(lecture) {
    /*
    * return type : boolean
    */
    const schoolFilterItems = document.querySelectorAll('.lectures-filter__school-item.active');
    if (schoolFilterItems.length === 0) return true;
    return [].some.call(schoolFilterItems, item => {
      const filterText = item.innerText;
      const schoolsList = lecture.querySelectorAll('.main__name-of-school');
      return [].some.call(schoolsList, school => {
        return school.innerText === filterText;
      });
    });
  }

  document.querySelector('.lectures-filter__school-content').addEventListener('mousedown', e => {
    if (e.target.classList.contains('lectures-filter__school-item')) {
      e.target.classList.toggle('active');
      filteredAllLecture();
    }
  });



    // фильтр по лекторам

  function filterLector(lecture) {
    /*
    * return type : boolean
    */
    const lectorFilterItems = document.querySelectorAll('.lectures-filter__lector-item.active');
    if (lectorFilterItems.length === 0) return true;
    return [].some.call(lectorFilterItems, item => {
      const filterText = item.innerText;
      const lectorsList = lecture.querySelectorAll('.main__name-of-lector');
      return [].some.call(lectorsList, lector => {
        return lector.innerText === filterText;
      });
    });
  }

  document.querySelector('.lectures-filter__lector-content').addEventListener('mousedown', e => {
    if (e.target.classList.contains('lectures-filter__lector-item')) {
      e.target.classList.toggle('active');
      filteredAllLecture();
    }
  });

});