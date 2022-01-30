let productEdit = document.querySelector(".productEdit")
let editDelete = document.querySelector(".editDelete")
let editButton = document.querySelector(".editDelete a")
let buyProduct = document.querySelector(".buyProduct")

editButton.addEventListener("click", function () {
    console.log("Hello")
    productEdit.classList.toggle("hide")
    buyProduct.classList.toggle("show")
    editDelete.classList.toggle("show")
})