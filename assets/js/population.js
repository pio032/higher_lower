function paese() {
    const v = Math.floor(Math.random() * 249);
    const countryCodes = [
        4, 8, 10, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 50, 51, 52, 56, 60, 64, 68, 70, 72, 74, 76, 84, 86, 96, 100, 104, 108, 112, 116, 120, 124, 126, 132, 136, 140, 144, 148, 152, 156, 162, 166, 170, 174, 175, 178, 180, 184, 188, 191, 192, 196, 203, 204, 208, 212, 214, 218, 222, 226, 231, 232, 233, 234, 238, 239, 242, 246, 250, 254, 258, 260, 262, 266, 270, 275, 276, 288, 292, 296, 300, 304, 308, 312, 316, 320, 324, 328, 332, 334, 336, 340, 344, 348, 352, 356, 360, 364, 368, 372, 376, 380, 388, 392, 398, 400, 404, 408, 410, 414, 417, 418, 422, 426, 428, 430, 434, 438, 440, 442, 446, 450, 454, 458, 462, 466, 470, 474, 478, 480, 484, 492, 496, 498, 499, 500, 504, 508, 512, 516, 520, 524, 528, 540, 554, 558, 562, 566, 570, 574, 580, 578, 580, 583, 584, 585, 586, 591, 598, 600, 604, 608, 612, 616, 620, 624, 630, 634, 638, 642, 643, 646, 652, 654, 659, 662, 663, 666, 670, 674, 678, 682, 686, 688, 690, 694, 702, 703, 704, 705, 706, 710, 724, 732, 736, 740, 744, 748, 752, 756, 760, 762, 764, 768, 772, 776, 780, 784, 788, 792, 795, 796, 800, 804, 807, 818, 826, 831, 832, 833, 834, 835, 836, 840, 850, 854, 858, 860, 862, 876, 882, 887, 888, 891, 894, 896, 900, 901, 902, 903, 904, 905, 906, 907, 908, 910, 911, 912, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 930, 931, 932, 933, 934, 935, 936, 937, 938, 939, 940, 941, 942, 943, 944, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 970, 971, 972, 973, 974, 975, 976, 977, 978, 979, 980, 981, 982, 983, 984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 996, 997, 998, 999
    ];
    return countryCodes[v];
}

async function country() {
    const res = paese();
    try {
        const response = await fetch("https://restcountries.com/v3.1/alpha/" + res);
        const result = await response.json();
        if (!Array.isArray(result) || !result[0] || !result[0].cca2) {
            // Se non è valido, riprova
            return await country();
        }
        return result;
    } catch (error) {
        // In caso di errore di rete, riprova
        return await country();
    }
}

(async () => {
     sx = await country();
     dx = await country();
    console.log("sx", sx);
    console.log("dx", dx);
    document.getElementById('imgSx').src = "https://countryflagsapi.netlify.app/flag/" + sx[0].cca2 + ".svg";
    document.getElementById('imgDx').src = "https://countryflagsapi.netlify.app/flag/" + dx[0].cca2 + ".svg";
    document.getElementById('titleSx').innerText =sx[0].name.common;
    document.getElementById('titleDx').innerText =dx[0].name.common;


})();

async function generaSX(){
     sx = await country();
    console.log("sx", sx);
    document.getElementById('imgSx').src = "https://countryflagsapi.netlify.app/flag/" + sx[0].cca2 + ".svg";
    document.getElementById('titleSx').innerText =sx[0].name.common;
    
}
async function generaDX(){
     dx = await country();
    console.log("dx", dx);
    document.getElementById('imgDx').src = "https://countryflagsapi.netlify.app/flag/" + dx[0].cca2 + ".svg";
    document.getElementById('titleDx').innerText =dx[0].name.common;
}



function verifica(){
    if(sx[0].population>dx[0].population){
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


//----------------------------------GLOBAL----------------------------------------------------------------------------------------------------
 let score = 0;
 let wSx = 0;
 let wDx = 0;

//--------------------------INIZIALIZZAZIONE-------------------------------------------------------------------------------------------------
    document.getElementById('errore').style.display='none'
    document.getElementById('score').innerText=score;
    document.getElementById('sx').classList.add('bordo-default');
    document.getElementById('dx').classList.add('bordo-default')
    document.getElementById('risp').innerText="...";
    document.getElementById('sx').addEventListener("click", function(){
    document.getElementById('sx').style.pointerEvents = 'none';
    document.getElementById('risp').innerText="";
    document.getElementById('valSx').innerText=leggibile(sx[0].population);
    document.getElementById('valDx').innerText=leggibile(dx[0].population);
//--------------------------------------------------------------------------------------------------------------------------------------------
    if(verifica()){
        console.log("wSx", wSx)
        wSx++;
        score++;
        document.getElementById('feedback').classList.add('success')
        document.getElementById('risp').classList.add('fas', 'fa-check-circle');
        document.getElementById('sx').classList.add('bordo-verde')
        document.getElementById('dx').classList.add('bordo-rosso');
        document.getElementById('score').innerText=score;
        if(wSx>1){
        console.log("genSX")
        setTimeout(generaSX, 2000);
        setTimeout(init, 2000, true);
        wSx=0;
        }
        setTimeout(generaDX, 2000);
        setTimeout(init, 2000, false);
       
    }else{
        document.getElementById('feedback').classList.add('error')
        document.getElementById('risp').classList.add('fas', 'fa-times-circle');
        document.getElementById('sx').classList.add('bordo-rosso');
        document.getElementById('dx').classList.add('bordo-verde')
         document.getElementById('errore').style.display='block'
    }
    
})

document.getElementById('dx').addEventListener("click", function(){
     document.getElementById('dx').style.pointerEvents = 'none';
     document.getElementById('risp').innerText="";
    document.getElementById('valDx').innerText=leggibile(dx[0].population);
     document.getElementById('valSx').innerText=leggibile(sx[0].population);
    if(!verifica()){
        wDx++;
       score++;
       document.getElementById('feedback').classList.add('success')
       document.getElementById('risp').classList.add('fas', 'fa-check-circle');
       document.getElementById('dx').classList.add('bordo-verde')
       document.getElementById('sx').classList.add('bordo-rosso');
       document.getElementById('score').innerText=score;
       if(wDx>1){
       console.log("genDX")
       setTimeout(generaDX, 2000);
       setTimeout(init, 2000, false);
       wDx=0;
       }
       setTimeout(generaSX, 2000);
       setTimeout(init, 2000, true);
       

    }else{
        document.getElementById('feedback').classList.add('error')
        document.getElementById('risp').classList.add('fas', 'fa-times-circle');
        document.getElementById('sx').classList.add('bordo-verde')
        document.getElementById('dx').classList.add('bordo-rosso');
        document.getElementById('errore').style.display='block'
    }
})

document.getElementById('sx').classList.remove('bordo-verde');
document.getElementById('dx').classList.remove('bordo-verde');
document.getElementById('sx').classList.remove('bordo-rosso');
document.getElementById('dx').classList.remove('bordo-rosso');


//------------------------------------TORNA-ALLA-HOME--------------------------------------------------------------------------
document.getElementById('home').addEventListener("click", function(){
    window.location.href = "/index.html"
})