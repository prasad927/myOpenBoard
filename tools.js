'use strict';

const optionsCont = document.querySelector('.options-cont');
const toolsCont = document.querySelector('.tools-cont');
let optionsFlag = true;
//true==>open

const pencilToolCont = document.querySelector('.pencil-tool-cont');
const eraserToolCont = document.querySelector('.eraser-tool-cont');
const pencil = document.querySelector('.pencil');
const eraser = document.querySelector('.eraser');
let pencilFlag = false;
let eraserFlag = false;

//sticky-notes
const stickyNotes = document.querySelector('.sticky-notes');


//upload
const upload = document.querySelector('.upload');

optionsCont.addEventListener('click',function(e){
    optionsFlag = !optionsFlag;
    console.log('clicked');
    if(optionsFlag){
        openTools();
    }else{
        closeTools();
    }
});

const openTools = function(){
    let iconElm = optionsCont.children[0];
    iconElm.classList.remove('fa-times'); //remove cross
    iconElm.classList.add('fa-bars');
    toolsCont.style.display = 'flex';

}

const closeTools = function(){
    let iconElm = optionsCont.children[0];
    iconElm.classList.remove('fa-bars');
    iconElm.classList.add('fa-times');
    toolsCont.style.display = 'none';

    // close them only when we close tools
    pencilToolCont.style.display = 'none';
    eraserToolCont.style.display = 'none';
}


pencil.addEventListener('click',function(e){
    //true-->show pencil tool  false--->hide pencil tool
    pencilFlag = !pencilFlag;//toggle

    if(pencilFlag){
        pencilToolCont.style.display = 'block';
    }else{
        pencilToolCont.style.display = 'none';
    }
});


eraser.addEventListener('click',function(e){
    //true-->show eraser tool  false--->hide eraser tool

    eraserFlag = !eraserFlag;//toggle

    if(eraserFlag ){
        eraserToolCont.style.display = 'flex';
    }else{
        eraserToolCont.style.display = 'none';
    }
});


//sticky notes
stickyNotes.addEventListener('click',function(e){
    // create and append
    const stickyCont = document.createElement('div');
    stickyCont.setAttribute('class','sticky-cont');

    stickyCont.innerHTML =`<div class="header-cont">
                               <div class="minimize"></div>
                               <div class="remove"></div>
                           </div>
                           <div class="note-cont">
                               <textarea spellcheck="false"></textarea>
                           </div>`;

    document.body.appendChild(stickyCont);


    // DRAG AND DROP FUNCTIONALITY
    stickyCont.onmousedown = function(event) {
        console.log("ON MOUSE DOWN CALL DRAG AND DROP");
        dragAndDrop(stickyCont,event);
    }
      
    stickyCont.ondragstart = function() {
        return false;
    };


    //notes-actions

    const minimize = document.querySelector('.minimize');
    const remove  = document.querySelector('.remove');

    notesActions(minimize,remove,stickyCont);
});

const dragAndDrop = function(element,event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;
  
    element.style.position = 'absolute';
    element.style.zIndex = 1000;

  
    moveAt(event.pageX, event.pageY);
  
    
    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + 'px';
      element.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      console.log("ON MOUSE MOVE")
      moveAt(event.pageX, event.pageY);
    }
  
    document.addEventListener('mousemove', onMouseMove);
  
    element.onmouseup = function() {
      console.log("MOUSE WAS UPED......");
      document.removeEventListener('mousemove', onMouseMove); //remove even listener
      element.onmouseup = null;
    }
}

//Actions on notes
const notesActions = function(minimize,remove,stickyCont){

    //remove sticky cont
    remove.addEventListener('click',function(e){
        stickyCont.remove(); //remove sticky cont
    });


    //minimize
    minimize.addEventListener('click',function(e){
        const noteCont = stickyCont.querySelector('.note-cont');
        const display = getComputedStyle(noteCont).getPropertyValue('display'); //get display value of note-cont

        if(display==='none'){
            noteCont.style.display = 'block';
        }else{
            noteCont.style.display = 'none';
        }
    });
}



//upload
upload.addEventListener('click',function(e){
    
    //open file explorer.
    const input = document.createElement('input');
    input.setAttribute('type','file');
    input.click();


    //creating sticky note with img
    input.addEventListener('change',function(e){
        
        const file = input.files[0];  //first file
        const url = URL.createObjectURL(file);


        const stickyCont = document.createElement('div');
        stickyCont.setAttribute('class','sticky-cont');
    
        stickyCont.innerHTML =`<div class="header-cont">
                                   <div class="minimize"></div>
                                   <div class="remove"></div>
                               </div>
                               <div class="note-cont">
                                   <img src="${url}"/>
                               </div>`;
    
        document.body.appendChild(stickyCont);
    
        //same functionality as text-stricky content 
        // DRAG AND DROP FUNCTIONALITY
        stickyCont.onmousedown = function(event) {
            dragAndDrop(stickyCont,event);
        }
          
        stickyCont.ondragstart = function() {
            return false;
        };
    
    
        //notes-actions
    
        const minimize = document.querySelector('.minimize');
        const remove  = document.querySelector('.remove');
    
        notesActions(minimize,remove,stickyCont);
    });
});