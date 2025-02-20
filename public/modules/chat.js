document.getElementById('send-button').addEventListener('click', async function () {
    const chatInput = document.getElementById('chat-input');
    const chatBox = document.getElementById('chat-box');
    const apiKey = ''

    if (chatInput.value.trim() !== '') {
        // Exibe a mensagem do usuário no chat
        const userMessage = document.createElement('div');
        userMessage.textContent = "Você: " + chatInput.value;
        chatBox.appendChild(userMessage);

        try {
            // Faz a requisição para a API da OpenAI
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer `+ apiKey // Substitua pela sua chave da API
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo", // Modelo de chat
                    messages: [
                        {
                            role: "system",
                            content: "Você é um assistente especializado em análise e melhoria de prompts. Sua tarefa é analisar o prompt do usuário e sugerir melhorias para torná-lo mais claro, específico e eficaz. Depois, gere uma resposta com base no prompt melhorado. Formate sua resposta da seguinte forma: 'Análise: [sua análise aqui] --- Resposta: [sua resposta aqui]'."
                        },
                        {
                            role: "user",
                            content: chatInput.value // Prompt do usuário
                        }
                    ],
                    max_tokens: 550, // Limite de tokens na resposta
                    temperature: 0.5 // Temperatura da amostragem
                })
            });

            if (!response.ok) {
                throw new Error('Erro na requisição: ' + response.statusText);
            }

            const data = await response.json();

            // Divide a resposta da IA em análise e resposta
            const fullResponse = data.choices[0].message.content;
            const [analysis, improvedResponse] = fullResponse.split('---'); // Usa '---' como delimitador

            // Exibe a análise no chat
            const analysisMessage = document.createElement('div');
            analysisMessage.textContent = "| " + analysis.trim(); // Remove espaços em branco
            analysisMessage.style.color = 'white'; // Estilo para a análise
            analysisMessage.style.backgroundColor = '#181D28'; // Cor de fundo para a análise
            analysisMessage.style.fontFamily = '"Tomorrow", serif'; // Fonte para a análise
            chatBox.appendChild(analysisMessage);

            // Exibe a resposta melhorada no chat
            const improvedResponseMessage = document.createElement('div');
            improvedResponseMessage.textContent = "| " + improvedResponse.trim(); // Remove espaços em branco
            improvedResponseMessage.style.color = '#7bce7b'; // Estilo para a resposta
            improvedResponseMessage.style.backgroundColor = '#181D28'; // Cor de fundo para a resposta
            improvedResponseMessage.style.fontFamily = '"Tomorrow", serif'; // Fonte para a resposta
            chatBox.appendChild(improvedResponseMessage);

            // Limpa o campo de entrada
            chatInput.value = '';

            // Rola a caixa de chat para a última mensagem
            chatBox.scrollTop = chatBox.scrollHeight;
        } catch (error) {
            console.error('Erro:', error);

            // Exibe uma mensagem de erro no chat
            const errorMessage = document.createElement('div');
            errorMessage.textContent = "IA: Desculpe, ocorreu um erro. Tente novamente.";
            errorMessage.style.color = 'red';
            chatBox.appendChild(errorMessage);
        }
    }
});