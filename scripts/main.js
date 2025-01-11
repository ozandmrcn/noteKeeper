// Months Array
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Variables from HTML
const addBox = document.querySelector(".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector("header i");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header p");
const submitBtn = document.querySelector("#submit-btn");

// Localstoreage
let notes = JSON.parse(localStorage.getItem("notes")) || [];

let isUpdate = false;
let updateId = null;

// Event Listeners
// When addBox is clicked, show the popup
addBox.addEventListener("click", () => {
  isUpdate = false; // Reset update state
  updateId = null; // Reset update ID
  form[0].value = ""; // Clear title input
  form[1].value = ""; // Clear description input
  popupTitle.textContent = "Add a new note";
  submitBtn.textContent = "Add Note";
  popupBoxContainer.classList.add("show");
  popupBox.classList.add("show");
  document.querySelector("body").style.overflow = "hidden";
});

// When close button is clicked, close the popup
closeBtn.addEventListener("click", () => {
  popupBoxContainer.classList.remove("show");
  popupBox.classList.remove("show");
  document.querySelector("body").style.overflow = "auto";
});

// Function to show the menu
function showMenu(elem) {
  elem.parentElement.classList.add("show");
  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != elem) {
      elem.parentElement.classList.remove("show");
    }
  });
}

// Add an event listener to the wrapper to show the menu when click on the three dots
wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  } else if (e.target.classList.contains("deleteIcon")) {
    const res = confirm("Do you really want to DELETE this note?");
    if (res) {
      const note = e.target.closest(".note");
      const noteId = parseInt(note.dataset.id);
      notes = notes.filter((note) => note.id !== noteId);
      localStorage.setItem("notes", JSON.stringify(notes));
      renderNotes();
    }
  } else if (e.target.classList.contains("updateIcon")) {
    const note = e.target.closest(".note");
    const noteId = parseInt(note.dataset.id);
    const foundedNote = notes.find((note) => note.id === noteId);

    form[0].value = foundedNote.titleInput;
    form[1].value = foundedNote.descriptionInput;

    isUpdate = true;
    updateId = noteId;

    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");
    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";
  }
});

// When form is submitted, add the note to the list
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let titleInput = e.target[0].value.trim();
  let descriptionInput = e.target[1].value.trim();

  if (!titleInput && !descriptionInput) {
    alert("Please fill required sections!");
  } else {
    const date = new Date();
    let day = date.getDate();
    let year = date.getFullYear();
    let month = months[date.getMonth()];
    let id = new Date().getTime();

    if (isUpdate) {
      const noteIndex = notes.findIndex((note) => note.id == updateId);
      notes[noteIndex] = {
        ...notes[noteIndex],
        titleInput,
        descriptionInput,
      };

      isUpdate = false;
      updateId = null;
      popupTitle.textContent = "Add a new note";
      submitBtn.textContent = "Add Note";
    } else {
      notes.push({
        id,
        titleInput,
        descriptionInput,
        date: `${month} ${day}, ${year}`,
      });
    }

    if (!descriptionInput) {
      descriptionInput = "No comment";
    }

    localStorage.setItem("notes", JSON.stringify(notes));

    form[0].value = ""; // Clear title input
    form[1].value = ""; // Clear description input

    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";

    renderNotes();
  }
});

// Function to render the notes
function renderNotes() {
  if (!notes) return;
  else {
    document.querySelectorAll(".note").forEach((li) => li.remove());
    notes.forEach((note) => {
      let liTag = `<li class="note" data-id="${note.id}">
        <div class="details">
          <p class="title">${note.titleInput}</p>
          <p class="description">${note.descriptionInput}</p>
        </div>
        <div class="bottom-content">
          <span>${note.date}</span>
          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>
            <ul class="menu">
              <li class="updateIcon"><i class="bx bx-edit"></i> Edit</li>
              <li class="deleteIcon"><i class="bx bx-trash"></i> Delete</li>
            </ul>
          </div>
        </div>
      </li>`;
      addBox.insertAdjacentHTML("afterend", liTag);
    });
  }
}

// When the page is loaded, render the notes
document.addEventListener("DOMContentLoaded", () => renderNotes());
