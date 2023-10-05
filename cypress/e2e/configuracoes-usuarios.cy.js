import { faker } from '@faker-js/faker/locale/pt_BR';

describe('Atualização de dados do usuário', () => {
  const novosDadosDeUsuario = {
    nome: faker.person.fullName(),
    senha: faker.internet.password(),
  };

  it('Deve permitir o usuário atualizar seus dados', () => {
    cy.fixture('usuarios').as('usuarios');
    // pegou a fixture e fez login com o usuario do arquivo usuarios.json
    cy.get('@usuarios').then((usuario) => {
      cy.login(usuario[3].email, usuario[3].senha);

      cy.visit('/home');
      cy.url().should('include', '/home');

      //na página home deve ter o nome do usuário
      cy.contains(usuario[3].nome).should('be.visible');

      // procurar o link de 'minha conta'
      cy.getByData('app-home').find('a').eq(1).click();
      cy.url().should('include', '/minha-conta');

      // ver se o botão de 'salvar alterações' está desabilitado
      cy.getByData('botao-salvar-alteracoes').should('be.disabled');

      // digitar o nome e senha
      cy.get('[name = "nome"]').type(novosDadosDeUsuario.nome);
      cy.get('[name = "senha"]').type(novosDadosDeUsuario.senha);
      // ver se o botão de 'salvar alterações' está habilitado
      cy.getByData('botao-salvar-alteracoes').should('not.be.disabled');
      cy.getByData('botao-salvar-alteracoes').click();

      // escutar evento de alert
      cy.on('window: alert', (textoDoAlert) => {
        expect(textoDoAlert).to.equal('Alterações salvas com sucesso!');
      });
      // ver se redirecionou para a página home
      cy.url().should('include', '/home');

      // window é um comando para manipular o que está na janela do nosso navegador.
      cy.window().then((win) => {
        expect(win.localStorage.getItem('nomeUsuario')).to.equal(
          novosDadosDeUsuario.nome
        );

        // obter o userId para poder fazer o request e ver se as infos da resposta estão iguais ao novosDadosDeUsuario
        const userId = win.localStorage.getItem('userId');

        cy.request('GET', `http://localhost:8000/users/${userId}`).then(
          (resposta) => {
            expect(resposta.status).to.eq(200);
            expect(resposta.body.nome).to.eq(novosDadosDeUsuario.nome);
            expect(resposta.body.senha).to.eq(novosDadosDeUsuario.senha);
          }
        );
      });
    });
  });
});
