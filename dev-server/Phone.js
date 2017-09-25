import SDK from 'ringcentral';
import Client from 'ringcentral-client';
import { combineReducers } from 'redux';
import { Injector as getInjector } from 'glaive';

import RcModule from 'ringcentral-integration/lib/RcModule';

import AccountExtension from 'ringcentral-integration/modules/AccountExtension';
import AccountInfo from 'ringcentral-integration/modules/AccountInfo';
import AccountPhoneNumber from 'ringcentral-integration/modules/AccountPhoneNumber';
import AddressBook from 'ringcentral-integration/modules/AddressBook';
import Alert from 'ringcentral-integration/modules/Alert';
import Auth from 'ringcentral-integration/modules/Auth';
import Brand from 'ringcentral-integration/modules/Brand';
import Call from 'ringcentral-integration/modules/Call';
import CallingSettings from 'ringcentral-integration/modules/CallingSettings';
import Contacts from 'ringcentral-integration/modules/Contacts';
import ConnectivityMonitor from 'ringcentral-integration/modules/ConnectivityMonitor';
import DialingPlan from 'ringcentral-integration/modules/DialingPlan';
import ExtensionDevice from 'ringcentral-integration/modules/ExtensionDevice';
import Environment from 'ringcentral-integration/modules/Environment';
import ExtensionInfo from 'ringcentral-integration/modules/ExtensionInfo';
import ExtensionPhoneNumber from 'ringcentral-integration/modules/ExtensionPhoneNumber';
import ForwardingNumber from 'ringcentral-integration/modules/ForwardingNumber';
import GlobalStorage from 'ringcentral-integration/modules/GlobalStorage';
import Locale from 'ringcentral-integration/modules/Locale';
import Presence from 'ringcentral-integration/modules/Presence';
import RateLimiter from 'ringcentral-integration/modules/RateLimiter';
import RegionSettings from 'ringcentral-integration/modules/RegionSettings';
import Ringout from 'ringcentral-integration/modules/Ringout';
import Webphone from 'ringcentral-integration/modules/Webphone';
import RolesAndPermissions from 'ringcentral-integration/modules/RolesAndPermissions';
import Softphone from 'ringcentral-integration/modules/Softphone';
import Storage from 'ringcentral-integration/modules/Storage';
import Subscription from 'ringcentral-integration/modules/Subscription';
import TabManager from 'ringcentral-integration/modules/TabManager';
import NumberValidate from 'ringcentral-integration/modules/NumberValidate';
import MessageSender from 'ringcentral-integration/modules/MessageSender';
import ComposeText from 'ringcentral-integration/modules/ComposeText';
import MessageStore from 'ringcentral-integration/modules/MessageStore';
import Messages from 'ringcentral-integration/modules/Messages';
import Conversation from 'ringcentral-integration/modules/Conversation';
import ContactSearch from 'ringcentral-integration/modules/ContactSearch';
import DateTimeFormat from 'ringcentral-integration/modules/DateTimeFormat';
import Conference from 'ringcentral-integration/modules/Conference';

import ActiveCalls from 'ringcentral-integration/modules/ActiveCalls';
import DetailedPresence from 'ringcentral-integration/modules/DetailedPresence';
import CallLog from 'ringcentral-integration/modules/CallLog';
import CallMonitor from 'ringcentral-integration/modules/CallMonitor';
import CallHistory from 'ringcentral-integration/modules/CallHistory';
import ContactMatcher from 'ringcentral-integration/modules/ContactMatcher';
import ActivityMatcher from 'ringcentral-integration/modules/ActivityMatcher';
import CallLogger from 'ringcentral-integration/modules/CallLogger';
import ConversationMatcher from 'ringcentral-integration/modules/ConversationMatcher';
import ConversationLogger from 'ringcentral-integration/modules/ConversationLogger';
import RecentMessages from 'ringcentral-integration/modules/RecentMessages';
import RecentCalls from 'ringcentral-integration/modules/RecentCalls';

import RouterInteraction from '../src/modules/RouterInteraction';

const Injector = getInjector(RcModule);

export default class Phone extends Injector {
  constructor({
                apiConfig,
                brandConfig,
                appVersion,
                useTabManager = true,
                extensionMode = false,
                ...options,
              } = {}) {
    super({
      ...options,
    });
    const cachePrefix = `sdk${options.prefix ? `-${options.prefix}` : ''}`;
    this.inject(
      [
        {
          module: Client,
          params: new SDK({
            ...options,
            ...apiConfig,
            cachePrefix,
            clearCacheOnRefreshError: false,
          }),
        },
        {
          module: Alert,
        },
        {
          module: RouterInteraction,
          key: 'router'
        },
        {
          module: Brand,
          params: {
            id: '1210',
            name: 'RingCentral',
            fullName: 'RingCentral',
          }
        },
        {
          module: Locale,
        },
        ...useTabManager ? [{
          module: TabManager,
        }] : [],
        {
          module: GlobalStorage,
        },
        {
          module: Environment,
          deps: ['Client', 'GlobalStorage'],
        },
        {
          module: ConnectivityMonitor,
          deps: ['Alert', 'Client', 'Environment'],
          params: {
            checkConnectionFunc: async () => {
              await fetch('//pubsub.pubnub.com/time/0');
            },
          },
        },
        {
          module: Auth,
          deps: ['Alert', 'Brand', 'Client', 'Environment', 'Locale', 'TabManager'],
        },
        {
          module: Storage,
          deps: ['Auth'],
        },
        {
          module: RateLimiter,
          deps: ['Alert', 'Client', 'Environment', 'GlobalStorage'],
        },
        {
          module: ExtensionDevice,
          deps: ['Auth', 'Client', 'Storage', 'TabManager'],
        },
        {
          module: Softphone,
          deps: ['Brand'],
          params: {
            extensionMode,
          }
        },
        {
          module: Ringout,
          deps: ['Auth', 'Client'],
        },
        {
          module: AccountInfo,
          deps: ['Auth', 'Client', 'Storage', 'TabManager'],
        },
        {
          module: ExtensionInfo,
          deps: ['Auth', 'Client', 'Storage', 'TabManager'],
        },
        {
          module: RolesAndPermissions,
          deps: ['Auth', 'Client', 'Storage', 'ExtensionInfo', 'TabManager'],
        },
        {
          module: DialingPlan,
          deps: ['Auth', 'Client', 'Storage', 'TabManager'],
        },
        {
          module: ExtensionPhoneNumber,
          deps: ['Auth', 'Client', 'Storage', 'TabManager'],
        },
        {
          module: ForwardingNumber,
          deps: ['Auth', 'Client', 'Storage', 'TabManager'],
        },
        // {
        //   module: BlockedNumber,
        //   deps: ['Auth', 'Client', 'Storage', 'TabManager'],
        // },
        {
          module: ContactMatcher,
          deps: ['Storage'],
          after: (storage, contactMatcher) => {
            contactMatcher.addSearchProvider({
              name: 'contacts',
              searchFn: async ({queries}) => this.contacts.matchContacts({phoneNumbers: queries}),
              readyCheckFn: () => this.contacts.ready,
            })
          }
        },
        {
          module: Subscription,
          deps: ['Auth', 'Client', 'Storage', 'TabManager', 'ConnectivityMonitor'],
        },
        {
          module: RegionSettings,
          deps: ['Storage', 'ExtensionInfo', 'DialingPlan', 'Alert', 'TabManager'],
        },
        {
          module: AccountExtension,
          deps: ['Auth', 'Client', 'Storage', 'Subscription'],
        },
        {
          module: NumberValidate,
          deps: ['Client', 'AccountExtension', 'RegionSettings', 'AccountInfo'],
        },
        {
          module: Webphone,
          deps: ['Alert', 'Auth', 'Client', 'ContactMatcher', 'ExtensionDevice', 'GlobalStorage', 'RolesAndPermissions', 'Storage', 'NumberValidate'],
          params: {
            appKey: apiConfig.appKey,
            appName: 'RingCentral Widget',
            appVersion: '0.1.0',
          }
        },
        {
          module: CallingSettings,
          deps: ['Alert', 'Brand', 'ExtensionInfo', 'ExtensionPhoneNumber', 'ForwardingNumber', 'Storage', 'RolesAndPermissions', 'TabManager', 'Webphone'],
        },
        {
          module: DetailedPresence,
          deps: ['Storage', 'ConnectivityMonitor'],
          //deps: ['Auth', 'Client', 'Subscription', 'Storage', 'ConnectivityMonitor'],
        },
        {
          module: Presence,
          //deps: ['Auth', 'Client', 'Subscription'],
        },
        {
          module: CallLog,
          deps: ['Auth', 'Client', 'Subscription', 'Storage', 'RolesAndPermissions'],
        },
        {
          module: Call,
        },
        {
          module: MessageSender,
          deps: ['Alert', 'Client', 'ExtensionPhoneNumber', 'ExtensionInfo', 'NumberValidate'],
        },
        {
          module: ContactSearch,
          deps: ['Auth', 'Storage'],
          after: (auth, storage, contactSearch) => {
            contactSearch.addSearchSource({
              sourceName: 'personalContacts',
              searchFn: ({ searchString }) => {
                const items = this.contacts.personalContacts;
                if (!searchString) {
                  return items;
                }
                const searchText = searchString.toLowerCase();
                return items.filter((item) => {
                  const name = `${item.firstName} ${item.lastName}`;
                  if (
                    name.toLowerCase().indexOf(searchText) >= 0 ||
                    item.phoneNumbers.find(x => x.phoneNumber.indexOf(searchText) >= 0)
                  ) {
                    return true;
                  }
                  return false;
                });
              },
              formatFn: entities => entities.map(entity => ({
                id: entity.id.toString(),
                type: entity.type,
                name: `${entity.firstName} ${entity.lastName}`,
                hasProfileImage: false,
                phoneNumbers: entity.phoneNumbers,
                phoneNumber: entity.phoneNumbers[0] && entity.phoneNumbers[0].phoneNumber,
                phoneType: entity.phoneNumbers[0] && entity.phoneNumbers[0].phoneType,
                entityType: 'personalContact',
              })),
              readyCheckFn: () => this.contacts.ready,
            });
          }
        },
        {
          module: ComposeText,
          deps: ['Auth', 'Alert', 'Storage', 'MessageSender', 'NumberValidate', 'ContactSearch'],
        },
        {
          module: CallMonitor,
          deps: ['Call', 'AccountInfo', 'DetailedPresence', 'Webphone', 'Storage'],
        },
        {
          module: CallHistory,
          deps: ['AccountInfo', 'CallLog', 'CallMonitor'],
        },
        {
          module: ActivityMatcher,
          deps: ['Storage'],
        },
        {
          module: ConversationMatcher,
          deps: ['Storage'],
        },
        {
          module: MessageStore,
          deps: ['Alert', 'Auth', 'Client', 'Storage', 'Subscription', 'ConnectivityMonitor'],
        },
        {
          module: Conversation,
          deps: ['Auth', 'MessageSender', 'ExtensionInfo', 'MessageStore'],
        },
        {
          module: DateTimeFormat,
          deps: ['Locale', 'Storage'],
        },
        {
          module: Conference,
          deps: ['Auth', 'Client', 'RegionSettings'],
        },
        {
          module: CallLogger,
          deps: ['Storage', 'CallMonitor', 'ActivityMatcher', 'ContactMatcher'],
          params: {
            logFunction: async () => {
            },
            readyCheckFunction: () => true,
          }
        },
        {
          module: AccountPhoneNumber,
          deps: ['Auth', 'Client', 'Storage', 'TabManager'],
        },
        {
          module: AddressBook,
          deps: ['Client', 'Auth', 'Storage'],
        },
        {
          module: Contacts,
          deps: ['Client', 'AddressBook', 'AccountPhoneNumber', 'AccountExtension'],
        },
        {
          module: ConversationLogger,
          deps: ['Auth', 'ContactMatcher', 'ConversationMatcher', 'DateTimeFormat', 'ExtensionInfo', 'MessageStore', 'RolesAndPermissions', 'Storage', 'TabManager'],
          params: {
            logFunction: async () => {
            },
            readyCheckFunction: () => true,
          }
        },
        {
          module: Messages,
          deps: ['ContactMatcher', 'MessageStore', 'ExtensionInfo', 'ConversationLogger'],
        },
        {
          module: RecentMessages,
          deps: ['Client', 'MessageStore'],
        },
        {
          module: RecentCalls,
          deps: ['Client', 'CallHistory'],
        },
        // {
        //   module: Analytics,
        //   deps: ['Auth', 'Call', 'Webphone', 'Contacts', 'MessageSender'],
        //   params: {
        //     analyticsKey: 'd51li7ZONOLUcHKBqVmQmhG2mF0FySUZ',
        //     appName: 'RingCentral Integration',
        //     appVersion: '0.1.1-beta',
        //     brandCode: 'rc',
        //   }
        // }
      ],
      {
        preInject: () => {
          this.__reducers = {};
          this.__proxyReducers = {};
        },
        preDistribute: true,
      }
    );
    this._reducer = combineReducers({
      ...this.__reducers,
      app: (state = {
        name: brandConfig.appName,
        version: appVersion,
      }) => state,
      lastAction: (state = null, action) => {
        console.log(action)
        return action
      },
    });
    this._proxyReducer = combineReducers({
      ...this.__proxyReducers,
    });
  }

  mountParams(moduleKey) {
    if (moduleKey !== 'client') {
      this.__reducers[moduleKey] = this[moduleKey].reducer;
      this.__proxyReducers[moduleKey] = this[moduleKey].proxyReducer;
      this[moduleKey]._getState = () => this.state[moduleKey];
      this[moduleKey]._getProxyState = () => this.proxyState[moduleKey];
    }
  }

  _initModule() {}

  initialize() {
    this.store.subscribe(() => {
      if (this.auth.ready) {
        if (
          this.router.currentPath !== '/' &&
          !this.auth.loggedIn
        ) {
          this.router.push('/');
        } else if (
          this.router.currentPath === '/' &&
          this.auth.loggedIn
        ) {
          this.router.push('/dialer');
        }
      }
    });
  }

  get name() {
    return this.state.app.name;
  }

  get version() {
    return this.state.app.version;
  }
}
