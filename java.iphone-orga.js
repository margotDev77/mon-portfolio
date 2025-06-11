
const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {
    
    if (entry.isIntersecting) {
    
    entry.target.classList.add('visible');
    
    }
    
    });
    
    }, { threshold: 0.5 }); // Se déclenche quand 30% de l'élément est visible
    
    // Sélectionne tous les éléments à observer
    
    const elements = document.querySelectorAll('.blocApparition');
    
    // Applique l'observation sur chaque élément
    
    elements.forEach(element => observer.observe(element));  



/************************************************************************** Drag screen accueil **************************************************************************/

const draggable = document.getElementById("draggable");
// const animOpenScreen = document.querySelector(".screen-content-app");

let isDraggings = false;
let startY = 0;
let currentY = 0;
let offset = 0;
const threshold = 100;

draggable.addEventListener("mousedown", (e) => {
    isDraggings = true;
    startY = e.clientY;
    draggable.style.transition = "none";
});

document.addEventListener("mousemove", (e) => {
    if (!isDraggings) return;

    currentY = e.clientY;
    offset = startY - currentY;

    if (offset > 0) {
        draggable.style.transform = `translateY(-${offset}px)`;
    }
});

document.addEventListener("mouseup", () => {
    if (!isDraggings) return;
    isDraggings = false;
    draggable.style.transition = "transform 0.3s ease-in-out";

    if (offset > threshold) {
        draggable.style.transform = `translateY(-100%)`;
        setTimeout(() => {
            draggable.style.display = "none";
            animOpenScreen.classList.add("on");
        }, 300);
    } else {
        draggable.style.transform = `translateY(0)`;
    }

});

/**************************** screen close ****************************/

function toggleScreen() {
    const content = document.getElementById('toggleContent');
    const button = document.querySelector('.lock-btn-face');

    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        button.classList.add('actve');
    } else {
        content.style.display = 'none';
        button.classList.remove('actve');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('toggleContent').style.display = 'none';
});

let clickCount = 0;

function toggleScreen() {
    const content = document.getElementById('toggleContent');
    const button = document.querySelector('.lock-btn-face');
    const draggable = document.getElementById('draggable');

    clickCount++;

    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        button.classList.add('actve');
    } else {
        content.style.display = 'none';
        button.classList.remove('actve');
    }

    if (clickCount % 2 === 0) {
        draggable.style.display = 'block';
        draggable.style.transform = 'translateY(0)';
    }
}


'use strict';
const tabs = document.querySelectorAll("[data-id^='app-']");
const contents = document.querySelectorAll("[data-content^='app-']");

let activeTab = tabs[0];

tabs.forEach(tab => {
    tab.addEventListener('click', function () {

        activeTab.classList.remove('active');

        tab.classList.add('active');
        activeTab = tab;

        let id = tab.getAttribute("data-id");

        contents.forEach(box => {

            box.classList.add('hide');
            box.classList.remove('show');

            if (box.getAttribute("data-content") == id) {
                box.classList.remove('hide');
                box.classList.add('show');
            }
        });
    });
});

   /**************************** heure ****************************/

   function updateClockAccueil() {
       const clockElement = document.getElementById('clock-screen');
       const now = new Date();
       const hours = String(now.getHours()).padStart(2, '0');
       const minutes = String(now.getMinutes()).padStart(2, '0');
       const currentTime = `${hours}:${minutes}`;
       clockElement.textContent = currentTime;
   }
   setInterval(updateClock, 1000);
   updateClockAccueil();

   function updateClock() {
       const clockElement = document.getElementById('clock');
       const now = new Date();
       const hours = String(now.getHours()).padStart(2, '0');
       const minutes = String(now.getMinutes()).padStart(2, '0');
       const currentTime = `${hours}:${minutes}`;
       clockElement.textContent = currentTime;
   }
   setInterval(updateClock, 1000);
   updateClock();


   /**************************** date ****************************/

   function afficherDateAccueil() {
       const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
       const moisAnnee = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
       const aujourdHui = new Date();
       const jourSemaine = joursSemaine[aujourdHui.getDay()];
       const jour = aujourdHui.getDate();
       const mois = moisAnnee[aujourdHui.getMonth()];
       const jourFormate = jour < 10 ? '0' + jour : jour;
       const dateTexte = `${jourSemaine} ${jourFormate} ${mois}`;
       document.getElementById("date2").innerText = dateTexte;
   }

   function afficherDate() {
       const joursSemaine = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
       const aujourdHui = new Date();
       const jourSemaine = joursSemaine[aujourdHui.getDay()];
       const jour = aujourdHui.getDate();
       const jourFormate = jour < 10 ? '0' + jour : jour;
       const dateTexte = `${jourSemaine}`;
       const jourTexte = `${jourFormate}`;
       document.getElementById("date").innerText = dateTexte;
       document.getElementById("jour").innerText = jourTexte;
   }



/************************************************************************** CONTROL PAGE **************************************************************************/

var openCtrl = document.querySelector(".openCtrl");
var overlay = document.querySelector(".container-notif");
var closeLine = document.querySelector(".fillInCtrl");

openCtrl.addEventListener("click", function () {
    overlay.style.display = "flex";
    document.body.classList.add("no-scroll");
});

overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        overlay.style.display = "none";
        document.body.classList.remove("no-scroll");
    }
});

closeLine.addEventListener("click", function () {
    overlay.style.display = "none";
    document.body.classList.remove("no-scroll");
});


/**************************** scroll ****************************/

document.addEventListener("DOMContentLoaded", function () {
    const pages = document.querySelectorAll(".page");
    const dots = document.querySelectorAll(".dot");

    function updatePagination() {
        let index = 0;

        pages.forEach((page, i) => {
            const rect = page.getBoundingClientRect();
            if (rect.top >= 0 && rect.top < window.innerHeight) {
                index = i;
            }
        });

        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");
    }

    document.querySelector(".scroll-container").addEventListener("scroll", updatePagination);


    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            pages[i].scrollIntoView({ behavior: "smooth" });
        });
    });
});

/**************************** switch btn ****************************/

const switches1 = document.querySelectorAll(".switch");

switches1.forEach(switchButton => {
    switchButton.addEventListener("click", () => {
        switchButton.classList.toggle("active");

        const label = switchButton.previousElementSibling;

        const textOn = switchButton.dataset.on;
        const textOff = switchButton.dataset.off;

        if (switchButton.classList.contains("active")) {
            label.textContent = textOn;
        } else {
            label.textContent = textOff;
        }
    });
});


const switches2 = document.querySelectorAll(".switch2");

switches2.forEach(switchButton => {
    switchButton.addEventListener("click", () => {
        switchButton.classList.toggle("desactive");

        const label = switchButton.previousElementSibling;

        const textOns = switchButton.dataset.ons;
        const textOffs = switchButton.dataset.offs;

        if (switchButton.classList.contains("desactive")) {
            label.textContent = textOns;
        } else {
            label.textContent = textOffs;
        }
    });
});


const switchesDark = document.querySelectorAll(".switchDark");

switchesDark.forEach(switchButton => {
    switchButton.addEventListener("click", () => {
        switchButton.classList.toggle("active");
    });
});


const switchesDarkOk = document.querySelectorAll(".switchDarkOk");

switchesDarkOk.forEach(switchButton => {
    switchButton.addEventListener("click", () => {
        switchButton.classList.toggle("desactive");

    });
});

/************************************************************************** FICHIER PAGE **************************************************************************/

/************************* visonneuse img ****************************/
const imagesViz = document.querySelectorAll(".galleryViz img");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const imageInfo = document.getElementById("image-info");
const closeBton = document.querySelector(".close-bttn");

imagesViz.forEach(image => {
    image.addEventListener("click", () => {
        lightbox.style.display = "flex";
        lightboxImg.src = image.src;
        imageInfo.textContent = image.getAttribute("data-info");
    });
});

closeBton.addEventListener("click", () => {
    lightbox.style.display = "none";
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        lightbox.style.display = "none";
    }
});

/************************* sous menu img ****************************/

document.getElementById("menu-toggle").addEventListener("click", function () { document.getElementById("dropdown-menu").classList.toggle("active"); });

/**************************** heure ****************************/

function updateClockAccueil() {
    const clockElement = document.getElementById('clock-screen');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    clockElement.textContent = currentTime;
}
setInterval(updateClock, 1000);
updateClockAccueil();

function updateClock() {
    const clockElement = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    clockElement.textContent = currentTime;
}
setInterval(updateClock, 1000);
updateClock();


/**************************** date ****************************/

function afficherDateAccueil() {
    const joursSemaine = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const moisAnnee = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    const aujourdHui = new Date();
    const jourSemaine = joursSemaine[aujourdHui.getDay()];
    const jour = aujourdHui.getDate();
    const mois = moisAnnee[aujourdHui.getMonth()];
    const jourFormate = jour < 10 ? '0' + jour : jour;
    const dateTexte = `${jourSemaine} ${jourFormate} ${mois}`;
    document.getElementById("date2").innerText = dateTexte;
}

function afficherDate() {
    const joursSemaine = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
    const aujourdHui = new Date();
    const jourSemaine = joursSemaine[aujourdHui.getDay()];
    const jour = aujourdHui.getDate();
    const jourFormate = jour < 10 ? '0' + jour : jour;
    const dateTexte = `${jourSemaine}`;
    const jourTexte = `${jourFormate}`;
    document.getElementById("date").innerText = dateTexte;
    document.getElementById("jour").innerText = jourTexte;
}



/**************************** vibr bouton neum ****************************/


const vibrBtn = document.getElementById('moveVibr');
let moved = false;

vibrBtn.addEventListener('click', function () {
    if (!moved) {
        vibrBtn.style.left = '10px';
    } else {
        vibrBtn.style.left = '0px';
    }
    moved = !moved;
});
