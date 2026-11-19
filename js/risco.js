// Mapa de risco (filtro) e simulador de relato. Dados fictícios de demonstração.
const BAIRROS = ['Jardim Pantanal', 'Jardim Helena', 'Vila Itaim', 'Vila Seabra', 'União de Vila Nova', 'Itaim Biacica'];
const NIVEIS = ['Seco', 'Poça', 'Água na calçada', 'Água na rua', 'Água invadiu casas'];
const pontos = [
    { bairro: 'Jardim Pantanal', ponto: 'Rua junto à várzea', nivel: 3 },
    { bairro: 'Jardim Pantanal', ponto: 'Rua da escola', nivel: 2 },
    { bairro: 'Jardim Helena', ponto: 'Avenida principal', nivel: 4 },
    { bairro: 'Vila Itaim', ponto: 'Travessa do córrego', nivel: 1 },
    { bairro: 'Vila Seabra', ponto: 'Rua baixa', nivel: 3 },
    { bairro: 'União de Vila Nova', ponto: 'Rua do mercado', nivel: 0 },
    { bairro: 'Itaim Biacica', ponto: 'Estrada da margem', nivel: 4 },
];
const ORIENTACOES = {
    BAIXO: 'Acompanhe os alertas do bairro.',
    'MÉDIO': 'Evite o ponto e proteja documentos e eletrodomésticos.',
    ALTO: 'Suba objetos para locais altos e prepare uma mochila de emergência.',
    'CRÍTICO': 'Saia para o abrigo mais próximo. Ligue 199 (Defesa Civil) ou 193 (Bombeiros).',
};

function classificar(pontuacao) {
    if (pontuacao >= 4) return 'CRÍTICO';
    if (pontuacao === 3) return 'ALTO';
    if (pontuacao === 2) return 'MÉDIO';
    return 'BAIXO';
}

const classeDe = (rotulo) => 'risco-' + rotulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

// Mapa de risco: filtros por bairro e por nível
const listaPontos = document.querySelector('#lista-pontos');
if (listaPontos) {
    const filtroBairro = document.querySelector('#filtro-bairro');
    const filtroRisco = document.querySelector('#filtro-risco');
    const contagem = document.querySelector('#contagem');
    BAIRROS.forEach((nome) => filtroBairro.add(new Option(nome, nome)));

    function desenhar() {
        const visiveis = pontos.filter((p) =>
            (!filtroBairro.value || p.bairro === filtroBairro.value) &&
            (!filtroRisco.value || classificar(p.nivel) === filtroRisco.value));
        listaPontos.replaceChildren();
        visiveis.forEach((p) => {
            const rotulo = classificar(p.nivel);
            const cartao = document.createElement('article');
            cartao.className = 'cartao';
            const titulo = document.createElement('h3');
            titulo.textContent = p.bairro;
            const local = document.createElement('p');
            local.textContent = p.ponto + ': ' + NIVEIS[p.nivel];
            const selo = document.createElement('span');
            selo.className = 'selo ' + classeDe(rotulo);
            selo.textContent = 'Risco ' + rotulo;
            cartao.append(titulo, local, selo);
            listaPontos.append(cartao);
        });
        contagem.textContent = visiveis.length + ' ponto(s) encontrado(s).';
    }
    filtroBairro.addEventListener('change', desenhar);
    filtroRisco.addEventListener('change', desenhar);
    desenhar();
}

// Simulador de relato (regras R2 e R4 do projeto)
const formRelato = document.querySelector('#form-relato');
if (formRelato) {
    const ultimosRelatos = {};
    const saida = document.querySelector('#resultado');
    BAIRROS.forEach((nome) => formRelato.elements.bairro.add(new Option(nome, nome)));

    formRelato.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const bairro = formRelato.elements.bairro.value;
        const ponto = formRelato.elements.ponto.value.trim();
        const nivel = formRelato.querySelector('input[name="nivel"]:checked');
        if (!bairro || !ponto || !nivel) {
            saida.className = 'aviso aviso-erro';
            saida.textContent = 'Escolha o bairro, informe o ponto de referência e marque o nível da água.';
            return;
        }
        const chave = bairro + '|' + ponto.toLowerCase();
        if (ultimosRelatos[chave] && Date.now() - ultimosRelatos[chave] < 10 * 60 * 1000) {
            saida.className = 'aviso aviso-erro';
            saida.textContent = 'Você já relatou este ponto há menos de 10 minutos. Aguarde para enviar de novo.';
            return;
        }
        ultimosRelatos[chave] = Date.now();
        const bonusChuva = formRelato.elements.chuva.checked ? 1 : 0;
        const rotulo = classificar(Math.min(4, Number(nivel.value) + bonusChuva));
        saida.className = 'aviso ' + classeDe(rotulo);
        saida.textContent = 'Relato recebido para ' + ponto + ' (' + bairro + '). Risco ' + rotulo + '. ' + ORIENTACOES[rotulo];
    });
}