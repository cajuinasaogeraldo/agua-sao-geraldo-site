import type { CookieConsentConfig } from 'vanilla-cookieconsent';
import * as CookieConsent from 'vanilla-cookieconsent';
import ptBR from './translations/pt-BR';
import en from './translations/en';
import { CAT_ANALYTICS, CAT_NECESSARY, SERVICE_ANALYTICS_STORAGE } from './consts';

/**
 * O site só usa cookies de análise (Google Analytics e Microsoft Clarity, ambos via GTM).
 * O Clarity lê o Consent Mode do Google, então depende apenas de `analytics_storage`.
 * Os demais sinais (ad_*, functionality, personalization) ficam 'denied' pelo default
 * declarado em `common/Analytics.astro`, e security_storage fica 'granted'.
 */
function updateGtagConsent() {
  window.gtag('consent', 'update', {
    [SERVICE_ANALYTICS_STORAGE]: CookieConsent.acceptedCategory(CAT_ANALYTICS)
      ? 'granted'
      : 'denied',
  });

  // Dispara tags do GTM que dependem da mudança de consentimento
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
      enabled: true,
      readOnly: true,
    },
    [CAT_ANALYTICS]: {
      autoClear: {
        cookies: [
          { name: /^_ga/ }, // _ga e _ga_<ID>
          { name: '_gid' },
          { name: '_clsk' },
          { name: '_clck' },
          { name: 'CLID' },
          { name: 'MUID' },
          { name: 'SM' },
        ],
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
  onFirstConsent: updateGtagConsent,
  onConsent: updateGtagConsent,
  onChange: updateGtagConsent,
};
