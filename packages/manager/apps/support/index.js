import managerSupport from '@ovh-ux/manager-support';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import uiRouterAngularJs from '@uirouter/angularjs';
import angular from 'angular';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { state } from './index.routing';

angular
  .module('supportApp', [
    managerSupport,
    ngOvhOtrs,
    uiRouterAngularJs,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(state.name, state);
  })
  .config(/* @ngInject */ OtrsPopupProvider => OtrsPopupProvider
    .setBaseUrlTickets('/support/tickets'));
