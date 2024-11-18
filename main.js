//-------------CLASSES----------------
class GlobuleRouge {
   
    constructor(x, y, velX, velY) {

        this.posX = x;
        this.posY = y;
        this.velX = velX;
        this.velY = velY;
        this.color = "#FF8E8E";
        this.border = "#FF495F";
        this.size = random(30,45);
    }

    afficher() {

        strokeWeight(1);
        stroke(this.border);
        fill(this.color);
        circle(this.posX, this.posY, this.size)
    } 

    comportement() {

        this.posX += this.velX;
        this.posY += this.velY;

        this.posX = (this.posX > WIDTH) ? 0 : this.posX;
        this.posY = (this.posY > HEIGHT) ? 0 : this.posY;
    }
}
//-------------PROGRAMM PRINCIPALE-------------------
const WIDTH = 700;
const HEIGHT = 700;
const NB_BR = 80;

let mask;
let globules_rouges = [];

function setup() {

    createCanvas(WIDTH, HEIGHT);
    setMask();

    //INITIALISATION

    for(var i = 0; i < NB_BR; i++) {

        globules_rouges.push(
            new GlobuleRouge(
                random(1, WIDTH),
                random(1, HEIGHT),
                random(1, 5),
                random(1, 5)
            )
        );
    }

    //FIN DE L'INITIALISATION
}

function draw() {

        drawBg();

        //AFFICHAGE
        for(var i = 0; i < NB_BR; i++) {

            globules_rouges[i].afficher();
            globules_rouges[i].comportement();
        }

        //FIN DE L'AFFICHAGE

        image(mask, 0, 0);

}

//---------------FONCTION OUTILS---------------

function drawBg() {

    stroke("black");
    fill("#A2E9FF");
    circle(WIDTH/2, HEIGHT/2, 680)
}

function setMask() {

    mask = createGraphics(WIDTH, HEIGHT);
    mask.background("black");
    mask.noStroke();
    mask.erase();
    mask.circle(WIDTH/2, HEIGHT/2, 680)
    mask.noErase();
}