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
    console.error(error)
}

/* PENDING WORK */

/* TO DO LIST */
try {
    const taskInput = document.querySelector(".task-input #title");
    const filters = document.querySelectorAll(".filters span");
    const taskBox = document.querySelector(".task-box");
    const taskContainingsInputs = document.querySelector(".task_containings_wrapper");
    const taskNoteInputButton = document.querySelector("#task_note_input_button");
    const taskNoteInputTextArea = document.querySelector("#task_note_input_textArea");
    const taskForm = document.querySelector("#storeTaskForm");
    let editId, isEditTask = false;
document.addEventListener('DOMContentLoaded', function() {
    localStorage.removeItem('task_list');
    $.ajax({
        url: '/home/tasks',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            localStorage.setItem("task_list", JSON.stringify(response));
        },
        error: function(xhr, status, error) {
            console.error('Request failed with status ' + xhr.status + ': ' + error);
        }
    });
});
let tasksArrays = JSON.parse(localStorage.getItem("task_list"));
filters.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        button.classList.add("active");
        showTodo(button.id);
    });
});

taskInput.addEventListener("focus", ()=>{
    taskContainingsInputs.style.display = "block";
})
document.addEventListener("click", (event)=>{
    if(!taskInput.contains(event.target) && !taskContainingsInputs.contains(event.target)){
            taskContainingsInputs.style.display = "none";
    }
})
taskNoteInputButton.addEventListener("click", ()=>{
    taskNoteInputTextArea.showModal();
})
function showTodo(filter) {
    let liTag = "";
    if(filter == "for_me") {
        if(tasksArrays[0] != null) {
            let tasksCount = 0;
            tasksArrays[0][0].forEach((task, id) => {
                let completed = task.status == "completed" ? "checked" : "";
                    liTag += `<li class="task flex flex-col">
                                <div class="w-full flex">
                                    <label for="${task.id}" class="w-fit">
                                        <input onclick="updateStatus(this,${task.id})" type="checkbox" id="${task.id}" ${completed}>
                                        <p class="${completed}">${task.title}</p>
                                    </label>

                                    <div class="settings">
                                        <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                        <ul class="task_menu">
                                            <li onclick='editTask(${task.id}, "${task.title}", "${task.note}")'><i class="fa-solid fa-pen text-black"></i>Edit</li>
                                            <li onclick='deleteTask(${task.id}, "${filter}")' class="li-deleteTask"><i class="fa-solid fa-trash"></i>Delete</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="task_containings">
                                    <div class="task_note_wrapper">
                                        <div>
                                            <button onclick="showNote(this)">
                                                <i class="bx bxs-note bx-xs"></i>
                                                <p class="">1 note</p>
                                            </button>
                                        </div>
                                        <dialog class="task_note">
                                            <h1>Note</h1>
                                                <p>${task.note}</p>
                                        </dialog>
                                    </div>
                                    <div>
                                        <p>Date limite:${ task.due_date}</p>
                                    </div>
                                </div>
                            </li>`;
            });
            tasksCount = tasksArrays[0][0].length;
            document.querySelector("#count_personal_tasks").textContent = "";
            document.querySelector("#count_personal_tasks").textContent = "("+ tasksCount + ")";
        }
    }else{
        if(tasksArrays[1] != null) {
            tasksArrays[1].forEach((tasksArray,index) => {
                tasksArray.forEach((task,id) =>{

                    let completed = task.status == "completed" ? "checked" : "";
                    liTag += `<li class="task flex flex-col">
                                <div class="w-full flex">
                                    <label for="${task.id}" class="w-fit">
                                        <input onclick="updateStatus(this,${task.id})" type="checkbox" id="${task.id}" ${completed}>
                                        <p class="${completed}">${task.title}</p>
                                    </label>
                                </div>
                                <div class="task_containings">
                                    <div class="task_note_wrapper">
                                        <div>
                                            <button onclick="showNote(this)">
                                                <i class="bx bxs-note bx-xs"></i>
                                                <p class="">1 note</p>
                                            </button>
                                        </div>
                                        <dialog class="task_note">
                                            <h1>Note</h1>
                                                <p>${task.note}</p>
                                        </dialog>
                                    </div>
                                    <div>
                                        <p>Date limite:${ task.due_date}</p>
                                    </div>
                                </div>
                            </li>`;
                })
            });
        }
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("for_me");
function showMenu(selectedTask) {
    const menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}
function showNote(selectedNote){
    const noteDiv = selectedNote.parentElement.parentElement.lastElementChild;
    noteDiv.showModal();
    noteDiv.style.transform = "scale(1)";
    document.addEventListener("click", (event)=> {
        if(!selectedNote.contains(event.target) || noteDiv.contains(event.target)) {
            noteDiv.style.transform = "scale(0)";
            noteDiv.close();
        }
    });
}

function updateStatus(selectedTask, taskId) {
    let taskName = selectedTask.parentElement.lastElementChild;
    let delay = 0;
    if(selectedTask.checked) {
        taskName.classList.add("checked");
        setTimeout(submitUpdateStatus, delay, "completed");
    } else {
        taskName.classList.remove("checked");
        setTimeout(submitUpdateStatus, delay, "pending");
    }

    function submitUpdateStatus(status){
        $.ajax({
            url: '/home/tasks/update-task-status/'+taskId,
            type: 'POST',
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            data: {
                "_method": "PUT",
                "task_status": status
                },
            success: function(response) {
               console.log(response);
            },
            error: function(xhr, status, error) {
                console.error('Request failed with status ' + xhr.status + ': ' + error);
            }
        }
        )}
}
function editTask(taskId, textName, taskNote) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskNoteInputTextArea.querySelector("#note").value = taskNote;
    // taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteTaskId, filter) {
    if(filter == "for_me"){
        let taskIndex = tasksArrays[0][0].findIndex(task => task.id === deleteTaskId);
        if (taskIndex !== -1) {
            tasksArrays[0][0].splice(taskIndex, 1);
            localStorage.setItem("task_list", JSON.stringify(tasksArrays));
            showTodo(filter);
        }
    }
     $.ajax({
         url: '/home/tasks/delete-task/'+deleteTaskId,
         type: 'POST',
         headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
         data: {
            "_method": "DELETE",
            "task_status": deleteTaskId
            },
         success: function(response) {
            console.log(response);
         },
         error: function(xhr, status, error) {
             console.error('Request failed with status ' + xhr.status + ': ' + error);
         }
     });
}
taskForm.addEventListener("submit",(event)=>{
    event.preventDefault();
})
taskInput.addEventListener("keyup", (event) => {
    let userTask = taskInput.value.trim();
    if(event.key == "Enter" && userTask) {
        $.ajax({
            url: '/home/tasks/add-task',
            type: 'POST',
            data: $(taskForm).serialize(),
            success: function(response) {
               taskInput.value = "";
               tasksArrays[0][0] = response.updatedTasks;
                showTodo("for_me");
            },
            error: function(xhr, status, error) {
                console.error('Request failed with status ' + xhr.status + ': ' + error);
            }
        });
    }
});

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
            if(response.eventExist){
                document.querySelector('#availability_list').innerHTML = "";
                response.events.forEach((UserEvent)=>{
                    document.querySelector('#availability_list').innerHTML += `
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
            }else{
                document.querySelector('#availability_list').innerHTML = "";
                document.querySelector('#availability_list').innerHTML = `
                 <div class="flex items-center h-full">
                    <h1 class="capitalize flex ml-2 text-white text-[14px] text-center">Vous n'avez aucun événement prévu à ce jour!!</h1>
                </div>
                `
            }
          },
          error: function(error){
            console.log(error);
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

  try {
   

   
  } catch (error) {
    console.log(error.message);
  }

//   datepicker.onChange()
/* CALENDAR */
