/**@type {HTMLCanvasElement} */
const paper= document.querySelector("#paper");
pen= paper.getContext('2d');

const startTime= new Date().getTime();
let soundEnabled=false;

document.onvisibilitychange=()=>soundEnabled=false;
paper.onclick= () => soundEnabled= !soundEnabled;

const sounds=[
    new Audio(`./1.wav`),
    new Audio(`./2.wav`),
    new Audio(`./3.wav`),
    new Audio(`./4.wav`),
    new Audio(`./5.wav`),
    new Audio(`./6.wav`),
    new Audio(`./7.wav`),
    new Audio(`./8.wav`),
    new Audio(`./9.wav`),
    new Audio(`./10.wav`),
]

const settings = {
    maxCycles: 50,
    soundEnabled: false, 
    duration: 180,
  }

const calculateVelocity = index => {  
    const numberOfCycles = settings.maxCycles - index,
          distancePerCycle = 2 * Math.PI;
  
  return (numberOfCycles * distancePerCycle) / settings.duration;
}


const calculateNextImpactTime=(currentImpactTime, velocity) =>{
    return currentImpactTime+(Math.PI/velocity)*1000;
}

const arcs=[
    "#fafa6e",
    "#c4ec74",
    "#92dc7e",
    "#64c987",
    "#39b48e",
    "#089f8f",
    "#00898a",
    "#08737f",
    // "#215d6e",
    // "#2a4858",  
].map((color, index)=>{
    
    const audio=sounds[index];
    audio.volume=0.5;
    const velocity=calculateVelocity(index);
    let lastImpactTime=0,
    nextImpactTime=calculateNextImpactTime(startTime, velocity);
    return{
        color,
        audio,
        nextImpactTime,
        lastImpactTime,
        velocity
    }
});

const draw= () =>{
    pen.clearRect(0, 0, paper.width, paper.height);
    paper.width=paper.clientWidth;
    paper.height=paper.clientHeight;


    const start={
        x: paper.width*0.1,
        y: paper.height*0.9
    }
    const end={
        x: paper.width*0.9,
        y: paper.height*0.9
    }
    
    const center={
        x:start.x+(end.x-start.x)/2.0,
        y:start.y
    }


    let currentTime = new Date().getTime(),
    elapsedTime= (currentTime-startTime)/1000;
    
    let length=end.x-start.x;
    const initialRadius= 0.05*length;
    

    arcs.forEach((arc, index)=>{

        const velocity = calculateVelocity(index);

        let radius=length*0.05,
        maxAngle= 2*Math.PI,
        distance= (Math.PI+ (elapsedTime * velocity));
        modDis=distance%maxAngle;
        adjDistance= (modDis>= Math.PI)? modDis : maxAngle-modDis;
        
        const spacing=((end.x-start.x)/2-initialRadius)/ arcs.length,
        arcRadius= initialRadius + (index*spacing);

        pen.strokeStyle= arc.toString();
        pen.lineWidth= 2;
        
        currentTime=new Date().getTime();
        if(currentTime>=arc.nextImpactTime){
            if(soundEnabled){
                console.log(arc.lastImpactTime, arc.nextImpactTime); 

                arc.audio.play();
                arc.lastImpactTime = arc.nextImpactTime;
                console.log(arc.lastImpactTime, arc.nextImpactTime); 

            }
            arc.nextImpactTime = calculateNextImpactTime(arc.lastImpactTime, arc.velocity); 
            pen.strokeStyle="white";
            pen.beginPath();
            pen.moveTo(start.x, start.y+length *0.0065);
            pen.lineTo(end.x, end.y+length *0.0065);
            pen.stroke();
        }
        else{
            pen.strokeStyle="black";
        }

        pen.beginPath();
        pen.moveTo(start.x, start.y+length *0.0065);
        pen.lineTo(end.x, end.y+length *0.0065);
        pen.stroke();

        pen.fillStyle= "white";
        pen.beginPath();
        pen.arc(center.x+arcRadius*Math.cos(adjDistance), center.y+arcRadius*Math.sin(adjDistance), length *0.0065, 0, 2*Math.PI);
        pen.fill();

        pen.strokeStyle= arc.color.toString();
        pen.beginPath();
        pen.arc(center.x, center.y, arcRadius, Math.PI, 2*Math.PI);
        pen.stroke();

        
    });

    
    requestAnimationFrame(draw);
}

draw();