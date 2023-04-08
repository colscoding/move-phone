import data from '../src/data.json' assert { type: 'json' };



const last100 = []
let last100Sum = 0
let displayTime = Date.now()
function handleMotion(event) {
    const sum = (Math.abs(event.acceleration.x) + Math.abs(event.acceleration.y) + Math.abs(event.acceleration.z)) * event.interval
    last100.push(sum)
    last100Sum += sum
    if (last100.length > 100) {
        const old = last100.splice(0, 1)
        last100Sum -= old
    }
    console.log(last100Sum)
    if (!last100Sum) {
        const x = 2
    }
}



const events = data.recording

let eventIndex = 0
let lastTime = 0

const eventT0 = events[0].t

const f = () => {
    const e = events[eventIndex]
    const eventTimeDiff = e.t - eventT0
    const t = Date.now()
    const currTimeDiff = t - lastTime
    if (currTimeDiff >= eventTimeDiff || true) {
        handleMotion(e.event)
        // console.log(e)
        eventIndex = (eventIndex + 1) % events.length
        lastTime = eventIndex === 0 ? 0 : t;
    }
    setTimeout(f, 10)
}
setTimeout(f, 10);