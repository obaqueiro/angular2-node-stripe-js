# NgStripePay

This sample project shows how to use stripe.js as a payment gateway with Angular 2 and Node.js. It allows developers to store away customer credit card detail as an encryted token for later charge without requesting for it again. 

## Development server

First create a local MySQL database and run the following table creation query:

    CREATE TABLE stripe (
        userId INT PRIMARY KEY AUTO_INCREMENT,
        amount FLOAT,
        stripeCustomerId VARCHAR(100),
        chargeStatus TINYINT(4)
    );

Then, navigate to `backend` folder, edit `server.js` to add your database info and run `node server.js` to get the backend running. Navigate back to the project folder and run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`
