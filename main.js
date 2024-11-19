//-------------CLASSES----------------
class Organisme {

    constructor(x, y, velX, velY, color, colorBorder, size) {

        this.posX = x;
        this.posY = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.border = colorBorder;
        this.size = size;
    }

    afficher() {

        strokeWeight(1);
        stroke(this.border);
        fill(this.color);
        circle(this.posX, this.posY, this.size)
    } 

    getPos() {

        return {"x": this.posX, "y": this.posY};
    }

}

class GlobuleRouge  extends Organisme {
   
    constructor(x, y, velX, velY) {

        super(x, y, velX, velY, "#FF8E8E", "#FF495F", random(27, 38));

        this.tracked = false;
        this.pv = random(200, 350);
    }

    afficher() {

        super.afficher();
    } 

    comportement() {

        this.posX += this.velX;
        this.posY += this.velY;

        this.posX = (this.posX > WIDTH) ? 0 : this.posX;
        this.posY = (this.posY > HEIGHT) ? 0 : this.posY;

        this.subitDommage();
    }

    getPos() {

        return super.getPos();
    }

    isTracked() {

        return this.tracked;
    }

    setTracked() {

        this.tracked = true;
        print("Globule rouge: je suis tracké !!!");
    }

    isAttacked() {

        return this.attacked;
    }

    setAttack() {

        this.attacked = true;
        print("Globule rouge: je suis attaqué !!!");
    }

    subitDommage() {

        if( this.isAttacked()) {

            this.pv --;
            this.color = color(255, 142, 142, map(this.pv, 0, 350, 0, 255));
            this.border = color(255, 73, 95, map(this.pv, 0, 350, 0, 255));
        }
    }

    getPv() {

        return this.pv;
    }
}

class Virus extends Organisme {
   
    constructor(x, y, velX, velY) {

        super(x, y, velX, velY, "#67af66", "#216b20", random(15, 25));

        this.cible = null;
        this.isTracking = false;
    }

    afficher() {

        super.afficher();
    } 

    getPos() {

        return super.getPos();
    }

    comportement() {

        // 1 - cibler un globule rouge
        if(this.cible == null) {

            var cible = getNextGlobuleSain();

            if (cible != null) {
                this.cible = cible;
                print(" Virus : j'ai détecté ma cible");
            }
        } else {

            //2 - suivre sa cible
            this.suivreCible(this.cible);
        }
    }

    suivreCible(cible) {
       // Calcul de la distance à la cible
    let distance = dist(this.posX, this.posY, cible.getPos().x, cible.getPos().y);

    // Si la distance est supérieure au seuil, continuer à suivre
    if (distance >= 6 && !this.isTracking) {
        // Calcul de la vitesse relative
        let cibleVitesse = Math.sqrt(cible.velX ** 2 + cible.velY ** 2);
        let d = cibleVitesse + 1;

        // Création du vecteur direction
        let m = createVector(cible.getPos().x - this.posX, cible.getPos().y - this.posY);
        m.normalize();

        // Mise à jour de la position sans dépasser la cible
        this.posX += m.x * Math.min(d, distance);
        this.posY += m.y * Math.min(d, distance);
     } else {

            this.isTracking = true;
            cible.setAttack();
            this.posX = cible.getPos().x;
            this.posY = cible.getPos().y;

            if (cible.getPv() <= 0) {

                this.isTracking = false;
                this.cible = null;
            }
        }
    }
}
//-------------PROGRAMM PRINCIPALE-------------------
const WIDTH = 700;
const HEIGHT = 700;
const NB_BR = 80;

let injected = false;
let mask;
let globules_rouges = [];
let virus = [];

function setup() {

    createCanvas(WIDTH, HEIGHT);
    setMask();

    //INITIALISATION

    for(var i = 0; i < NB_BR; i++) {

        globules_rouges.push(
            new GlobuleRouge(
                random(1, WIDTH),
                random(1, HEIGHT),
                random(1, 6),
                random(1, 6)
            )
        );
    }

     
    virus.push(
        new Virus (
       
            WIDTH/2,
            HEIGHT/2,
            0,
            0
        )
    ); 
    
    

    //FIN DE L'INITIALISATION
}

function draw() {

        drawBg();

        //AFFICHAGE
        for(var i = 0; i < globules_rouges.length; i++) {

            globules_rouges[i].afficher();
            globules_rouges[i].comportement();

            if (globules_rouges[i].getPv() <= 0) {

                let pos = globules_rouges[i].getPos();
                globules_rouges.splice(i, 1);

                virus.push(
                    new Virus (
                   
                        pos.x,
                        pos.y,
                        0,
                        0
                    )
                );
            }
        }
    
        
        for (var j = 0; j < virus.length; j++) {

            virus[j].afficher();
            virus[j].comportement();
        }

        //FIN DE L'AFFICHAGE

        image(mask, 0, 0);

}

//---------------FONCTION OUTILS---------------

/*
function keyPressed() {
//function qui fait une action quand on a appuis sur une touche du clavier

    if(key == ' ' && !injected) {

        injected = true;

        virus.push(
            new Virus (
           
                WIDTH/2,
                HEIGHT/2,
                0,
                0
            )
        ); 
    }
}

*/


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

function getNextGlobuleSain() {

    for(var i = 0; i < globules_rouges.length; i++) {

        if (!globules_rouges[i].isTracked()) {

            globules_rouges[i].setTracked();
            return globules_rouges[i];
        }
    }

    return null;
}