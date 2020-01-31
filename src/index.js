let addToy = false

document.addEventListener("DOMContentLoaded", () => {
  getToys()
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
  submitToy()
})

function submitToy() {
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault()
    let newToy = {
      name: event.target.name.value,
      image: event.target.image.value
    }
    postToy(newToy)
  })
}

function getToys() {
  fetch("http://localhost:3000/toys")
    .then(function (res) {
      return res.json()
    })
    .then(function (data) {
      showToys(data)
    })
}

function showToys(toyArray) {
  toyArray.map(toy => {
    addAToy(toy);
  });
}

function addAToy(toy) {
  const toy_list = document.querySelector("#toy-collection")
  const div = makeToyCard(toy);
  toy_list.appendChild(div);
}

function makeToyCard(toy) {
  const div = document.createElement("div")
  div.className = "card"

  const name = document.createElement("h2")
  name.textContent = toy.name

  const img = document.createElement("img")
  img.src = toy.image
  img.className = "toy-avatar"

  const likes = document.createElement("p")
  likes.textContent = `${toy.likes} Likes`

  const likeBtn = document.createElement("button")
  likeBtn.className = "like-btn"
  likeBtn.textContent = "Like <3"
  likeBtn.addEventListener("click", function () {
    likes.textContent = `${++toy.likes} Likes`
  })


  div.appendChild(name)
  div.appendChild(img)
  div.appendChild(likes)
  div.appendChild(likeBtn)

  return div
}

function postToy(toy) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "applicaton/json"
    },
    body: JSON.stringify(toy)
  })
    .then(function (res) {
      return res.json()
    })
    .then(function (data) {
      if (data.id) {
        addAToy(data)
      } else {
        console.log(data)
      }
    })
}

function patchLikes(toy) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      "likes": toy.likes++
    })
  })
} 