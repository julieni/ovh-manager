/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
/* eslint-enable import/no-webpack-loader-syntax */

import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/manager-veeam-enterprise';

import { momentConfiguration } from './config';

import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

angular
  .module('veeamEnterpriseApp', [
    'ovhManagerCore',
    'ovhManagerVeeamEnterprise',
  ])
  .config(momentConfiguration);
