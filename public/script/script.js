try {
    const passwordEye = document.querySelector('.eye');
const passwordInput = document.querySelector('#password');

passwordEye.addEventListener('click',()=>{
    if (passwordInput.type == "password"){
        passwordInput.type = "text";
        passwordEye.classList.remove('fa-eye');
        passwordEye.classList.add('fa-eye-slash');
        passwordEye.title = "Casher le mot de passe";
    }
    else{
        passwordInput.type = "password";
        passwordEye.classList.remove('fa-eye-slash');
        passwordEye.classList.add('fa-eye');
        passwordEye.title = "Montrer le mot de passe";
    }
})
} catch (error) {
    error.message;
}

/* SIDEBAR */
 try {
    const expand_btn = document.querySelector('#expand_btn');
    const sidebarText = document.querySelectorAll("#sidebar_wrapper nav a span h1");

    expand_btn.addEventListener("click", ()=>{
        document.querySelector("#sidebar").classList.toggle("expand_sidebar");
        document.querySelector("#main").classList.toggle("reduce_main");
        document.querySelector("#expand_btn i").classList.toggle("rotate_expand_btn");
        document.querySelector("#sidebar_wrapper footer summary h1").classList.toggle("hide_sidebar_text");
        sidebarText.forEach(text => {
            text.classList.toggle("hide_sidebar_text");
        });
    })

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const tabs = document.querySelectorAll('#sidebar_wrapper nav a');
    if (queryString.length == 0) {
        tabs.forEach(function(tab){
            tab.classList.remove('active_tab');
        })
        tabs[0].classList.add('active_tab');
    } else {
        if(urlParams.get('q') == "reports"){
            tabs[1].classList.add('active_tab');
        }else if(urlParams.get('q') == "models"){
            tabs[2].classList.add('active_tab');
        }else if(urlParams.get('q') == "library"){
            tabs[3].classList.add('active_tab');
        }else if(urlParams.get('q') == "clients"){
            tabs[2].classList.add('active_tab');
        }
    }
 } catch (error) {
     error.message;
 }
/* SIDEBAR */

/* My foders */ 
try {
  document.addEventListener('DOMContentLoaded', (event) =>  {

    const inputs = document.querySelectorAll('.dt-container thead input');
  
    inputs.forEach((input) => {
      input.addEventListener('keydown', function (evt) {
        if ((evt.metaKey || evt.ctrlKey) && evt.key === 'a') this.select();
      });
    });
  });
} catch (error) {
  console.log(error.message);
}

/* My foders */
/* PENDING WORK */
try{
    const wrapper = document.querySelector(".pending_cases_wrapper");
    const casesCarousel = document.querySelector(".pending_cases_wrapper .carousel");
    const firstCardWidth = casesCarousel.querySelector(".card").offsetWidth;
    const arrowBtns = document.querySelectorAll(".pending_cases_wrapper i");
    const carouselChildrens = [...casesCarousel.children];

    /* NEWS */
    const newsCarousel = document.querySelector('.news_wrapper .carousel');
    const firstNewsPaperWidth = newsCarousel.querySelector('.news_paper').offsetWidth;
    const newsCarouselChildrens = [...newsCarousel.children];
    const newsWrapper = document.querySelector(".news_wrapper");
    /* NEWS */
    let isDragging = false, isAutoPlay = true, startScrollLeft, timeoutId, timeoutNewsId;


  const carouselCountainers = document.querySelector('.pending_cases_wrapper .carousel');

  let isDown = false;
  let startX;
  let startY;
  let scrollLeft;
  let scrollTop;

  carouselCountainers.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - carouselCountainers.offsetLeft;
      startY = e.pageY - carouselCountainers.offsetTop;
      scrollLeft = carouselCountainers.scrollLeft;
      scrollTop = carouselCountainers.scrollTop;
      carouselCountainers.style.cursor = 'grabbing';
  });

  carouselCountainers.addEventListener('mouseleave', () => {
    isDown = false;
    carouselCountainers.style.cursor = 'grab';
  });

  carouselCountainers.addEventListener('mouseup', () => {
    isDown = false;
    carouselCountainers.style.cursor = 'grab';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carouselCountainers.offsetLeft;
    const y = e.pageY - carouselCountainers.offsetTop;
    const walkX = (x - startX) * 1;
    const walkY = (y - startY) * 1;
    carouselCountainers.scrollLeft = scrollLeft - walkX;
    carouselCountainers.scrollTop = scrollTop - walkY;
  });


  const scrollLeftButtons = document.querySelector('.action-button--previous');
  const scrollRightButtons = document.querySelector('.action-button--next');

  scrollLeftButtons.addEventListener('click', () => {
    carouselCountainers.scrollBy({
        top: 0,
        left: -150,
        behavior: 'smooth'
    });
  });


    scrollRightButtons.addEventListener('click', () => {
    carouselCountainers.scrollBy({
        top: 0,
        left: 150,
        behavior: 'smooth'
    });
  });

  carouselCountainers.addEventListener('scroll', (e) => {
    const position = carouselCountainers.scrollLeft;
    if (position === 5) {
        scrollLeftButtons.disabled = true;
    } else {
        scrollLeftButtons.disabled = false;

    }

    if (Math.round(position) === carouselCountainers.scrollWidth - carouselCountainers.clientWidth) {
        scrollRightButtons.disabled = true;
    } else {
        scrollRightButtons.disabled = false;
    }
  })
    // Get the number of cards that can fit in the carousel at once

    let papaerPerView = Math.round(newsCarousel.offsetWidth / firstNewsPaperWidth);

    newsCarouselChildrens.slice(-papaerPerView).reverse().forEach(paper => {
        newsCarousel.insertAdjacentHTML("afterbegin", paper.outerHTML);
    });

    newsCarouselChildrens.slice(0, papaerPerView).forEach(paper => {
        newsCarousel.insertAdjacentHTML("beforeend", paper.outerHTML);
    });

    newsCarousel.classList.add("no-transition");
    newsCarousel.scrollLeft = newsCarousel.offsetWidth;
    newsCarousel.classList.remove("no-transition");

     const dragStart = (e) => {
         isDragging = true;
         casesCarousel.classList.add("dragging");
         // Records the initial cursor and scroll position of the carousel
         startX = e.pageX;
         startScrollLeft = casesCarousel.scrollLeft;
     }

     const dragging = (e) => {
         if(!isDragging) return; // if isDragging is false return from here
         // Updates the scroll position of the carousel based on the cursor movement
         casesCarousel.scrollLeft = startScrollLeft - (e.pageX - startX);
     }

     const dragStop = () => {
         isDragging = false;
         casesCarousel.classList.remove("dragging");
     }

    const infiniteNewsScroll = () => {
        if(newsCarousel.scrollLeft === 0) {
            newsCarousel.classList.add("no-transition");
            newsCarousel.scrollLeft = newsCarousel.scrollWidth - (2 * newsCarousel.offsetWidth);
            newsCarousel.classList.remove("no-transition");
        }
        else if(Math.ceil(newsCarousel.scrollLeft) === newsCarousel.scrollWidth - newsCarousel.offsetWidth) {
            newsCarousel.classList.add("no-transition");
            newsCarousel.scrollLeft = newsCarousel.offsetWidth;
            newsCarousel.classList.remove("no-transition");
        }

        clearTimeout(timeoutNewsId);
        newsAutoPlay();
    }

    const newsAutoPlay = () => {
        // Autoplay the carousel after every 2500 ms
        timeoutNewsId = setTimeout(() => newsCarousel.scrollLeft += firstNewsPaperWidth, 30000);
    }
    newsAutoPlay();

    document.addEventListener("mouseup", dragStop);
    // casesCarousel.addEventListener("scroll", infiniteScroll);
    newsCarousel.addEventListener("scroll", infiniteNewsScroll);
    wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
    // wrapper.addEventListener("mouseleave", casesAutoPlay);
    newsWrapper.addEventListener("mouseleave", newsAutoPlay);
}catch(error){
    console.log(error.message);
}
try {
    const updateButton = document.querySelector("#update_button");
    const uploadCaseDialog = document.querySelector("#upload_update_dialog");
    const cancelCaseDialogsButtons = document.querySelectorAll("button.cancel");
    const submitCaseDialog = document.querySelector('#submit_case_wrapper');
    const submitCaseButton = document.querySelector('#submit_case_button');

    updateButton.addEventListener("click", ()=>{
        uploadCaseDialog.showModal();
    })
    cancelCaseDialogsButtons.forEach((button)=>{
        button.addEventListener("click", ()=>{
            uploadCaseDialog.close();
            submitCaseDialog.close();
        });
    });


    submitCaseButton.addEventListener('click',()=>{
        submitCaseDialog.showModal();
    })
} catch (error) {
    console.log(error.message)
} 

