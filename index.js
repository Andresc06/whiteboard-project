let color,
  width,
  drawing,
  startX,
  startY,
  currentTouch,
  currentTouchEnd,
  currentId,
  buttons,
  buttonsWidth,
  currentContext;

function begin() {
  canvas = [];
  canvas.push(document.getElementById("canvas"));
  canvas.push(document.getElementById("canvas2"));
  canvas.push(document.getElementById("canvas3"));
  canvas.push(document.getElementById("canvas4"));
  canvas.map((canv) => (canv.style.zIndex = -1));
  canvas[0].style.zIndex = 1;
  ctx = [];
  ctx.push(canvas[0].getContext("2d"));
  ctx.push(canvas[1].getContext("2d"));
  ctx.push(canvas[2].getContext("2d"));
  ctx.push(canvas[3].getContext("2d"));
  currentContext = ctx[0];
  currentId = 0;

  buttons = [];
  for (let i = 1; i <= 4; i++) {
    buttons.push(document.getElementById(`but${i}`));
  }
  buttonsWidth = [];
  for (let i = 1; i <= 6; i++) {
    buttonsWidth.push(document.getElementById(`wd${i}`));
  }
  buttons[0].style.background = "#154360";
  buttonsWidth[0].style.background = "#FFF";
  buttonsWidth[0].style.color = "#000";

  // Creacion de los listener para interaccion con el usuario

  canvas.map((canv) => {
    canv.addEventListener("mousedown", click);
    canv.addEventListener("mouseup", unclick);
    canv.addEventListener("touchstart", handleStart);
    canv.addEventListener("touchend", handleEnd);
    canv.addEventListener("touchmove", handleMove);
  });
  document.addEventListener("mousemove", moveMouse);

  color = "#000";
  width = 7;
}

function handleStart(evt) {
  drawing = true;
  currentTouch = evt.touches[evt.touches.length - 1];

  startX = currentTouch.clientX;
  startY = currentTouch.clientY;

  // Empezar camino
  currentContext.beginPath();

  // Averiguar coordenadas para dibujar
  currentContext.moveTo(startX, startY);
}

function handleMove(evt) {
  if (drawing) {
    currentTouchEnd = evt.touches[evt.touches.length - 1];
    // Color
    currentContext.strokeStyle = color;

    // Width
    currentContext.lineWidth = width;

    // Se indica hasta donde se va a dibujar la linea
    currentContext.lineTo(currentTouchEnd.clientX, currentTouchEnd.clientY);

    // Dibuja la linea
    currentContext.stroke();

    // Send the mouse coordinates
    sendmouse(
      startX,
      startY,
      currentTouchEnd.clientX,
      currentTouchEnd.clientY,
      currentId
    );
    startX = currentTouchEnd.clientX;
    startY = currentTouchEnd.clientY;
  }
}

function movecanva(id) {
  canvas.map((canv) => (canv.style.zIndex = -1));
  buttons.map((but) => (but.style.background = "#5499C7"));
  canvas[id].style.zIndex = 1;
  buttons[id].style.background = "#154360";
  currentContext = ctx[id];
  currentId = id;
}

function handleEnd(e) {
  // Terminar dibujo
  currentContext.closePath();
  drawing = false;
}

function changeColor(currentColor) {
  color = `#${currentColor}`;

  // Cambio color relleno de fondo del color actual
  document.getElementById("rellenoActual").style.background = color;
}

function changeWidth(currentWidth) {
  width = currentWidth;
  buttonsWidth.map(
    (but) => ((but.style.background = "#333"), (but.style.color = "#FFF"))
  );
  buttonsWidth[currentWidth - 1].style.background = "#FFF";
  buttonsWidth[currentWidth - 1].style.color = "#000";
}

function click(e) {
  drawing = true;
  startX = e.clientX;
  startY = e.clientY;
  // Empezar camino
  currentContext.beginPath();

  // Averiguar coordenadas para dibujar
  currentContext.moveTo(startX, startY);
}

function moveMouse(e) {
  // Condicional si esta dibujando
  if (drawing) {
    // Color
    currentContext.strokeStyle = color;

    // Width
    currentContext.lineWidth = width;

    // Se indica hasta donde se va a dibujar la linea
    currentContext.lineTo(e.clientX, e.clientY);

    // Dibuja la linea
    currentContext.stroke();

    // Send the mouse coordinates
    sendmouse(startX, startY, e.clientX, e.clientY, currentId);
    startX = e.clientX;
    startY = e.clientY;
  }
}

function unclick() {
  // Terminar dibujo
  currentContext.closePath();
  drawing = false;
}

function paint(data) {
  let id = data.id;
  ctx[id].beginPath();
  ctx[id].moveTo(data.x, data.y);
  ctx[id].strokeStyle = data.color;
  ctx[id].lineWidth = data.width;
  ctx[id].lineTo(data.px, data.py);
  ctx[id].stroke();
  ctx[id].closePath();
}

// Start the socket connection
socket = io.connect("https://whiteboard-project-andresc06.netlify.app:3000");

socket.on("mouse", (data) => {
  paint(data);
});

// Sending data to the socket
function sendmouse(x, y, pX, pY, id) {
  const data = {
    x: x,
    y: y,
    px: pX,
    py: pY,
    color: color,
    width: width,
    id: id,
  };
  socket.emit("mouse", data);
}
