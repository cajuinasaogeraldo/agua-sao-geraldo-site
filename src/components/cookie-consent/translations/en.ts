import { CAT_ANALYTICS, CAT_NECESSARY } from '../consts';

const config = {
  consentModal: {
    title: 'We use cookies',
    description:
      'We use cookies to understand how the Água São Geraldo website is used and to improve your experience, using Google Analytics and Microsoft Clarity (which records sessions and heatmaps). You can accept all, keep only the essentials or choose in Manage preferences. Learn more in our <strong><a href="/empresa/politica-de-privacidade/#cookies">Privacy Policy</a></strong>.',
    acceptAllBtn: 'Accept all',
    acceptNecessaryBtn: 'Essentials only',
    showPreferencesBtn: 'Manage preferences',
  },
  preferencesModal: {
    title: 'Cookie preferences',
    acceptAllBtn: 'Accept all',
    acceptNecessaryBtn: 'Essentials only',
    savePreferencesBtn: 'Save preferences',
    closeIconLabel: 'Close',
    sections: [
      {
        title: 'Cookie usage',
        description:
          'We use cookies to keep the website working and to measure how it is used. We do not use advertising cookies.',
      },
      {
        title: 'Strictly necessary cookies',
        description:
          'They store your cookie choice and keep the basic functions of the site working. They cannot be turned off.',
        linkedCategory: CAT_NECESSARY,
      },
      {
        title: 'Analytics',
        description:
          'They measure how visitors use the site (pages visited, visit duration, clicks) through Google Analytics and Microsoft Clarity, which also records sessions and heatmaps. The data is used to improve content and navigation.',
        linkedCategory: CAT_ANALYTICS,
        cookieTable: {
          headers: {
            name: 'Name',
            domain: 'Service',
            description: 'Description',
            expiration: 'Duration',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Distinguishes unique users · <a target="_blank" rel="noopener noreferrer" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: '2 years',
            },
            {
              name: '_ga_<ID>',
              domain: 'Google Analytics',
              description:
                'Persists session state · <a target="_blank" rel="noopener noreferrer" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: '2 years',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Distinguishes unique users · <a target="_blank" rel="noopener noreferrer" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: '24 hours',
            },
            {
              name: '_clck',
              domain: 'Microsoft Clarity',
              description:
                'User identification and Clarity preferences · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: '1 year',
            },
            {
              name: '_clsk',
              domain: 'Microsoft Clarity',
              description:
                'Groups page views into one session · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: '1 day',
            },
            {
              name: 'CLID',
              domain: 'Microsoft Clarity',
              description:
                'Identifies the first visit of the user · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: '1 year',
            },
            {
              name: 'MUID',
              domain: 'Microsoft',
              description:
                'Browser identifier used by Microsoft · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: '1 year',
            },
            {
              name: 'SM',
              domain: 'Microsoft Clarity',
              description:
                'Syncs MUID across Microsoft domains · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: 'Session',
            },
          ],
        },
      },
      {
        title: 'More information',
        description:
          'For questions about cookies and your choices, read the <a href="/empresa/politica-de-privacidade/#cookies">Privacy Policy</a> or <a href="/fale-conosco/">contact us</a>.',
      },
    ],
  },
};

export default config;
