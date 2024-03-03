

var form = document.querySelector(".form form")
var filterSelect = document.querySelector(".filter_genre select");
var sear = document.querySelector(".searchBox #search")
let preview = document.getElementById("preview")
console.log(preview);

const displayModal = ()=>{
   let modal =  document.querySelector(".form")
   console.log(modal);
   modal.style.display = "block";
}
var modal =  document.querySelector(".form")

const setEvent = {
     displayModal:  () =>{
        modal.style.display = "block";
     },
     closeModale : ()=>{
        modal.style.display = "none";     }
     
    
}

var add = document.querySelector(".addbuton")
add.onclick = setEvent.displayModal
modal.querySelectorAll("#close").forEach((cls)=>{
    cls.onclick = setEvent.closeModale
})