
# AP Course Help

## Overview
**AP Course Help** is a web-based tool designed to assist high school students in selecting Advanced Placement (AP) courses that align with their future academic and career goals. Created by **Ege Yilmaz**, a 9th-grade student, this project was born from the need for clearer guidance in the often overwhelming AP course selection process.

The tool allows students to explore recommended AP courses based on specific majors and careers, using publicly available information from the College Board. While this tool is helpful, it should be used alongside official guidance from academic advisors and the College Board.

### Key Features
- **Major & Career-Based AP Recommendations:** Easily browse lists of AP courses recommended by the College Board for specific majors and careers.
- **All AP Courses Overview:** A complete list of all available AP courses grouped by subject area, with extra details such as popularity by grade and related fields.
- **Interactive Design:** Features a user-friendly interface, floating help buttons, and an embedded feedback form to gather user suggestions.
- **JSON Data Source:** All the data for majors, careers, and AP courses is stored in JSON format for easy maintenance and scalability.

## How It Works
1. **Select a Major or Career:** Choose either a major or a career to view the AP courses recommended for that path.
2. **AP Course Recommendations:** For each major or career, relevant AP courses are displayed with attributes such as "Popular in Grade X", "Project-Based", "Good With", and more.
3. **All Courses Listing:** A dedicated section lists all available AP courses, grouped by subject, allowing users to explore AP offerings comprehensively.

## Technology Stack
- **HTML/CSS/JavaScript:** Core technologies powering the front-end interface.
- **JSON Data Storage:** Majors, careers, and AP courses are stored and fetched dynamically using JSON, ensuring fast, lightweight access to data.
- **GitHub Pages Hosting:** The project is hosted on GitHub Pages, making it easily accessible to anyone.

## Live Demo
Check out the live version of the project hosted on GitHub Pages [here](http://apcourse.help).

## Installation & Setup

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/apcourse-help.git
    cd apcourse-help
    ```

2. **View Locally:**
    Open the `index.html` file in your browser to run the site locally.

3. **JSON Data:** 
    All majors, careers, and AP course data is stored in the `json` folder and fetched dynamically by JavaScript.

## Disclaimer
This is an independent project created by Ege Yilmaz and is not affiliated with, endorsed by, or officially connected to the College Board. The information provided here is based on publicly available data from the College Board. For official guidance on AP courses and academic decisions, please consult the College Board website or your school advisors.

## License
This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.