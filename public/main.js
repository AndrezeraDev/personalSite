function toggleMenu() {
    const nav = document.querySelector('header nav ul');
    nav.classList.toggle('show');

    // Ajusta a altura para ativar a animação de deslizamento
    if (nav.classList.contains('show')) {
        nav.style.maxHeight = nav.scrollHeight + "px";
    } else {
        nav.style.maxHeight = null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const introElements = document.querySelectorAll('.intro h1, .intro p');
    introElements.forEach(el => {
        el.style.opacity = 0;
        el.classList.add('fade-in');
        setTimeout(() => {
            el.style.opacity = 1;
        }, 100); // Pequeno atraso para garantir o efeito de fade-in
    });

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        introElements.forEach(el => {
            el.style.opacity = 1 - scrollPosition / 400;
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const chatLink = document.querySelector('a[href="chat.html"]');

    if (chatLink) {
        chatLink.addEventListener("click", (event) => {
            event.preventDefault(); // Impede a navegação padrão

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Você precisa estar logado para acessar o chat!");
                window.location.href = "login.html";
                return;
            }

            // Se houver um token, verifica se é válido chamando o backend
            fetch("http://localhost:3000/chat", {
                method: "GET",
                headers: { Authorization: token }
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = "chat.html"; // Redireciona se estiver autorizado
                } else {
                    alert("Sessão expirada ou acesso negado. Faça login novamente.");
                    localStorage.removeItem("token");
                    window.location.href = "login.html";
                }
            })
            .catch(() => {
                alert("Erro ao verificar autenticação.");
            });
        });
    }
});



