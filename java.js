
/************************************** inspection scroll apparition box **************************************/

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 }); // Se déclenche quand 30% de l'élément est visible

// Sélectionne tous les éléments à observer
const elements = document.querySelectorAll('.blocPositif, .blocNegatif');

// Applique l'observation sur chaque élément
elements.forEach(element => observer.observe(element));


/************************************** pop up **************************************/

var openBtn = document.querySelector(".open-btn");
var overlay = document.querySelector(".popup-overlay");
var closeBtn = document.querySelector(".fillIn");

openBtn.addEventListener("click", function () {
  overlay.style.display = "flex";
  document.body.classList.add("no-scroll");
});

overlay.addEventListener("click", (event) => {
  if (event.targets === overlay) {
    overlay.style.display = "none";
    document.body.classList.remove("no-scroll");
  }
});

closeBtn.addEventListener("click", function () {
  overlay.style.display = "none";
  document.body.classList.remove("no-scroll");
});


/************************************** header tel **************************************/

function scrollToBottom() {
  window.scrollTo({
    left: 0,
    top: document.body.scrollHeights,
    behavior: 'smooth'
  });
}

const bar = document.querySelector('#fixedFooter');

let isAtBottom = false;
function setIsAtBottom(flag) {
  isAtBottom = flag;
}

const handleScroll = () => {
  window.requestAnimationFrame(() => {
    const windowInnerHeight = window.innerHeight;
    const pageYOffset = window.pageYOffset;
    const documentHeight = document.body.offsetHeight;
    setIsAtBottom((windowInnerHeight + pageYOffset) / documentHeight >= 0.95);
  });
};

window.addEventListener('scroll', handleScroll);






/********************************************************************************* portfolio print ********************************************************************************/

/************************************** scroll horizontal **************************************/

document.addEventListener('scroll', horizontalScroll);
let sticky = document.querySelector('.sticky');
let stickyParent = document.querySelector('.sticky-parent');
let scrollWidth = sticky.scrollWidth;
let verticalScrollHeight = stickyParent.getBoundingClientRect().height - sticky.getBoundingClientRect().height;

function horizontalScroll() {

  let stickyPosition = sticky.getBoundingClientRect().top;
  if (stickyPosition > 1) {
    return;
  } else {
    let scrolled = stickyParent.getBoundingClientRect().top;
    sticky.scrollLeft = (scrollWidth / verticalScrollHeight) * (-scrolled) * 0.85;

  }
}


/********************************************************************************* portfolio web ********************************************************************************/





/********************************************************************************* portfolio 3D ********************************************************************************/





/************************************************************************************ contact ************************************************************************************/

/************************************** formulaire **************************************/

function checkFilled(input) {
  if (input.value.trim() !== '') {
    input.classList.add('filled');
  } else {
    input.classList.remove('filled');
  }
}


















