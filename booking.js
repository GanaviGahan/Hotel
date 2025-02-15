document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let checkInDate = document.getElementById('check-in').value;
    let checkOutDate = document.getElementById('check-out').value;
    let loading = document.getElementById('loading');

    // Validate name and email
    if (!name || !email) {
        alert("Please fill in your name and email.");
        return;
    }

    if (!checkInDate || !checkOutDate) {
        alert("Please select both check-in and check-out dates.");
        return;
    }

    let checkIn = new Date(checkInDate);
    let checkOut = new Date(checkOutDate);

    if (checkOut <= checkIn) {
        alert("Check-out date must be after the check-in date.");
        return;
    }

    // Show loading indicator
    loading.style.display = 'block';

    // Prepare booking data
    const bookingData = {
        name,
        email,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        roomType: document.querySelector('select').value // Assuming you have a select for room type
    };

    // Send booking data to the backend
    fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => {
        loading.style.display = 'none'; // Hide loading indicator
        if (response.ok) {
            alert('Booking successful!');
            document.getElementById('bookingForm').reset(); // Reset form after successful booking
        } else {
            alert('Error in booking: ' + response.statusText);
        }
    })
    .catch(error => {
        loading.style.display = 'none'; // Hide loading indicator
        console.error('Error:', error);
        alert('Error in booking: ' + error);
    });
});