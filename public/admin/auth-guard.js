// Auth Guard para Sveltia CMS
// Redireciona para /admin/ se não houver token no localStorage
(function () {
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
        window.location.replace('/admin/');
      }
    } catch (error) {
      // Em caso de erro ao ler localStorage, redireciona
      console.error('Erro ao verificar autenticação:', error);
      window.location.replace('/admin/');
    }
  }
})();
