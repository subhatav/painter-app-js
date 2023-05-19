const paintCanvas = document.querySelector("canvas");
const paintContext = paintCanvas.getContext("2d");

const toolButtons = document.querySelectorAll(".tool");
const fillColor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorPicker = document.querySelector("#color-picker");
const colorButtons = document.querySelectorAll(".colors .option");

const clearCanvas = document.querySelector(".clear-canvas");
const saveImage = document.querySelector(".save-image");

let snapshot, prevMouseX, prevMouseY;

let brushWidth = 5, isDrawing = false;
let selectedTool = "brush", selectedColor = "#000";

const setCanvasBackground = () => {

  // Set the whole Canvas Background to White Color;
  // so, the downloaded Image BG shall be White as well
  paintContext.fillStyle = "#FFF";
  paintContext.fillRect(0, 0, paintCanvas.width, paintCanvas.height);

  // Set the `fillStyle` back to the `selectedColor`
  paintContext.fillStyle = selectedColor;
}

window.addEventListener("load", () => {

  // Set the Canvas Width/Height as the Offset Width/Height;
  // so, it returns the Viewable Width/Height of an element
  paintCanvas.width = paintCanvas.offsetWidth;
  paintCanvas.height = paintCanvas.offsetHeight;

  setCanvasBackground();
});

const drawRectangle = (event) => {

  if (!fillColor.checked) {

    // Create a Rectangle according to the movement(s) of the Mouse Pointer, and border it with Color properly
    return paintContext.strokeRect(event.offsetX, event.offsetY, prevMouseX - event.offsetX, prevMouseY - event.offsetY);
  }

  // Create a Rectangle according to the movement(s) of the Mouse Pointer, and fill it with Color properly
  paintContext.fillRect(event.offsetX, event.offsetY, prevMouseX - event.offsetX, prevMouseY - event.offsetY);
}

const drawCircle = (event) => {

  paintContext.beginPath(); // Create a new Path to draw the Circle

  // Calculate the Radius for the Circle, from the movements of the Mouse Pointer
  const radius = Math.sqrt(Math.pow((prevMouseX - event.offsetX), 2) + Math.pow((prevMouseY - event.offsetY), 2));

  paintContext.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI); // Draw the Circle based on the Radius calculated
  fillColor.checked ? paintContext.fill() : paintContext.stroke(); // Fill or border the drawn Circle accordingly
}

const drawTriangle = (event) => {

  paintContext.beginPath(); // Create a new Path to draw the Triangle

  paintContext.moveTo(prevMouseX, prevMouseY); // Move the Triangle to the location of the Mouse Pointer

  paintContext.lineTo(event.offsetX, event.offsetY); // Create the first Line according to the Mouse Pointer
  paintContext.lineTo((prevMouseX * 2) - event.offsetX, event.offsetY); // Create the bottom Line of the Triangle
  paintContext.closePath(); // Close the Path of the Triangle, so that the last Line draws automatically

  fillColor.checked ? paintContext.fill() : paintContext.stroke(); // Fill or border the drawn Triangle accordingly
}

const startDrawing = (event) => {

  isDrawing = true; // Set the `isDrawing` as `true` value

  prevMouseX = event.offsetX; // Pass the current `mouseX` position as the `prevMouseX` value
  prevMouseY = event.offsetY; // Pass the current `mouseY` position as the `prevMouseY` value

  paintContext.beginPath(); // Create a new Path to draw the Image

  paintContext.lineWidth = brushWidth; // Pass the `brushSize` as the Line Width
  paintContext.strokeStyle = selectedColor; // Pass the `selectedColor` as the Stroke Style
  paintContext.fillStyle = selectedColor; // Pass the `selectedColor` as the Fill Style

  // Pass the Canvas Data as the `snapshot` value, to avoid dragging the Image
  snapshot = paintContext.getImageData(0, 0, paintCanvas.width, paintCanvas.height);
}

const performDrawing = (event) => {

  if (!isDrawing) return; // Return back if the `isDrawing` has `false` value

  // Put on the copied Canvas Data onto this Canvas
  paintContext.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush" || selectedTool === "eraser") {

    // If the `selectedTool` is `eraser`, then set the `strokeStyle` to White value;
    // otherwise, set it to the `selectedColor` to draw up the sketches accordingly
    paintContext.strokeStyle = selectedTool === "eraser" ? "#FFF" : selectedColor;

    // Create the Line according to the Mouse Pointer
    paintContext.lineTo(event.offsetX, event.offsetY);
    paintContext.stroke(); // Draw/Fill the Line with Color
  }

  else if (selectedTool === "rectangle") drawRectangle(event);
  else if (selectedTool === "circle") drawCircle(event);
  else drawTriangle(event);
}

toolButtons.forEach(button => {

  // Attach the Click Event Listeners to all the Tool Options
  button.addEventListener("click", () => {

    // Remove the `active` Class from the previous Option
    document.querySelector(".options .active").classList.remove("active");

    button.classList.add("active"); // Add it to the currently Clicked Shape Option

    selectedTool = button.id;
  });
});

// Pass the value of the Slider Range as the Brush Size for painting
sizeSlider.addEventListener("change", () => brushWidth = sizeSlider.value);

colorButtons.forEach(button => {

  // Attach the Click Event Listeners to all the Color Buttons
  button.addEventListener("click", () => {

    // Remove the `selected` Class from the previous Button
    document.querySelector(".options .selected").classList.remove("selected");

    button.classList.add("selected"); // Add it to the currently Clicked Color Button

    // Pass the selected Button BG Color as the `selectedColor` value
    selectedColor = window.getComputedStyle(button).getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {

  // Pass the picked Color value from Color Picker to the Button BG
  colorPicker.parentElement.style.background = colorPicker.value;

  colorPicker.parentElement.click();
});

clearCanvas.addEventListener("click", () => {

  // Clear the whole Canvas; i.e., reset the entire Canvas
  paintContext.clearRect(0, 0, paintCanvas.width, paintCanvas.height);

  setCanvasBackground();
});

saveImage.addEventListener("click", () => {

  // Create an `a` Element Link for downloading the Image
  const link = document.createElement("a");

  // Pass the Canvas Data URL to the `href` value of the `<a>` element
  link.href = paintCanvas.toDataURL();
  link.download = `${Date.now()}.jpg`;

  link.click(); // Click the Link created to start the download
});

paintCanvas.addEventListener("mousedown", startDrawing);
paintCanvas.addEventListener("mousemove", performDrawing);

paintCanvas.addEventListener("mouseup", () => isDrawing = false);