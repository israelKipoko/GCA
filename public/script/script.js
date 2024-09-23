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
    console.log(error);
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

/* PENDING WORK */

/* TO DO LIST */
try {
    const todoWrapperTabs = document.querySelectorAll('.todo_wrapper_tabs ul li');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const todoTodayDate = document.querySelector('.todo_date_now');
    const todoTitleTab = document.querySelector('.todo_list_wrapper h1');
    const addTaskInputWrapper = document.querySelector('.addTaskInput');
    const newTaskForm = document.querySelector('#new_todo_form');
    const checkMark = document.querySelectorAll('.check_mark');
    var targetTab = "my_day";

    todoWrapperTabs.forEach((tab)=>{
        tab.addEventListener('click',()=>{
          targetTab = tab.getAttribute('data-tab');

          todoWrapperTabs.forEach(function(tabLink) {
            tabLink.classList.remove('active');
          });
          tabPanes.forEach(function(pane) {
              pane.classList.remove('active');
          });

          tab.classList.add('active');
          document.getElementById(targetTab).classList.add('active');
           
            todoTitleTab.innerHTML = tab.textContent;
            if(targetTab != "my_day"){
                todoTitleTab.nextElementSibling.classList.add('hidden');
            }else{
                todoTitleTab.nextElementSibling.classList.remove('hidden');
            }
        })
    });
    newTaskForm.addEventListener('submit',(event)=>{
      if(newTaskForm.querySelector('#new_task').value == ""){
          event.preventDefault();
      }else{
        event.preventDefault();

        var categoryInput = document.createElement('input');
        categoryInput.type = "hidden";
        categoryInput.name = "category";
        categoryInput.value = targetTab;
        newTaskForm.appendChild(categoryInput);
        var data = $(newTaskForm).serialize();
        jQuery.ajax({
          headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
          url: "/tasks/new-task",
          type: 'POST',
          data: data,
          success: function(response){
            Livewire.dispatch('refreshTodoList', { refreshPosts: true });
            newTaskForm.remove(categoryInput);
          },
          error: function(){

          }
        });
      };
    });

    checkMark.forEach((mark)=>{
      mark.addEventListener('click',()=>{
        var data = $(mark.querySelector('form')).serialize();
        jQuery.ajax({
          headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
          url: "/tasks/update-status",
          type: 'POST',
          data: data,
          success: function(response){
            Livewire.dispatch('refreshTodoList', { refreshPosts: true });
          },
          error: function(){

          }
        });
      });
    });
   
    let dateToday = new Date();
    const options = {weekday:'short',month:'long', day:'numeric'};
    const newDate = dateToday.toLocaleDateString('fr-FR',options);
    todoTodayDate.innerHTML = newDate;
} catch (error) {
    console.log(error.message);
}
/* TO DO LIST */

/* CALENDAR */
try {

} catch (error) {
    console.log(error.message);
}

/* MULTIPLE SELECT */
try {
    const multipleSlectTrigger = document.querySelector('.multiple-select #selected_participants');
    const options = document.querySelector('.options');
    const optionsList = document.querySelectorAll('.option');
    const selectedOptions = [];
    const participantsInput = document.querySelector('.multiple-select #participants');
    const badgesWrapper = document.querySelector('#participants_badges_wrapper');

    multipleSlectTrigger.addEventListener('focus', function() {
      options.classList.add('open');
  });

   // Close the dropdown when clicking outside
   document.addEventListener('click', function(e) {
      if (!multipleSlectTrigger.contains(e.target) && !options.contains(e.target)) {
          options.classList.remove('open');
          multipleSlectTrigger.classList.remove('isHover');
      }
    });
     // Handle option selection
     optionsList.forEach(function(option) {
      option.addEventListener('click', function() {
          const value = this.getAttribute('data-value');
          const text = this.querySelector('span').textContent;

            if (!selectedOptions.includes(value)) {
                selectedOptions.push(value);
                participantsInput.value = selectedOptions;
            }

          // Update the trigger content with selected items
          const selectedTexts = selectedOptions.map(value => {
              return options.querySelector(`.option[data-value="${value}"] span`).textContent;
          });

          // var placeholder = document.querySelector('.select-placeholder').textContent;
          if(selectedTexts.length != 0){
                const div = document.createElement('div');
                div.setAttribute('data-value', value);
                const badgeText = document.createElement('span');
                badgeText.textContent = text;
                const removeBtn = document.createElement('span');
                removeBtn.innerHTML = '<i class="fa-solid fa-x text-bold text-[12px]"></i>';
                removeBtn.addEventListener('click', ()=>{
                    let index = selectedOptions.indexOf(div.getAttribute('data-value'));
                        if (index > -1) {
                            selectedOptions.splice(index, 1);
                        }
                    participantsInput.value = selectedOptions;
                    badgesWrapper.removeChild(removeBtn.parentElement);
                })
                div.appendChild(badgeText);
                div.appendChild(removeBtn);
                div.classList.add('participants');
                badgesWrapper.insertBefore(div, multipleSlectTrigger);
          }
      });
  });
  multipleSlectTrigger.addEventListener('input', function() {
    const filter = multipleSlectTrigger.value.toLowerCase();
    optionsList.forEach(function(option) {
        const text = option.querySelector('span').textContent.toLowerCase();
        if (text.includes(filter)) {
            option.style.display = '';
            let startIndex = text.indexOf(filter);
            let endIndex = startIndex + filter.length;
            option.querySelector('span').innerHTML= text.substring(0, startIndex) +
                             '<strong>' + text.substring(startIndex, endIndex) + '</strong>' +
                             text.substring(endIndex);
        } else {
            option.style.display = 'none';
        }
    });
});
  } catch (error) {
    console.log(error.message);
  }
  try{
    var datepicker = new Datepicker('#datepicker', {
        // Configure options here
        onChange: (instance) => {
             const inputDate = document.querySelector('.input_div #datepicker').value;
            const date = new Date(inputDate);
             const options = {weekday:'short', year:'numeric',month:'long', day:'numeric'};
             const formattedDate = date.toLocaleDateString('fr-FR',options);

             if(formattedDate != 'Invalid Date'){
                document.querySelector('.input_div #datepicker').value = formattedDate;
                const event = new Event('input', { bubbles: true });
                document.querySelector('.input_div #datepicker').dispatchEvent(event);

                const inputEventDate = document.querySelector('#planned_events_calendar_date');
                let newOptions = {weekday:'short',month:'long', day:'numeric'};
                let newDate = date.toLocaleDateString('fr-FR',newOptions);
                if(newDate != 'Invalid Date'){
                    inputEventDate.value = newDate;
                    const event = new Event('input', { bubbles: true });
                    inputEventDate.dispatchEvent(event);
                 }
             }
        },
    });
} catch(error){
    console.log(error.message);
  }

  try {
    const months = {
        "janvier": "01",
        "février": "02",
        "mars": "03",
        "avril": "04",
        "mai": "05",
        "juin": "06",
        "juillet": "07",
        "août": "08",
        "septembre": "09",
        "octobre": "10",
        "novembre": "11",
        "décembre": "12"
      };
    const inputEventDate = document.querySelector('#planned_events_calendar_date');
    const todayDate = new Date();
    const options = {weekday:'short',month:'long', day:'numeric'};
    const formattedDate = todayDate.toLocaleDateString('fr-FR',options);
    if(formattedDate != 'Invalid Date'){
        inputEventDate.value = formattedDate;
     }

     const dateControls = document.querySelectorAll('.date_controls');

     dateControls.forEach((icon)=>{
        icon.addEventListener('click',()=>{
            if(icon.classList.contains('left')){
                let dateValue = inputEventDate.value;
                const [day, month] = dateValue.match(/\d+|\D+/g).slice(1, 3).map(str => str.trim());
                const year = new Date().getFullYear();
                const formattedDate = `${year}-${months[month]}-${day.padStart(2, '0')}`;

                let currentDate = new Date(formattedDate);
                currentDate.setDate(currentDate.getDate() - 1);
                const options = {weekday:'short',month:'long', day:'numeric'};
                let newDate = currentDate.toLocaleDateString('fr-FR',options);
                 if(newDate != 'Invalid Date'){
                    inputEventDate.value = newDate;
                    const event = new Event('input', { bubbles: true });
                    inputEventDate.dispatchEvent(event);
                 }
            }else if(icon.classList.contains('right')){
                let dateValue = inputEventDate.value;
                const [day, month] = dateValue.match(/\d+|\D+/g).slice(1, 3).map(str => str.trim());
                const year = new Date().getFullYear();
                const formattedDate = `${year}-${months[month]}-${day.padStart(2, '0')}`;

                let currentDate = new Date(formattedDate);
                currentDate.setDate(currentDate.getDate() + 1);
                const options = {weekday:'short',month:'long', day:'numeric'};
                let newDate = currentDate.toLocaleDateString('fr-FR',options);
                 if(newDate != 'Invalid Date'){
                    inputEventDate.value = newDate;
                    const event = new Event('input', { bubbles: true });
                    inputEventDate.dispatchEvent(event);
                 }
            }
         });
     });
     inputEventDate.addEventListener('input',()=>{
        var data = $("#planned_events_calendar_form").serialize();
        jQuery.ajax({
          headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
          url: "/home/event/check-availability",
          type: 'POST',
          data: data,
          success: function(response){
            console.log(response.events)
            if(response.eventExist){
                document.querySelectorAll('#availability_list')[0].innerHTML = "";
                document.querySelectorAll('#availability_list')[1].innerHTML = "";
                response.events.forEach((UserEvent)=>{
                    document.querySelectorAll('#availability_list').forEach((item)=>{
                        item.innerHTML += `
                        <div class="events_wrapper ml-2">
                                    <div class="event_divider"></div>
                                    <div class="flex gap-x-2 py-1">
                                        <div>
                                            <p>${UserEvent['time']['start_time']}</p>
                                            <span class="hidden">remaining time</span>
                                        </div>
                                        <div class="">
                                            <h1 class="font-bold capitalize text-[17px] text-[#356B8C]">${UserEvent['title']}</h1>
                                            <div>
                                                <div id="user_picture" class="hidden w-[40px] h-[40px]">
                                                    <img src="{{asset('storage${UserEvent['user']['avatar']})}}" alt="user-profile">
                                                </div>
                                                <div>
                                                    <h1 class="capitalize flex ml-2 text-white text-[14px]">${UserEvent['user']['firstname']}  ${response.events[0]['user']['name']}</h1>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                    `
                    })
                    
                })
            }else{
                document.querySelectorAll('#availability_list')[0].innerHTML = "";
                document.querySelectorAll('#availability_list')[1].innerHTML = "";
                document.querySelectorAll('#availability_list')[0].innerHTML = `
                 <div class="flex items-center h-full no-event">
                  <h3 class="">Aucun Evénement!!</h3>
                </div>
                `
                document.querySelectorAll('#availability_list')[1].innerHTML = `
                <div class="flex items-center h-full no-event">
                 <h3 class="">Aucun Evénement!!</h3>
               </div>
               `
            }
          },
          error: function(error){
            console.log(error.message);
          }
        });
      });
     var eventDatePicker = new Datepicker('#planned_events_calendar_date', {
          onChange: (instance) => {
            let dateValue = inputEventDate.value;
            let choosedDate = new Date(dateValue);
            const options = {weekday:'short',month:'long', day:'numeric'};
            const newDate = choosedDate.toLocaleDateString('fr-FR',options);
               if(newDate != 'Invalid Date'){
                  inputEventDate.value = newDate;
                  const event = new Event('input', { bubbles: true });
                  inputEventDate.dispatchEvent(event);
               }
          },
    });



  } catch (error) {
    console.log(error.message);
  }
  try {
    const inputTime = document.querySelectorAll('.event_time_trigger span');
    const inputTimeOptions = document.querySelectorAll('.event_time_options');

    const timeNow = new Date();
    let hours = timeNow.getHours();
    let minutes = timeNow.getMinutes();

    //Initialization
    if (minutes < 30) {

        //start time
        inputTime[0].textContent = hours.toString().padStart(2, '0') + ':' + '30';
        document.querySelector('#start_time').value = inputTime[0].textContent;
        const event = new Event('input', { bubbles: true });
        document.querySelector('#start_time').dispatchEvent(event);

        //End time
        timeNow.setHours(timeNow.getHours() + 1);
        let hour = timeNow.getHours();
        inputTime[1].textContent = hour.toString().padStart(2, '0') + ':' + '00';
        document.querySelector('#end_time').value = inputTime[1].textContent;
        document.querySelector('#end_time').dispatchEvent(event);
    } else {
        // start time
         timeNow.setHours(timeNow.getHours() + 1);
         let hour = timeNow.getHours();
        inputTime[0].textContent= hour.toString().padStart(2, '0') + ':' + '00';
        document.querySelector('#start_time').value = inputTime[0].textContent;
        const event = new Event('input', { bubbles: true });
        document.querySelector('#start_time').dispatchEvent(event);

        //end time
        inputTime[1].textContent = hour.toString().padStart(2, '0') + ':' + '30';
        document.querySelector('#end_time').value = inputTime[1].textContent;
        document.querySelector('#end_time').dispatchEvent(event);
    }

    frenchTime();

    // Modification
    inputTimeOptions[0].querySelectorAll('span').forEach((option) =>{
        option.addEventListener('click',()=>{
          inputTime[0].textContent = option.textContent;
          document.querySelector('#start_time').value = option.textContent;
          const event = new Event('input', { bubbles: true });
          document.querySelector('#start_time').dispatchEvent(event);

           //end time
           let [endHours, endMinutes] = inputTime[0].textContent.split(':').map(Number);
           timeNow.setHours(endHours, (endMinutes+30));
            let hour = timeNow.getHours();
            let minute = timeNow.getMinutes();

            inputTime[1].textContent = hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');
            document.querySelector('#end_time').value = inputTime[1].textContent;
            document.querySelector('#end_time').dispatchEvent(event);
        });
     });
     inputTimeOptions[1].querySelectorAll('span').forEach((option) =>{
        option.addEventListener('click',()=>{
          inputTime[1].textContent = option.textContent;
          document.querySelector('#end_time').value = option.textContent;
          const event = new Event('input', { bubbles: true });
          document.querySelector('#end_time').dispatchEvent(event);
        });
     });
    function frenchTime(){
        let hour = 0;
        let minutes = 0;
        for (let i = 0; i <= 23; i++) {
            hour = i.toString().padStart(2, '0');
            for (let j = 0; j <= 59; j+= 30) {
                minutes = j.toString().padStart(2, '0');
                let element = document.createElement('span');
                element.textContent = `${hour+':'+minutes}`;
                inputTimeOptions[0].appendChild(element);
              }
        }
        let [endHours, endMinutes] = inputTime[0].textContent.split(':').map(Number);
        if(endMinutes >= 30)
            endHours++;


        for (let i = endHours; i < 23; i++) {
            hour = i.toString().padStart(2, '0');
            for (let j = 0; j <= 59; j+= 30) {
                minutes = j.toString().padStart(2, '0');
                let element = document.createElement('span');
                element.textContent = `${hour+':'+minutes}`;
                inputTimeOptions[1].appendChild(element);
              }
        }
    }
  } catch (error) {
    console.log(error.message);
  }

  /* Calendar */
  try {
   
    const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventBtn = document.querySelector(".add-event"),
    addEventWrapper = document.querySelector(".add-event-wrapper "),
    addEventCloseBtn = document.querySelector(".close "),
    addEventTitle = document.querySelector(".event-name "),
    addEventFrom = document.querySelector(".event-time-from "),
    addEventTo = document.querySelector(".event-time-to "),
    addEventSubmit = document.querySelector(".add-event-btn ");
  
  let today = new Date();
  let activeDay;
  let month = today.getMonth();
  let year = today.getFullYear();
  
  const months = [
    "Janvier",    // January in French
    "Février",    // February in French
    "Mars",       // March in French (missing in the original array)
    "Avril",      // April in French (was "A" and "April")
    "Mai",        // May in French
    "Juin",       // June in French
    "Juillet",    // July in French
    "Août",       // August in French
    "Septembre",  // September in French
    "Octobre",    // October in French
    "Novembre",   // November in French
    "Décembre"    // December in French
  ];
  
  // const eventsArr = [
  //   {
  //     day: 13,
  //     month: 11,
  //     year: 2022,
  //     events: [
  //       {
  //         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
  //         time: "10:00 AM",
  //       },
  //       {
  //         title: "Event 2",
  //         time: "11:00 AM",
  //       },
  //     ],
  //   },
  // ];
  
  const eventsArr = [];
  getEvents();
  
  //function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
  function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;
  
    date.innerHTML = months[month] + " " + year;
  
    let days = "";
  
    for (let x = day; x > 0; x--) {
      days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }
  
    for (let i = 1; i <= lastDate; i++) {
      //check if event is present on that day
      let event = false;
      eventsArr.forEach((eventObj) => {
        if (
          eventObj.day === i &&
          eventObj.month === month + 1 &&
          eventObj.year === year
        ) {
          event = true;
        }
      });
      if (
        i === new Date().getDate() &&
        year === new Date().getFullYear() &&
        month === new Date().getMonth()
      ) {
        activeDay = i;
        getActiveDay(i);
        // updateEvents(i);
        if (event) {
          days += `<div class="day today active event">${i}</div>`;
        } else {
          days += `<div class="day today active">${i}</div>`;
        }
      } else {
        if (event) {
          days += `<div class="day event">${i}</div>`;
        } else {
          days += `<div class="day ">${i}</div>`;
        }
      }
    }
  
    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="day next-date">${j}</div>`;
    }
    daysContainer.innerHTML = days;
    addListner();
  }
  
  //function to add month and year on prev and next button
  function prevMonth() {
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    initCalendar();
  }
  
  function nextMonth() {
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    initCalendar();
  }
  
  prev.addEventListener("click", prevMonth);
  next.addEventListener("click", nextMonth);
  
  initCalendar();
  
  //function to add active on day
  function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
      day.addEventListener("click", (e) => {
        getActiveDay(e.target.innerHTML);
        // updateEvents(Number(e.target.innerHTML));
        activeDay = Number(e.target.innerHTML);
        //remove active
        days.forEach((day) => {
          day.classList.remove("active");
        });
        //if clicked prev-date or next-date switch to that month
        if (e.target.classList.contains("prev-date")) {
          prevMonth();
          //add active to clicked day afte month is change
          setTimeout(() => {
            //add active where no prev-date or next-date
            const days = document.querySelectorAll(".day");
            days.forEach((day) => {
              if (
                !day.classList.contains("prev-date") &&
                day.innerHTML === e.target.innerHTML
              ) {
                day.classList.add("active");
              }
            });
          }, 100);
        } else if (e.target.classList.contains("next-date")) {
          nextMonth();
          //add active to clicked day afte month is changed
          setTimeout(() => {
            const days = document.querySelectorAll(".day");
            days.forEach((day) => {
              if (
                !day.classList.contains("next-date") &&
                day.innerHTML === e.target.innerHTML
              ) {
                day.classList.add("active");
              }
            });
          }, 100);
        } else {
          e.target.classList.add("active");
        }
      });
    });
  }
  
  todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();
  });
  
  dateInput.addEventListener("input", (e) => {
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    if (dateInput.value.length === 2) {
      dateInput.value += "/";
    }
    if (dateInput.value.length > 7) {
      dateInput.value = dateInput.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
      if (dateInput.value.length === 3) {
        dateInput.value = dateInput.value.slice(0, 2);
      }
    }
  });
  
  gotoBtn.addEventListener("click", gotoDate);
  
  function gotoDate() {
    console.log("here");
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
      if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
        month = dateArr[0] - 1;
        year = dateArr[1];
        initCalendar();
        return;
      }
    }
    // alert("Invalid Date");
  }
  
  //function get active day day name and date and update eventday eventdate
  function getActiveDay(date) {
    const day = new Date(year, month, date);
    const options = {weekday: 'long' };
    const formattedDate =  day.toLocaleDateString('fr-FR',options);
    const dayName = day.toString().split(" ")[0];
    eventDay.innerHTML = formattedDate;
    eventDate.innerHTML = date + " " + months[month] + " " + year;

    const choosedOptions = {weekday:'short',month:'long', day:'numeric'};
    const newDate = day.toLocaleDateString('fr-FR',choosedOptions);
    document.querySelector('#planned_events_calendar_date').value = newDate;
        const event = new Event('input', { bubbles: true });
        document.querySelector('#planned_events_calendar_date').dispatchEvent(event);
  }
  
  //function update events when a day is active
//   function updateEvents(date) {
//     let events = "";
//     eventsArr.forEach((event) => {
//       if (
//         date === event.day &&
//         month + 1 === event.month &&
//         year === event.year
//       ) {
//         event.events.forEach((event) => {
//           events += `<div class="event">
//               <div class="title">
//                 <i class="fas fa-circle"></i>
//                 <h3 class="event-title">${event.title}</h3>
//               </div>
//               <div class="event-time">
//                 <span class="event-time">${event.time}</span>
//               </div>
//           </div>`;
//         });
//       }
//     });
//     if (events === "") {
//       events = `<div class="no-event">
//               <h3>Aucun Evénement</h3>
//           </div>`;
//     }
//     eventsContainer.innerHTML = events;
//     saveEvents();
//   }
  
  //function to add event
  addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
  });
  
  addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
  });
  
  document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
      addEventWrapper.classList.remove("active");
    }
  });
  
  //allow 50 chars in eventtitle
  addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
  });
  
  function defineProperty() {
    var osccred = document.createElement("div");
    osccred.style.position = "absolute";
    osccred.style.bottom = "0";
    osccred.style.right = "0";
    osccred.style.fontSize = "10px";
    osccred.style.color = "#ccc";
    osccred.style.fontFamily = "sans-serif";
    osccred.style.padding = "5px";
    osccred.style.background = "#fff";
    osccred.style.borderTopLeftRadius = "5px";
    osccred.style.borderBottomRightRadius = "5px";
    osccred.style.boxShadow = "0 0 5px #ccc";
    document.body.appendChild(osccred);
  }
  
  defineProperty();
  
  //allow only time in eventtime from and to
  addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if (addEventFrom.value.length === 2) {
      addEventFrom.value += ":";
    }
    if (addEventFrom.value.length > 5) {
      addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
  });
  
  addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if (addEventTo.value.length === 2) {
      addEventTo.value += ":";
    }
    if (addEventTo.value.length > 5) {
      addEventTo.value = addEventTo.value.slice(0, 5);
    }
  });
  
  //function to add event to eventsArr
  addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
      alert("Please fill all the fields");
      return;
    }
  
    //check correct time format 24 hour
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    if (
      timeFromArr.length !== 2 ||
      timeToArr.length !== 2 ||
      timeFromArr[0] > 23 ||
      timeFromArr[1] > 59 ||
      timeToArr[0] > 23 ||
      timeToArr[1] > 59
    ) {
      alert("Invalid Time Format");
      return;
    }
  
    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);
  
    //check if event is already added
    let eventExist = false;
    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        event.events.forEach((event) => {
          if (event.title === eventTitle) {
            eventExist = true;
          }
        });
      }
    });
    if (eventExist) {
      alert("Event already added");
      return;
    }
    const newEvent = {
      title: eventTitle,
      time: timeFrom + " - " + timeTo,
    };
    console.log(newEvent);
    console.log(activeDay);
    let eventAdded = false;
    if (eventsArr.length > 0) {
      eventsArr.forEach((item) => {
        if (
          item.day === activeDay &&
          item.month === month + 1 &&
          item.year === year
        ) {
          item.events.push(newEvent);
          eventAdded = true;
        }
      });
    }
  
    if (!eventAdded) {
      eventsArr.push({
        day: activeDay,
        month: month + 1,
        year: year,
        events: [newEvent],
      });
    }
  
    console.log(eventsArr);
    addEventWrapper.classList.remove("active");
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    // updateEvents(activeDay);
    //select active day and add event class if not added
    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
      activeDayEl.classList.add("event");
    }
  });
  
  //function to delete event when clicked on event
  eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
      if (confirm("Are you sure you want to delete this event?")) {
        const eventTitle = e.target.children[0].children[1].innerHTML;
        eventsArr.forEach((event) => {
          if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
          ) {
            event.events.forEach((item, index) => {
              if (item.title === eventTitle) {
                event.events.splice(index, 1);
              }
            });
            //if no events left in a day then remove that day from eventsArr
            if (event.events.length === 0) {
              eventsArr.splice(eventsArr.indexOf(event), 1);
              //remove event class from day
              const activeDayEl = document.querySelector(".day.active");
              if (activeDayEl.classList.contains("event")) {
                activeDayEl.classList.remove("event");
              }
            }
          }
        });
        // updateEvents(activeDay);
      }
    }
  });
  
  //function to save events in local storage
  function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }
  
  //function to get events from local storage
  function getEvents() {
    //check if events are already saved in local storage then return event else nothing
    if (localStorage.getItem("events") === null) {
      return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
  }
  
  function convertTime(time) {
    //convert time to 24 hour format
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
  }
   
  } catch (error) {
    console.log(error.message);
  }
/* Calendar */
//   datepicker.onChange()
/* CALENDAR */
