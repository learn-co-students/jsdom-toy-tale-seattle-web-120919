let addToy = false

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
  
  fetchToys();
  createToyEvent();
  
})
function fetchToys () {
  fetch('http://localhost:3000/toys').then(res => {
    return res.json();
  }).then(json => {
    showToys(json);
  });
}



function showToys(toy_obj_arr) {
  //console.log(toy_obj_arr);
  const toy_collection_div = document.getElementById("toy-collection");


  toy_obj_arr.map(toy => {
    const div = makeToyCard(toy)
    toy_collection_div.appendChild(div)
  });


}

function makeToyCard(toy) {
  const div = document.createElement("div");
  div.className = "card";
  div.id = toy.id;
  
  const h2 = document.createElement("h2");
  h2.textContent = toy.name;


  const img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar";


  const p = document.createElement("p");
  p.textContent = `${toy.likes}` + " Likes";

  const likeButton = document.createElement("button");
  likeButton.className = "like-btn";
  likeButton.addEventListener("click", function() {
    
    toy.likes += 1;
    updateToy(toy)
  });


  div.appendChild(img);
  div.appendChild(h2);
  div.appendChild(p);
  div.appendChild(likeButton);
  return div;

}


function addCreatedToy(toy) {
  const toy_collection_div = document.getElementById("toy-collection");
  const div = makeToyCard(toy);
  toy_collection_div.appendChild(div);
}

function createToyEvent() {
  document.getElementsByClassName("add-toy-form")[0].addEventListener("submit", function(event) {
    event.preventDefault();
    let newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0
    }; 
    postToy(newToy)
  });
}

function postToy(toy) {
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toy)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.id) {
        addCreatedToy(data);
      } else {
        console.log(data);
      }
    });
}

const updateToy = toy => {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(toy)
  }).then(res => res.json()).then(
    data => { 
      const toy_collection_div = document.getElementById("toy-collection");
      const toy = document.getElementById(data.id)
      const likes = toy.children[2];
      likes.innerHTML = `${data.likes}` + " Likes";
    
    }
  );
}