document.addEventListener('DOMContentLoaded', () => {
    fetch('json/ap_classes.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const apClasses = data.ap_classes;
            const apContainer = document.getElementById('ap-courses-container');
            
            // Check if the data is correctly loaded
            console.log('AP Classes Data:', apClasses);
            
            if (apClasses.length === 0) {
                apContainer.innerHTML = '<p>No AP courses found.</p>';
                return;
            }

            // Group courses by type
            const groups = {};
            apClasses.forEach(apCourse => {
                if (!groups[apCourse.group]) {
                    groups[apCourse.group] = [];
                }
                groups[apCourse.group].push(apCourse);
            });

            const groupKeys = Object.keys(groups);
            groupKeys.forEach((group, index) => {
                // Group Title
                const groupTitle = document.createElement('h2');
                groupTitle.textContent = `Group: ${group}`;
                groupTitle.style.color = 'black';
                apContainer.appendChild(groupTitle);

                // Courses in the group
                groups[group].forEach(apCourse => {
                    const apDiv = document.createElement('div');
                    apDiv.classList.add('ap-course');

                    // AP course name as a link
                    const courseLink = document.createElement('a');
                    courseLink.href = `https://apstudents.collegeboard.org/courses/${apCourse.name.toLowerCase().replace(/ /g, '-')}`;
                    courseLink.classList.add('ap-course-name');
                    courseLink.textContent = apCourse.name;
                    apDiv.appendChild(courseLink);

                    // Badge container
                    const badgeContainer = document.createElement('div');
                    badgeContainer.classList.add('badge-container');

                    // Popular badge
                    const popularGrades = [];
                    if (apCourse.attributes["Popular 9"]) popularGrades.push("9th");
                    if (apCourse.attributes["Popular 10"]) popularGrades.push("10th");
                    if (apCourse.attributes["Popular 11"]) popularGrades.push("11th");
                    if (apCourse.attributes["Popular 12"]) popularGrades.push("12th");

                    if (popularGrades.length > 0) {
                        const popularBadge = document.createElement('span');
                        popularBadge.classList.add('badge', 'popular');
                        popularBadge.innerHTML = `<a href="https://blog.collegeboard.org/popular-ap-courses-grade" target="_blank">Popular in: ${popularGrades.join(', ')}</a>`;
                        badgeContainer.appendChild(popularBadge);
                    }

                    // Good With badge
                    if (apCourse.attributes['Good With']) {
                        const goodWithBadge = document.createElement('span');
                        goodWithBadge.classList.add('badge', 'good-with');
                        goodWithBadge.innerHTML = `<a href="https://blog.collegeboard.org/ap-courses-go-together" target="_blank">Good With: ${apCourse.attributes['Good With']}</a>`;
                        badgeContainer.appendChild(goodWithBadge);
                    }

                    // Project Based badge
                    if (apCourse.attributes['Project Based']) {
                        const projectBadge = document.createElement('span');
                        projectBadge.classList.add('badge', 'project-based');
                        projectBadge.innerHTML = `<a href="https://blog.collegeboard.org/what-are-project-based-ap-courses" target="_blank">Project Based</a>`;
                        badgeContainer.appendChild(projectBadge);
                    }

                    // Major Score badge with classification
                    const majorScore = parseFloat(apCourse.attributes['Major Score']);
                    let majorScoreLabel = '';
                    if (majorScore < 10) {
                        majorScoreLabel = `Specialized: Recommended for ${Math.floor(majorScore)}% of all majors`;
                    } else if (majorScore >= 10 && majorScore < 40) {
                        majorScoreLabel = `General: Recommended for ${Math.floor(majorScore)}% of all majors`;
                    } else if (majorScore >= 40) {
                        majorScoreLabel = `Common: Recommended for ${Math.floor(majorScore)}% of all majors`;
                    }
                    const majorScoreBadge = document.createElement('span');
                    majorScoreBadge.classList.add('badge', 'major-score');
                    majorScoreBadge.textContent = majorScoreLabel;
                    badgeContainer.appendChild(majorScoreBadge);

                    // Career Score badge with classification
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

                    // "3+" Score badge
                    const score3Plus = parseFloat(apCourse.attributes['3+']);
                    if (score3Plus) {
                        const score3PlusBadge = document.createElement('span');
                        score3PlusBadge.classList.add('badge', 'score-3plus');
                        score3PlusBadge.innerHTML = `<a href="https://apstudents.collegeboard.org/about-ap-scores/score-distributions/2023" target="_blank">${score3Plus}% got 3+ in 2023 exams</a>`;
                        badgeContainer.appendChild(score3PlusBadge);
                    }

                    // "5" Score badge with classification
                    const score5 = parseFloat(apCourse.attributes['5']);
                    if (score5) {
                        let score5Class = '';
                        if (score5 < 10) {
                            score5Class = 'Selective';
                        } else if (score5 >= 10 && score5 < 25) {
                            score5Class = 'Challenging';
                        } else if (score5 >= 25 && score5 < 50) {
                            score5Class = 'Accessible';
                        } else if (score5 >= 50) {
                            score5Class = 'Standard';
                        }
                        const score5Badge = document.createElement('span');
                        score5Badge.classList.add('badge', 'score-5');
                        score5Badge.innerHTML = `<a href="https://apstudents.collegeboard.org/about-ap-scores/score-distributions/2023" target="_blank">${score5Class}: ${score5}% got 5 in 2023 exams</a>`;
                        badgeContainer.appendChild(score5Badge);
                    }

                    apDiv.appendChild(badgeContainer);
                    apContainer.appendChild(apDiv);
                });

                // Add a divider after each group, but not after the last group
                if (index !== groupKeys.length - 1) {
                    const divider = document.createElement('div');
                    divider.classList.add('group-divider');
                    apContainer.appendChild(divider);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching AP classes:', error);
            document.getElementById('ap-courses-container').innerHTML = '<p>Failed to load AP courses. Please try again later.</p>';
        });
});
