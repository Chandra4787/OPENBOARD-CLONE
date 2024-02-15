let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;      
let mousedown = false;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

let undoredoTracker = []; // data
let track = 0; // Represent which action from tracker array

// canvas.getContext gives us canvas tool. it gives predefined tool in canvas which we access. its one type of api in which canvas gives predefined tool.
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> start new path, mousemove -> path fill (graphics fill)
canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    beginPath({
        x: e.clientX,
        y: e.clientY
    })
})
canvas.addEventListener("mousemove", (e) => {
    if(mousedown) {
        drawStroke({
            x: e.clientX, 
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        })
    }
})
canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();
    undoredoTracker.push(url);
    track = undoredoTracker.length - 1;
})

// undo means we have to back the steps 
undo.addEventListener("click", (e) => {
    if(track > 0) {
        track--;
    }
    // track action
    let trackObj = {
        trackValue: track,
        undoredoTracker
    }
    undoRedoCanvas(trackObj);
})

// redo means we have to forward the steps
redo.addEventListener("click", (e) => {
    if(track < undoredoTracker.length-1) {
        track++;
    }
    // track action
    let trackObj = {
        trackValue: track,
        undoredoTracker
    }
    undoRedoCanvas(trackObj);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoredoTracker = trackObj.undoredoTracker;

    let url = undoredoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    // tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click", (e) => {
    if(eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg"
    a.click();
})