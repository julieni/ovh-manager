import set from 'lodash/set';

import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ovhManagerCore from '@ovh-ux/manager-core';

import autorenew from './autoRenew/autorenew.module';
import orders from './orders/orders.module';
import sla from './sla/sla.module';
import termination from './confirmTerminate/termination.module';

import config from '../config/config';
import routing from './billing.routing';

angular
  .module('Billing', [
    ovhManagerCore,
    autorenew,
    'Billing.constants',
    'Billing.controllers',
    'Billing.directives',
    'Billing.filters',
    'Billing.services',
    'ngRoute',
    'ngSanitize',
    orders,
    ngOvhExportCsv,
    'ngOvhUtils',
    sla,
    termination,
    'ui.bootstrap',
    'ui.router',
  ])
  .constant('BILLING_BASE_URL', 'billing/')
  .constant('Billing.constants', {
    aapiRootPath: config.aapiRootPath,
    swsProxyRootPath: config.swsProxyRootPath,
    paymentMeans: ['bankAccount', 'paypal', 'creditCard', 'deferredPaymentAccount'],
    target: config.target,
  })
  .constant('LANGUAGES', config.constants.LANGUAGES)
  .constant('Billing.URLS', {
    renew: config.constants.billingRenew,
  })
  .config(routing)
  .run(/* @ngInject */ ($rootScope, coreConfig) => {
    set($rootScope, 'worldPart', coreConfig.getRegion());
  });