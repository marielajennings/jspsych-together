
///make line width a parameter, add the dashed lines on every line, format "pre"
function definePlugin (){
var plugin = {};

plugin.info= {
  name: 'reciprocal',
  description:'This plugin is specifically made for Physical Togetherness!',
  parameters: {
      preamble: {
        type:[jsPsych.plugins.parameterType.STRING],
        default: '',
        no_function:false,
        description: 'This is the preamble that shows on top'
      },
      question: {
        type:[jsPsych.plugins.parameterType.STRING],
        default: undefined,
        no_function:false,
        description: 'This is the real question'
      },
      objects: {
        type:[jsPsych.plugins.parameterType.ARRAY],
        default:undefined,
        no_function:false,
        description:"The names for the objects we want to ask about!"
      }

  }

}

plugin.trial= function (display_element, trial) {

trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

var p = document.createElement('p');
display_element.appendChild(p);
p.innerHTML= ""+trial.preamble+""

var p2 = document.createElement('p');
display_element.appendChild(p2);
p2.innerHTML= ""+trial.question+""

var p3 = document.createElement('p');
display_element.appendChild(p3);
p3.innerHTML="Bring the lines together or apart to create an accurate representation of when the two objects were together in time:"

var spacer = document.createElement('div');
display_element.appendChild(spacer);
spacer.setAttribute('style', 'height:30px');

var center = document.createElement('pre');
display_element.appendChild(center);
center.innerHTML="                           &nbsp;&nbsp;  before        during        after       "
center.setAttribute('style', 'color:gray;font-weight:bold')

var mainWrapper = document.createElement('div');
display_element.appendChild(mainWrapper);

/*var labelling = document.createElement('div');
mainWrapper.appendChild(labelling);
labelling.setAttribute('style', 'float:left; width:160px; height:250;box-sizing:border-box;');
var names = document.createElement('p');
labelling.appendChild(names);
names.innerHTML="<br><br>"+trial.objects[0]+trial.objects[1]+"" */
var helper_canvas = document.createElement('canvas');
helper_canvas.setAttribute('width','180');
helper_canvas.setAttribute('height','250');
helper_canvas.setAttribute('float', 'left')
mainWrapper.appendChild(helper_canvas);


var canvas = document.getElementById("myCanvas");
var ctx1=helper_canvas.getContext("2d");
ctx1.font = "20px Arial";
ctx1.fillText(""+trial.objects[0]+"",100,105);
ctx1.fillText(""+trial.objects[1]+"",100,208);

var canvasWrapper = document.createElement('div')
mainWrapper.appendChild(canvasWrapper);
canvasWrapper.setAttribute('style','width:610px;float:right')

var canvas = document.createElement('canvas');
canvasWrapper.appendChild(canvas);
canvas.setAttribute('width','600');
canvas.setAttribute('height','250');
canvas.setAttribute('float', 'right')

var ctx=canvas.getContext("2d");

var cw=canvas.width;
var ch=canvas.height;
function reOffset(){
    var BB=canvas.getBoundingClientRect();
    offsetX=BB.left;
    offsetY=BB.top;        
}
var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }
window.onresize=function(e){ reOffset(); }

var startX,startY;

// line vars
var nearest;
var lines=[];
lines.push({x0:100, y0:100, x1:250,y1:100});
lines.push({x0:100, y0:200, x1:250, y1:200});
lines.push({x0:250, y0:100, x1:400,y1:100});
lines.push({x0:250, y0:200, x1:400, y1:200});
lines.push({x0:400, y0:100, x1:550,y1:100});
lines.push({x0:400,y0:200, x1:550,y1:200});
lines.push({x0:247, y0:103, x1:247, y1:197})
lines.push({x0:403, y0:103, x1:403, y1:197})
lines.push({x0:100, y0:106, x1:250,y1:106});
lines.push({x0:100, y0:194, x1:250, y1:194});
lines.push({x0:250, y0:106, x1:400,y1:106});
lines.push({x0:250, y0:194, x1:400, y1:194});
lines.push({x0:394, y0:106, x1:550,y1:106});
lines.push({x0:400,y0:194, x1:550,y1:194});
lines.push({x0:5, y0:100 , x1:100,y1:100});
lines.push({x0:5, y0:200, x1:100,y1:200});
lines.push({x0:5, y0:100, x1:100, y1:191});
lines.push({x0:5, y0:200, x1:100, y1:109});

draw();

// listen for mouse events
canvas.addEventListener("mousedown",handleMouseDown);

// select the nearest line to the mouse
function closestLine(mx,my){
    var dist=100000000;
    var index,pt;
    for(var i=0;i<6;i++){
        //
        var xy=closestXY(lines[i],mx,my);
        //
        var dx=mx-xy.x;
        var dy=my-xy.y;
        var thisDist=dx*dx+dy*dy;
        if(thisDist<dist){
            dist=thisDist;
            pt=xy;
            index=i;
        }
    }
    var line=lines[index];
    return({ pt:pt, line:line, originalLine:{x0:line.x0,y0:line.y0,x1:line.x1,y1:line.y1} });
}


// linear interpolation -- needed in setClosestLine()
function lerp(a,b,x){return(a+x*(b-a));}

// find closest XY on line to mouse XY
function closestXY(line,mx,my){
    var x0=line.x0;
    var y0=line.y0;
    var x1=line.x1;
    var y1=line.y1;
    var dx=x1-x0;
    var dy=y1-y0;
    var t=((mx-x0)*dx+(my-y0)*dy)/(dx*dx+dy*dy);
    t=Math.max(0,Math.min(1,t));
    var x=lerp(x0,x1,t);
    var y=lerp(y0,y1,t);
    return({x:x,y:y});
}


// draw the scene
function draw(){

 // ctx.save();
  //ctx.setLineDash([5]);
 // for (var j=0; j<2; j++) {
  //  drawLabel(labels[j]);
 // }
  //ctx.restore();
    // draw all lines at their current positions
   for(var i=0;i<lines.length;i++){
        if (i == 0 || i == 2 || i ==4) {
        drawLine(lines[i],'black',0,6);
     } else if ( i == 1 || i ==3 || i ==5) {
      drawLine(lines[i],'orange',0,6);
     } else if (i == 14 || i ==15) {
      drawLine(lines[i],'gray',5,2)
     }else {
        drawLine(lines[i],'transparent',0,6);
    } }  }


var before = 'apart before'
var after = 'apart after'
var during = 'apart during'
var color



function drawLine(line,color, dash, width){
    ctx.beginPath();
    ctx.moveTo(line.x0,line.y0);
    ctx.lineTo(line.x1,line.y1);
    ctx.lineWidth = width;
    ctx.strokeStyle=color;
    ctx.setLineDash([dash]);
    ctx.stroke();
}

/////////Labels//////////////////


/*function drawLabel(label){
    ctx.beginPath();
    ctx.moveTo(label.x0,label.y0);
    ctx.lineTo(label.x1,label.y1);
    ctx.setLineDash([5]);  
    ctx.stroke();
   var  x=1;
   console.log(x);
} */
//////////////////////////////////
function handleMouseDown(e){
  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();
  // mouse position
  startX=parseInt(e.clientX-offsetX);
  startY=parseInt(e.clientY-offsetY);
  // find nearest line to mouse
  nearest=closestLine(startX,startY);
 
    var line=nearest.line;

  
if (line.x0 == 100 && line.y0 == 100 && before == 'apart before' && during == 'apart during' && after == 'apart after') {
  ctx.clearRect(0,0,cw,ch);
  
lines[6].x0=253
lines[6].x1=253

drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'transparent',0,6)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',0,6)

before = 'together before'
color = 'black'
console.log(before)
console.log(color)


} else if (line.x0 == 100 && line.y0 == 200 && before == 'apart before' && during == 'apart during' && after == 'apart after') {
  console.log(before)
 ctx.clearRect(0,0,cw,ch);
 lines[6].x0=253
lines[6].x1=253

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'transparent',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2)

before = 'together before'
color = 'orange'
console.log(before)
console.log (color)

}else if ((line.x0 == 100 && line.y0 == 200 && before == 'together before' && during == 'apart during' && after == 'apart after') || (line.x0 == 100 && line.y0 == 100 && before == 'together before' && during == 'apart during' && after == 'apart after')) {
 
 ctx.clearRect(0,0,cw,ch);

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)


before = 'apart before'
console.log(before)
color = 'neutral'
console.log(color)
} else if (line.x0 == 250 && line.y0 == 100 && during == 'apart during' && before == 'apart before' && after == 'apart after') {
  ctx.clearRect(0,0,cw,ch);

lines[6].x0=247
lines[6].x1=247
lines[7].x0=403
lines[7].x1=403

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

during = 'together during'
color = 'black'
console.log(during)
console.log(color)


} else if (line.x0 == 250 && line.y0 == 200 && during == 'apart during' && before == 'apart before' && after == 'apart after') {
  
 ctx.clearRect(0,0,cw,ch);

lines[6].x0=247
lines[6].x1=247
lines[7].x0=403
lines[7].x1=403

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

during = 'together during'
color = 'orange'
console.log(during)

} else if ((line.x0 == 250 && line.y0 == 200 && during == 'together during' && before == 'apart before' && after == 'apart after') || (line.x0 == 250 && line.y0 == 100 && during == 'together during' && before == 'apart before' && after == 'apart after')) {
 
 ctx.clearRect(0,0,cw,ch);

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

during = 'apart during'
color='neutral'
console.log(during)
} else if (line.x0 == 400 && line.y0 == 100 && after == 'apart after' && before == 'apart before' && during == 'apart during') {
  ctx.clearRect(0,0,cw,ch);


lines[7].x0=397
lines[7].x1=397

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

after = 'together after'
color = 'black'
console.log(after)


} else if (line.x0 == 400 && line.y0 == 200 && after == 'apart after' && before == 'apart before' && during == 'apart during') {
  
 ctx.clearRect(0,0,cw,ch);
lines[7].x0=397
lines[7].x1=397

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'orange',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

after = 'together after'
color = 'orange'
console.log(after)

} else if ((line.x0 == 400 && line.y0 == 200 && after == 'together after' && before == 'apart before' && during == 'apart during') || (line.x0 == 400 && line.y0 == 100 && after == 'together after' && before == 'apart before' && during == 'apart during')) {
 
 ctx.clearRect(0,0,cw,ch);

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

after = 'apart after'
color='neutral'
console.log(after) /////////////////END OF SINGLES///////////////////////
}  else if (line.x0 == 250 && line.y0 == 100 && during == 'apart during' && before == 'together before' && after == 'apart after' && color == 'black') {

ctx.clearRect(0,0,cw,ch);
lines[7].x0=403
lines[7].x1=403

drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'transparent',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',5,2)

during = 'together during'
color = 'black'


} else if (line.x0==400 && line.y0==100 && during =='together during' && before == 'together before' && after == 'apart after' && color == 'black') {

ctx.clearRect(0,0,cw,ch);
lines[7].x0=403
lines[7].x1=403


drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);
drawLine(lines[14], 'transparent',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',5,2)


after = 'together after'
color = 'black'
} /* else if ( before == 'together before' && during == 'together during' && after =='together after') {

ctx.clearRect(0,0,cw,ch);
drawLine(lines[0], 'black');
drawLine(lines[1], 'orange');
drawLine(lines[2], 'black');
drawLine(lines[3], 'orange');
drawLine(lines[4], 'black');
drawLine(lines[5], 'orange');
drawLine(lines[6], 'transparent');
drawLine(lines[7], 'transparent');
drawLine(lines[8], 'transparent');
drawLine(lines[9], 'transparent');
drawLine(lines[10], 'transparent');
drawLine(lines[11], 'transparent');
drawLine(lines[12], 'transparent');
drawLine(lines[13], 'transparent');
before = 'apart before'
during = 'apart during'
after = 'apart after'
color = 'neutral'

} */else if ( before == 'together before' && during == 'apart during' && after =='apart after' && color == 'black' && line.x0==400 && line.y0==100) {

ctx.clearRect(0,0,cw,ch);
lines[7].x0=397
lines[7].x1=397
drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'transparent',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',5,2)

after = 'together after'
color = 'black'

} else if (line.x0==250 && line.y0==100 && during =='apart during' && before == 'together before' && after == 'together after' && color == 'black') {

ctx.clearRect(0,0,cw,ch);



drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'transparent',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',5,2)

during = 'together during'
color = 'black'
} else if (line.x0 == 100 && line.y0 == 100 && during =='together during' && before == 'apart before' && after == 'apart after' && color == 'black') {
  console.log('yess')
ctx.clearRect(0,0,cw,ch);
lines[7].x0=403
lines[7].x1=403


drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'transparent',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',5,2)


before = 'together before'
color = 'black'
} else if (line.x0 == 400 && line.y0 == 100 && during =='together during' && before == 'apart before' && after == 'apart after' && color == 'black') {
  
ctx.clearRect(0,0,cw,ch);
lines[7].x0=397
lines[7].x1=397

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)


after = 'together after'
color = 'black'



} else if (line.x0 == 100 && line.y0 == 100 && during =='together during' && before == 'apart before' && after == 'together after' && color == 'black') {
  
ctx.clearRect(0,0,cw,ch);

drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'transparent',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',5,2)
before = 'together before'
color = 'black'

} else if (line.x0 == 250 && line.y0 == 100 && during =='apart during' && before == 'apart before' && after == 'together after' && color == 'black') {
  lines[6].x0=247
ctx.clearRect(0,0,cw,ch);
drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

during = 'together during'
color = 'black'

} else if (line.x0 == 100 && line.y0 == 100 && during =='apart during' && before == 'apart before' && after == 'together after' && color == 'black') {
  
ctx.clearRect(0,0,cw,ch);
lines[6].x0=253
lines[6].x1=253
drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'transparent',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',5,2)

before = 'together before'
color = 'black'
} //////////////////////////////end of statements for black lines////////////////////////////// 


else if (line.x0 == 250 && line.y0 == 200 && during == 'apart during' && before == 'together before' && after == 'apart after' && color == 'orange') {

ctx.clearRect(0,0,cw,ch);
lines[7].x0=403
lines[7].x1=403

drawLine(lines[1], 'transparent',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[12], 'transparent',0,6);

drawLine(lines[0], 'black');
drawLine(lines[2], 'black');
drawLine(lines[4], 'black');
drawLine(lines[9], 'transparent');
drawLine(lines[11], 'transparent');
drawLine(lines[13], 'transparent');

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2)

during = 'together during'
color = 'orange'

//done
} else if (line.x0==400 && line.y0==200 && during =='together during' && before == 'together before' && after == 'apart after' && color == 'orange') {

ctx.clearRect(0,0,cw,ch);
lines[7].x0=403
lines[7].x1=403


drawLine(lines[1], 'transparent',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[12], 'orange',0,6);

drawLine(lines[0], 'black',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2)

after = 'together after'
color = 'orange'
//done
}  else if ( before == 'together before' && during == 'apart during' && after =='apart after' && color == 'orange' && line.x0==400 && line.y0==200) {

ctx.clearRect(0,0,cw,ch);
lines[7].x0=397
lines[7].x1=397
drawLine(lines[1], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[12], 'orange',0,6);

drawLine(lines[0], 'black',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2) 

after = 'together after'
color = 'orange'
//done
} else if (line.x0==250 && line.y0==200 && during =='apart during' && before == 'together before' && after == 'together after' && color == 'orange') {

ctx.clearRect(0,0,cw,ch);
drawLine(lines[1], 'transparent',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[12], 'orange',0,6);

drawLine(lines[0], 'black',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2) 

during = 'together during'
color = 'orange'
//done
} else if (line.x0 == 100 && line.y0 == 200 && during =='together during' && before == 'apart before' && after == 'apart after' && color == 'orange') {
 
ctx.clearRect(0,0,cw,ch);
lines[7].x0=403
lines[7].x1=403


drawLine(lines[1], 'transparent',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[12], 'transparent',0,6);

drawLine(lines[0], 'black',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2) 

before = 'together before'
color = 'orange'
//done
} else if (line.x0 == 400 && line.y0 == 200 && during =='together during' && before == 'apart before' && after == 'apart after' && color == 'orange') {
  
ctx.clearRect(0,0,cw,ch);
lines[7].x0=397
lines[7].x1=397

drawLine(lines[1], 'orange',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[12], 'orange',0,6);

drawLine(lines[0], 'black',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2) 


after = 'together after'
color = 'orange'

//done

} else if (line.x0 == 100 && line.y0 == 200 && during =='together during' && before == 'apart before' && after == 'together after' && color == 'orange') {
  
ctx.clearRect(0,0,cw,ch);

drawLine(lines[1], 'transparent',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[12], 'orange',0,6);

drawLine(lines[0], 'black',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2) 

before = 'together before'
color = 'orange'
//done
} else if (line.x0 == 250 && line.y0 == 200 && during =='apart during' && before == 'apart before' && after == 'together after' && color == 'orange') {
lines[7].x0=397
lines[7].x1=397
ctx.clearRect(0,0,cw,ch);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[12], 'orange',0,6);

drawLine(lines[0], 'black',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2) 

during = 'together during'
color = 'orange'

} else if (line.x0 == 100 && line.y0 == 200 && during =='apart during' && before == 'apart before' && after == 'together after' && color == 'orange') {
  
ctx.clearRect(0,0,cw,ch);
lines[6].x0=253
lines[6].x1=253
drawLine(lines[1], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[12], 'orange');

drawLine(lines[0], 'black',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);


drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2)

before = 'together before'
color = 'orange'


} else if (line.x0==100 && line.y0==200 && during =='together during' && before == 'together before' && after == 'apart after' && color == 'black') {
 ctx.clearRect(0,0,cw,ch);

lines[6].x0=247
lines[6].x1=247
lines[7].x0=403
lines[7].x1=403

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)


before = 'apart before'
color = 'black'


} else if (line.x0==250 && line.y0==200 && during =='together during' && before == 'together before' && after == 'apart after' && color == 'black') {
 ctx.clearRect(0,0,cw,ch);
  
lines[6].x0=253
lines[6].x1=253

drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'transparent',0,6)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',0,6)
during = 'apart during'
color = 'black'
} else if (line.x0==250 && line.y0==200 && during == 'together during' && before == 'apart before' && after == 'together after' && color =='black') {

 ctx.clearRect(0,0,cw,ch);


lines[7].x0=397
lines[7].x1=397

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

during = 'apart during'
color = 'black'


} else if (line.x0==400 && line.y0==200 && during == 'together during' && before == 'apart before' && after == 'together after' && color =='black') {
 ctx.clearRect(0,0,cw,ch);

lines[6].x0=247
lines[6].x1=247
lines[7].x0=403
lines[7].x1=403

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'transparent',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'black',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)
after = 'apart after'
color = 'black'
} else if (line.x0==100 && line.y0==200 && before =='together before' && during == 'apart during' && after == 'together after' && color =='black') {
ctx.clearRect(0,0,cw,ch);

lines[7].x0=397
lines[7].x1=397

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'transparent',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'black',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'black',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

before ='apart before'
color = 'black'
} else if (line.x0==400 && line.y0==200 && before =='together before' && during == 'apart during' && after == 'together after' && color =='black') {
  ctx.clearRect(0,0,cw,ch);
lines[6].x0=253
lines[6].x1=253
drawLine(lines[0], 'transparent',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'black',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'black',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);
drawLine(lines[14], 'transparent',0,6)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'gray',5,2)
drawLine(lines[17],'transparent',0,6)
after ='apart after'
color = 'black'
    } else if (line.x0==100 && line.y0==100 && before == 'together before' && during == 'together during' && after =='apart after' && color =='orange'){
ctx.clearRect(0,0,cw,ch);

lines[6].x0=247
lines[6].x1=247
lines[7].x0=403
lines[7].x1=403

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

before = 'apart before'
color = 'orange'

    }else if (line.x0==250 && line.y0==100 && before == 'together before' && during == 'together during' && after =='apart after' && color =='orange'){
ctx.clearRect(0,0,cw,ch);
 lines[6].x0=253
lines[6].x1=253

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'transparent',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2)

during = 'apart during'
color = 'orange'

    } else if (line.x0==250 && line.y0==100 && before == 'apart before' && during == 'together during' && after =='together after' && color =='orange') {

ctx.clearRect(0,0,cw,ch);
lines[7].x0=397
lines[7].x1=397

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'orange',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

during = 'apart during'
color = 'orange'


    }else if (line.x0==400 && line.y0==100 && before == 'apart before' && during == 'together during' && after =='together after' && color =='orange') {


ctx.clearRect(0,0,cw,ch);

lines[6].x0=247
lines[6].x1=247
lines[7].x0=403
lines[7].x1=403

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'transparent',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'orange',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

after = 'apart after'
color = 'orange'

    } else if (line.x0==100 && line.y0==100 && before == 'together before' && during == 'apart during' && after =='together after' && color =='orange'){

ctx.clearRect(0,0,cw,ch);
lines[7].x0=397
lines[7].x1=397

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'transparent',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'orange',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'orange',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2)

before = 'apart before'
color = 'orange'



    }else if (line.x0==400 && line.y0==100 && before == 'together before' && during == 'apart during' && after =='together after' && color =='orange') {

ctx.clearRect(0,0,cw,ch);
 lines[6].x0=253
lines[6].x1=253

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'transparent',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'orange',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'orange',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);

drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'transparent',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'gray',5,2)

after = 'apart after'
color = 'orange'
    }

}

var finishWrapper = document.createElement('div');
finishWrapper.setAttribute('style','text-align:center')
display_element.appendChild(finishWrapper);



var button2 = document.createElement('button');
button2.setAttribute('type','button');
button2.setAttribute('style','background: #3498db;background-image: -webkit-linear-gradient(top, #3498db, #2980b9);background-image: -moz-linear-gradient(top, #3498db, #2980b9);background-image: -ms-linear-gradient(top, #3498db, #2980b9);background-image: -o-linear-gradient(top, #3498db, #2980b9);background-image: linear-gradient(to bottom, #3498db, #2980b9);-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #ffffff;font-size: 20px;padding: 10px 20px 10px 20px;text-decoration: none; float:left;')

finishWrapper.appendChild(button2);
button2.innerHTML="Reset";
button2.addEventListener('click', () => {
ctx.clearRect(0,0,cw,ch);

drawLine(lines[0], 'black',0,6);
drawLine(lines[1], 'orange',0,6);
drawLine(lines[2], 'black',0,6);
drawLine(lines[3], 'orange',0,6);
drawLine(lines[4], 'black',0,6);
drawLine(lines[5], 'orange',0,6);
drawLine(lines[6], 'transparent',0,6);
drawLine(lines[7], 'transparent',0,6);
drawLine(lines[8], 'transparent',0,6);
drawLine(lines[9], 'transparent',0,6);
drawLine(lines[10], 'transparent',0,6);
drawLine(lines[11], 'transparent',0,6);
drawLine(lines[12], 'transparent',0,6);
drawLine(lines[13], 'transparent',0,6);
drawLine(lines[14], 'gray',5,2)
drawLine(lines[15],'gray',5,2)
drawLine(lines[16],'transparent',5,2)
drawLine(lines[17],'transparent',5,2) 
before = 'apart before'
during = 'apart during'
after = 'apart after'
color = 'neutral'
});


var button = document.createElement('button');
button.setAttribute('type','button');
button.setAttribute('style','background: #3498db;background-image: -webkit-linear-gradient(top, #3498db, #2980b9);background-image: -moz-linear-gradient(top, #3498db, #2980b9);background-image: -ms-linear-gradient(top, #3498db, #2980b9);background-image: -o-linear-gradient(top, #3498db, #2980b9);background-image: linear-gradient(to bottom, #3498db, #2980b9);-webkit-border-radius: 28;-moz-border-radius: 28;border-radius: 28px;font-family: Arial;color: #ffffff;font-size: 20px;padding: 10px 20px 10px 20px;text-decoration: none; float:right;')
finishWrapper.appendChild(button);
button.innerHTML="Finish";
button.addEventListener('click', () => {
  var endTime = (new Date()).getTime();
  var together =[];
  if (before % 2 == 1 ) {together.push ("before")}
  if (during % 2 == 1) {together.push("during")}
  if (after % 2 ==1) {together.push("after")}
  if (together.length==0) {together.push("never")}
  if (together.length==3) {together =[]; together.push("always")}
  
  var response_time = endTime - startTime;
  
  display_element.innerHTML = '',
  jsPsych.finishTrial({
    "preamble": trial.preamble,
    "question": trial.question,
    "rt": response_time,
    "before": before,
    "during": during,
    "after": after



  })});


var startTime = (new Date()).getTime(); 

}
return plugin;
}

jsPsych.plugins['reciprocal'] = definePlugin() ;
