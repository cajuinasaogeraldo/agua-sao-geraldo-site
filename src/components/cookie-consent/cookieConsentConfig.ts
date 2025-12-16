import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import ptBR from './translations/pt-BR.json';
import en from './translations/en.json';

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
  categories: {
    necessary: {
      readOnly: true,
    },
    functionality: {},
    analytics: {
      services: {
        ga4: {
          label: 'Google Analytics',
          onAccept: () => {
            console.log('ga4 granted');

            window.gtag('consent', 'update', {
              ad_storage: 'granted',
              ad_user_data: 'granted',
              ad_personalization: 'granted',
              analytics_storage: 'granted',
            });
          },
          onReject: () => {
            console.log('ga4 rejected');
          },
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
