document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

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

    // Show loading and simulate booking process
    loading.style.display = 'block';
    setTimeout(() => {
        alert('Booking successful!');
        loading.style.display = 'none';
        document.getElementById('bookingForm').reset(); // Reset form after successful booking
    }, 2000);
});