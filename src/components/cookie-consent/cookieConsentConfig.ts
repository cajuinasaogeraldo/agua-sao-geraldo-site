import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import * as CookieConsent from 'vanilla-cookieconsent';
import ptBR from './translations/pt-BR.json';
import en from './translations/en.json';
import {
  CAT_ADVERTISEMENT,
  CAT_ANALYTICS,
  CAT_FUNCTIONALITY,
  CAT_NECESSARY,
  CAT_SECURITY,
  SERVICE_AD_PERSONALIZATION,
  SERVICE_AD_STORAGE,
  SERVICE_AD_USER_DATA,
  SERVICE_ANALYTICS_STORAGE,
  SERVICE_FUNCTIONALITY_STORAGE,
  SERVICE_PERSONALIZATION_STORAGE,
  SERVICE_SECURITY_STORAGE,
} from './consts';

function updateGtagConsent() {
  window.gtag('consent', 'update', {
    [SERVICE_ANALYTICS_STORAGE]: CookieConsent.acceptedService(
      SERVICE_ANALYTICS_STORAGE,
      CAT_ANALYTICS,
    )
      ? 'granted'
      : 'denied',
    [SERVICE_AD_STORAGE]: CookieConsent.acceptedService(SERVICE_AD_STORAGE, CAT_ADVERTISEMENT)
      ? 'granted'
      : 'denied',
    [SERVICE_AD_USER_DATA]: CookieConsent.acceptedService(SERVICE_AD_USER_DATA, CAT_ADVERTISEMENT)
      ? 'granted'
      : 'denied',
    [SERVICE_AD_PERSONALIZATION]: CookieConsent.acceptedService(
      SERVICE_AD_PERSONALIZATION,
      CAT_ADVERTISEMENT,
    )
      ? 'granted'
      : 'denied',
    [SERVICE_FUNCTIONALITY_STORAGE]: CookieConsent.acceptedService(
      SERVICE_FUNCTIONALITY_STORAGE,
      CAT_FUNCTIONALITY,
    )
      ? 'granted'
      : 'denied',
    [SERVICE_PERSONALIZATION_STORAGE]: CookieConsent.acceptedService(
      SERVICE_PERSONALIZATION_STORAGE,
      CAT_FUNCTIONALITY,
    )
      ? 'granted'
      : 'denied',
    [SERVICE_SECURITY_STORAGE]: CookieConsent.acceptedService(
      SERVICE_SECURITY_STORAGE,
      CAT_SECURITY,
    )
      ? 'granted'
      : 'denied',
  });
}

export const config: CookieConsentConfig = {
  root: '#cc-container',
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom left',
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  // Trigger consent update when user choices change
  onFirstConsent: () => {
    updateGtagConsent();
  },
  onConsent: () => {
    updateGtagConsent();
  },
  onChange: () => {
    updateGtagConsent();
  },
  categories: {
    [CAT_NECESSARY]: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
    [CAT_ANALYTICS]: {
      autoClear: {
        cookies: [
          {
            name: /^_ga/, // regex: match all cookies starting with '_ga'
          },
          {
            name: '_gid', // string: exact cookie name
          },
        ],
      },
      // See: https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
      services: {
        [SERVICE_ANALYTICS_STORAGE]: {
          label: 'Enables storage (such as cookies) related to analytics e.g. visit duration.',
        },
      },
    },
  },
  language: {
    default: 'pt-BR',
    autoDetect: 'browser',
    translations: {
      en: () => en,
      'pt-BR': () => ptBR,
    },
  },
};
