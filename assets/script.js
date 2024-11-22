document.addEventListener('DOMContentLoaded', () => {
    // Interactividad del formulario de inscripción
    const form = document.getElementById('form-inscripcion');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Formulario enviado!');
        form.reset();
    });

    // Carrusel de imágenes
    const carousel = document.querySelector('.carousel');
    let index = 0;

    function showNextImage() {
        index = (index + 1) % carousel.children.length;
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    setInterval(showNextImage, 3000);
});