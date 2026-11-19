// Menu hambúrguer (telas pequenas) e acordeão do FAQ
const botaoMenu = document.querySelector('#botao-menu');
const menuPrincipal = document.querySelector('#menu');

if (botaoMenu && menuPrincipal) {
    botaoMenu.addEventListener('click', () => {
        const aberto = menuPrincipal.classList.toggle('aberto');
        botaoMenu.setAttribute('aria-expanded', String(aberto));
    });
}

document.querySelectorAll('.acordeao-botao').forEach((botao) => {
    const painel = document.getElementById(botao.getAttribute('aria-controls'));
    botao.addEventListener('click', () => {
        const estavaAberto = botao.getAttribute('aria-expanded') === 'true';
        botao.setAttribute('aria-expanded', String(!estavaAberto));
        painel.hidden = estavaAberto;
    });
});