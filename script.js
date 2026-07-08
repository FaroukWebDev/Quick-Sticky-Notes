/* functions for repeting codes */
function FreeTheInput(input) {
    input.value = '';
}

function display_HideElements(El, state) {
    El.style.display = state;
}

function PointerEventEl(El, state) {
    El.style.pointerEvents = state;
}

function Opacity_Config(El, val) {
    val >= 0 && val <= 1 ? El.style.opacity = val : console.log("Error ! 'val' should be between 1 and 0");
}

function ConfirmationMessage(Ele,text){
    Ele.innerText = text;
    Ele.style.opacity = 1;
    setTimeout(()=>{Ele.style.opacity = 0},600);
}
/* Confirmation Elements */

const SaveConfirmation = document.getElementById("confirm-message");
const DeleteConfirmation = document.getElementById("delete-confirm-message");
const EditConfirmation = document.getElementById("edit-confirm-message");
const ResetConfirmation = document.getElementById("reset-confirm-message");

/* principle part for the page */

// Save the writen note on input 
const Note_inputEl = document.getElementById("Notes-input"),
    Save_noteBtn = document.getElementById("Save-btn");

let Notes = JSON.parse(localStorage.getItem("my Notes")) || [];

function AddNoteToArray(array, data) {
    array.push(data);
}

function saveNote(array, note) {
    if (note !== '' && note !== '\n')
        AddNoteToArray(array, note);
    localStorage.setItem("my Notes", JSON.stringify(array));
}

function deleteAllSavingNotes(array){
    array.splice(0,array.length);
    localStorage.clear("my Notes");
}

Save_noteBtn.addEventListener("click", () => {
    if (Note_inputEl.value != '' && Note_inputEl.value != '\n') {
        saveNote(Notes, Note_inputEl.value);
        RenderNotes(Notes, NotesDisplay_El);
        // Note_inputEl.value = '';
        FreeTheInput(Note_inputEl);
        // display the confimation message for saving data
        ConfirmationMessage(SaveConfirmation, "Saved successfully");
    } else{
        ConfirmationMessage(SaveConfirmation, "failed!,empty input!");
    }
});

// Render Notes in <li> elements inside the parent element <ul>
function RenderNotes(array, parentEl) {
    console.log(array);
    let GenHtml = '';
    if(array.length != 0){
        for (let i = 0; i < array.length; i++) {
            const noteElement = `<li id="Notes" data-index="${i}">${array[i]}</li>`;
            GenHtml += noteElement;
        }
    }
    // if (GenHtml != '')
    //     parentEl.innerHTML = GenHtml;

    GenHtml != '' ? parentEl.innerHTML = GenHtml : NotesDisplay_El.textContent = "No notes , please write one...!";
}

const Display_El = document.getElementById("display");
const NotesDisplay_El = document.getElementById("Notes-display");

// Render the saved Notes when the page open
RenderNotes(Notes, NotesDisplay_El);

// Button to display the saved Notes
const ReviewBtn = document.getElementById("review-btn");

ReviewBtn.addEventListener("click", () => {
    display_HideElements(Display_El, "grid");
    // if (NotesDisplay_El.textContent == '') {
    //     NotesDisplay_El.textContent = "No notes , please write one...!";
    // }
})

// Button to close the window of Notes
const Exit_NotesBtn = document.getElementById("Exit-Notes-btn");

Exit_NotesBtn.addEventListener("click", () => {
    display_HideElements(Display_El, "none");
})

const ResetStorageBtn = document.getElementById("Reset-Notes-btn");

ResetStorageBtn.addEventListener("click",()=>{
    deleteAllSavingNotes(Notes);
    RenderNotes(Notes,NotesDisplay_El);
    ConfirmationMessage(ResetConfirmation,"Reset successfully");
})


// NotesEls.forEach(Note =>{
//     Note.addEventListener("click", nt=>{
// const note = nt.target.closest("#Notes");
// if(note){
//     const AllNotes = Array.from(NotesEls);
//     const index = AllNotes.indexOf(note);
//     console.log(index);
//     if(index !== -1){
//         Notes.splice(index,1);
//         saveNote(Notes,'');
//         RenderNotes(Notes,NotesDisplay_El);
//     }
// }
//     })
// })

let clickedNote = null;

// const NotesEls = document.querySelectorAll("#Notes");
function deleteNote(ntEl, ParentOfNotes, array) {
    // const note = ntEl.target.closest("#Notes");
    // console.log(note.dataset.index);
    if (ntEl) {
        const index = Number(ntEl.dataset.index);
        console.log(index);
        if (index !== -1) {
            array.splice(index, 1);
            saveNote(array, '');
            RenderNotes(array, ParentOfNotes);
        }
    }
}

const NoteSettingPopupEl = document.getElementById("Notes-settings-popup"),
    BgBlurNoteSetting = document.getElementById("blur-BackPopup");


NotesDisplay_El.addEventListener("click", nt => {
    // deleteNote(nt,NotesDisplay_El,Notes);
    const note = nt.target.closest("#Notes");
    if (note) {
        display_HideElements(NoteSettingPopupEl, "flex");
        Opacity_Config(BgBlurNoteSetting, 1);
        PointerEventEl(BgBlurNoteSetting, "all");
        clickedNote = note;
    }
})

const ExitBtn_NotesSettingsPopupEl = document.getElementById("exit-Notes-settings"),
    DeleteBtn_NotesSettingsPopupEl = document.getElementById("delete-Notes-settings"),
    EditBtn_NotesSettingsPopupEl = document.getElementById("edit-Notes-settings");

/** this hide the displayed popup of Notes when click the Exit btn inside it */
ExitBtn_NotesSettingsPopupEl.addEventListener("click", () => {
    display_HideElements(NoteSettingPopupEl, "none");
    Opacity_Config(BgBlurNoteSetting, 0);
    PointerEventEl(BgBlurNoteSetting, "none");
});

/** this delete the selected note and hide the popup when click the delete btn */
DeleteBtn_NotesSettingsPopupEl.addEventListener("click", () => {
    display_HideElements(NoteSettingPopupEl, "none");
    Opacity_Config(BgBlurNoteSetting, 0);
    PointerEventEl(BgBlurNoteSetting, "none");
    // delete Notes's function
    deleteNote(clickedNote, NotesDisplay_El, Notes);
    // message to confirm the removing/delete
    ConfirmationMessage(DeleteConfirmation,"Deleted successfully");
});

const editNote_popup = document.getElementById("edit-part-note");
const editNote_input = document.getElementById("Note-edit-input");

EditBtn_NotesSettingsPopupEl.addEventListener("click", () => {
    display_HideElements(editNote_popup, "grid");
    // hide the Note setting Popup
    display_HideElements(NoteSettingPopupEl, "none");
    Opacity_Config(BgBlurNoteSetting, 0);
    PointerEventEl(BgBlurNoteSetting, "none");
    editNote_input.value = clickedNote.innerText;
});

function changeSavedNote(array, note, input) {
    array[note.dataset.index] = input.value;
}


// the check btn in the edit note's popup
const check_SaveChange_Btn = document.getElementById("complete-SaveChange-btn");

check_SaveChange_Btn.addEventListener("click", () => {
    display_HideElements(editNote_popup, "none");
    changeSavedNote(Notes, clickedNote, editNote_input);
    saveNote(Notes,'');
    RenderNotes(Notes, NotesDisplay_El);
    // to confirm the success of edit note
    ConfirmationMessage(EditConfirmation,"Updated successfully");
})

// the minimize btn in the edit note's popup
const minimize_btn = document.getElementById("minimize-edit-input-btn");

minimize_btn.addEventListener("click", () => {
    display_HideElements(editNote_popup, "none");
    FreeTheInput(editNote_input);
})
