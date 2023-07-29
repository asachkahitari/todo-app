const task = document.getElementById("title");
const category = document.getElementById("category");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const deleteTask = document.getElementById("deleteTask");
const startDate = document.getElementById("startDate");
const endDate = document.getElementById("endDate");
const logsArray = [];
let tasks = [];
const doneTasks = [];
let editId;
const categorySortTasks = [], prioritySortTasks = [];

// add task
function addTodo(){
    let newTask;
    if(task.value === '' || category.value === '' || dueDate.value === "" || priority.value === ""){
        alert("Enter valid task value!");
    }
    else{
        const subtaskInputs = document.querySelectorAll(".subtask-input");
        const subtasks = [];
        subtaskInputs.forEach(input => {
            if (input.value.trim() !== "") {
                subtasks.push(input.value.trim());
                input.value = ""; // Clear the input field after adding subtask
            }
        });
        const tagsInput = document.querySelectorAll(".tag-input");
        const tags = [];
        tagsInput.forEach(input => {
            if (input.value.trim() !== "") {
                tags.push(input.value.trim());
                input.value = ""; // Clear the input field after adding tag
            }
        });
        newTask = {
            title : task.value,
            category : category.value,
            dueDate : dueDate.value,
            priority : priority.value,
            subtasks : subtasks,
            tags : tags
        }
        tasks.push(newTask)

        keepLog(newTask, "Task added");
        // console.log(logsArray);
    }
    task.value = "";
    category.value = "";
    dueDate.value = "";
    priority.value = "Low";
    // categorySort(newTask);
    // prioritySort(newTask);
    if(tasks.length != 0) {
        showTasks();
    }
    else{
        showDefault();
    }
    saveData();
    // showData();
}

// function fetchTodo(){
//     fetch('https://jsonplaceholder.typicode.com/todos')
//       .then(response => response.json())
//       .then(function(response){
//         for(let i = 0; i < 10; i++){
//             let newTask = {
//                 // userId :response.userId,
//                 title : response[i].title,

//             }
//             tasks.push(newTask);
//         }
//         // console.log(response);
//         // saveData();
//         // showTasks();
//       })
// }

function showTasks(){
    // showData();
    var taskList = document.getElementById("todo-list");
    // console.log(tasks);
    taskList.innerHTML = "";
    for(let i = 0; i < tasks.length; i++){

        let newdiv = document.createElement("div");
        newdiv.classList.add('todo-div')
        newdiv.classList.add("priority-" + tasks[i].priority);
        newdiv.draggable = true;
        newdiv.addEventListener("dragstart", () => {
            newdiv.classList.add("is-dragging");
            // console.log(newdiv);
        });
        newdiv.addEventListener("dragend", () => {
            newdiv.classList.remove("is-dragging");
        });
        taskList.appendChild(newdiv);

        let row1 = document.createElement("div");
        row1.classList.add("row1");
        newdiv.appendChild(row1);

        let newtaskcheckbox = document.createElement('input');
        newtaskcheckbox.type = 'checkbox';
        newtaskcheckbox.classList.add('task-checkbox');
        newtaskcheckbox.setAttribute("id",i);
        newtaskcheckbox.checked = false;
        newtaskcheckbox.addEventListener('click',removeTask);
        row1.appendChild(newtaskcheckbox);

        let newtask = document.createElement("p");
        newtask.setAttribute("class", "todo-item");
        newtask.setAttribute("id", i);
        newtask.innerHTML = tasks[i].title;
        newtask.addEventListener('click', removeTask);
        row1.appendChild(newtask);

        let dueDate = document.createElement("p");
        dueDate.setAttribute("class", "todo-due-date");
        dueDate.innerHTML = tasks[i].dueDate;
        // dueDate.addEventListener('click', editDueDate);
        row1.appendChild(dueDate);

        let editIcon = document.createElement("button");
        editIcon.innerHTML = "Edit";
        editIcon.setAttribute("id", i);
        editIcon.setAttribute("class", "editbtn");
        editIcon.addEventListener('click', editTodo);
        row1.appendChild(editIcon);

        let deleteIcon = document.createElement("button");
        deleteIcon.innerHTML = "Delete";
        deleteIcon.setAttribute("id", i);
        deleteIcon.setAttribute("class", "deletebtn");
        deleteIcon.addEventListener('click', deleteTodo);
        row1.appendChild(deleteIcon);

        // Display tag under each main task
        if (tasks[i].tags.length > 0) {
            let tagList = document.createElement("ul");
            tagList.setAttribute("class", "tag-list");
            for (let j = 0; j < tasks[i].tags.length; j++) {
                let tagItem = document.createElement("li");
                tagItem.innerHTML = tasks[i].tags[j];
                tagList.appendChild(tagItem);
            }
            newdiv.appendChild(tagList);
        }
        // Display subtasks under each main task
        if (tasks[i].subtasks.length > 0) {
            let subtaskList = document.createElement("ul");
            subtaskList.setAttribute("class", "subtask-list");
            for (let j = 0; j < tasks[i].subtasks.length; j++) {
                let subtaskItem = document.createElement("li");
                subtaskItem.setAttribute("class", "subTask");
                subtaskItem.addEventListener('click', doneSubtask);
                subtaskItem.innerHTML = tasks[i].subtasks[j];
                subtaskList.appendChild(subtaskItem);
            }
            newdiv.appendChild(subtaskList);
        }
        // newtask.appendChild(newdiv);
        // console.log(newdiv);
    }
    console.log(taskList);
}

function showDoneTasks(){
    var doneTaskList = document.getElementById("done-list");
    doneTaskList.innerHTML = "";
    for(let i = 0; i < doneTasks.length; i++){
        let newdiv = document.createElement("div");
        newdiv.classList.add('todo-div')
        newdiv.draggable = true;
        doneTaskList.appendChild(newdiv);

        let newtaskcheckbox = document.createElement('input');
        newtaskcheckbox.type = 'checkbox';
        newtaskcheckbox.classList.add('task-checkbox');
        newtaskcheckbox.setAttribute("id",i);
        newtaskcheckbox.checked = true;
        newtaskcheckbox.addEventListener('click',undoTask);
        newdiv.appendChild(newtaskcheckbox);

        let newtask = document.createElement("p");
        newtask.setAttribute("class", "done-item");
        newtask.setAttribute("id", i);
        newtask.innerHTML = doneTasks[i].title;
        newtask.addEventListener('click', undoTask);
        newdiv.appendChild(newtask);
    }
    if(doneTasks.length == 0){
        doneTaskList.innerHTML = `<p>No tasks here!</p>`
    }
}

// Function to add new subtask input field dynamically
function addSubtaskInput() {
    const subtaskContainer = document.getElementById("subtask-container");
    const newSubtaskInput = document.createElement("input");
    newSubtaskInput.setAttribute("type", "text");
    newSubtaskInput.setAttribute("class", "subtask-input");
    newSubtaskInput.setAttribute("placeholder", "Add Subtask");
    subtaskContainer.appendChild(newSubtaskInput);
}

// Function to add new tag input field dynamically
function addTagInput() {
    const tagContainer = document.getElementById("tag-container");
    const newTagInput = document.createElement("input");
    newTagInput.setAttribute("type", "text");
    newTagInput.setAttribute("class", "tag-input");
    newTagInput.setAttribute("placeholder", "Add Tag");
    tagContainer.appendChild(newTagInput);
}

// mark as done and undone
const removeTask = e => {
    if(e.target.classList.contains("task-checkbox") || e.target.classList.contains("todo-item")){
        // console.log(tasks);
        // let task = {
        //     title : tasks[e.target.id].title,
        // }
        doneTasks.push(tasks[e.target.id]);
        // console.log(doneTasks);
        showDoneTasks();
        keepLog(tasks[e.target.id], "Task done");
        tasks.splice(e.target.id, 1);
        showTasks();
    }
    saveData();
    showTasks();
    showDoneTasks();
}

const undoTask = e => {
    if(e.target.classList.contains("task-checkbox") || e.target.classList.contains("done-item")){
        // console.log(doneTasks);
        // let task = {
        //     title : doneTasks[e.target.id].title,
        // }
        tasks.push(doneTasks[e.target.id]);
        showTasks();
        keepLog(doneTasks[e.target.id], "Task Undone");
        doneTasks.splice(e.target.id, 1);
        showDoneTasks();
        
    }
    saveData();
    showTasks();
    showDoneTasks();
}

// delete todo
const deleteTodo = e => {
    keepLog(tasks[e.target.id], "Task Deleted");
    tasks.splice(e.target.id, 1);
    saveData();
    if(tasks.length != 0) {
        showTasks();
    }
    else{
        showDefault();
    }
} 

// done subtask
const doneSubtask = e => {
    e.target.classList.toggle("subTask-checked");
}

// edit todo
const editTodo = e => {
    document.getElementById('edit-modal').style.display = 'block';
    editId = e.target.id;
    keepLog(tasks[e.target.id], "Task edited");
} 
document.querySelector('#close-modal').addEventListener('click', function(e) {
    let editedTask = document.getElementById("editedTask");
    let editedDueDate = document.getElementById("editedDueDate");
    let editedCategory = document.getElementById("editedCategory");
    let editedPriority = document.getElementById("editedPriority");
    // console.log(editedTask.value);
    for(let i = 0; i < tasks.length; i++){
        // console.log(e.target.id);
        if(i == editId){
            // console.log(editedTask.value);
            if(editedTask.value != "") tasks[i].title = editedTask.value;
            if(editedDueDate.value != "") tasks[i].dueDate = editedDueDate.value;
            if(editedPriority.value != "") tasks[i].priority = editedPriority.value;
            if(editedCategory.value != "") tasks[i].category = editedCategory.value;
        }
    }
    editedTask.value = "";
    editedDueDate.value = "";
    editedPriority.value = "Low";
    editedCategory.value = "";
    document.getElementById('edit-modal').style.display = 'none';
    saveData();
    showTasks();
});  

// searching tasks to delete them
function findTaskToDelete(){
    // console.log("I am here!");
    for(let i = 0; i < tasks.length; i++){
        // console.log(tasks[i].title);
        // console.log(deleteTask.value);
        if(tasks[i].title === deleteTask.value){
            // console.log("I am here too!");
            // console.log(tasks[i].id);
            keepLog(tasks[i], "Task deleted");
            tasks.splice(i, 1);
            showTasks();
        }
    }
    saveData();
    deleteTask.value = "";
}

// category sort
function filterByCategory(){
    // console.log(tasks);
    for(todo of tasks){
        // console.log(todo);
        if(!categorySortTasks[todo.category]){
            categorySortTasks[todo.category] = [todo];
        }
        else categorySortTasks[todo.category].push(todo);
    }
    console.log(categorySortTasks);
    const outputDiv = document.querySelector(".output-div");
    outputDiv.innerHTML = "";

    // for(item in categorySortTasks){
    //     console.log(item);
    //     // console.log(categorySortTasks[item]);
    //     for(itemm in categorySortTasks[item]){
    //         console.log(categorySortTasks[item][itemm]);
    //     }
    //     // for(itemm in item){
    //     //     let categoryDiv = document.createElement("div");
    //     //     outputDiv.appendChild(categoryDiv);
    //     //     let title = document.createElement("p");
    //     //     title.innerHTML = itemm[0];
    //     //     categoryDiv.appendChild(title);
    //     //     let category = document.createElement("p");
    //     //     category.innerHTML = itemm[1];
    //     //     categoryDiv.appendChild(category);
    //     //     // console.log(categoryDiv);
    //     // }
    // }
    for (const category in categorySortTasks) {
        if (categorySortTasks.hasOwnProperty(category)) {
            const categoryDiv = document.createElement("div");
            categoryDiv.innerHTML = `<h4>${category}</h4>`;
            outputDiv.appendChild(categoryDiv);

            if (categorySortTasks[category].length === 0) {
                const noTasksMessage = document.createElement("p");
                noTasksMessage.textContent = "No tasks in this category.";
                categoryDiv.appendChild(noTasksMessage);
            } else {
                categorySortTasks[category].forEach(task => {
                    const taskDiv = createTaskDiv(task);
                    categoryDiv.appendChild(taskDiv);
                });
            }
        }
    }

}

// priority sort
function filterByPriority(){
    for(todo of tasks){
        if(!prioritySortTasks[todo.priority]){
            prioritySortTasks[todo.priority] = [todo];
        }
        else prioritySortTasks[todo.priority].push(todo);
    }
    console.log(prioritySortTasks);
    const outputDiv = document.querySelector(".output-div");
    outputDiv.innerHTML = "";
    for (const priority in prioritySortTasks) {
        if (prioritySortTasks.hasOwnProperty(priority)) {
            const priorityDiv = document.createElement("div");
            priorityDiv.innerHTML = `<h4>${priority}</h4>`;
            outputDiv.appendChild(priorityDiv);

            if (prioritySortTasks[priority].length === 0) {
                const noTasksMessage = document.createElement("p");
                noTasksMessage.textContent = "No tasks in this priority.";
                priorityDiv.appendChild(noTasksMessage);
            } else {
                prioritySortTasks[priority].forEach(task => {
                    const taskDiv = createTaskDiv(task);
                    priorityDiv.appendChild(taskDiv);
                });
            }
        }
    }
}

// due date sort
function filterByDueDate(){
    const filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        const startFilterDate = new Date(startDate.value);
        const endFilterDate = new Date(endDate.value);
        return (taskDate >= startFilterDate && taskDate <= endFilterDate);
    });
    console.log(filteredTasks);
    const outputDiv = document.querySelector(".output-div");
    outputDiv.innerHTML = "";
    if (filteredTasks.length === 0) {
        const noTasksMessage = document.createElement("p");
        noTasksMessage.textContent = "No tasks in this due date range.";
        outputDiv.appendChild(noTasksMessage);
    } else {
        filteredTasks.forEach(task => {
            const taskDiv = createTaskDiv(task);
            outputDiv.appendChild(taskDiv);
        });
    }
}

// sort tasks by due date
function sortTasksByDueDate() {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    showTasks();
}

// sort tasks by priority
function sortTasksByPriority() {
    tasks.sort((a, b) => {
        const priorityOrder = { "Low": 1, "Medium": 2, "High": 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    showTasks();
}


// activity log

function keepLog(task, taskType){
    // keep a log of task
    let log = {
        logType : taskType,
        logEvent : task,
        time : new Date(),

    }
    logsArray.push(log);
}
function activityLog(){
    console.log(logsArray)
    const outputDiv = document.querySelector(".output-div");
    outputDiv.innerHTML = "";
    if (logsArray.length === 0) {
        const noTasksMessage = document.createElement("p");
        noTasksMessage.textContent = "No activites done.";
        outputDiv.appendChild(noTasksMessage);
    } else {
        logsArray.forEach(task => {
            const taskDiv = createActivityDiv(task);
            outputDiv.appendChild(taskDiv);
        });
    }
} 
function createActivityDiv(task) {
    const taskDiv = document.createElement("div");
    taskDiv.innerHTML = `<span><p><strong>${task.logType}</strong></p> <p><strong>${task.logEvent.title}</strong></p> <p><strong>${task.time}</strong></p></span>`;
    return taskDiv;
}

// backlog and missed tasks

// Function to view backlogs (pending and missed tasks)
function viewBacklogs() {
    const currentDate = new Date();

    const pendingTasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return !task.completed && dueDate > currentDate;
    });

    const missedTasks = tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return !task.completed && dueDate <= currentDate;
    });

    const backlogTasks = {
        pending: pendingTasks,
        missed: missedTasks
    };

    displayBacklogs(backlogTasks);
}

// Function to display backlogs
function displayBacklogs(backlogTasks) {
    const outputDiv = document.querySelector(".output-div");
    outputDiv.innerHTML = "";

    const pendingDiv = document.createElement("div");
    pendingDiv.innerHTML = "<h4>Pending Tasks</h4>";
    outputDiv.appendChild(pendingDiv);
    if (backlogTasks.pending.length === 0) {
        const noPendingTasks = document.createElement("p");
        noPendingTasks.innerHTML = "No pending tasks.";
        pendingDiv.appendChild(noPendingTasks);
    } else {
        backlogTasks.pending.forEach(task => {
            const taskDiv = createTaskDiv(task);
            pendingDiv.appendChild(taskDiv);
        });
    }

    const missedDiv = document.createElement("div");
    missedDiv.innerHTML = "<h4>Missed Tasks</h4>";
    outputDiv.appendChild(missedDiv);
    if (backlogTasks.missed.length === 0) {
        const noMissedTasks = document.createElement("p");
        noMissedTasks.innerHTML = "No missed tasks.";
        missedDiv.appendChild(noMissedTasks);
    } else {
        backlogTasks.missed.forEach(task => {
            const taskDiv = createTaskDiv(task);
            missedDiv.appendChild(taskDiv);
        });
    }
}


// SAERCH TODOS
// Function to search for exact todo by name
function exactTodoSearch() {
    const searchInput = document.getElementById("searchInput").value;
    const exactMatch = tasks.filter(task => task.title.toLowerCase() === searchInput.toLowerCase());
    displaySearchResults(exactMatch);
}

// Function to search for tasks by subtasks
function subtaskSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const subtaskMatches = tasks.filter(task => {
        return task.subtasks.some(subtask => subtask.toLowerCase().includes(searchInput));
    });
    displaySearchResults(subtaskMatches);
}

// Function to search for tasks with similar words
function similarWordsSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const similarWordsMatches = tasks.filter(task => task.title.toLowerCase().includes(searchInput));
    displaySearchResults(similarWordsMatches);
}

// Function to search for tasks using partial keywords
function partialSearch() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const partialMatches = tasks.filter(task => {
        return task.title.toLowerCase().includes(searchInput) || task.subtasks.some(subtask => subtask.toLowerCase().includes(searchInput));
    });
    displaySearchResults(partialMatches);
}

// Function to search for tasks by tags
function tagSearch() {
    const searchInput = document.getElementById("searchInput").value;
    const tagMatches = tasks.filter(task => {
        return task.tags.some(tag => tag.toLowerCase() === searchInput.toLowerCase());
    });
    displaySearchResults(tagMatches);
}

// Function to display search results
function displaySearchResults(searchResults) {
    const outputDiv = document.querySelector(".output-div");
    outputDiv.innerHTML = "";

    if (searchResults.length === 0) {
        const noResultsMessage = document.createElement("p");
        noResultsMessage.textContent = "No matching tasks found.";
        outputDiv.appendChild(noResultsMessage);
    } else {
        searchResults.forEach(task => {
            const taskDiv = createTaskDiv(task);
            outputDiv.appendChild(taskDiv);
        });
    }
}

// Function to create task div for display
function createTaskDiv(task) {
    const taskDiv = document.createElement("div");
    taskDiv.innerHTML = `<p><strong>${task.title}</strong></p>`;
    return taskDiv;
}

// local storage
function saveData(){
    let data = JSON.stringify(tasks);
    // console.log(data);
    localStorage.setItem("data", data);
}
function showData(){
    let string = localStorage.getItem("data");
    // console.log(string);
    tasks = JSON.parse(string);
    // console.log(tasks);
    showTasks();
}

const draggables = document.querySelectorAll(".todo-div");
const droppables = document.querySelectorAll(".sections");

draggables.forEach((task) => {
  task.addEventListener("dragstart", () => {
    task.classList.add("is-dragging");
    console.log(task);
  });
  task.addEventListener("dragend", () => {
    task.classList.remove("is-dragging");
  });
});

droppables.forEach((zone) => {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const curTask = document.querySelector(".is-dragging");
    // console.log(curTask);
    if (!bottomTask) {
      zone.appendChild(curTask);
    } else {
      zone.insertBefore(curTask, bottomTask);
    }
  });
});

const insertAboveTask = (zone, mouseY) => {
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();

    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
};