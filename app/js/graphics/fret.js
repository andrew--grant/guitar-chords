function Fret(stage) {
    this.stage = stage;
}

Fret.prototype.draw = function(pos) {
    this.rect = new createjs.Shape();
    this.rect.graphics.beginFill("#ff0000").drawRect(pos * 70, 50, 30, 40);


    var line = new createjs.Shape();
    line.graphics.setStrokeStyle(1);
    line.graphics.beginStroke("red");
    line.graphics.moveTo(5, 5);
    line.graphics.lineTo(100, 5);
    line.graphics.endStroke();
    this.stage.addChild(line);

    var line2 = new createjs.Shape();
    line2.graphics.setStrokeStyle(1);
    line2.graphics.beginStroke("red");
    line2.graphics.moveTo(5, 20);
    line2.graphics.lineTo(100, 20);
    line2.graphics.endStroke();
    this.stage.addChild(line2);




    return this.rect;
}