document.addEventListener('DOMContentLoaded', () => {
    // Fetch the careers data from the JSON file
    fetch('json/CBcareers.json')
        .then(response => response.json())
        .then(data => {
            const careersContainer = document.getElementById('careers-container');

            // Loop through the careers and create buttons
            data.careers.forEach(careerObj => {
                // Extract the name of the career
                const career = careerObj.name;

                const button = document.createElement('button');
                button.classList.add('career-button');
                button.textContent = career;

                // Add a click event to handle navigation
                button.addEventListener('click', () => {
                    // Redirect to career.html with the selected career as a query parameter
                    window.location.href = `career.html?career=${encodeURIComponent(career)}`;
                });

                careersContainer.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error loading careers:', error);
        });
});
