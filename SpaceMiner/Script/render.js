//Sets the position of all the boxes based on the X and Y position variables
//This is laggy!
// Define cachedBoxes and renderVars
const cachedBoxes = document.querySelectorAll('.box'); // Select all elements with the class "box"

const renderVars = {
    diffX: 0,
    diffY: 0,
    lastRender: Date.now(),
    mouseIsDown: false,
    isAutoPanning: false,
    autoPanTime: 1000,
    currentMousePos: [0, 0], // Initialize as an array
};

const inputVars = {
    keysHeld: {}, // Tracks which keys are currently held down
    keySpeedX: 0, // Current horizontal speed
    keySpeedY: 0, // Current vertical speed
    keyInputX: 0, // Horizontal input (-1 for left, 1 for right)
    keyInputY: 0, // Vertical input (-1 for up, 1 for down)
    keySpeedCap: 10, // Maximum speed for panning
    keySpeedDecel: 1, // Deceleration rate
    keyboardRenderPerSec: 72, // Render rate for keyboard panning
};

const panResistantFields = []; // Add IDs of elements that should resist panning

tabPositions = [];

//this is executed on pageload to populate an array of tab data for better rendering
function populateTabPositions() {
  let tabNames = Object.keys(tabData);
  let highestUnlock = 0;
  tabNames.forEach(tab => {highestUnlock = Math.max(highestUnlock, tabData[tab][2])});
  tabPositions.length = highestUnlock + 1;
  for (i=0;i<tabPositions.length;i++) {tabPositions[i] = {}};
  tabNames.forEach(tab => {
    tabPositions[tabData[tab][2]][tab] = [tabData[tab][0], tabData[tab][1]]
  })
}

//Sets the position of all the boxes based on the X and Y position variables
//This is laggy!
function render(x, y) {
  //Main tab
  cachedBoxes[0].style.left = (x) + "px"
  cachedBoxes[0].style.top = (y) + "px"

  document.body.style.backgroundPosition = (x / 4) + "px " + (y / 4) + "px"
  //console.log(Date.now() - renderVars.lastRender)
  renderVars.lastRender = Date.now();
}

render(renderVars.posX, renderVars.posY)

//Automatically renders 10 times per second (there's probably a better way to do this)
function renderAuto() {
  //render(renderVars.posX, renderVars.posY)
  render(renderVars.posX + renderVars.diffX, renderVars.posY + renderVars.diffY)
}
setInterval(renderAuto, 100)

//Renders 72 times per second, but only if any movement keys are held
function renderKeyboardPan() {
  updatePanKeySpeed();
  if (renderVars.mouseIsDown || (Math.abs(inputVars.keySpeedX) < 0.1 && Math.abs(inputVars.keySpeedY) < 0.1)) return;
  renderVars.posX = renderVars.posX + inputVars.keySpeedX;
  renderVars.posY = renderVars.posY + inputVars.keySpeedY;
  //console.log("rendering")
  render(renderVars.posX, renderVars.posY)
}
setInterval(renderKeyboardPan, 1000 / inputVars.keyboardRenderPerSec)

// Fix mouseDown function
function mouseDown(e) {
    if (renderVars.isAutoPanning || e.button !== 0) { return } // Ensure we only respond to left clicks
    renderVars.currentMousePos[0] = e.pageX; // Set X position
    renderVars.currentMousePos[1] = e.pageY; // Set Y position
    renderVars.mouseIsDown = true;
}

//Resets variables for comparing position when mouse goes up
function mouseUp(e) {
  renderVars.mouseIsDown = false
  renderVars.posX = renderVars.posX + renderVars.diffX
  renderVars.posY = renderVars.posY + renderVars.diffY
  renderVars.diffX = 0
  renderVars.diffY = 0
}

//Sets the position to x,y
function posSet(x,y) {
  //Zoom stuff!
  //renderVars.posX = 0 - window.innerWidth / (renderVars.zoomMultiplier * 2)
  //renderVars.posY = 0 - window.innerHeight / (renderVars.zoomMultiplier * 2)
  renderVars.posX = x + window.innerWidth/2
  renderVars.posY = y + window.innerHeight/2
  render(renderVars.posX, renderVars.posY)
  resetPressedKeys(); //pressing home will reset all held keyboard keys in case of stuck keys
}

async function panTo(endX,endY) {
  renderVars.isAutoPanning = true;
  resetPressedKeys();
  let startTime = Date.now();
  let endTime = startTime + renderVars.autoPanTime;
  let midTime = startTime + renderVars.autoPanTime * 0.75;
  let startX = renderVars.posX;
  let startY = renderVars.posY;
  let midX = startX + (endX - startX) * 0.9;
  let midY = startY + (endY - startY) * 0.9;
  //console.log("starting pan. currentx: " + renderVars.posX + ", currentY: " + renderVars.posY + ", startX: " + startX + ", startY: " + startY)
  while (Date.now() < midTime) {
    renderVars.posX = lerp(startX, midX, (Date.now() - startTime) / renderVars.autoPanTime * 1.33);
    renderVars.posY = lerp(startY, midY, (Date.now() - startTime) / renderVars.autoPanTime * 1.33);
    //console.log((Date.now() - startTime) / renderVars.autoPanTime * 0.5)
    render(renderVars.posX, renderVars.posY);
    await promiseDelay(17);
  }
  //console.log("mid pan. currentx: " + renderVars.posX + ", currentY: " + renderVars.posY + ", midX: " + midX + ", midY: " + midY)
  renderVars.posX = midX;
  renderVars.posY = midY;
  while(Date.now() < endTime) {
    renderVars.posX = lerp(midX, endX, (Date.now() - midTime) / renderVars.autoPanTime * 4);
    renderVars.posY = lerp(midY, endY, (Date.now() - midTime) / renderVars.autoPanTime * 4);
    render(renderVars.posX, renderVars.posY);
    await promiseDelay(17);
  }
  //console.log("end pan. currentx: " + renderVars.posX + ", currentY: " + renderVars.posY + ", endX: " + endX + ", endY: " + endY)
  renderVars.posX = endX;
  renderVars.posY = endY;
  renderVars.isAutoPanning = false;
}

function updatePanKeys() {
    // Reset key inputs
    inputVars.keyInputX = 0;
    inputVars.keyInputY = 0;

    // Update horizontal input
    if (inputVars.keysHeld['ArrowLeft']) {
        inputVars.keyInputX -= 1; // Move left
    }
    if (inputVars.keysHeld['ArrowRight']) {
        inputVars.keyInputX += 1; // Move right
    }

    // Update vertical input
    if (inputVars.keysHeld['ArrowUp']) {
        inputVars.keyInputY -= 1; // Move up
    }
    if (inputVars.keysHeld['ArrowDown']) {
        inputVars.keyInputY += 1; // Move down
    }
}

function panToTab(tab) {
  if (tabData[tab] === undefined) {console.warn("auto tab pan attempted with invalid parameter: " + tab); return;}
  panTo(-tabData[tab][0]+(window.innerWidth/2),
    -tabData[tab][1]+(window.innerHeight/2))
}

function panToNewUnlock() {
  let tabNames = Object.keys(tabData);
  for (i=0;i<tabNames.length;i++) {
    let tab = tabNames[i];
    if (tabData[tab][2] === game.unlocks) {
      panToTab(tab);
      return;
    }
  }
}

function handleMouseMove(event) {
    if (renderVars.isAutoPanning) return;
    event = event || window.event;
    renderVars.mousePosX = event.pageX;
    renderVars.mousePosY = event.pageY;

    if (
        renderVars.mouseIsDown &&
        panResistantFields.indexOf(document.activeElement.id) === -1 &&
        bigFinishPoint === 0
    ) {
        renderVars.diffX = event.pageX - renderVars.currentMousePos[0];
        renderVars.diffY = event.pageY - renderVars.currentMousePos[1];
        if (Date.now() - renderVars.lastRender >= 20 && Math.abs(renderVars.diffX) + Math.abs(renderVars.diffY) > 8) {
            render(renderVars.posX + renderVars.diffX, renderVars.posY + renderVars.diffY);
        }
    }
}

function processKeyDown(event) {
  if (event.repeat || renderVars.isAutoPanning) return; //holding a key down causes repeated keydown events. make sure we don't respond to duplicates.
  inputVars.keysHeld[event.key] = true;
  updatePanKeys();
}

function processKeyUp(event) {
  inputVars.keysHeld[event.key] = false;
  updatePanKeys();
}

function arrowClick(dir) {
  inputVars.keysHeld[dir] = true;
  updatePanKeys();
  clearTouch();
}

function arrowRelease(dir) {
  inputVars.keysHeld[dir] = false;
  updatePanKeys();
}

function clearTouch() {
    console.log("clearTouch called. Implement touch reset logic here if needed.");
}

//process the speed for smooth panning when using keyboard
function updatePanKeySpeed() {
  let effectiveDecel = inputVars.keySpeedDecel / inputVars.keyboardRenderPerSec;
  if (Math.sign(inputVars.keySpeedX) * Math.sign(inputVars.keyInputX) === -1) inputVars.keySpeedX = 0; // skip decel if opposite direction is pressed
  if (Math.sign(inputVars.keySpeedY) * Math.sign(inputVars.keyInputY) === -1) inputVars.keySpeedY = 0;
  if (inputVars.keyInputX === 0) {
    inputVars.keySpeedX -= Math.sign(inputVars.keySpeedX) * effectiveDecel;
    if (Math.abs(inputVars.keySpeedX) <= effectiveDecel) inputVars.keySpeedX = 0;
  } else {
    inputVars.keySpeedX = Math.sign(inputVars.keyInputX) * inputVars.keySpeedCap; // no accel, goes straight to max speed
  }
  if (inputVars.keyInputY === 0) {
    inputVars.keySpeedY -= Math.sign(inputVars.keySpeedY) * effectiveDecel;
    if (Math.abs(inputVars.keySpeedY) <= effectiveDecel) inputVars.keySpeedY = 0;
  } else {
    inputVars.keySpeedY = Math.sign(inputVars.keyInputY) * inputVars.keySpeedCap;
  }
  inputVars.keySpeedX = Math.round(inputVars.keySpeedX * inputVars.keyboardRenderPerSec) / inputVars.keyboardRenderPerSec; // avoiding precision errors (hopefully)
  inputVars.keySpeedX = Math.min(inputVars.keySpeedCap, Math.max(-inputVars.keySpeedCap, inputVars.keySpeedX)); // clamp between the speed caps
  inputVars.keySpeedY = Math.round(inputVars.keySpeedY * inputVars.keyboardRenderPerSec) / inputVars.keyboardRenderPerSec;
  inputVars.keySpeedY = Math.min(inputVars.keySpeedCap, Math.max(-inputVars.keySpeedCap, inputVars.keySpeedY));
}

//reset all held keys. 
function resetPressedKeys() {
  for (let key in inputVars.keysHeld) {
    inputVars.keysHeld[key] = false;
  }
  updatePanKeys()
} 

// Variables to track dragging state and background position
let isDragging = false;
let lastMousePos = { x: 0, y: 0 };
let backgroundPos = { x: 0, y: 0 };

document.addEventListener('mousedown', (e) => {
    if (e.target.closest('.tab')) {
        console.log("Dragging ignored for tabs.");
        return; // Do not start dragging if clicking inside a tab
    }

    isDragging = true;
    lastMousePos.x = e.clientX;
    lastMousePos.y = e.clientY;
    document.body.style.cursor = 'grabbing'; // Change cursor to grabbing
});

// Mouse move event to drag the background
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        // Calculate the difference in mouse position
        const diffX = e.clientX - lastMousePos.x;
        const diffY = e.clientY - lastMousePos.y;

        // Update the background position
        backgroundPos.x += diffX;
        backgroundPos.y += diffY;
        document.body.style.backgroundPosition = `${backgroundPos.x}px ${backgroundPos.y}px`;

        // Update the last mouse position
        lastMousePos.x = e.clientX;
        lastMousePos.y = e.clientY;
    }
});

// Mouse up event to stop dragging
document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'all-scroll'; // Reset cursor to all-scroll
});