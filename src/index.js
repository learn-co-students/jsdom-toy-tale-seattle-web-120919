let addToy = false
let origToy = null 

document.addEventListener("DOMContentLoaded", ()=>{
  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })
  fetchToys()
  addNewToy()
})

function fetchToys() {
  fetch("http://localhost:3000/toys").then(response => {return response.json()}).then(json => {showToys(json)})
}

function showToys(toyArray) {
  toyArray.map(toy => {
    addToyToCollection(toy)
  })
}

function addToyToCollection(toy) {
  const toy_collection = document.getElementById("toy-collection")
  const div = makeToyCard(toy)
  toy_collection.appendChild(div)
}

function makeToyCard(toy) {
  const div = document.createElement("div")
  div.className =  "card"

  const img = document.createElement("img")
  img.src = toy.image
  img.className = "toy-avatar"

  const h2 = document.createElement("h2")
  h2.textContent = toy.name

  const p = document.createElement("p")
  p.textContent = `${toy.likes}` + " Likes"
  
  const likeButton = document.createElement("button")
  likeButton.textContent = "Like <3"
  likeButton.className = "like-btn"
  likeButton.addEventListener("click", function() {
    toy.likes++
    addLike(toy)
    origToy = div
  })
  div.appendChild(img)
  div.appendChild(h2)
  div.appendChild(p)
  div.appendChild(likeButton)

  return div
}

function addLike(toy) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toy)})
    .then(function(response) {
      return response.json()
    })
    .then(function(data) {
      let updatedToy = makeToyCard(data)
      origToy.parentNode.replaceChild(updatedToy, origToy)
      origToy = null
    })
}

function postToy(toy) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toy)})
    .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    if (data.id) {
      addToyToCollection(data)
    } else {
      console.log(data)
    }
  });
}

function addNewToy() {
    document.getElementsByClassName("add-toy-form")[0].addEventListener("submit", function(event) {
    event.preventDefault();
    let newToy = {
      name: event.target.name.value,
      image: event.target.image.value
    };
    postToy(newToy);
  });
}