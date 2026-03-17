const filter = (function() {
  'use strict';
  /**
   * Filter module
   * @return {Object} returns an object with methods
   *
   */
  const cacheDom = {};
  const filtersStack = [];

  function cachingDom() {
    cacheDom.lectures = document.querySelectorAll('.main__lecture');
    cacheDom.filterDateInput = document.querySelector('.lectures-filter__date-input');
    cacheDom.filterSchoolContent = document.querySelector('.lectures-filter__school-content');
    cacheDom.filterLectorContent = document.querySelector('.lectures-filter__lector-content');
    cacheDom.filterToggle = document.querySelector('.lectures-filter__toggle');
    cacheDom.filterSchoolTitle = document.querySelector('.lectures-filter__school-title');
    cacheDom.filterLectorTitle = document.querySelector('.lectures-filter__lector-title');
  }

  function addEvents() {
    // Date field change event
    cacheDom.filterDateInput.addEventListener('change', _ => filteredAllLecture());

    // Click event on school in filter
    cacheDom.filterSchoolContent.addEventListener('mousedown', e => {
      const targetClassList = e.target.classList;
      if (targetClassList.contains('lectures-filter__school-item')) {
        targetClassList.toggle('active');
        filteredAllLecture();
      };
    });

    // Click event on lecturer in filter
    cacheDom.filterLectorContent.addEventListener('mousedown', e => {
      const targetClassList = e.target.classList;
      if (targetClassList.contains('lectures-filter__lector-item')) {
        targetClassList.toggle('active');
        filteredAllLecture();
      }
    });

    cacheDom.filterToggle.addEventListener('mousedown', e => {
      e.target.classList.toggle('active');
    });
    cacheDom.filterSchoolTitle.addEventListener('mousedown', e => {
      e.target.classList.toggle('active');
    });
    cacheDom.filterLectorTitle.addEventListener('mousedown', e => {
      e.target.classList.toggle('active');
    });
  }

  // Pre-rendering functions
  function checkLectureOnOdd(lecture, i) {
    /**
     * Marks odd-numbered lectures
     */
    lecture.setAttribute('data-odd', i % 2 !== 0);
  }

  function checkLectureOnOverdue(lecture) {
    /**
     * Marks overdue lectures
     */

    const dateNow = Date.now();
    const lectureDate = new Date(lecture.querySelector('.main__lecture-date').innerText).valueOf();
    dateNow > lectureDate && lecture.classList.add('main__lecture--ended');
  }

  function prerenderingLectures() {
    /**
     * Performs preliminary processing of all lectures
     *
     * @param {Object} arguments Accepts an arbitrary number of functions for
     * preliminary lecture processing
     */
    [].forEach.call(cacheDom.lectures, (lecture, i) => {
      [].forEach.call(arguments, renderFn => {
        if (typeof renderFn !== 'function') throw new Error('One of the passed parameters in the pre-rendering function is not a function');
        renderFn(lecture, i);
      });
    });
  }

  function filteredAllLecture() {
    /**
     * Iterates through each lecture and applies all filter functions to it
     */
    let countTrueLecture = 0;
    [].forEach.call(cacheDom.lectures, lecture => {
      let isValidLecture = filtersStack.every(filterFunc => filterFunc(lecture));

      if (isValidLecture === true) {
        countTrueLecture += 1;
        lecture.setAttribute('data-odd', countTrueLecture % 2 !== 0);
        lecture.setAttribute('data-display', true);
      } else lecture.setAttribute('data-display', false);
    });
  }

  // Standard filter functions

  function filterDate(lecture) {
    /**
     * Filters by date
     *
     * @param {HTMLElement} accepts a single lecture. Checks whether it should be displayed or not
     * @return {Boolean} Returns the check result
     */

    // Get the current lecture date
    const lectureDate = lecture.querySelector('.main__lecture-date');
    // Convert the selected filter date to the correct format for comparison with the lecture date
    const correctInputDate = cacheDom.filterDateInput.value.replace(/-/g, '.');

    // If the filter date is empty, or the dates match, return a positive result
    if (correctInputDate === '' || lectureDate.innerText === correctInputDate) return true;
    // Otherwise negative
    return false;
  }

  function filterSchool(lecture) {
    /**
     * Filters by schools
     *
     * @param {HTMLElement} accepts a single lecture. Checks whether it should be displayed or not
     * @return {Boolean} Returns the check result
     */
    const activeSchoolFilterItems = document.querySelectorAll('.lectures-filter__school-item.active');
    // If there are no active schools in the filter, pass all lectures
    if (activeSchoolFilterItems.length === 0) return true;

    return [].some.call(activeSchoolFilterItems, item => {
      const filterText = item.innerText;
      const schoolsList = lecture.querySelectorAll('.main__name-of-school');
      return [].some.call(schoolsList, school => school.innerText === filterText);
    });
  }

  function filterLector(lecture) {
    /**
     * Filters by lecturers
     *
     * @param {HTMLElement} accepts a single lecture. Checks whether it should be displayed or not
     * @return {Boolean} Returns the check result
     */
    const activeLectorFilterItems = document.querySelectorAll('.lectures-filter__lector-item.active');
    // If there are no active lecturers in the filter, pass all lectures
    if (activeLectorFilterItems.length === 0) return true;

    return [].some.call(activeLectorFilterItems, item => {
      const filterText = item.innerText;
      const lectorsList = lecture.querySelectorAll('.main__name-of-lector');
      return [].some.call(lectorsList, lector => lector.innerText === filterText);
    });
  }

  function addFilterFnsToStack() {
    /**
     * Adds all filter functions to the filter stack
     *
     * @param {Object} arguments Accepts an arbitrary number of filter functions
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
