document.addEventListener('DOMContentLoaded', () => {
    // Fetch the majors data from the JSON file
    fetch('json/majors.json')
        .then(response => response.json())
        .then(data => {
            const majorsContainer = document.getElementById('majors-container');

            // Loop through the majors and create buttons
            data.majors.forEach(majorObj => {
                // Extract the name of the major
                const major = majorObj.name;

                const button = document.createElement('button');
                button.classList.add('major-button');
                button.textContent = major;

                // Add a click event to handle navigation
                button.addEventListener('click', () => {
                    // Redirect to major.html with the selected major as a query parameter
                    window.location.href = `major.html?major=${encodeURIComponent(major)}`;
                });

                majorsContainer.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error loading majors:', error);
        });
});
