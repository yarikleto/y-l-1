const filter = (function() {
  'use strict';
  /**
   * Модуль фильтрации
   * @return {Object} возвращает обьект с методами
   * 
   */
  const cacheDom = {};
  const filtersStack = [];

  function cachingDom() {
    cacheDom.lectures = document.querySelectorAll('.main__lecture');
    cacheDom.filterDateInput = document.querySelector('.lectures-filter__date-input');
    cacheDom.filterSchoolContent = document.querySelector('.lectures-filter__school-content');
    cacheDom.filterLectorContent = document.querySelector('.lectures-filter__lector-content');
    cacheDom.filterTiggle = document.querySelector('.lectures-filter__toggle');
    cacheDom.filterSchoolTitle = document.querySelector('.lectures-filter__school-title');
    cacheDom.filterLectorTitle = document.querySelector('.lectures-filter__lector-title');
  }

  function addEvents() {
    // Событие изменения поля с датой
    cacheDom.filterDateInput.addEventListener('change', _ => filteredAllLecture());

    // Событие клика по школе в фильтре
    cacheDom.filterSchoolContent.addEventListener('mousedown', e => {
      const targetClassList = e.target.classList;
      if (targetClassList.contains('lectures-filter__school-item')) {
        targetClassList.toggle('active');
        filteredAllLecture();
      };
    });

    // Событие клика по лектору в фильтре
    cacheDom.filterLectorContent.addEventListener('mousedown', e => {
      const targetClassList = e.target.classList;
      if (targetClassList.contains('lectures-filter__lector-item')) {
        targetClassList.toggle('active');
        filteredAllLecture();
      }
    });

    cacheDom.filterTiggle.addEventListener('mousedown', e => {
      e.target.classList.toggle('active');
    });
    cacheDom.filterSchoolTitle.addEventListener('mousedown', e => {
      e.target.classList.toggle('active');
    });
    cacheDom.filterLectorTitle.addEventListener('mousedown', e => {
      e.target.classList.toggle('active');
    });
  }

  // Функции пререндеринга
  function checkLectureOnOdd(lecture, i) {
    /**
     * Функция помечает нечетную лекцию
     */
    lecture.setAttribute('data-odd', i % 2 !== 0);
  }

  function checkLectureOnOverdue(lecture) {
    /**
     * Функция помечает просроченную лекцию
     */

    const dateNow = Date.now();
    const lectureDate = new Date(lecture.querySelector('.main__lecture-date').innerText).valueOf();
    dateNow > lectureDate && lecture.classList.add('main__lecture--ended');
  }

  function prerenderingLectures() {
    /**
     * Функция выполняет предварительную обработку всех лекций
     *
     * @param {Object} arguments Принимает произвольное количетсво функций для
     * предварительной обработки лекции
     */
    [].forEach.call(cacheDom.lectures, (lecture, i) => {
      [].forEach.call(arguments, renderFn => {
        if (typeof renderFn !== 'function') throw new Error('В функции пререндеринга один из переданных параметров не является функцией');
        renderFn(lecture, i);
      });
    });
  }

  function filteredAllLecture() {
    /**
     * Функция проходит по каждой лекции и к ней применяет все фильтрующие функции
     */
    let countTrueLecture = 0;
    [].forEach.call(cacheDom.lectures, lecture => {
      let isValidLecture = filtersStack.every(filterFunc => filterFunc(lecture));

      if (isValidLecture === true) {
        countTrueLecture += 1;
        if (countTrueLecture % 2 !== 0) {
          lecture.setAttribute('data-odd', true);
        } else {
          lecture.setAttribute('data-odd', false);
        }
        lecture.setAttribute('data-display', true);
      } else lecture.setAttribute('data-display', false);
    });
  }

  // Стандартные функции фильтрации

  function filterDate(lecture) {
    /**
     * Фильтрует по дате
     *
     * @param {HTMLElement} принимает одну лекцию. Проверяет, нужно ли ее отображать или нет
     * @return {Boolean} Возвращает результат проверки
     */

    // Узнаем дату текущей лекции
    const lectureDate = lecture.querySelector('.main__lecture-date');
    // Приводим выбранную дату в фильтре к нужному виду, чтобы корректно сравнивать ее с датой лекции
    const correctInputDate = cacheDom.filterDateInput.value.replace(/-/g, '.');

    // Если дата фильтра пуста, либо даты совпадают, то возвращаем положительный результат
    if (correctInputDate === '' || lectureDate.innerText === correctInputDate) return true;
    // Иначе отрицательный
    return false;
  }

  function filterSchool(lecture) {
    /**
     * Фильтрует по школам
     *
     * @param {HTMLElement} принимает одну лекцию. Проверяет, нужно ли ее отображать или нет
     * @return {Boolean} Возвращает результат проверки
     */
    const activeSchoolFilterItems = document.querySelectorAll('.lectures-filter__school-item.active');
    // Если активных школ в фильтре нет, то пропускать все лекции
    if (activeSchoolFilterItems.length === 0) return true;

    return [].some.call(activeSchoolFilterItems, item => {
      const filterText = item.innerText;
      const schoolsList = lecture.querySelectorAll('.main__name-of-school');
      return [].some.call(schoolsList, school => school.innerText === filterText);
    });
  }

  function filterLector(lecture) {
    /**
     * Фильтрует по лекторам
     *
     * @param {HTMLElement} принимает одну лекцию. Проверяет, нужно ли ее отображать или нет
     * @return {Boolean} Возвращает результат проверки
     */
    const activeLectorFilterItems = document.querySelectorAll('.lectures-filter__lector-item.active');
    // Если активных лекторов в фильтре нет, то пропускать все лекции
    if (activeLectorFilterItems.length === 0) return true;

    return [].some.call(activeLectorFilterItems, item => {
      const filterText = item.innerText;
      const lectorsList = lecture.querySelectorAll('.main__name-of-lector');
      return [].some.call(lectorsList, lector => lector.innerText === filterText);
    });
  }

  function addFilterFnsToStack() {
    /**
     * Добавляет все функции фильрации в стэк фильтров
     * 
     * @param {Object} arguments Принимает произвольное количетсво функций фильтрации
     */
    [].forEach.call(arguments, filterFn => filtersStack.push(filterFn));
  }

  return {
    init: _ => {
      cachingDom();
      prerenderingLectures(checkLectureOnOdd, checkLectureOnOverdue);
      addEvents();
      addFilterFnsToStack(filterDate, filterSchool, filterLector);
    },
    addFilter: (filterFn, eventName, eventFn) => {

    }
  }
})();
