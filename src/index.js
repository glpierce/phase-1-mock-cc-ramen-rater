// Array for locally storing ramen information
const ramenArray = []

//Gets ramens from server and sets up form event listener after the DOM is loaded
document.addEventListener('DOMContentLoaded', event => {
    getRamens()
    document.querySelector(`#new-ramen`).addEventListener(`submit`, (event) => submitForm(event))
})

//Initiates GET request to server and passes parsed response to addRamens function
function getRamens() {
    fetch('http://localhost:3000/ramens')
    .then(resp => resp.json())
    .then(data => data.forEach(ramenObj => addRamens(ramenObj)))
}

//For each ramen object passed in, creates an img, adds event listener to img, and appends it to the dom and adds it to the ramenArray
function addRamens(ramenObj) {
    const img = document.createElement('img')
    img.src = ramenObj.image 
    img.addEventListener(`click`, (event) => presentRamen(event))
    document.querySelector(`#ramen-menu`).appendChild(img)
    ramenObj.imgElement = img
    ramenArray.push(ramenObj)
}

//If a ramen image is clicked on, makes central ramen display show that ramen's info 
function presentRamen(event) {
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
        rating: event.target.querySelector(`#new-rating`).value,
        comment: event.target.querySelector(`#new-comment`).value,
    }
    addRamens(newRamenObj)
    postRamen(newRamenObj)
}

//Submits new POST request to the server containing the new ramen object's information
function postRamen(newRamenObj) {
    postRamenObj = {...newRamenObj}
    delete postRamenObj.imgElement
    const postObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRamenObj)
    }
    fetch(`http://localhost:3000/ramens`, postObj)
}