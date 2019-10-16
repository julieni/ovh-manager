import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';


import component from './telecom-telephony-alias-portability-portabilities.component';
import routing from './telecom-telephony-alias-portability-portabilities.routing';

const moduleName = 'ovhManagerTelecomPortabilities';

angular
  .module(moduleName, [
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('portabilities', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
