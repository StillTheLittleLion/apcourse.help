document.addEventListener('DOMContentLoaded', () => {
    // Function to get the value of a query parameter from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the selected career from the URL
    const careerName = getQueryParam('career');

    if (careerName) {
        document.getElementById('career-name').textContent = decodeURIComponent(careerName);

        // Fetch both careers and AP classes data
        Promise.all([
            fetch('json/careers.json').then(response => response.json()),
            fetch('json/ap_classes.json').then(response => response.json())
        ]).then(([careersData, apClassesData]) => {
            // Find the selected career
            const selectedCareer = careersData.careers.find(career => career.name === decodeURIComponent(careerName));

            if (selectedCareer) {
                const apContainer = document.getElementById('ap-courses-container');
                const totalCourses = selectedCareer.ap_courses.length;

                // Update subtitle with the number of AP courses
                document.getElementById('major-details').innerHTML = `The College Board identifies these <strong>${totalCourses} AP courses</strong> as helpful for this career.<br>However, this doesn't mean you need to take these courses or exams to pursue this career.`;

                // For each AP course in the selected career, find its attributes
                selectedCareer.ap_courses.forEach(apCourseName => {
                    const apCourse = apClassesData.ap_classes.find(ap => ap.name === apCourseName);

                    if (apCourse) {
                        // Create the container for the AP course and badges
                        const apDiv = document.createElement('div');
                        apDiv.classList.add('ap-course');

                        // Create the course name div
                        const nameDiv = document.createElement('div');
                        nameDiv.classList.add('ap-course-name');
                        nameDiv.textContent = apCourse.name;

                        // Create the group (AP Group) as a link
                        const groupLink = document.createElement('a');
                        groupLink.href = 'https://apstudents.collegeboard.org/choosing-courses/by-major-career';
                        groupLink.target = '_blank'; // Opens the link in a new tab
                        groupLink.classList.add('ap-course-group');
                        groupLink.textContent = `AP Group: ${apCourse.group}`;

                        // Append both name and group link to the course container
                        apDiv.appendChild(nameDiv);
                        apDiv.appendChild(groupLink);

                        // Badge container
                        const badgeContainer = document.createElement('div');
                        badgeContainer.classList.add('badge-container');

                        // 1. Popular grades with a link
                        const popularGrades = [];
                        if (apCourse.attributes["Popular 9"]) popularGrades.push("9th");
                        if (apCourse.attributes["Popular 10"]) popularGrades.push("10th");
                        if (apCourse.attributes["Popular 11"]) popularGrades.push("11th");
                        if (apCourse.attributes["Popular 12"]) popularGrades.push("12th");

                        if (popularGrades.length > 0) {
                            const popularBadge = document.createElement('span');
                            popularBadge.classList.add('badge', 'popular');
                            const popularLink = document.createElement('a');
                            popularLink.href = 'https://blog.collegeboard.org/popular-ap-courses-grade';
                            popularLink.target = '_blank';
                            popularLink.textContent = `Popular in: ${popularGrades.join(', ')}`;
                            popularBadge.appendChild(popularLink);
                            badgeContainer.appendChild(popularBadge);
                        }

                        // 2. Good With badge with a link
                        if (apCourse.attributes['Good With']) {
                            const goodWithBadge = document.createElement('span');
                            goodWithBadge.classList.add('badge', 'good-with');
                            const goodWithLink = document.createElement('a');
                            goodWithLink.href = 'https://blog.collegeboard.org/ap-courses-go-together';
                            goodWithLink.target = '_blank';
                            goodWithLink.textContent = 'Good With: ' + apCourse.attributes['Good With'];
                            goodWithBadge.appendChild(goodWithLink);
                            badgeContainer.appendChild(goodWithBadge);
                        }

                        // 3. Project Based badge with a link
                        if (apCourse.attributes['Project Based']) {
                            const projectBadge = document.createElement('span');
                            projectBadge.classList.add('badge', 'project-based');
                            const projectLink = document.createElement('a');
                            projectLink.href = 'https://blog.collegeboard.org/what-are-project-based-ap-courses';
                            projectLink.target = '_blank';
                            projectLink.textContent = 'Project Based';
                            projectBadge.appendChild(projectLink);
                            badgeContainer.appendChild(projectBadge);
                        }

                        // 4. Career Score badge with custom labels
                        const careerScore = parseFloat(apCourse.attributes['Career Score']);
                        let careerScoreLabel = '';
                        if (careerScore < 10) {
                            careerScoreLabel = `Specialized Course: Recommended for ${Math.floor(careerScore)}% of all careers`;
                        } else if (careerScore >= 10 && careerScore < 40) {
                            careerScoreLabel = `General Course: Recommended for ${Math.floor(careerScore)}% of all careers`;
                        } else if (careerScore >= 40) {
                            careerScoreLabel = `Common Course: Recommended for ${Math.floor(careerScore)}% of all careers`;
                        }

                        const careerScoreBadge = document.createElement('span');
                        careerScoreBadge.classList.add('badge', 'career-score');
                        careerScoreBadge.textContent = careerScoreLabel;
                        badgeContainer.appendChild(careerScoreBadge);

                        // 5. "3+" score badge with a link
                        const score3Plus = parseFloat(apCourse.attributes['3+']);
                        if (score3Plus) {
                            const score3PlusBadge = document.createElement('span');
                            score3PlusBadge.classList.add('badge', 'score-3plus');
                            const score3PlusLink = document.createElement('a');
                            score3PlusLink.href = 'https://apstudents.collegeboard.org/about-ap-scores/score-distributions/2023';
                            score3PlusLink.target = '_blank';
                            score3PlusLink.textContent = `${score3Plus}% got 3+ in 2023 exams`;
                            score3PlusBadge.appendChild(score3PlusLink);
                            badgeContainer.appendChild(score3PlusBadge);
                        }

                        // 6. "5" score badge with classification and link
                        const score5 = parseFloat(apCourse.attributes['5']);
                        if (score5) {
                            let score5Class = '';
                            if (score5 < 10) {
                                score5Class = 'Selective Level';
                            } else if (score5 >= 10 && score5 < 25) {
                                score5Class = 'Challenging Level';
                            } else if (score5 >= 25 && score5 < 50) {
                                score5Class = 'Accessible Level';
                            } else if (score5 >= 50) {
                                score5Class = 'Standard Level';
                            }

                            const score5Badge = document.createElement('span');
                            score5Badge.classList.add('badge', 'score-5');
                            const score5Link = document.createElement('a');
                            score5Link.href = 'https://apstudents.collegeboard.org/about-ap-scores/score-distributions/2023';
                            score5Link.target = '_blank';
                            score5Link.textContent = `${score5Class}: ${score5}% got 5 in 2023 exams`;
                            score5Badge.appendChild(score5Link);
                            badgeContainer.appendChild(score5Badge);
                        }

                        // Append the badge container to the course div
                        apDiv.appendChild(badgeContainer);

                        // Append the entire AP course with badges to the container
                        apContainer.appendChild(apDiv);
                    }
                });
            } else {
                document.getElementById('career-details').textContent = 'Career not found in the database.';
            }
        }).catch(error => {
            document.getElementById('career-details').textContent = 'Error loading the data.';
        });
    } else {
        document.getElementById('career-name').textContent = 'Career not found';
        document.getElementById('career-details').textContent = 'Please go back and select a valid career.';
    }
});
