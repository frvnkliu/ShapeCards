//cards library
function clearCanvas(ctx){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawShapePreview(shape, ctx){
    clearCanvas(ctx);
    ctx.fillStyle = `rgb(${shape.color.r}, ${shape.color.g}, ${shape.color.b}, 0.9)`;
    //Determine which shape to draw
    const size = shape.size??20;
    ctx.strokeStyle = `rgb(${(100+shape.color.r)%256}, ${(100+shape.color.g)%256}, ${(100+shape.color.b)%256})`;
    ctx.setLineDash([Math.min(Math.ceil(size/10), 15), Math.min(Math.floor(size/10), 15)]);
    
    shape.pos.x= +shape.pos.x;
    shape.pos.y= +shape.pos.y;
    ctx.beginPath();
    switch(shape.type){
        case 'Square':
            ctx.rect(shape.pos.x-size/2, shape.pos.y-size/2, size, size);
            break;
        case 'Circle':
            ctx.arc(shape.pos.x, shape.pos.y, size/2, 0, 2 * Math.PI);
            break;
        case 'Triangle':
            const h = size*Math.sqrt(3)/2;
            ctx.moveTo(shape.pos.x-size/2, shape.pos.y+h/3);
            ctx.lineTo(shape.pos.x + size/2, shape.pos.y+h/3);
            ctx.lineTo(shape.pos.x, shape.pos.y-2*h/3);
            ctx.lineTo(shape.pos.x-size/2, shape.pos.y+h/3);
            break;
        case 'Diamond':
            ctx.moveTo(shape.pos.x-size/2, shape.pos.y);
            ctx.lineTo(shape.pos.x, shape.pos.y+size/2);
            ctx.lineTo(shape.pos.x+size/2, shape.pos.y);
            ctx.lineTo(shape.pos.x, shape.pos.y-size/2);
            ctx.lineTo(shape.pos.x-size/2, shape.pos.y);
    }
    ctx.fill();
    ctx.stroke();
}


//function to drawShape
function drawShape(shape, ctx){
    ctx.fillStyle = `rgb(${shape.color.r}, ${shape.color.g}, ${shape.color.b})`;
    //Determine which shape to draw
    shape.pos.x= +shape.pos.x;3
    shape.pos.y= +shape.pos.y;
    const size = shape.size??20;
    ctx.beginPath();
    switch(shape.type){
        case 'Square':
            ctx.rect(shape.pos.x-size/2, shape.pos.y-size/2, size, size);
            break;
        case 'Circle':
            ctx.arc(shape.pos.x, shape.pos.y, size/2, 0, 2 * Math.PI);
            break;
        case 'Triangle':
            const h = size*Math.sqrt(3)/2;
            ctx.moveTo(shape.pos.x-size/2, shape.pos.y+h/3);
            ctx.lineTo(shape.pos.x + size/2, shape.pos.y+h/3);
            ctx.lineTo(shape.pos.x, shape.pos.y-2*h/3);
            ctx.lineTo(shape.pos.x-size/2, shape.pos.y+h/3);
            break;
        case 'Diamond':
            ctx.moveTo(shape.pos.x-size/2, shape.pos.y);
            ctx.lineTo(shape.pos.x, shape.pos.y+size/2);
            ctx.lineTo(shape.pos.x+size/2, shape.pos.y);
            ctx.lineTo(shape.pos.x, shape.pos.y-size/2);
            ctx.lineTo(shape.pos.x-size/2, shape.pos.y);
    }
    ctx.fill();
}

//Card is the object returned by the database, canvas is the html element
function render(cardInfo, canvas){
    const ctx = canvas.getContext("2d");
    const bg = cardInfo.backgroundcolor;
    ctx.fillStyle = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cardInfo.shapes.forEach(shape => drawShape(shape,ctx));
}