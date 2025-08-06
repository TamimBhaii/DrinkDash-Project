const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const drinkContainer = document.getElementById("drinkContainer");
const cartTableBody = document.getElementById("cartTableBody");
const cartCount = document.getElementById("cartCount");

let cart = [];

window.onload = () => {
  loadRandomDrinks();
};

function loadRandomDrinks() {
  drinkContainer.innerHTML = "<p>Loading drinks...</p>";
  let promises = [];
  for (let i = 0; i < 20; i++) {
    promises.push(fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php").then(res => res.json()));
  }

  Promise.all(promises).then(results => {
    const drinks = results.map(res => res.drinks[0]);
    renderDrinks(drinks);
  });
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchDrinks(query);
  }
});

function fetchDrinks(name) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`)
    .then(res => res.json())
    .then(data => {
      if (data.drinks) {
        renderDrinks(data.drinks);
      } else {
        drinkContainer.innerHTML = `
          <h2 class="text-danger text-center mt-5">No drinks found... 😢</h2>
        `;
      }
    });
}

function renderDrinks(drinks) {
  drinkContainer.innerHTML = "";

  const row = document.createElement("div");
  row.className = "row";

  drinks.forEach(drink => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";

    col.innerHTML = `
      <div class="card h-100">
        <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Drink Image">
        <div class="card-body">
          <h5 class="card-title">${drink.strDrink}</h5>
          <p class="card-text"><strong>Category:</strong> ${drink.strCategory}</p>
          <p class="card-text">${drink.strInstructions.slice(0, 15)}...</p>
          <button class="btn btn-success btn-sm me-2" onclick="addToCart('${drink.idDrink}', '${drink.strDrink}', '${drink.strDrinkThumb}')">Add to Group</button>
          <button class="btn btn-info btn-sm" onclick="showDetails('${drink.idDrink}')">Details</button>
        </div>
      </div>
    `;

    row.appendChild(col);
  });

  drinkContainer.appendChild(row);
}

function addToCart(id, name, img) {
  if (cart.length >= 7) {
    alert("You can't add more than 7 drinks.");
    return;
  }
  cart.push({ id, name, img });
  updateCart();
}

function updateCart() {
  cartTableBody.innerHTML = "";
  cart.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${item.img}" style="width:40px; border-radius:5px;" /></td>
      <td>${item.name}</td>
    `;
    cartTableBody.appendChild(row);
  });
  cartCount.textContent = cart.length;
}

function showDetails(id) {
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const drink = data.drinks[0];
      const modalTitle = document.getElementById("modalTitle");
      const modalBody = document.getElementById("modalBody");

      modalTitle.textContent = drink.strDrink;

      modalBody.innerHTML = `
        <img src="${drink.strDrinkThumb}" class="img-fluid rounded mb-3" alt="Drink Image">
        <p><strong>Category:</strong> ${drink.strCategory}</p>
        <p><strong>Alcoholic:</strong> ${drink.strAlcoholic}</p>
        <p><strong>Glass:</strong> ${drink.strGlass}</p>
        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
      `;

      new bootstrap.Modal(document.getElementById("detailsModal")).show();
    });
}