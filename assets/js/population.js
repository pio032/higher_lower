
async function paese() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    data.sort((a, b) => a.area - b.area);
    const rand = Math.floor(Math.random() * (data.length - 100)); // -100 per sicurezza con difficoltà alta
    let other = 0;
    if(localStorage.getItem('dif')==1){
         other = rand + 90;
    }else if(localStorage.getItem('dif')==2){
         other = rand + 30;
    }else{
         other = rand + 10;
    }
    nuSX = rand;
    nuDx = other;
    return [ [data[rand]], [data[other]] ]; 
}
//---------------------------------------------------------GLOBALI-------------------------------------------------------------------------
let nuSX=0;
let nuDx=0;
let sx = [];
let dx = [];
//---------------------------------------------------------GENERAZIONE-INIZIALE------------------------------------------------------------------


(async () => {
    const [sxResult, dxResult] = await paese();
    // Corretto: sxResult[0] e dxResult[0]
    console.log(sxResult[0].ccn3+" "+dxResult[0].ccn3)
    sx = sxResult;
    dx = dxResult;
    document.getElementById('imgSx').src = "https://countryflagsapi.netlify.app/flag/" + sx[0].cca2 + ".svg";
    document.getElementById('imgDx').src = "https://countryflagsapi.netlify.app/flag/" + dx[0].cca2 + ".svg";
    document.getElementById('titleSx').innerText =sx[0].name.common;
    document.getElementById('titleDx').innerText =dx[0].name.common;
})();

//---------------------------------------------------GENERA-SX-DX-----------------------------------------------------------------------

let isTransitioning = false;

async function generaSX(){
    try{
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        data.sort((a, b) => a.area - b.area);
        let maxDiff = 10;
        if(localStorage.getItem('dif')==1){
            maxDiff = 80;
        } else if(localStorage.getItem('dif')==2){
            maxDiff = 30;
        }
        let other;
        do {
            other = nuDx + Math.floor(Math.random() * maxDiff) + 1;
        } while (other >= data.length || other === nuDx);
        sx = [data[other]];
        nuSX = other;
        document.getElementById('imgSx').src = "https://countryflagsapi.netlify.app/flag/" + sx[0].cca2 + ".svg";
        document.getElementById('titleSx').innerText = sx[0].name.common;
    }catch(error){
        console.log("errore", error)
    }
       
}

async function generaDX(){
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        data.sort((a, b) => a.area - b.area);
        let maxDiff = 10;
        if(localStorage.getItem('dif')==1){
            maxDiff = 80;
        } else if(localStorage.getItem('dif')==2){
            maxDiff = 30;
        }
        let other;
        do {
            other = nuSX + Math.floor(Math.random() * maxDiff) + 1;
        } while (other >= data.length || other === nuSX);
        dx = [data[other]];
        nuDx = other;
        document.getElementById('imgDx').src = "https://countryflagsapi.netlify.app/flag/" + dx[0].cca2 + ".svg";
        document.getElementById('titleDx').innerText = dx[0].name.common;
    } catch (error) {
        console.error("Errore durante la generazione DX:", error);
    }
}



function verifica(){
    if(sx[0].population>=dx[0].population){
      return true;
    }else{
      return false;
    }
}
function leggibile(population){
    return population.toLocaleString('it-IT');
}

//---------------------------------------INIZIALIZZA-CSS-------------------------------------------------------------------------------------
function init(dx){
    document.getElementById('dx').style.pointerEvents = 'auto';
    document.getElementById('sx').style.pointerEvents = 'auto';
     document.getElementById('sx').classList.remove('bordo-verde', 'bordo-rosso', 'bordo-default');
    document.getElementById('dx').classList.remove('bordo-verde', 'bordo-rosso', 'bordo-default');
    document.getElementById('sx').classList.add('bordo-default');
    document.getElementById('dx').classList.add('bordo-default')
    document.getElementById('feedback').classList.remove('success', 'error');
    document.getElementById('risp').className = '';
    document.getElementById('risp').innerText = "...";
    if(dx){
    document.getElementById('valSx').innerText = "";
    }else{
    document.getElementById('valDx').innerText = "";
    } 
}

//-----------------------------------------------------ANIMAZIONE-NUMERI------------------------------------------------------------------------

function animaNumero(element, target, durata = 1000) {
    const end = Number(target);
    const start = end/2;
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


//----------------------------------GLOBAL----------------------------------------------------------------------------------------------------
 const win = localStorage.getItem('win');
 let score = 0;
 let wSx = 0;
 let wDx = 0;

//--------------------------INIZIALIZZAZIONE-------------------------------------------------------------------------------------------------
    document.getElementById('errore').style.display='none'
    document.getElementById('score').innerText=score;
    document.getElementById('sx').classList.add('bordo-default');
    document.getElementById('dx').classList.add('bordo-default')
    document.getElementById('risp').innerText="...";

//----------------------------------------------------------------------------------------------------------------------------------------------

    
   document.getElementById('sx').addEventListener("click", function(){
    if (isTransitioning) return; // BLOCCA SE IN TRANSIZIONE
    isTransitioning = true;
    document.getElementById('sx').style.pointerEvents = 'none';
    document.getElementById('risp').innerText="";
    if(wSx==0){
        animaNumero(document.getElementById('valSx'), sx[0].population);
    }
    if(wDx==0){
        animaNumero(document.getElementById('valDx'), dx[0].population);
    }

    if(verifica()){
        wSx++;
        score++;
        document.getElementById('feedback').classList.add('success')
        document.getElementById('risp').classList.add('fas', 'fa-check-circle');
        document.getElementById('sx').classList.add('bordo-verde')
        document.getElementById('dx').classList.add('bordo-rosso');
        document.getElementById('score').innerText=score;
        if(wSx>1){
            setTimeout(() => {
                generaSX();
                init(true);
                wSx=0;
                isTransitioning = false;
            }, 2000);
        } else {
            wDx=0;
            setTimeout(() => {
                generaDX();
                init(false);
                isTransitioning = false;
            }, 2000);
        }
    }else{
        document.getElementById('feedback').classList.add('error')
        document.getElementById('risp').classList.add('fas', 'fa-times-circle');
        document.getElementById('sx').classList.add('bordo-rosso');
        document.getElementById('dx').classList.add('bordo-verde')
        perdita();
        isTransitioning = false;
    }
})

document.getElementById('dx').addEventListener("click", function(){
      if (isTransitioning) return; // BLOCCA SE IN TRANSIZIONE
    isTransitioning = true;
    document.getElementById('dx').style.pointerEvents = 'none';
    document.getElementById('risp').innerText="";
    if(wDx==0){
        animaNumero(document.getElementById('valDx'), dx[0].population);
    }
    if(wSx==0){
        animaNumero(document.getElementById('valSx'), sx[0].population);
    }

    if(!verifica()){
        wDx++;
        score++;
        document.getElementById('feedback').classList.add('success')
        document.getElementById('risp').classList.add('fas', 'fa-check-circle');
        document.getElementById('dx').classList.add('bordo-verde')
        document.getElementById('sx').classList.add('bordo-rosso');
        document.getElementById('score').innerText=score;
        if(wDx>1){
            setTimeout(() => {
                generaDX();
                init(false);
                wDx=0;
                isTransitioning = false;
            }, 2000);
        } else {
            wSx=0;
            setTimeout(() => {
                generaSX();
                init(true);
                isTransitioning = false;
            }, 2000);
        }
    }else{
        document.getElementById('feedback').classList.add('error')
        document.getElementById('risp').classList.add('fas', 'fa-times-circle');
        document.getElementById('sx').classList.add('bordo-verde')
        document.getElementById('dx').classList.add('bordo-rosso');
        perdita();
        isTransitioning = false;
    }
})

document.getElementById('sx').classList.remove('bordo-verde');
document.getElementById('dx').classList.remove('bordo-verde');
document.getElementById('sx').classList.remove('bordo-rosso');
document.getElementById('dx').classList.remove('bordo-rosso');

//----------------------------------------PERSO--------------------------------------------------------------------------------

function perdita(){
     document.getElementById('errore').style.display='block'
     document.getElementById('attuale').innerText="Hai totalizzato: "+score
     if(win && win>score){
        document.getElementById('local').innerText="Il tuo record è: "+win
     }else{
        localStorage.setItem('win', score)
        document.getElementById('local').innerText="Il tuo record è: "+ localStorage.getItem('win')
     }
}



//------------------------------------TORNA-ALLA-HOME--------------------------------------------------------------------------
document.getElementById('home').addEventListener("click", function(){
    window.location.href = "/index.html"
})
