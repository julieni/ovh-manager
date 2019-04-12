import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-api-wrappers'; // should be a peer dependency of ovh-api-services
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import edit from './edit';
import instances from './instances';
import kubernetes from './kubernetes';
import legacy from './legacy';
import sshKeys from './ssh-keys';
import storages from './storages';
import routing from './project.routing';

const moduleName = 'ovhManagerPciProject';

angular
  .module(moduleName, [
    edit,
    instances,
    kubernetes,
    legacy,
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    sshKeys,
    storages,
  ])
  .config(routing);

export default moduleName;
