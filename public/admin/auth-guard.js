// Auth Guard para Sveltia CMS
// Redireciona para /admin/ se não houver token no localStorage
(function () {
  const authCookieName = 'cms_auth';
  const cookieFlags = `Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;

  const setAuthCookie = (isAuthenticated) => {
    if (isAuthenticated) {
      document.cookie = `${authCookieName}=1; Max-Age=${60 * 60 * 8}; ${cookieFlags}`;
      return;
    }

    document.cookie = `${authCookieName}=; Max-Age=0; ${cookieFlags}`;
  };

  // Só executa se estiver em uma subrota de /admin/
  const currentPath = window.location.pathname;

  if (currentPath.startsWith('/admin/') && currentPath !== '/admin/') {
    try {
      // Verifica se existe token do Sveltia CMS
      const userDataKey = 'sveltia-cms.user';
      const userData = localStorage.getItem(userDataKey);

      if (!userData) {
        // Sem dados de usuário, redireciona para /admin/
        window.location.replace('/admin/');
        return;
      }

      const parsedData = JSON.parse(userData);

      // Verifica se existe token
      if (!parsedData || !parsedData.token) {
        setAuthCookie(false);
        window.location.replace('/admin/');
        return;
      }

      setAuthCookie(true);
    } catch (error) {
      // Em caso de erro ao ler localStorage, redireciona
      setAuthCookie(false);
      console.error('Erro ao verificar autenticação:', error);
      window.location.replace('/admin/');
    }
  }
})();
