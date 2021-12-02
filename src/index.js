// Array for locally storing ramen information
let ramenArray = []

//Gets ramens from server and sets up form event listener and delete button event listener after the DOM is loaded
document.addEventListener('DOMContentLoaded', event => {
    getRamens()
    document.querySelector(`#new-ramen`).addEventListener(`submit`, (event) => submitForm(event))
    document.querySelector(`#deleteButton`).addEventListener(`submit`, (event) => deleteRamen(event))
})

//Initiates GET request to server and passes parsed response to addRamens function
function getRamens() {
    fetch('http://localhost:3000/ramens')
    .then(resp => resp.json())
    .then(data => data.forEach(ramenObj => addRamens(ramenObj)))
    .then(undef => presentRandomRamen())
}

//For each ramen object passed in, creates an img, adds event listener to img, and appends it to the dom and adds it to the ramenArray
function addRamens(ramenObj) {
    const img = document.createElement('img')
    img.src = ramenObj.image 
    img.addEventListener(`click`, (event) => presentSelectedRamen(event))
    document.querySelector(`#ramen-menu`).appendChild(img)
    ramenObj.imgElement = img
    ramenArray.push(ramenObj)
}

//If a ramen image is clicked on, makes central ramen display show that ramen's info 
function presentSelectedRamen(event) {
    const ramenDetails = document.querySelector(`#ramen-detail`)
    const ramenObj = ramenArray.find(element => element.imgElement === event.target)
    ramenDetails.querySelector(`img`).src = ramenObj.image
    ramenDetails.querySelector(`h2`).textContent = ramenObj.name
    ramenDetails.querySelector(`h3`).textContent = ramenObj.restaurant
    document.querySelector(`#rating-display`).textContent = ramenObj.rating
    document.querySelector(`#comment-display`).textContent = ramenObj.comment
}

//Prevents default form submission behavior, creates a new ramen object from user input, 
//calls addRamens to add new ramen object to DOM and ramenArray, posts new ramen object to
//server to persist the new ramen
function submitForm(event)  {
    event.preventDefault()
    const newRamenObj = {
        name: event.target.querySelector(`#new-name`).value,
        restaurant: event.target.querySelector(`#new-restaurant`).value,
        image: event.target.querySelector(`#new-image`).value,
        rating: parseInt(event.target.querySelector(`#new-rating`).value, 10),
        comment: event.target.querySelector(`#new-comment`).value,
    }
    event.target.reset()
    postRamen(newRamenObj)
}

//Submits new POST request to the server containing the new ramen object's information
function postRamen(newRamenObj) {
    const postObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRamenObj)
    }
    fetch(`http://localhost:3000/ramens`, postObj)
    .then(resp => resp.json())
    .then(data => addRamens(data))
}

//Triggered when delete button is pressed, prevents page reload, identifies ramen obj to be deleted and calls functions to remove it from server and DOM
function deleteRamen(event) {
    event.preventDefault()
    const deletedRamenObj = ramenArray.find(ramen => ramen.name === document.querySelector(`#ramen-detail h2`).textContent)
    sendDelete(deletedRamenObj)
    removeFromDOM(deletedRamenObj)
}

//Takes in the ramen object to be deleted and sends delete request to server
function sendDelete(deletedRamenObj) {
    const deleteObj = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(`http://localhost:3000/ramens/${deletedRamenObj.id}`, deleteObj)
}

//Takes in the ramen object tor be deleted, removes it from top div display, removes it from ramenArray, calls presentRandomRamen to present a new ramen
function removeFromDOM(deletedRamenObj) {
    document.querySelector(`#ramen-menu`).removeChild(deletedRamenObj.imgElement)
    ramenArray = ramenArray.filter(ramen => ramen !== deletedRamenObj)
    presentRandomRamen()
}

//Randomly chooses a ramen from the ramenArray and presents it
function presentRandomRamen() {
    const displayRamen = ramenArray[Math.floor(Math.random() * ramenArray.length)]
    const ramenDetails = document.querySelector(`#ramen-detail`)
    ramenDetails.querySelector(`img`).src = displayRamen.image
    ramenDetails.querySelector(`h2`).textContent = displayRamen.name
    ramenDetails.querySelector(`h3`).textContent = displayRamen.restaurant
    document.querySelector(`#rating-display`).textContent = displayRamen.rating
    document.querySelector(`#comment-display`).textContent = displayRamen.comment
}