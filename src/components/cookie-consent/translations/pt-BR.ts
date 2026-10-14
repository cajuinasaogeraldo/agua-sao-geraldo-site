import { CAT_ANALYTICS, CAT_NECESSARY } from '../consts';

const config = {
  consentModal: {
    title: 'Usamos cookies',
    description:
      'Usamos cookies para entender como o site da Água São Geraldo é usado e melhorar sua experiência, com o Google Analytics e o Microsoft Clarity (que registra sessões e mapas de calor). Você pode aceitar todos, ficar só com os essenciais ou escolher em Gerenciar preferências. Saiba mais na <strong><a href="/empresa/politica-de-privacidade/#cookies">Política de Privacidade</a></strong>.',
    acceptAllBtn: 'Aceitar todos',
    acceptNecessaryBtn: 'Apenas essenciais',
    showPreferencesBtn: 'Gerenciar preferências',
  },
  preferencesModal: {
    title: 'Preferências de cookies',
    acceptAllBtn: 'Aceitar todos',
    acceptNecessaryBtn: 'Apenas essenciais',
    savePreferencesBtn: 'Salvar preferências',
    closeIconLabel: 'Fechar',
    sections: [
      {
        title: 'Uso de cookies',
        description:
          'Usamos cookies para garantir o funcionamento do site e medir como ele é utilizado. Não usamos cookies de publicidade.',
      },
      {
        title: 'Cookies estritamente necessários',
        description:
          'Guardam a sua escolha sobre cookies e garantem o funcionamento básico do site. Não podem ser desativados.',
        linkedCategory: CAT_NECESSARY,
      },
      {
        title: 'Análises',
        description:
          'Medem como os visitantes usam o site (páginas visitadas, tempo de visita, cliques) por meio do Google Analytics e do Microsoft Clarity, que também grava sessões e mapas de calor. Os dados servem para melhorar o conteúdo e a navegação.',
        linkedCategory: CAT_ANALYTICS,
        cookieTable: {
          headers: {
            name: 'Nome',
            domain: 'Serviço',
            description: 'Descrição',
            expiration: 'Validade',
          },
          body: [
            {
              name: '_ga',
              domain: 'Google Analytics',
              description:
                'Distingue usuários únicos · <a target="_blank" rel="noopener noreferrer" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: '2 anos',
            },
            {
              name: '_ga_<ID>',
              domain: 'Google Analytics',
              description:
                'Mantém o estado da sessão · <a target="_blank" rel="noopener noreferrer" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: '2 anos',
            },
            {
              name: '_gid',
              domain: 'Google Analytics',
              description:
                'Distingue usuários únicos · <a target="_blank" rel="noopener noreferrer" href="https://business.safety.google/adscookies/">Google Analytics</a>',
              expiration: '24 horas',
            },
            {
              name: '_clck',
              domain: 'Microsoft Clarity',
              description:
                'Identificação de usuário e preferências do Clarity · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: '1 ano',
            },
            {
              name: '_clsk',
              domain: 'Microsoft Clarity',
              description:
                'Agrupa as páginas vistas em uma única sessão · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: '1 dia',
            },
            {
              name: 'CLID',
              domain: 'Microsoft Clarity',
              description:
                'Identifica o primeiro acesso do usuário · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: '1 ano',
            },
            {
              name: 'MUID',
              domain: 'Microsoft',
              description:
                'Identificador de navegador usado pela Microsoft · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: '1 ano',
            },
            {
              name: 'SM',
              domain: 'Microsoft Clarity',
              description:
                'Sincroniza o MUID entre domínios da Microsoft · <a target="_blank" rel="noopener noreferrer" href="https://clarity.microsoft.com/">Microsoft Clarity</a>',
              expiration: 'Sessão',
            },
          ],
        },
      },
      {
        title: 'Mais informações',
        description:
          'Para dúvidas sobre cookies e suas escolhas, leia a <a href="/empresa/politica-de-privacidade/#cookies">Política de Privacidade</a> ou <a href="/fale-conosco/">entre em contato conosco</a>.',
      },
    ],
  },
};

export default config;
