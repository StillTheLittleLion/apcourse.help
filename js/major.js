document.addEventListener('DOMContentLoaded', () => {
    // Function to get the value of a query parameter from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Function to convert course names into URL-friendly format
    function convertToUrlFriendly(courseName) {
        return courseName.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/ /g, '-');
    }

    // Get the selected major from the URL
    const majorName = getQueryParam('major');

    if (majorName) {
        document.getElementById('major-name').textContent = decodeURIComponent(majorName);

        // Fetch both majors and AP classes data
        Promise.all([
            fetch('json/majors.json').then(response => response.json()),
            fetch('json/ap_classes.json').then(response => response.json())
        ]).then(([majorsData, apClassesData]) => {
            // Find the selected major
            const selectedMajor = majorsData.majors.find(major => major.name === decodeURIComponent(majorName));

            if (selectedMajor) {
                const apContainer = document.getElementById('ap-courses-container');
                const totalCourses = selectedMajor.ap_courses.length;

                // Update subtitle with the number of AP courses
                document.getElementById('major-details').innerHTML = `The College Board identifies these <strong>${totalCourses} AP courses</strong> as helpful for this major.<br>However, this doesn't mean you need to take these courses or exams to pursue this major.`;

                // For each AP course in the selected major, find its attributes
                selectedMajor.ap_courses.forEach(apCourseName => {
                    const apCourse = apClassesData.ap_classes.find(ap => ap.name === apCourseName);

                    if (apCourse) {
                        // Create the container for the AP course and badges
                        const apDiv = document.createElement('div');
                        apDiv.classList.add('ap-course');

                        // Create the course name link to College Board page
                        const courseLink = document.createElement('a');
                        courseLink.href = `https://apstudents.collegeboard.org/courses/${convertToUrlFriendly(apCourse.name)}`;
                        courseLink.target = '_blank';
                        courseLink.classList.add('ap-course-name');
                        courseLink.textContent = apCourse.name;

                        // Append the course name link to the course container
                        apDiv.appendChild(courseLink);

                        // Create the group (AP Group) as a link
                        const groupLink = document.createElement('a');
                        groupLink.href = 'https://apstudents.collegeboard.org/choosing-courses/by-major-career';
                        groupLink.target = '_blank'; 
                        groupLink.classList.add('ap-course-group');
                        groupLink.textContent = `AP Group: ${apCourse.group}`;

                        // Append the group link to the course container
                        apDiv.appendChild(groupLink);

                        // Badge container
                        const badgeContainer = document.createElement('div');
                        badgeContainer.classList.add('badge-container');

                        // Popular grades with a link
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

                        // Good With badge with a link
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

                        // Project Based badge with a link
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

                        // Major Score badge with custom labels
                        const majorScore = parseFloat(apCourse.attributes['Major Score']);
                        let majorScoreLabel = '';
                        if (majorScore < 10) {
                            majorScoreLabel = `Specialized Course: Recommended for ${Math.floor(majorScore)}% of all majors`;
                        } else if (majorScore >= 10 && majorScore < 40) {
                            majorScoreLabel = `General Course: Recommended for ${Math.floor(majorScore)}% of all majors`;
                        } else if (majorScore >= 40) {
                            majorScoreLabel = `Common Course: Recommended for ${Math.floor(majorScore)}% of all majors`;
                        }

                        const majorScoreBadge = document.createElement('span');
                        majorScoreBadge.classList.add('badge', 'major-score');
                        majorScoreBadge.textContent = majorScoreLabel;
                        badgeContainer.appendChild(majorScoreBadge);

                        // "3+" score badge with a link
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

                        // "5" score badge with classification and link
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
                document.getElementById('major-details').textContent = 'Major not found in the database.';
            }
        }).catch(error => {
            document.getElementById('major-details').textContent = 'Error loading the data.';
        });
    } else {
        document.getElementById('major-name').textContent = 'Major not found';
        document.getElementById('major-details').textContent = 'Please go back and select a valid major.';
    }
});
