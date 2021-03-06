import angular from 'angular';
import debounce from 'lodash/debounce';
import has from 'lodash/has';
import isNumber from 'lodash/isNumber';

export default class ExchangeTabSharedAccountsCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    Exchange,
    exchangeSelectedService,
    ExchangeSharedAccounts,
    exchangeStates,
    exchangeVersion,
    messaging,
    navigation,
  ) {
    this.services = {
      $scope,
      $translate,
      Exchange,
      exchangeSelectedService,
      ExchangeSharedAccounts,
      exchangeStates,
      exchangeVersion,
      messaging,
      navigation,
    };

    this.$routerParams = Exchange.getParams();

    this.canDisplayQuota = false;
    this.stateCreating = Exchange.stateCreating;
    this.stateDeleting = Exchange.stateDeleting;
    this.stateOk = Exchange.stateOk;
    this.stateReopening = Exchange.stateReopening;
    this.stateSuspended = Exchange.stateSuspended;
    this.stateSuspending = Exchange.stateSuspending;

    this.stateTaskError = 'TASK_ON_ERROR';
    this.stateTaskDoing = 'TASK_ON_DOING';

    this.stateDoing = 'TASK_ON_DOING';
    this.stateError = 'TASK_ON_ERROR';

    this.loading = false;
    this.accounts = null;
    this.displayAccounts();

    this.showAccounts = true;
    this.showAlias = false;
    this.selectedAccount = null;
    this.noDomainFlag = true;
    this.exchange = Exchange.value;

    Exchange.fetchingAccountCreationOptions(
      this.$routerParams.organization,
      this.$routerParams.productId,
    ).then((data) => {
      this.noDomainFlag = data.availableDomains.length === 0;
    });

    ExchangeSharedAccounts.retrievingQuota(
      this.$routerParams.organization,
      this.$routerParams.productId,
    )
      .then((data) => {
        if (
          !has(data, 'quotaLimit', 'quotaUsed', 'quotaReserved')
          || !isNumber(data.quotaLimit)
          || !isNumber(data.quotaReserved)
          || !isNumber(data.quotaUsed)
        ) {
          return;
        }

        this.quotaLimit = data.quotaLimit;
        this.quotaRemaining = parseFloat(
          (this.quotaLimit - data.quotaUsed) / 1000 - data.quotaReserved,
        ).toFixed(2);
        this.quoteRemainingPercent = parseFloat(
          (this.quotaRemaining * 100) / this.quotaLimit,
        ).toFixed(2);
        this.canDisplayQuota = true;
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_tab_ACCOUNTS_error_message'),
          err,
        );
        this.canDisplayQuota = false;
      });

    $scope.$on(Exchange.events.sharedAccountsChanged, () => {
      $scope.$broadcast('paginationServerSide.reload', 'accountsTable');
    });

    $scope.$on('showAccounts', () => {
      this.displayAccounts();
    });

    $scope.retrievingAccounts = (count, offset) => this.retrievingAccounts(count, offset);
    $scope.getAccounts = () => this.accounts;
    $scope.getLoading = () => this.loading;

    $scope.isDisabled = () => this.isDisabled();
    $scope.deleteAccount = account => this.deleteAccount(account);
    $scope.delegationSettings = account => this.delegationSettings(account);

    this.debouncedRetrievingAccounts = debounce(this.retrievingAccounts, 300);
  }

  onSearch() {
    this.debouncedRetrievingAccounts();
  }

  resetSearch() {
    this.searchValue = null;
    this.services.$scope.$broadcast('paginationServerSide.loadPage', 1, 'accountsTable');
  }

  retrievingAccounts(count, offset) {
    this.services.messaging.resetMessages();
    this.loading = true;

    return this.services.ExchangeSharedAccounts.retrievingSharedAccounts(
      this.$routerParams.organization,
      this.$routerParams.productId,
      count,
      offset,
      this.searchValue,
    )
      .then((accounts) => {
        this.accounts = accounts;
      })
      .catch((err) => {
        this.services.messaging.writeError(
          this.services.$translate.instant('exchange_tab_ACCOUNTS_error_message'),
          err,
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  newSharedAccount() {
    this.services.navigation.setAction('exchange/shared-account/add/shared-account-add');
  }

  isEditable(account) {
    return account.state === this.stateOk && !this.noDomainFlag;
  }

  /* eslint-disable class-methods-use-this */
  isConfigurable(account) {
    return account.state === 'OK';
  }
  /* eslint-enable class-methods-use-this */

  isSharedAccountAdjustable() {
    return this.exchange;
  }

  editAccount(account) {
    if (this.isEditable(account)) {
      this.services.navigation.setAction(
        'exchange/shared-account/update/shared-account-update',
        angular.copy(account),
      );
    }
  }

  showAliases(account) {
    this.selectedAccount = account;
    this.showAccounts = false;
    this.showAlias = true;
    this.services.$scope.$broadcast('paginationServerSide.loadPage', 1, 'aliasTable');
  }

  displayAccounts() {
    this.search = { value: null };
    this.showAccounts = true;
    this.showAlias = false;
    this.selectedAccount = null;
  }

  isDisabled(account) {
    return (
      !this.services.exchangeStates.constructor.isOk(account)
      || this.services.exchangeStates.constructor.isDoing(account)
      || this.services.exchangeStates.constructor.isInError(account)
    );
  }

  deleteAccount(account) {
    if (!this.isDisabled(account)) {
      this.services.navigation.setAction(
        'exchange/shared-account/delete/shared-account-delete',
        angular.copy(account),
      );
    }
  }

  delegationSettings(account) {
    if (!this.isDisabled(account)) {
      this.services.navigation.setAction(
        'exchange/shared-account/delegation/shared-account-delegation',
        angular.copy(account),
      );
    }
  }
}
