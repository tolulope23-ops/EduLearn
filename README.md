# Edulearn

**Edulearn** is an **offline-first digital learning platform** designed to empower students in their educational journey while supporting **SDG 4 – Quality Education**. The platform allows learners to access lessons, complete quizzes, and track progress **offline**, and automatically synchronizes all activity with the backend once the device reconnects to the internet.  

Edulearn is specifically tailored for **students in rural areas** or regions with limited internet connectivity and expensive data, bridging the digital divide and promoting **inclusive education**.

---

## Table of Contents

- [Features](#features)  
- [Technology Stack](#technology-stack)  
- [Architecture Overview](#architecture-overview)  
- [Getting Started](#getting-started)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## Features

- **Offline Learning:** Download lessons and modules to continue learning without an internet connection.  
- **Progress Tracking:** Automatically track lesson completion, quiz scores, and module progress.  
- **Seamless Sync:** Offline activity syncs with the backend when internet is restored.  
- **Quizzes & Assessments:** Each module includes quizzes for knowledge checks and feedback.  
- **Modular Content Structure:** Courses are divided into modules and submodules for organized learning.  
- **Inclusive Education:** Designed to help students in low-connectivity areas continue learning.  
- **Cross-Platform Support:** Works across devices, enabling anytime, anywhere access.  

---

## Technology Stack

- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **ORM:** Sequelize  
- **Authentication:** JWT-based authentication for secure access  
- **Frontend:** React (offline support via Service Workers)  
- **Testing:** Jest / Mocha for unit and integration tests  
- **Deployment:** CI/CD pipelines (GitHub Actions, Render)

---

## Architecture Overview

Edulearn uses a **modular backend architecture**:

1. **User & Authentication Module:** Handles student signup, login, and JWT authentication.  
2. **Course & Lesson Module:** Manages courses, modules, submodules, and lesson content.  
3. **Quiz Module:** Handles quiz questions, options, scoring, and progress tracking.  
4. **Offline Sync Module:** Tracks offline activity and syncs with backend when online.  
5. **Progress Tracking Module:** Stores student activity, module completion, and quiz results in the database.  

The system follows a **RESTful API design**, enabling frontend clients to interact with backend endpoints efficiently.  

---

## Getting Started

These instructions will help you set up Edulearn **locally** for development and testing purposes.

### Prerequisites

- Node.js v24+ 
- npm or yarn  
- MySQL
- Git  

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/<tolulope23-ops>/edulearn.git
cd edulearn
```
2. Install dependencies:

```bash
npm install
```
3. Set up environment variables:
#### Check .env.example

4. Run database migrations:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
5. Start the server:
```bash
npm run dev
```

## Contributing
### Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m "Add feature")
4. Push to the branch (git push origin feature/your-feature)
5. Open a Pull Request

Please follow the code style and ensure tests pass before submitting a PR.

## License
This project is licensed under the MIT License – see the LICENSE file for details.

## Contact
For questions or suggestions:

GitHub: https://github.com/<tolulope23-ops>

Email: tolulope.r.adeyemi@gmail.com

