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


