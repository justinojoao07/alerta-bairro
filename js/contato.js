// Validação do formulário de contato (sem envio real)
const formContato = document.querySelector('#form-contato');

if (formContato) {
    const campos = ['nome', 'email', 'assunto', 'mensagem'];
    const emailValido = (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);

    function validarCampo(id) {
        const campo = formContato.elements[id];
        const valor = campo.value.trim();
        let mensagem = '';
        if (!valor) mensagem = 'Preencha este campo.';
        else if (id === 'email' && !emailValido(valor)) mensagem = 'Informe um e-mail válido, como nome@dominio.com.';
        else if (id === 'mensagem' && valor.length < 10) mensagem = 'Escreva pelo menos 10 caracteres.';
        campo.classList.toggle('invalido', Boolean(mensagem));
        campo.classList.toggle('valido', !mensagem);
        campo.setAttribute('aria-invalid', String(Boolean(mensagem)));
        document.querySelector('#erro-' + id).textContent = mensagem;
        return !mensagem;
    }

    campos.forEach((id) => formContato.elements[id].addEventListener('blur', () => validarCampo(id)));

    formContato.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const tudoCerto = campos.map((id) => validarCampo(id)).every(Boolean);
        const aviso = document.querySelector('#aviso-form');
        aviso.className = 'aviso ' + (tudoCerto ? 'aviso-ok' : 'aviso-erro');
        aviso.textContent = tudoCerto
            ? 'Mensagem enviada (simulação). Obrigado pelo contato!'
            : 'Corrija os campos destacados e envie de novo.';
        if (tudoCerto) {
            formContato.reset();
            campos.forEach((id) => formContato.elements[id].classList.remove('valido'));
        }
    });
}