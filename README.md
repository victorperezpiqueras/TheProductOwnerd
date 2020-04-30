<img src="readme_images/avatar2.png" style="width:200px;">

# TheProductOwnerd

[![Build Status](https://travis-ci.com/victorperezpiqueras/TFG.svg?branch=master)](https://travis-ci.com/victorperezpiqueras/TFG)
![GitHub issues](https://img.shields.io/github/issues-raw/victorperezpiqueras/TFG)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/victorperezpiqueras/TFG)

## Table of Contents

- [Introduction](#introduction)
- [Showcase](#showcase)
- [Main Dependencies](#main-dependencies)
- [Get Started](#get-started)
- [Documentation](#documentation)

## Introduction

TheProductOwnerd is a web application focused on giving the Product Owner the tools to successfully manage software projects using an agile methodology. Using this application the Product Owner will be able to:

- Manage the Product Backlog of a project
- Invite new members to collaborate in the Scrum team
- Control the Product Burndown Chart and project specific metrics such as velocity
- Perform forecasting and predictions of the project and team performance

## Showcase

Login page:
![Login page](readme_images/cap1.PNG 'Login page')

Project view:
![Project view](readme_images/cap2.PNG 'Project view')

Product Backlog:
![Product Backlog](readme_images/backlog.PNG 'Product Backlog')

PBIs:

![animated demo screenshot](https://media.giphy.com/media/lr8TftXlHG6HFrlqmW/giphy.gif)

### Reporting

Project Burndown Chart:
![Project Burndown Chart](readme_images/pbc.PNG 'Project Burndown Chart')

Percentage of Completion:
![Percentage of Completion](readme_images/poc.PNG 'Percentage of Completion')

### Forecasting

Velocity:
![Velocity](readme_images/velocity.PNG 'Velocity')

Linear Regression:
![Linear Regression](readme_images/lr.PNG 'Linear Regression')

Polynomial Regression:
![Polynomial Regression](readme_images/pr.PNG 'Polynomial Regression')

---

## Main Dependencies

### Backend

- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Mustache](https://www.npmjs.com/package/mustache)
- [Nodemailer](https://nodemailer.com/about/)
- [Mysql2](https://www.npmjs.com/package/mysql2)
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

### Frontend

- [Angular 8](https://angular.io/)
- [Jasmine](https://jasmine.github.io/setup/nodejs.html)
- [Highcharts](https://www.highcharts.com/)
- [Ml-regression](https://www.npmjs.com/package/ml-regression)

## Get started

Clone the repo: `git clone https://github.com/victorperezpiqueras/TFG`

### Backend

To start the server in development mode you have to create the following file: `/backend/.env` with the following configuration:

```
DB_HOST = your-host-database-url
DB_USER = your-db-user
DB_PASSWORD = your-db-password
DB_DATABASE = your-db-name

MAIL_USER = your-email-for-invitations
MAIL_PASSWORD = your-email-password
MAIL_INVITE_LINK = http://localhost:4200/register/invitation/

JWT_KEY = your-jwt-password
```

Run the following commands to install backend dependencies:

```
cd backend && npm install
```

And run the server (from the root of the project or inside `/backend` ):

```
npm run dev
```

### Frontend

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng build` to build the project. The build artifacts will be stored in the dist/ directory. Use the --prod flag for a production build.

### Running unit tests

Run `ng test` to execute the Frontend unit tests via [Karma](https://karma-runner.github.io).

Run `cd backend && npm test` to run the Jasmine server unit tests.

## Documentation

### Sprint Reports

Every Sprint has a documentation issue associated to it. The report file is posted inside the issue.

### Labelling

| Label                                                                                      | Description                                 |
| ------------------------------------------------------------------------------------------ | :------------------------------------------ |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/feature)     | New features requested for the application  |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/defect)      | Bugs                                        |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/enhancement) | Enhancements for application features       |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/flow)        | Integration and flow related issues         |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/retro)       | Issues generated in the Scrum retrospective |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/debt)        | Technical Debt that has to be paid          |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/memoria)     | Report related issues                       |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/Epic)        | Epic issues                                 |
| ![GitHub labels](https://img.shields.io/github/labels/victorperezpiqueras/TFG/Sprint%201)  | Issue selected for Sprint X                 |
