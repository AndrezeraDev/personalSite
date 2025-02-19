document.getElementById('send-button').addEventListener('click', function() {
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    if (chatInput.value.trim() !== '') {
        // Cria um novo elemento de mensagem
        const message = document.createElement('div');
        message.textContent = chatInput.value;

        // Adiciona a mensagem à caixa de chat
        chatBox.appendChild(message);

        // Limpa a textarea
        chatInput.value = '';

        // Rola a caixa de chat para a última mensagem
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});