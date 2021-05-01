# Exercise Tracker

A small, responsive full-stack app to keep track of your workouts. Built for FreeCodeCamp's APIs and Microservices certification [(completed in April 2021)](https://www.freecodecamp.org/certification/cvega21/apis-and-microservices).

## How To Use
1. Type your name and press submit to create a unique user ID. 
      - If name has already been submitted, backend will return its corresponding user ID
3. After typing your user ID, submit a workout with type, length and date. 
      - If no date is specified, defaults to today
5. Retrieve list of all workouts submitted.
      - If no limit is specified, retrieves all workouts


## Tech Stack / Architecture
The app is built on the **MERN Stack**, using a **React** front-end, a **Node.JS**/**Express** back-end, and a **MongoDB** Atlas database hosted on the cloud. Each screen consists of its own React Component, which uses modern react features such as functional components and hooks. All state is kept at the component level, with the exception of 'which window is currently active' being kept at the top level. Additionally, I used the following libraries:
- React Bootstrap
- Font Awesome
- canvas-confetti 
- Mongoose


## What I Learned

#### Practical
- Baby stages of user / auth management
- Copy to clipboard using JS
- Interactivity/UX flags (e.g. button turns grey when loading)
- Displaying data of unknown length
- Displaying properly on mobile
- Working with functions that depend on other async functions
- Logging information from application code

#### Big Picture
- Why it's important to break down application into components
- Why you should always handle errors/edge cases from the back-end (and even from the front-end, but ideally you would not be serving bad data/responses)
- The need for Don't Repeat Yourself (DRY) to reduce unnecessary code

## Next Steps
For future refactoring, which might or might not ever happen, the following things need to be addressed:

- Need to create an interface for checkIfUserExists(), which is the basic function used in every API call. It's currently being defined and initialized inside every route function, which is inefficient and inconsistent as they don't all return the same thing (e.g. some return functions and some return data, some close the db connection in the call, others close it in .then()). Although all connections have been closing properly, the last mentioned issue could lead to unexpected behavior in the case of many concurrent connections.
- Looks like triggering the calls from front end with useEffect might be resulting in fetch() being called more than once for the same logical action - this was seen in the network requests part of the console. Need to check why this is happening, on which calls it happens, and how to implement the ux flags in a different way if it's caused by useEffect
- Create a reusable component for the active window, which will then be 'implemented' by each window (e.g. create user, submit workout, search history). Also could create components for the input forms, as well as for the buttons which would remove dependency on Bootstrap
- Fix the date input forms' width and copy to clipboard on mobile
    - Looks like copy to clipboard might have also broken on web
- Make application more lightweight by removing Bootstrap and using Font Awesome from CDN
- Reduce the size of CSS by grouping together classes with the same attributes
