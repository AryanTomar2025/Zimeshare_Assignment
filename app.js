document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const resultsContainer = document.getElementById('results');
    const addClothingForm = document.getElementById('add-clothing-form');
  
    searchBar.addEventListener('input', async (event) => {
      const query = event.target.value;
  
      if (query.length > 3) {
        const response = await fetch(`http://localhost:3000/api/clothes?q=${query}`);
        const results = await response.json();
        displayResults(results);
      } else {
        resultsContainer.innerHTML = '';
      }
    });
  
    addClothingForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const name = document.getElementById('name').value;
      const description = document.getElementById('description').value;
      const price = document.getElementById('price').value;
  
      const response = await fetch('http://localhost:3000/api/clothes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, price }),
      });
  
      if (response.ok) {
        const newClothing = await response.json();
        alert('Clothing added successfully');
        // Clear the form
        addClothingForm.reset();
        // Update the search results to include the new item
        const searchQuery = searchBar.value;
        if (searchQuery.length > 3) {
          const response = await fetch(`http://localhost:3000/api/clothes?q=${searchQuery}`);
          const results = await response.json();
          displayResults(results);
        }
      } else {
        alert('Error adding clothing');
      }
    });
  
    function displayResults(results) {
      resultsContainer.innerHTML = results
        .map(item => {
          return `
            <div class="border p-4 rounded">
              <h2 class="text-xl font-semibold">${item.name}</h2>
              <p>${item.description}</p>
              <p class="text-gray-500">${item.price}</p>
            </div>
          `;
        })
        .join('');
    }
  });
  