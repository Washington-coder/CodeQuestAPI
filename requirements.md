# What is the project ?

CodeQuest is a web platform where programmers can acess to pratice their programming skills. So the main thing the users should do as soon as they log into the app is be able to answer some question about the tech stack they like. The result of the answers should be saved in some database ('I will define the database later and the cloud'). The app should have a good and youth energy in its design, make modern, simple and put some animations to make it smooth transaction in the components of the interface. The colors for fonts, backgrounds should have something to do with youth, energy and modernity. The font should remember programming and IT in some way. And finally make it easy to use, it should have a few functionalities at first like sidebar, navbar, go back button, users page, report.

# Functional Requirements

<!--- USER AUTHENTICATION -->

- [x] [RF-01] The app must allow users to register a new account using an email and password.

- [x] [RF-02] The app must allow users to log in with their email and password.

- [ ] [RF-03] The app must allow users to log in using their Google Accounts.

<!-- ONBOARDING & PREFERENCES -->

- [RF-04] The app must allow users to select their preferences (programming languages, frameworks, frontend/backend, and interface language) during onboarding.

<!-- QUESTION MODES (GENERAL) -->

- [RF-05] The app must support two distinct question-answering modes: Free Random Mode (based on onboarding preferences) and Quiz Mode (based on custom generated quizzes).

<!-- QUESTIONS & QUIZZES -->

- [RF-06] The app must allow users to view and answer questions based on their selected tech stack immediately after logging in.
- [RF-07] The app must allow users to view the results, along with a detailed explanation, immediately after answering a question.
- [RF-08] The app must allow users to retry a question after confirming their initial answer.

<!-- NAVIGATION BUTTONS -->

- [RF-09] In Free Random Mode, the question screen must display only a "Next Question" button to proceed to the next randomized question.
- [RF-10] In Quiz Mode, the question screen must display both "Previous Question" and "Next Question" navigation buttons.
- [RF-11] In Quiz Mode, the "Previous Question" button must be hidden or disabled when the user is on the first question of the quiz.
- [RF-12] In Quiz Mode, the "Next Question" button must be hidden or disabled when the user reaches the final question of the quiz.

<!-- QUIZZES GENERATION -->

- [RF-13] The app must allow users to filter questions by difficulty level (Easy, Medium, Hard).
- [RF-14] The app must allow users to create custom question quizzes.
- [RF-15] The app must allow users to enable or disable open-ended questions in their quizzes.
- [RF-16] The app must allow users to use a text field to further specify the type of questions to be generated for a quiz [BR-02].

<!-- HISTORY & DASHBOARD -->

- [RF-17] The app must allow users to view a history dashboard of questions answered over the last 7 days, featuring two charts:
  - A horizontal bar chart displaying daily performance (correct vs. incorrect answers per day).
  - A pie chart displaying the overall percentage and fraction of correct vs. incorrect answers.
- [RF-18] The app must allow users to filter their history by date range, correctness, category, and programming language.
- [RF-19] The app must display a dedicated section within the history page to view custom quizzes.
- [RF-20] The app must display each custom quiz in the history with a specific UI layout containing its name, total number of correct answers, total number of incorrect answers, and overall success percentage.
- [RF-21] The app must allow users to click on a custom quiz in the history to open a popup modal.
- [RF-22] The popup modal for a quiz must display an internal list of all specific questions belonging to that quiz.
- [RF-23] The app must display a detailed list of all individually answered questions directly below the charts.
- [RF-24] The app must allow users to click on any single item in the history list to view the full question details and the option they previously selected.

# Non-Functional Requirements

<!-- DESIGN & UX -->

- [RNF-01] The user interface must feature a modern, simple, and vibrant design with a youthful aesthetic.
- [RNF-02] The system must use a typography style that evokes a programming and IT aesthetic (e.g., monospace fonts).
- [RNF-03] The interface components must utilize smooth animations and transitions.
- [RNF-04] The horizontal bar chart must feature smooth lines and rounded corners (border radius).

# Business Rules

- [BR-01] The user's password must contain at least 8 characters, including at least 1 special character and 1 number.
- [BR-02] The text field used to specify custom quizzes has a strict limit of 100 characters.
