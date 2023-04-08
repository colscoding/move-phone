import data from './data.json' assert { type: 'json' };

function updateFieldIfNotNull(fieldName, value, precision = 10) {
  if (value != null)
    document.getElementById(fieldName).innerHTML = value.toFixed(
      precision
    );
}

const last100 = []
let last100Sum = 0
let displayTime = Date.now()

let isMoving = false

let moveCount = 0

const setStatus = () => {
  const status = isMoving ? 'moving' : 'still'
  document.getElementById("status").innerHTML = status
}
const setMoveCount = () => {
  document.getElementById('moveCount').innerHTML = moveCount
}
setStatus()
setMoveCount()

function handleMotion(event) {
  updateFieldIfNotNull("Accelerometer_x", event.acceleration.x);
  updateFieldIfNotNull("Accelerometer_y", event.acceleration.y);
  updateFieldIfNotNull("Accelerometer_z", event.acceleration.z);
  updateFieldIfNotNull("Accelerometer_i", event.interval, 2);
  const sum = (Math.abs(event.acceleration.x) + Math.abs(event.acceleration.y) + Math.abs(event.acceleration.z)) * event.interval
  last100.push(sum)
  last100Sum += sum
  if (last100.length > 100) {
    const old = last100.splice(0, 1)
    last100Sum -= old
  }
  const moveThreshold = 100
  const newIsMoving = last100Sum > moveThreshold
  if (isMoving && !newIsMoving) {
    moveCount += 1
    setMoveCount()
  }
  if (isMoving !== newIsMoving) {
    isMoving = newIsMoving
    setStatus()
  }
  const t = Date.now()
  if (t > (displayTime + 1000)) {
    displayTime = t
    document.getElementById("last100Sum").innerHTML = last100Sum
  }
}


let is_running = false;
let demo_button = document.getElementById("start_demo");
//
demo_button.onclick = function (e) {


  e.preventDefault();

  // Request permission for iOS 13+ devices
  if (
    DeviceMotionEvent &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    DeviceMotionEvent.requestPermission();
  }

  if (is_running) {
    window.removeEventListener("devicemotion", handleMotion);
    demo_button.innerHTML = "Start demo";
    demo_button.classList.add("btn-success");
    demo_button.classList.remove("btn-danger");
    is_running = false;
  } else {
    window.addEventListener("devicemotion", handleMotion);
    document.getElementById("start_demo").innerHTML = "Stop demo";
    demo_button.classList.remove("btn-success");
    demo_button.classList.add("btn-danger");
    is_running = true;
  }


};



// const events = data.recording

// let eventIndex = 0
// let lastTime = 0

// let prevEventT = 0

// setInterval(() => {
//   const e = events[eventIndex]
//   const eventTimeDiff = e.t - prevEventT
//   const t = Date.now()
//   const currTimeDiff = t - lastTime
//   if (currTimeDiff >= eventTimeDiff) {
//     console.log(currTimeDiff)
//     handleMotion(e.event)
//     eventIndex = (eventIndex + 1) % events.length
//     lastTime = eventIndex === 0 ? 0 : t;
//     prevEventT = e.t
//   }
// }, 1)