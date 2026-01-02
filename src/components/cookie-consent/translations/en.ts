import {
  CAT_ADVERTISEMENT,
  CAT_ANALYTICS,
  CAT_FUNCTIONALITY,
  CAT_NECESSARY,
  CAT_SECURITY,
} from '../consts';

const config = {
  consentModal: {
    title: 'We use cookies',
    description:
      'The Cajuína São Geraldo website uses cookies to improve your experience on the site. If you continue browsing, we understand that you agree to our <strong><a href="/empresa/politica-de-privacidade/">Privacy Policy</a></strong> and the use of cookies.',
    acceptAllBtn: 'Accept all',
    acceptNecessaryBtn: 'Reject all',
    showPreferencesBtn: 'Manage preferences',
  },
  preferencesModal: {
    title: 'Cookie Preferences',
    acceptAllBtn: 'Accept all',
    acceptNecessaryBtn: 'Reject all',
    savePreferencesBtn: 'Save preferences',
    closeIconLabel: 'Close',
    serviceCounterLabel: 'Service|Services',
    sections: [
      {
        title: 'Cookie usage',
        description:
          'We use cookies to ensure the basic functionalities of the website and to enhance your online experience.',
      },
      {
        title: 'Strictly necessary cookies',
        description:
          'These cookies are essential for the proper functioning of the website, for example for user authentication.',
        linkedCategory: CAT_NECESSARY,
      },
      {
        title: 'Analytics',
        description:
          'Cookies used for analytics help collect data that allows services to understand how users interact with a particular service. These insights allow services both to improve content and to build better features that improve the user’s experience.',
        linkedCategory: CAT_ANALYTICS,
        cookieTable: {
          headers: {
            name: 'Name',
            domain: 'Service',
            description: 'Description',
            expiration: 'Expiration',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Cookie set by <a target="_blank" rel="noopener noreferrer" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Expires after 12 days',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Cookie set by <a target="_blank" rel="noopener noreferrer" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: 'Session',
            },
          ],
        },
      },
      {
        title: 'Advertising',
        description:
          'Google uses cookies for advertising, including serving and rendering ads, personalizing ads (depending on your ad settings at <a href="https://g.co/adsettings">g.co/adsettings</a>), limiting the number of times an ad is shown to a user, muting ads you have chosen to stop seeing, and measuring the effectiveness of ads.',
        linkedCategory: CAT_ADVERTISEMENT,
      },
      {
        title: 'Functionality',
        description:
          'Cookies used for functionality allow users to interact with a service or site to access features that are fundamental to that service. Things considered fundamental to the service include preferences like the user’s choice of language, product optimizations that help maintain and improve a service, and maintaining information relating to a user’s session, such as the content of a shopping cart.',
        linkedCategory: CAT_FUNCTIONALITY,
      },
      {
        title: 'Security',
        description:
          'Cookies used for security authenticate users, prevent fraud, and protect users as they interact with a service.',
        linkedCategory: CAT_SECURITY,
      },
      {
        title: 'More information',
        description:
          'For any queries in relation to the policy on cookies and your choices, please <a href="https://www.example.com/contacts">contact us</a>.',
      },
    ],
  },
};

export default config;
