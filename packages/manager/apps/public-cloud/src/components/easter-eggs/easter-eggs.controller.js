import angular from 'angular';
import Konami from 'konami-code-js';

import {
  EASTER_EGGS_LOCAL_STORAGE_KEY,
  EASTER_EGGS_LOCAL_STORAGE_KEY_ACTIVATE,
  EASTER_EGGS_LOCAL_STORAGE_KEY_DEACTIVATE,
  EASTER_EGGS_TRACKING_KEY,
} from './easter-eggs.constants';

import controller from './modal/controller';
import template from './modal/template.html';

export default class EeasterEggsController {
  /* @ngInject */
  constructor($document, $timeout, $uibModal, atInternet) {
    this.$document = $document;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.atInternet = atInternet;
  }

  $onInit() {
    this.rootElement = this.$document[0].querySelector('html');

    if (EeasterEggsController.isDarkThemeActive()) {
      this.rootElement.classList.add('theme-dark');
    }

    this.konami = new Konami(() => this.toggle());
  }

  /**
   * Check if the dark theme is activate by looking into the localStorage value.
   * @return {Boolean}
   */
  static isDarkThemeActive() {
    return localStorage
      .getItem(EASTER_EGGS_LOCAL_STORAGE_KEY) === EASTER_EGGS_LOCAL_STORAGE_KEY_ACTIVATE;
  }

  /**
   * Activate the dark theme and send a tracking information.
   * @return {void}
   */
  activateDarkTheme() {
    localStorage.setItem(
      EASTER_EGGS_LOCAL_STORAGE_KEY,
      EASTER_EGGS_LOCAL_STORAGE_KEY_ACTIVATE,
    );

    this.atInternet.trackClick({
      name: EASTER_EGGS_TRACKING_KEY,
      type: 'action',
    });

    this.rootElement.classList.add('theme-dark');
  }

  /**
   * Deactivate the dark theme.
   * @return {void}
   */
  deactiveDarkTheme() {
    localStorage.setItem(
      EASTER_EGGS_LOCAL_STORAGE_KEY,
      EASTER_EGGS_LOCAL_STORAGE_KEY_DEACTIVATE,
    );

    this.rootElement.classList.remove('theme-dark');
  }

  /**
   * Display a modal to inform the user that he is about to move to
   * the dark side of the moon.
   * @return {Promise}
   */
  openModal() {
    return this.$uibModal
      .open({
        template,
        controller,
        controllerAs: '$ctrl',
      })
      .result
      .then(shouldActiveDarkTheme => (shouldActiveDarkTheme
        ? this.activateDarkTheme()
        : angular.noop))
      .catch(angular.noop); // Prevent unhandled rejection.
  }

  toggle() {
    if (EeasterEggsController.isDarkThemeActive()) {
      return this.deactiveDarkTheme();
    }
    return this.openModal();
  }
}
