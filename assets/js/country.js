//---------------------------------------------------------CODICE-PAESI-RANDOM-------------------------------------------------------------------
async function paese() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    data.sort((a, b) => a.area - b.area);
    const rand = Math.floor(Math.random() * (data.length - 10));
    let other = 0;
    if(localStorage.getItem('dif')==1){
         other = rand + 90;
    }else if(localStorage.getItem('dif')==2){
         other = rand + 30;
    }else{
         other = rand + 10;
    }
    
    return [ [data[rand]], [data[other]] ]; 
}


//------------------------------------------------------SX_DX_GLOBAL-----------------------------------------------------------------------
let sx, dx;
//-----------------------------------------------------VERIFICA----------------------------------------------------------------------------

function verifica(){
    if(sx[0].area>dx[0].area){
        console.log("true")
        return true;
    }else{
        console.log("false")
        return false;
    }
}


//--------------------------------------------------DEFAULT---------------------------------------------------------------------------------
(async () => {
    try {
        
        let sxResult, dxResult;
    if(localStorage.getItem('dif')<3){
         do {
        [sxResult, dxResult] = await paese();
    } while (sxResult[0].population < 1000000 && dxResult[0].population < 1000000);
    }else{
         [sxResult, dxResult] = await paese();
    }
        sx = sxResult;
        dx = dxResult;
        console.log("sx", sx);
        console.log("maps", sx[0].maps.openStreetMaps);
        
        let lat = sx[0].latlng[0];
        let lon = sx[0].latlng[1];
        let delta = 4; 
        let bbox = `${lon-delta},${lat-delta},${lon+delta},${lat+delta}`;
        document.getElementById('imgSx').src =
            `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
        
        let latD = dx[0].latlng[0];
        let lonD = dx[0].latlng[1];
        let deltaD = 12; 
        let bboxD = `${lonD-deltaD},${latD-deltaD},${lonD+deltaD},${latD+deltaD}`;
        document.getElementById('imgDx').src =
            `https://www.openstreetmap.org/export/embed.html?bbox=${bboxD}&layer=mapnik&marker=${latD},${lonD}`;
        
        document.getElementById('titleSx').innerText = sx[0].name.common;
        document.getElementById('titleDx').innerText = dx[0].name.common;
    } catch (error) {
        console.error("Errore durante l'inizializzazione:", error);
        // Gestire l'errore mostrando un messaggio all'utente
        document.getElementById('errore').style.display = 'block';
        document.getElementById('attuale').innerText = "Errore di caricamento. Ricarica la pagina.";
    }
})();

//---------------------------------------------------------GENERA---------------------------------------------------------------------------
async function generaSX() {
     try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        data.sort((a, b) => a.area - b.area);

        // Trova l'indice attuale di dx
        const dxIndex = data.findIndex(c => c.cca3 === dx[0].cca3);

        // Imposta il salto in base alla difficoltà
        let saltoMin = 1, saltoMax = 10;
        const dif = localStorage.getItem('dif');
        if (dif == 1) { saltoMin = 60; saltoMax = 100; }
        else if (dif == 2) { saltoMin = 20; saltoMax = 40; }

        let newIndex;
        do {
            const salto = Math.floor(Math.random() * (saltoMax - saltoMin + 1)) + saltoMin;
            newIndex = dxIndex + (Math.random() < 0.5 ? -salto : salto);
        } while (
            newIndex < 0 ||
            newIndex >= data.length ||
            newIndex === dxIndex
        );

        sx = [data[newIndex]];

        let lat = sx[0].latlng[0];
        let lon = sx[0].latlng[1];
        let delta = 4; 
        let bbox = `${lon-delta},${lat-delta},${lon+delta},${lat+delta}`;
        document.getElementById('imgSx').src =
            `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
        document.getElementById('titleSx').innerText = sx[0].name.common;
    } catch (error) {
        console.error("Errore durante la generazione SX:", error);
    }
}

async function generaDX() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        data.sort((a, b) => a.area - b.area);

        const sxIndex = data.findIndex(c => c.cca3 === sx[0].cca3);

        let saltoMin = 1, saltoMax = 10;
        const dif = localStorage.getItem('dif');
        if (dif == 1) { saltoMin = 60; saltoMax = 100; }
        else if (dif == 2) { saltoMin = 20; saltoMax = 40; }

        let newIndex;
        do {
            const salto = Math.floor(Math.random() * (saltoMax - saltoMin + 1)) + saltoMin;
            newIndex = sxIndex + (Math.random() < 0.5 ? -salto : salto);
        } while (
            newIndex < 0 ||
            newIndex >= data.length ||
            newIndex === sxIndex
        );

        dx = [data[newIndex]];

        let latD = dx[0].latlng[0];
        let lonD = dx[0].latlng[1];
        let deltaD = 12; 
        let bboxD = `${lonD-deltaD},${latD-deltaD},${lonD+deltaD},${latD+deltaD}`;
        document.getElementById('imgDx').src =
            `https://www.openstreetmap.org/export/embed.html?bbox=${bboxD}&layer=mapnik&marker=${latD},${lonD}`;
        document.getElementById('titleDx').innerText = dx[0].name.common;
    } catch (error) {
        console.error("Errore durante la generazione DX:", error);
    }
}

//----------------------------------------------------GLOBAL-------------------------------------------------------------------------------
const win = localStorage.getItem('winC');
let score = 0;
let wSx = 0;
let wDx = 0;

//----------------------------------------------------INIZIALIZZAZIONE---------------------------------------------------------------------
document.getElementById('errore').style.display = 'none';
document.getElementById('score').innerText = score;
document.getElementById('sx').classList.add('bordo-default');
document.getElementById('dx').classList.add('bordo-default');
document.getElementById('risp').innerText = "...";

//---------------------------------------------------CLICK-DX-SX-----------------------------------------------------------------------------
let isTransitioning = false;


document.getElementById('dx').addEventListener("click", function() {
    if (isTransitioning) return; // BLOCCA SE IN TRANSIZIONE
    isTransitioning = true;
    document.getElementById('dx').style.pointerEvents = 'none';
    document.getElementById('risp').innerText = "";
    
    if (wDx == 0) {
        animaNumero(document.getElementById('valDx'), dx[0].area);
    }
    if (wSx == 0) {
        animaNumero(document.getElementById('valSx'), sx[0].area);
    }
   
    if (!verifica()) {
        wDx++;
        score++;
        document.getElementById('feedback').classList.add('success');
        document.getElementById('risp').classList.add('fas', 'fa-check-circle');
        document.getElementById('dx').classList.add('bordo-verde');
        document.getElementById('sx').classList.add('bordo-rosso');
        document.getElementById('score').innerText = score;
        
        if (wDx > 1) {
            setTimeout(() => {
                generaDX();
                init(false);
                wDx = 0;
                isTransitioning = false;
            }, 2000);
        } else {
            wSx = 0;
            setTimeout(() => {
                generaSX();
                init(true);
                isTransitioning = false;
            }, 2000);
        }
    } else {
        document.getElementById('feedback').classList.add('error');
        document.getElementById('risp').classList.add('fas', 'fa-times-circle');
        document.getElementById('sx').classList.add('bordo-verde');
        document.getElementById('dx').classList.add('bordo-rosso');
        perdita();
        isTransitioning = false;
    }
});

document.getElementById('sx').addEventListener("click", function() {
    if (isTransitioning) return; // BLOCCA SE IN TRANSIZIONE
    isTransitioning = true;
    document.getElementById('sx').style.pointerEvents = 'none';
    document.getElementById('risp').innerText = "";
    
    if (wSx == 0) {
        animaNumero(document.getElementById('valSx'), sx[0].area);
    }
    if (wDx == 0) {
        animaNumero(document.getElementById('valDx'), dx[0].area);
    }

    if (verifica()) {
        wSx++;
        score++;
        document.getElementById('feedback').classList.add('success');
        document.getElementById('risp').classList.add('fas', 'fa-check-circle');
        document.getElementById('sx').classList.add('bordo-verde');
        document.getElementById('dx').classList.add('bordo-rosso');
        document.getElementById('score').innerText = score;
        
        if (wSx > 1) {
            setTimeout(() => {
                generaSX();
                init(true);
                wSx = 0;
                isTransitioning = false;
            }, 2000);
        } else {
            wDx = 0;
            setTimeout(() => {
                generaDX();
                init(false);
                isTransitioning = false;
            }, 2000);
        }
    } else {
        document.getElementById('feedback').classList.add('error');
        document.getElementById('risp').classList.add('fas', 'fa-times-circle');
        document.getElementById('sx').classList.add('bordo-rosso');
        document.getElementById('dx').classList.add('bordo-verde');
        perdita();
        isTransitioning = false;
    }
});

//----------------------------------------------------------ANIMAZIONE-----------------------------------------------------------------
function animaNumero(element, target, durata = 1000) {
    const end = Number(target);
    const start = end / 2;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durata, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.innerText = value.toLocaleString('it-IT');
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.innerText = end.toLocaleString('it-IT');
        }
    }
    requestAnimationFrame(update);
}

//-----------------------------------------INIT--------------------------------------------------------------------------------
function init(dx) {
    document.getElementById('dx').style.pointerEvents = 'auto';
    document.getElementById('sx').style.pointerEvents = 'auto';
    document.getElementById('sx').classList.remove('bordo-verde', 'bordo-rosso', 'bordo-default');
    document.getElementById('dx').classList.remove('bordo-verde', 'bordo-rosso', 'bordo-default');
    document.getElementById('sx').classList.add('bordo-default');
    document.getElementById('dx').classList.add('bordo-default');
    document.getElementById('feedback').classList.remove('success', 'error');
    document.getElementById('risp').className = '';
    document.getElementById('risp').innerText = "...";
    
    if (dx) {
        document.getElementById('valSx').innerText = "";
    } else {
        document.getElementById('valDx').innerText = "";
    } 
}

//----------------------------------------PERSO--------------------------------------------------------------------------------
function perdita() {
    setTimeout(()=>{
        document.getElementById('errore').style.display = 'block';
    document.getElementById('attuale').innerText = "Hai totalizzato: " + score;
    
    if (win && parseInt(win) > score) {
        document.getElementById('local').innerText = "Il tuo record è: " + win;
    } else {
        localStorage.setItem('winC', score.toString());
        document.getElementById('local').innerText = "Il tuo record è: " + localStorage.getItem('winC');
    }

    }, 1500)
    }
//------------------------------------TORNA-ALLA-HOME--------------------------------------------------------------------------
document.getElementById('home').addEventListener("click", function() {
    window.location.href = "/index.html";
});