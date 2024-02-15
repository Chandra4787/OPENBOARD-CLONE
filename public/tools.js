let optionsCont = document.querySelector(".options-cont");
let optionsFlag = true;
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilFlag = false;
let eraserFlag = false;
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
// let stickyCont = document.querySelector(".sticky-cont");
// let stickyFlag = false;

// true -->> means, showing the icon and false -->> means, hiding the icon
optionsCont.addEventListener("click", (e) => {
  optionsFlag = !optionsFlag;
  if (optionsFlag) {
    openTools();
  } else {
    closeTools();
  }
});

function openTools() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-times");
  iconElem.classList.add("fa-bars");
  toolsCont.style.display = "flex";
}
function closeTools() {
  let iconElem = optionsCont.children[0];
  iconElem.classList.remove("fa-bars");
  iconElem.classList.add("fa-times");
  toolsCont.style.display = "none";

  // pencilToolCont.style.display = "none";
  // eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
  // true -> show pencil tool, false -> hide pencil tool
  pencilFlag = !pencilFlag;

  if (pencilFlag) {
    pencilToolCont.style.display = "block";
  } else {
    pencilToolCont.style.display = "none";
  }
});

eraser.addEventListener("click", (e) => {
  // true -> show eraser tool, false -> hide eraser tool
  eraserFlag = !eraserFlag;

  if (eraserFlag) {
    eraserToolCont.style.display = "flex";
  } else {
    eraserToolCont.style.display = "none";
  }
});
// method 1 to access sticky notes
// sticky.addEventListener("click", (e) => {
//     stickyFlag = !stickyFlag;

//     if(stickyFlag) {
//         stickyCont.style.display = "block";
//     }
//     else {
//         stickyCont.style.display = "none";
//     }
// })

// code for uploading images from file explorer
upload.addEventListener("click", (e) => {
  // open file explorer
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);

    let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
         <img src="${url}"/>
    </div>
    `;

    createSticky(stickyTemplateHTML);
  });
});

// method 2 to access sticky notes
sticky.addEventListener("click", (e) => {
  let stickyTemplateHTML = `
    <div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
            <textarea spellcheck="false"></textarea>
    </div>
    `;
    createSticky(stickyTemplateHTML);
});

function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
    stickyCont.innerHTML = stickyTemplateHTML;

    document.body.appendChild(stickyCont);

    // code for minimize and maximize the sticky content and remove the note area from sticky content.
    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = true;

    noteActions(minimize, remove, stickyCont);

    // code for drag and drop sticky content --->> reference from javascript.info
    stickyCont.onmousedown = function (event) {
      dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
      return false;
    };
}

// function for noteAction for doing minimize and remove the text area from sticky note
function noteActions(minimize, remove, stickyCont) {
  remove.addEventListener("click", (e) => {
    stickyCont.remove();
  });

  // method 1 to minimize the note area in sticky content
  // minimize.addEventListener("click", (e) => {
  //     display = !display;
  //     if(display) {
  //         noteCont.style.display = "block";
  //     }
  //     else {
  //         noteCont.style.display = "none";
  //     }
  // })

  // method 2 to minimize the note area in sticky content
  // note :- here block means content is showing on screen and none means content is hide from the screen.
  minimize.addEventListener("click", (e) => {
    let noteCont = stickyCont.querySelector(".note-cont");
    let display = getComputedStyle(noteCont).getPropertyValue("display");
    if (display === "none") {
      noteCont.style.display = "block";
    } else {
      noteCont.style.display = "none";
    }
  });
}

// function for drag and drop the sticky content
function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;

  element.style.position = "absolute";
  element.style.zIndex = 1000;
  // document.body.append(element);

  moveAt(event.pageX, event.pageY);

  // moves the element at (pageX, pageY) coordinates
  // taking initial shifts into account
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }

  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }

  // move the element on mousemove
  document.addEventListener("mousemove", onMouseMove);

  // drop the element, remove unneeded handlers
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}
