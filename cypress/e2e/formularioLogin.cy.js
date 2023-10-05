describe('Formulario de Login', () => {
  it('Deve acessar a página home', () => {
    cy.fixture('usuarios').then((usuario) => {
      cy.login(usuario[3].email, usuario[3].senha);
      cy.visit('/home');
      cy.url().should('include', '/home');
      cy.getByData('titulo-boas-vindas').should(
        'contain',
        'Bem vindo de volta!'
      );
      cy.contains(usuario[3].nome).should('be.visible');
    });
  });

  it('Deve acessar a página home', () => {
    cy.login('neilton@alura.com', '123456');
    cy.visit('/home');
    cy.getByData('titulo-boas-vindas').should('contain', 'Bem vindo de volta!');
  });

  it('Não deve permitir um email inválido', () => {
    cy.getByData('botao-login').click();
    cy.getByData('email-input').type('neilton@alura');
    cy.getByData('senha-input').type('123456');
    cy.getByData('botao-enviar').click();
    cy.getByData('mensagem-erro')
      .should('exist')
      .and('have.text', 'O email digitado é inválido');
  });

  it('Não deve permitir um campo em branco', () => {
    cy.getByData('botao-login').click();
    cy.getByData('senha-input').type('123456');
    cy.getByData('botao-enviar').click();
    cy.getByData('mensagem-erro')
      .should('exist')
      .and('have.text', 'O campo email é obrigatório');
  });
});

describe('Desafio aula 03 - Testa informações de um usuário específico', () => {
  it.only('Verifica informações de usuário, como transações, saldo, nome, etc', () => {
    // 'dadosUsuarios' está na pasta fixtures
    cy.fixture('dadosUsuarios').then((usuario) => {
      cy.login(usuario.email, usuario.senha);
      cy.visit('/home');
      cy.url().should('include', '/home');
      // Verifica se o nome de usuário aparece na tela
      cy.contains(usuario.nome).should('be.visible');
      // Verifica se o valor da última transação corresponde ao valor esperado
      cy.getByData('lista-transacoes')
        .find('li')
        .last()
        .contains(usuario.transacoes[usuario.transacoes.length - 1].valor);
      // Verificar se o saldo corresponde ao saldo esperado
      cy.get('[data-testid="saldo"]').contains(usuario.saldo);
    });
  });
});
