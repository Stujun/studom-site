const mainText = document.querySelector('.MainText');
const mainBg = document.querySelector('.MainTextBg');
const nav = document.querySelector('.navbar');
const wrapper = document.getElementById('mainDown');
const images = [
    document.getElementById('img1'),
    document.getElementById('img2'),
    document.getElementById('img3')
];

function isMobile() {
    return window.innerWidth <= 768;
}

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 300) {
        mainText.style.opacity = '0';
        mainBg.style.opacity = '0';
        nav.style.opacity = '0';
    } else {
        mainText.style.opacity = '1';
        mainBg.style.opacity = '1';
        nav.style.opacity = '0.7';
    }

    if (isMobile()) {
        const step = 600;

        if (scrollY < step) {
            images.forEach(img => img.classList.remove('show'));
            wrapper.style.display = "none";
            return;
        }

        const index = Math.floor(scrollY / step) - 1;

        images.forEach((img, i) => {
            img.classList.toggle('show', i === index);
        });

        wrapper.style.display = index >= 0 && index < images.length ? "flex" : "none";

    } else {
        const startY = 1000;
        const step = 1300;
        const fadeOutY = startY + step * 3 + 500;

        wrapper.style.opacity = scrollY > fadeOutY ? "0" : "1";

        if (scrollY < startY) {
            images.forEach(img => img.classList.remove('show'));
        } else if (scrollY < startY + step) {
            images[0].classList.add('show');
            images[1].classList.remove('show');
            images[2].classList.remove('show');
        } else if (scrollY < startY + step * 2) {
            images[0].classList.add('show');
            images[1].classList.add('show');
            images[2].classList.remove('show');
        } else if (scrollY < startY + step * 3) {
            images.forEach(img => img.classList.add('show'));
        } else {
            images.forEach(img => img.classList.remove('show'));
        }
        wrapper.style.display = "flex";
    }
});
