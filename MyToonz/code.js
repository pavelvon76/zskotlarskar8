const webtoonContainer = document.getElementById('webtoon-container');

// Předpokládejme, že máme pole s cestami k obrázkům
const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    // ... další obrázky
];

// Vytvoření a přidání obrázků do kontejneru
images.forEach(imagePath => {
    const imgElement = document.createElement('img');
    imgElement.src = imagePath;
    webtoonContainer.appendChild(imgElement);
});

// Přidání funkcionality pro scrollování
let currentIndex = 0;

function handleScroll(event) {
    const delta = event.deltaY;

    if (delta > 0 && currentIndex < images.length - 1) {
        currentIndex++;
    } else if (delta < 0 && currentIndex > 0) {
        currentIndex--;
    }

    scrollToCurrentIndex();
}

function scrollToCurrentIndex() {
    const scrollAmount = currentIndex * window.innerHeight;
    webtoonContainer.style.transform = `translateY(-${scrollAmount}px)`;
}

// Přidání posluchače událostí pro scrollování
window.addEventListener('wheel', handleScroll);
