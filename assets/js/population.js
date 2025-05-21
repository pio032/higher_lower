
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
lastSign = 1;
//---------------------------------------------------------GENERAZIONE-INIZIALE------------------------------------------------------------------


(async () => {
    let sxResult, dxResult;
    if(localStorage.getItem('dif')<3){
         do {
        [sxResult, dxResult] = await paese();
    } while (sxResult[0].population < 1000000 && dxResult[0].population < 1000000);
    }else{
         [sxResult, dxResult] = await paese();
    }
   

    
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

        let dxIndex = nuDx;
        let saltoMin = 1, saltoMax = 10;
        const dif = localStorage.getItem('dif');
        if(dif == 1){ saltoMin = 60; saltoMax = 100; }
        else if(dif == 2){ saltoMin = 20; saltoMax = 40; }

        let salto = Math.floor(Math.random() * (saltoMax - saltoMin + 1)) + saltoMin;
       
        lastSign = -lastSign;
        salto = salto * lastSign;

        let newIndex = dxIndex + salto;
        if(newIndex < 0) newIndex = 0;
        if(newIndex >= data.length) newIndex = data.length - 1;
        if(newIndex === dxIndex) newIndex = (newIndex + 1 < data.length) ? newIndex + 1 : newIndex - 1;

        sx = [data[newIndex]];
        nuSX = newIndex;
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

        let sxIndex = nuSX;
        let saltoMin = 1, saltoMax = 10;
        const dif = localStorage.getItem('dif');
        if(dif == 1){ saltoMin = 60; saltoMax = 100; }
        else if(dif == 2){ saltoMin = 20; saltoMax = 40; }

        let salto = Math.floor(Math.random() * (saltoMax - saltoMin + 1)) + saltoMin;
        
        lastSign = -lastSign;
        salto = salto * lastSign;

        let newIndex = sxIndex + salto;
        if(newIndex < 0) newIndex = 0;
        if(newIndex >= data.length) newIndex = data.length - 1;
        if(newIndex === sxIndex) newIndex = (newIndex + 1 < data.length) ? newIndex + 1 : newIndex - 1;

        dx = [data[newIndex]];
        nuDx = newIndex;
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
     setTimeout(()=>{
        document.getElementById('errore').style.display='block'
     document.getElementById('attuale').innerText="Hai totalizzato: "+score
     if(win && win>score){
        document.getElementById('local').innerText="Il tuo record è: "+win
     }else{
        localStorage.setItem('win', score)
        document.getElementById('local').innerText="Il tuo record è: "+ localStorage.getItem('win')
     }
     }, 1500)
}



//------------------------------------TORNA-ALLA-HOME--------------------------------------------------------------------------
document.getElementById('home').addEventListener("click", function(){
    window.location.href = "/index.html"
})
