
const canvas = document.querySelector('canvas');//get access of canvas element
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


//PENCIL TOOL AND ERASER
const pencilColors= document.querySelectorAll('.pencil-color');
const pencilWidthElem = document.querySelector('.pencil-width');
const eraserWidthElem = document.querySelector('.eraser-width');
const download = document.querySelector('.download');
const redo = document.querySelector('.redo');
const undo = document.querySelector('.undo');

let pencilColor = "red";
let eraserColor = "white";
let pencilWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;

//for undo-redo
let undoRedoTracker = [];  //data
let track=0; 



//get to from canvas
const tool = canvas.getContext('2d');
//default
tool.strokeStyle=pencilColor;
tool.lineWidth = pencilWidth;

const beginPath = function(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}

const drawStroke = function(strokeObj){
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;

    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();//to see graphics
}
 
let mouseDown = false;
canvas.addEventListener('mousedown',function(e){
    mouseDown = true;
    const drwObj = {
        x:e.clientX,
        y:e.clientY,
        color: eraserFlag ? eraserColor : pencilColor,
        width: eraserFlag ? eraserWidth : pencilWidth,
        eventT : 'mousedown'
    }
    beginPath(drwObj);
    undoRedoTracker.push(drwObj);
    track = undoRedoTracker.length-1;
});

canvas.addEventListener('mousemove',function(e){
    if(mouseDown){

        const drwObj = {
            x:e.clientX,
            y:e.clientY,
            color: eraserFlag ? eraserColor : pencilColor,
            width: eraserFlag ? eraserWidth : pencilWidth,
            eventT : 'mousemove'
        }
        drawStroke(drwObj);   
        undoRedoTracker.push(drwObj);
        track = undoRedoTracker.length-1; 
    }
});

canvas.addEventListener('mouseup',function(e){
    mouseDown = false; //make it false

    const drwObj = {
        x:e.clientX,
        y:e.clientY,
        color: eraserFlag ? eraserColor : pencilColor,
        width: eraserFlag ? eraserWidth : pencilWidth,
        eventT : 'mouseup'
    }
    undoRedoTracker.push(drwObj);
    track = undoRedoTracker.length-1;
});



//Listeners for colorElm/ pencil color
pencilColors.forEach(function(colorElm){
    colorElm.addEventListener('click',function(e){
          let color = colorElm.classList[0];
          pencilColor = color;
          tool.strokeStyle = pencilColor;
    });
});

//pencil width / event listener of change 
pencilWidthElem.addEventListener('change',function(e){
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
});

//Eraser width /event listener of width
eraserWidthElem.addEventListener('change',function(e){
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth; //change linewidth to eraser width value.
});

//eraser access from tools.js file./event listener on eraser elem.
eraser.addEventListener('click',function(e){
    //  eraserFlag managed in tools.js file
    if(eraserFlag){
        tool.strokeStyle = eraserColor;//eraser color is white it hides the other color.
        tool.lineWidth = eraserWidth;
    }else{
        // if i make eraser flag inactive
        // then get back pencil properties
        // on eraser inactive get back properties of pen
        tool.strokeStyle = pencilColor;
        tool.lineWidth = pencilWidth;
    }
});


//download
download.addEventListener('click',function(e){
    // READ ON MDN
    let url = canvas.toDataURL();
    let a = document.createElement('a');
    a.href = url;
    a.download = 'board.jpg';
    a.click();
});

const undoRedoactions = function(trackObj){
    // re-intialize
    track = trackObj.trackVal;
    undoRedoTracker = trackObj.undoRedoTracker;

    tool.clearRect(0, 0, canvas.width, canvas.height);
    for(let i=0;i<=track && i<undoRedoTracker.length;i++){
        let { x, y, eventT, color, width } = undoRedoTracker[i];
        tool.strokeStyle = color;
        tool.lineWidth = width;

        if (eventT ==="mousedown") {
          tool.beginPath();
          tool.moveTo(x, y);
        }else if(eventT==="mousemove"){
            tool.lineTo(x,y);
            tool.stroke();
        }
    }
    
}

//redo
redo.addEventListener('click',function(e){
    //action
    if(track<undoRedoTracker.length-1){
        for(let i=track;i<undoRedoTracker.length;i++){
            let { x, y, eventT, color, width } = undoRedoTracker[i];
            if(eventT==='mouseup'){
                track = i===undoRedoTracker.length-1 ? i :i+1;
                break;
            }
        }
    }

    const trackObj = {
        trackVal:track,
        undoRedoTracker:undoRedoTracker
    };
    undoRedoactions(trackObj);
});

//undo
undo.addEventListener('click',function(e){
    //action
    if(track>0){

        for(let i=track;i>=0;i--){
            let { x, y, eventT, color, width } = undoRedoTracker[i];
            if(eventT==='mousedown'){
                track = i===0 ? 0 : i-1;
                break;
            }
        }
    }
    const trackObj = {
        trackVal:track,
        undoRedoTracker:undoRedoTracker
    };
    undoRedoactions(trackObj);
});
