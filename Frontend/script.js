
document.addEventListener('DOMContentLoaded', () => {
  const spotListContainer = document.querySelector('.spots-container');
  const spotForm = document.getElementById('spot-form');

  // Load existing spots
  fetch('/api/spots')
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch spots');
      return res.json();
    })
    .then(spots => {
      spots.forEach(spot => {
        const spotCard = document.createElement('div');
        spotCard.classList.add('spot-card');
        spotCard.innerHTML = `
          <img src="${spot.image}" alt="${spot.name}" />
          <h3>${spot.name}</h3>
          <p>${spot.location}</p>
          <p>${spot.description}</p>
          <button class="edit-button" data-id="${spot.id}">Edit</button>
        `;
        spotListContainer.appendChild(spotCard);
      });

      // Attach event listeners to edit buttons
      document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', handleEdit);
      });
    })
    .catch(error => {
      console.error('Error loading spots:', error);
      spotListContainer.innerHTML = '<p>Failed to load spots. Please try again later.</p>';
    });

  // Submit new spot
  spotForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newSpot = {
      name: document.getElementById('name').value,
      location: document.getElementById('location').value,
      image: document.getElementById('image').value,
      description: document.getElementById('description').value,
    };

    fetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSpot),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add new spot');
        return res.json();
      })
      .then(data => {
        alert(data.message);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error adding new spot:', error);
        alert('Failed to add the skate spot. Please try again.');
      });
  });

  // Handle Edit Button Click
  function handleEdit(e) {
    const spotId = e.target.getAttribute('data-id');

    fetch(`/api/spots/${spotId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch spot data');
        return res.json();
      })
      .then(spot => {
        document.getElementById('name').value = spot.name;
        document.getElementById('location').value = spot.location;
        document.getElementById('image').value = spot.image;
        document.getElementById('description').value = spot.description;

        const submitButton = spotForm.querySelector('button[type="submit"]');
        submitButton.textContent = 'Update Spot';
        submitButton.classList.add('update-mode');
        submitButton.setAttribute('data-id', spotId);
      })
      .catch(error => {
        console.error('Error fetching spot data:', error);
        alert('Failed to fetch the skate spot data. Please try again.');
      });
  }

  // Handle form submission in update mode
  spotForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitButton = spotForm.querySelector('button[type="submit"]');
    if (submitButton.classList.contains('update-mode')) {
      const updatedSpot = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        image: document.getElementById('image').value,
        description: document.getElementById('description').value,
      };

      const spotId = submitButton.getAttribute('data-id');

      fetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSpot),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update spot');
          return res.json();
        })
        .then(data => {
          alert(data.message);
          window.location.reload();
        })
        .catch(error => {
          console.error('Error updating spot:', error);
          alert('Failed to update the skate spot. Please try again.');
        });
    }
  });
});

