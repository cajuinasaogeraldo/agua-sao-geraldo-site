import type { CallToAction } from './types';
import { getPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: '/',
    },
    {
      text: 'Sobre',
      href: '/sobre',
    },
    {
      text: 'Produtos',
      href: '/produtos',
    },
    {
      text: 'Notícias',
      href: '/blog',
    },
    {
      text: 'Nos Encontre',
      href: '#nos-encontre',
    },
  ],
  actions: [
    {
      text: 'Seja um revendedor',
      variant: 'action',
      href: '/solicite/seja-um-distribuidor',
    },
  ] as CallToAction[],
};

export const footerData = {
  links: [
    {
      title: 'Institucional',
      links: [
        { text: 'Sobre', href: '/sobre' },
        { text: 'Produtos', href: '/produtos' },
        { text: 'Notícias', href: '/blog' },
        { text: 'Nos encontre', href: '/#nos-encontre' },
        {
          text: 'Trabalhe Conosco',
          href: 'https://cajuinasaogeraldo.gupy.io/',
        },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Promoções', href: '/promocoes' },
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
    },
    {
      ariaLabel: 'Facebook',
      icon: 'mdi:facebook',
      href: 'https://www.facebook.com/aguasaogeraldo',
    },
    {
      ariaLabel: 'Linkedin',
      icon: 'mdi:linkedin',
      href: 'https://www.linkedin.com/company/aguasaogeraldo',
    },
    {
      ariaLabel: 'Youtube',
      icon: 'mdi:youtube',
      href: 'https://www.youtube.com/@aguasaogeraldo',
    },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    <span>
      &copy; 2025 Todos os direitos reservados a São Geraldo Águas Minerais
    </span>
  `,
};
