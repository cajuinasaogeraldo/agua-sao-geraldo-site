import type { CallToAction } from './types';
import { getPermalink as _getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Início',
      href: '/',
    },
    {
      text: 'Sobre',
      href: '/sobre/',
    },
    {
      text: 'Propriedades',
      href: '/#propriedades',
    },
    {
      text: 'Revenda',
      href: '/#revenda',
    },
    {
      text: 'Notícias',
      href: '/blog/',
    },
  ],
  actions: [
    {
      text: 'Seja um revendedor',
      variant: 'tertiary',
      href: '/solicite/seja-um-revendedor/',
      class: 'text-agua-primary-green!',
    },
    {
      text: 'Fale Conosco',
      variant: 'primary',
      href: '/fale-conosco/',
    },
  ] as CallToAction[],
};

export const footerData = {
  links: [
    {
      title: 'Institucional',
      links: [
        { text: 'Sobre', href: '/sobre/' },
        { text: 'Propriedades', href: '/#propriedades' },
        { text: 'Notícias', href: '/blog/' },
        { text: 'Revenda', href: '/#revenda' },
        { text: 'Fale Conosco', href: '/fale-conosco/' },
        {
          text: 'Trabalhe Conosco',
          href: 'https://cajuinasaogeraldo.gupy.io/',
          rel: 'noopener noreferrer',
        },
        {
          text: 'Portal de Boletos',
          href: 'https://boletos.cajuinasaogeraldo.com.br/',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
        {
          text: 'Agendar Visita',
          href: 'https://forms.office.com/r/W1KXF7sqcV',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      ],
    },
  ],
  secondaryLinks: [
    {
      text: 'Política de Privacidade',
      href: '/empresa/politica-de-privacidade/',
    },
  ],
  socialLinks: [
    {
      ariaLabel: 'Instagram',
      icon: 'mdi:instagram',
      href: 'https://www.instagram.com/aguasaogeraldo/',
      rel: 'noopener noreferrer',
    },
    {
      ariaLabel: 'Facebook',
      icon: 'mdi:facebook',
      href: 'https://www.facebook.com/aguasaogeraldo',
      rel: 'noopener noreferrer',
    },
    {
      ariaLabel: 'Linkedin',
      icon: 'mdi:linkedin',
      href: 'https://www.linkedin.com/company/aguasaogeraldo',
      rel: 'noopener noreferrer',
    },
    {
      ariaLabel: 'Youtube',
      icon: 'mdi:youtube',
      href: 'https://www.youtube.com/@aguasaogeraldo',
      rel: 'noopener noreferrer',
    },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    <span>
      &copy; ${new Date().getFullYear()} Todos os direitos reservados a São Geraldo Águas Minerais
    </span>
  `,
};
