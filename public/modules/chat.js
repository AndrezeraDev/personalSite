document.getElementById('send-button').addEventListener('click', async function () {
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');

    if (chatInput.value.trim() !== '') {
        // Exibe a mensagem do usuário no chat
        const userMessage = document.createElement('div');
        userMessage.textContent = "Você: " + chatInput.value;
        chatBox.appendChild(userMessage);

        try {
            // Faz a requisição para o backend, que chama a OpenAI
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: chatInput.value })
            });

            const data = await response.json();

            // Exibe a resposta no chat
            const aiMessage = document.createElement('div');
            aiMessage.textContent = "| " + data.response;
            aiMessage.style.color = '#7bce7b';
            aiMessage.style.backgroundColor = '#181D28';
            aiMessage.style.fontFamily = '"Tomorrow", serif';
            chatBox.appendChild(aiMessage);

            chatInput.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
            console.error("Erro:", error);

            const errorMessage = document.createElement('div');
            errorMessage.textContent = "IA: Desculpe, ocorreu um erro.";
            errorMessage.style.color = 'red';
            chatBox.appendChild(errorMessage);
        }
    }
});
