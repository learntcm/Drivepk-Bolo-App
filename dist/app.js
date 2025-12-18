const cars = [
  { brand:"Honda", model:"Civic 2019", city:"Lahore", price:"45 Lakh" },
  { brand:"Honda", model:"Civic 2018", city:"Lahore", price:"41 Lakh" },
  { brand:"Honda", model:"City 2020", city:"Karachi", price:"38 Lakh" },
  { brand:"Toyota", model:"Corolla 2019", city:"Lahore", price:"42 Lakh" },
  { brand:"MG", model:"HS 2021", city:"Lahore", price:"72 Lakh" }
];

function searchCars(textOverride) {
  const q = (textOverride || document.getElementById("query").value).toLowerCase();
  const results = document.getElementById("results");
  results.innerHTML = "";

  const found = cars.filter(c =>
    q.includes(c.brand.toLowerCase()) &&
    q.includes(c.city.toLowerCase())
  );

  if (!found.length) {
    results.innerHTML = "<p>No cars found</p>";
    return;
  }

  found.forEach(c => {
    results.innerHTML += `
      <div class="car">
        <strong>${c.brand} ${c.model}</strong><br>
        ${c.city} • PKR ${c.price}
      </div>
    `;
  });
}

function callAI() {
  const ring = document.getElementById("ring");
  const status = document.getElementById("status");

  ring.play();
  status.style.display = "block";

  console.log("Resham: Asalam o Alaikum! Welcome to DrivePK.");

  setTimeout(() => {
    ring.pause();
    ring.currentTime = 0;
    status.style.display = "none";
    document.getElementById("query").value = "Honda in Lahore";
    searchCars("Honda in Lahore");
  }, 2000);
}

document.getElementById("query").addEventListener("keydown", e => {
  if (e.key === "Enter") searchCars();
});
