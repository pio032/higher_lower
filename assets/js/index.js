const ct = document.getElementById('ct');
ct.addEventListener("click", function(){
document.getElementById('bottoni').style.display='block'
document.getElementById('lv1').addEventListener("click", function(){
    localStorage.setItem("dif", 1)
      window.location.href="/country.html"
})
  document.getElementById('lv2').addEventListener("click", function(){
    localStorage.setItem("dif", 2)
      window.location.href="/country.html"
})
document.getElementById('lv3').addEventListener("click", function(){
    localStorage.setItem("dif", 3)
      window.location.href="/country.html"
})
})
const pl = document.getElementById('pl')
pl.addEventListener("click", function(){
document.getElementById('bottoni').style.display='block'
document.getElementById('lv1').addEventListener("click", function(){
    localStorage.setItem("dif", 1)
    window.location.href="/population.html"
})
  document.getElementById('lv2').addEventListener("click", function(){
    localStorage.setItem("dif", 2)
      window.location.href="/population.html"
})
document.getElementById('lv3').addEventListener("click", function(){
    localStorage.setItem("dif", 3)
     window.location.href="/population.html"
})
    
})

document.getElementById('bottoni').style.display='none'

