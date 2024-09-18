document.addEventListener("DOMContentLoaded", () => {
    // Function to get the value of a query parameter from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the selected major from the URL
    const majorName = getQueryParam("major");

    if (majorName) {
        document.getElementById("hero-title").textContent = decodeURIComponent(majorName);

        // Fetch both majors and AP classes data for CB and AI
        Promise.all([
            fetch("json/CBmajors.json").then(response => response.json()),
            fetch("json/AImajors.json").then(response => response.json()),
            fetch("json/ap_classes.json").then(response => response.json())
        ])
        .then(([cbmajorsData, aimajorsData, apClassesData]) => {
            // Find the selected major for College Board
            const selectedCBmajor = cbmajorsData.majors.find(
                (major) => major.name === decodeURIComponent(majorName)
            );

            // Find the selected major for AI
            const selectedAImajor = aimajorsData.majors.find(
                (major) => major.name === decodeURIComponent(majorName)
            );

            if (selectedCBmajor) {
                populateCourses("cb-recommended", selectedCBmajor, apClassesData, "cb-toggle-details");
            }

            if (selectedAImajor) {
                populateCourses("ai-recommended", selectedAImajor, apClassesData, "ai-toggle-details");
            }

            // Update the hero section with the number of courses
            const cbCourseCount = selectedCBmajor ? selectedCBmajor.ap_courses.length : 0;
            const aiCourseCount = selectedAImajor ? selectedAImajor.ap_courses.length : 0;
            document.getElementById("hero-desc").innerHTML = `The College Board suggests <strong>${cbCourseCount} AP courses</strong>, and AI recommends <strong>${aiCourseCount} AP courses</strong> as useful for this major. However, this doesn't mean you need to take these courses or exams to pursue this major.`;

            // Add event listeners after dynamically creating elements
            attachToggleEvents();
        })
        .catch((error) => {
            document.getElementById("hero-desc").textContent = "Error loading the data.";
        });
    } else {
        document.getElementById("hero-title").textContent = "major not found";
        document.getElementById("hero-desc").textContent = "Please go back and select a valid major.";
    }

    // Function to populate course lists (CB and AI)
    function populateCourses(containerId, selectedmajor, apClassesData, toggleClass) {
        const container = document.getElementById(containerId);

        // For each AP course in the selected major, find its attributes
        selectedmajor.ap_courses.forEach((apCourseName) => {
            const apCourse = apClassesData.ap_classes.find((ap) => ap.name === apCourseName);

            if (apCourse) {
                // Create the course entry
                const courseDiv = document.createElement("div");
                courseDiv.classList.add("course-entry");

                // Course Name
                const courseNameDiv = document.createElement("div");
                courseNameDiv.classList.add("course-name");

                const courseLink = document.createElement("a");
                courseLink.href = `#`;
                courseLink.classList.add(toggleClass);
                courseLink.textContent = apCourse.name;

                courseNameDiv.appendChild(courseLink);

                // Bead Container
                const beadContDiv = document.createElement("div");
                beadContDiv.classList.add("bead-container");

                // Course Details
                const courseDetDiv = document.createElement("div");
                courseDetDiv.classList.add("course-details");

                // Bead Details
                const beadDetDiv = document.createElement("div");
                beadDetDiv.classList.add("bead-details");

                // Popular bead
                const popularGrades = [];
                if (apCourse.attributes["Popular 9"]) popularGrades.push("9");
                if (apCourse.attributes["Popular 10"]) popularGrades.push("10");
                if (apCourse.attributes["Popular 11"]) popularGrades.push("11");
                if (apCourse.attributes["Popular 12"]) popularGrades.push("12");

                if (popularGrades.length > 0) {
                    const popularBeadSpan = document.createElement("span");
                    popularBeadSpan.classList.add("bead", "popular");
                    popularBeadSpan.textContent = `P.${popularGrades}`;
                    beadContDiv.appendChild(popularBeadSpan);

                    const popularBeadSpan2 = document.createElement("p");
                    popularBeadSpan2.classList.add("bead", "popular");
                    popularBeadSpan2.textContent = `P.${popularGrades}`;
                    beadDetDiv.appendChild(popularBeadSpan2);

                    const popularBeadP = document.createElement("p");
                    popularBeadP.classList.add("bead-description");

                    const popularLink = document.createElement("a");
                    popularLink.href = "https://blog.collegeboard.org/popular-ap-courses-grade";
                    popularLink.target = "_blank";
                    popularLink.textContent = `Popular in grades: ${popularGrades}`;
                    popularBeadP.appendChild(popularLink);
                    beadDetDiv.appendChild(popularBeadP);
                }

                    // Good With bead with a link
    if (apCourse.attributes["Good With"]) {
        const goodWithBeadSpan = document.createElement("span");
        goodWithBeadSpan.classList.add("bead", "goodwidth");
        goodWithBeadSpan.textContent = `Gw`;
        beadContDiv.appendChild(goodWithBeadSpan);

        const goodWithBeadSpan2 = document.createElement("p");
        goodWithBeadSpan2.classList.add("bead", "goodwidth");
        goodWithBeadSpan2.textContent = `Gw`;
        beadDetDiv.appendChild(goodWithBeadSpan2);

        const goodWithBeadP = document.createElement("p");
        goodWithBeadP.classList.add("bead-description");

        const goodWithLink = document.createElement("a");
        goodWithLink.href = "https://blog.collegeboard.org/ap-courses-go-together";
        goodWithLink.target = "_blank";
        goodWithLink.textContent = "Good With: " + apCourse.attributes["Good With"];
        goodWithBeadP.appendChild(goodWithLink);
        beadDetDiv.appendChild(goodWithBeadP);
    }

        // Project Based bead with a link
        if (apCourse.attributes['Project Based']) {
            const projectBeadSpan = document.createElement('span');
            projectBeadSpan.classList.add('bead', 'project');
            projectBeadSpan.textContent = `PB`;
            beadContDiv.appendChild(projectBeadSpan);
    
            const projectBeadSpan2 = document.createElement("p");
            projectBeadSpan2.classList.add("bead", "project");
            projectBeadSpan2.textContent = `PB`;
            beadDetDiv.appendChild(projectBeadSpan2);
    
            const projectBeadP = document.createElement("p");
            projectBeadP.classList.add("bead-description");
    
            const projectLink = document.createElement('a');
            projectLink.href = 'https://blog.collegeboard.org/what-are-project-based-ap-courses';
            projectLink.target = '_blank';
            projectLink.textContent = 'Project Based';
            projectBeadP.appendChild(projectLink);
            beadDetDiv.appendChild(projectBeadP);
        }

         // major Score bead with custom labels
    const majorScore = parseFloat(apCourse.attributes['major Score']);
    let majorScoreLabel = '';
    if (majorScore < 10) {
        majorScoreLabel = `Specialized Course: Recommended for ${Math.floor(majorScore)}% of all majors`;
    } else if (majorScore >= 10 && majorScore < 40) {
        majorScoreLabel = `General Course: Recommended for ${Math.floor(majorScore)}% of all majors`;
    } else if (majorScore >= 40) {
        majorScoreLabel = `Common Course: Recommended for ${Math.floor(majorScore)}% of all majors`;
    }

    const majorScoreBeadSpan = document.createElement('span');
    majorScoreBeadSpan.classList.add('bead', 'majorScore');
    majorScoreBeadSpan.textContent = `C%:${majorScore}`;
    beadContDiv.appendChild(majorScoreBeadSpan);

    const majorScoreBeadSpan2 = document.createElement('span');
    majorScoreBeadSpan2.classList.add('bead', 'majorScore');
    majorScoreBeadSpan2.textContent = `C%:${majorScore}`;
    beadDetDiv.appendChild(majorScoreBeadSpan2);

    const majorScoreBeadP = document.createElement("p");
    majorScoreBeadP.classList.add("bead-description");
    majorScoreBeadP.textContent = `${majorScoreLabel}`;
    beadDetDiv.appendChild(majorScoreBeadP);

    // "3+" score bead with a link
    const score3Plus = parseFloat(apCourse.attributes['3+']);
    if (score3Plus) {
        const score3PlusBeadSpan = document.createElement('span');
        score3PlusBeadSpan.classList.add('bead', 'threePlus');
        score3PlusBeadSpan.textContent = `G.3+:${score3Plus}%`;
        beadContDiv.appendChild(score3PlusBeadSpan);

        const score3PlusBeadSpan2 = document.createElement('span2');
        score3PlusBeadSpan2.classList.add('bead', 'threePlus');
        score3PlusBeadSpan2.textContent = `G.3+:${score3Plus}%`;
        beadDetDiv.appendChild(score3PlusBeadSpan2);

        const score3PlusBeadP = document.createElement("p");
        score3PlusBeadP.classList.add("bead-description");

        const score3PlusLink = document.createElement('a');
        score3PlusLink.href = 'https://apstudents.collegeboard.org/about-ap-scores/score-distributions/2023';
        score3PlusLink.target = '_blank';
        score3PlusLink.textContent = `${score3Plus}% got 3+ in 2023 exams`;
        score3PlusBeadP.appendChild(score3PlusLink);
        beadDetDiv.appendChild(score3PlusBeadP);
    }

        // "5" score bead with classification and link
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
    
            const score5BeadSpan = document.createElement('span');
            score5BeadSpan.classList.add('bead', 'five');
            score5BeadSpan.textContent = `G.5:${score5}%`;
            beadContDiv.appendChild(score5BeadSpan);
    
            const score5BeadSpan2 = document.createElement('span');
            score5BeadSpan2.classList.add('bead', 'five');
            score5BeadSpan2.textContent = `G.5:${score5}%`;
            beadDetDiv.appendChild(score5BeadSpan2);
    
            const score3PlusBeadP = document.createElement("p");
            score3PlusBeadP.classList.add("bead-description");
    
            const score5Link = document.createElement('a');
            score5Link.href = 'https://apstudents.collegeboard.org/about-ap-scores/score-distributions/2023';
            score5Link.target = '_blank';
            score5Link.textContent = `${score5Class}: ${score5}% got 5 in 2023 exams`;
            score3PlusBeadP.appendChild(score5Link);
            beadDetDiv.appendChild(score3PlusBeadP);
        }


                // Append to the course entry
                courseDetDiv.appendChild(beadDetDiv);
                courseDiv.appendChild(courseNameDiv);
                courseDiv.appendChild(beadContDiv);
                courseDiv.appendChild(courseDetDiv);
                container.appendChild(courseDiv);
            }
        });
    }

    // Function to attach toggle functionality to dynamically created courses
    function attachToggleEvents() {
        // College Board list toggle functionality
        const cbCourseEntries = document.querySelectorAll("#cb-recommended .course-entry");
        cbCourseEntries.forEach((courseEntry) => {
            const toggleLink = courseEntry.querySelector(".cb-toggle-details");
            const courseDetails = courseEntry.querySelector(".course-details");

            toggleLink.addEventListener("click", (event) => {
                event.preventDefault();
                courseDetails.classList.toggle("show-details");

                cbCourseEntries.forEach((otherEntry) => {
                    if (otherEntry !== courseEntry) {
                        otherEntry.querySelector(".course-details").classList.remove("show-details");
                    }
                });
            });
        });

        // AI Recommended list toggle functionality
        const aiCourseEntries = document.querySelectorAll("#ai-recommended .course-entry");
        aiCourseEntries.forEach((courseEntry) => {
            const toggleLink = courseEntry.querySelector(".ai-toggle-details");
            const courseDetails = courseEntry.querySelector(".course-details");

            toggleLink.addEventListener("click", (event) => {
                event.preventDefault();
                courseDetails.classList.toggle("show-details");

                aiCourseEntries.forEach((otherEntry) => {
                    if (otherEntry !== courseEntry) {
                        otherEntry.querySelector(".course-details").classList.remove("show-details");
                    }
                });
            });
        });
    }
});
