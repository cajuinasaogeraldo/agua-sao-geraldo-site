import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import * as CookieConsent from 'vanilla-cookieconsent';
import ptBR from './translations/pt-BR';
import en from './translations/en';
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
  SERVICE_CLARITY,
  SERVICE_FUNCTIONALITY_STORAGE,
  SERVICE_PERSONALIZATION_STORAGE,
  SERVICE_SECURITY_STORAGE,
} from './consts';

function updateGtagConsent() {
  const consent = {
    [SERVICE_ANALYTICS_STORAGE]: CookieConsent.acceptedService(
      SERVICE_ANALYTICS_STORAGE,
      CAT_ANALYTICS,
    )
      ? 'granted'
      : 'denied',
    [SERVICE_CLARITY]: CookieConsent.acceptedService(SERVICE_CLARITY, CAT_ANALYTICS)
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
  };

  window.gtag('consent', 'update', consent);

  // Push a custom event to GTM to instantly trigger dependent tags
  window.dataLayer.push({
    event: 'cookie_consent_updated',
  });
}
export const config: CookieConsentConfig = {
  root: '#cc-container',
  disablePageInteraction: true,
  cookie: {
    name: 'caju_cc_cookie',
  },
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
    [CAT_NECESSARY]: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
    [CAT_SECURITY]: {
      enabled: true,
      readOnly: true,
      services: {
        [SERVICE_SECURITY_STORAGE]: {
          label:
            'Habilita armazenamento relacionado a segurança, como autenticação, prevenção de fraudes e outras proteções ao usuário.',
        },
      },
    },
    [CAT_ANALYTICS]: {
      services: {
        [SERVICE_ANALYTICS_STORAGE]: {
          label: 'Habilita armazenamento relacionado a análises, como duração da visita.',
        },
        [SERVICE_CLARITY]: {
          label:
            'Microsoft Clarity — grava sessões e mapas de calor para análise de comportamento do usuário.',
        },
      },
      autoClear: {
        cookies: [
          {
            name: /^_ga/,
          },
          {
            name: '_gid',
          },
          {
            name: '_clsk',
          },
          {
            name: '_clck',
          },
          {
            name: 'CLID',
          },
        ],
      },
    },
    [CAT_ADVERTISEMENT]: {
      services: {
        [SERVICE_AD_STORAGE]: {
          label: 'Habilita armazenamento (como cookies) relacionado a publicidade.',
        },
        [SERVICE_AD_USER_DATA]: {
          label:
            'Define consentimento para enviar dados do usuário relacionados a publicidade ao Google.',
        },
        [SERVICE_AD_PERSONALIZATION]: {
          label: 'Define consentimento para publicidade personalizada.',
        },
      },
    },
    [CAT_FUNCTIONALITY]: {
      services: {
        [SERVICE_FUNCTIONALITY_STORAGE]: {},
        [SERVICE_PERSONALIZATION_STORAGE]: {},
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
  onFirstConsent: function () {
    updateGtagConsent();
  },
  onConsent: () => {
    updateGtagConsent();
  },
  onChange: ({ changedCategories: _ }) => {
    updateGtagConsent();
  },
};
