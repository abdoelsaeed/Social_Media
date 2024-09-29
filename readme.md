# Social Media API

## Table of Contents
- [About the Project](#about-the-project)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

This is a **Social Media API** that allows users to create accounts, post updates, follow other users,create story will delete after 24H,block user ,                                                                                         block list, ,and interact with each other by liking and commenting on posts. The project is built with **Node.js** and **Express.js** for the backend, and **MongoDB** is used for data storage.

## Features

- **User Authentication**: Users can register and login using JWT-based authentication.
- **User Profiles**: Users can update their profiles, add pictures, and share information.
- **Create Posts**: Users can create, update, and delete if you are the owner their posts.
- **Create Comments**: Users can create, update, and delete if you are the owner the post or comment their comment.
- **Create Reply on Comments**: Users can create, update, and delete if you are the owner the post or comment or reply their reply.
- **Create Story will remove after 24H**: Users can create, update, and delete their stories.
- **Likes**: Users can like  on posts or comments or replys.
- **Follow System**: Users can follow or unfollow other users and will show the following and followers.
- **Follow System**: Users can follow or unfollow other users.
- **Conversation System**: Users can follow or unfollow other users.
- **Notifications**: Users receive notifications when they are followed, or when someone likes/comments on their posts.

## Technologies Used

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **MongoDB**: NoSQL database for storing data.
- **JWT**: JSON Web Token for secure user authentication.
- **Pug**: Template engine for server-side rendering.
- **Nodemailer**: Module for sending emails from Node.js applications.
- **Helmet**: Secure HTTP headers middleware.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **Dotenv**: Module to load environment variables from a .env file.
- **Bcrypt**: Library to hash passwords.
- **Validator**: Library to validate and sanitize strings.
- **mongoSanitizer**: Data sanitization against nosql query injection

## API Documentation
You can find the Postman api [here](https://documenter.getpostman.com/view/32765959/2sAXqzWdmR)

## Getting Started
1. **Clone this repository to your local machine**
    ```sh
    git clone https://github.com/abdoelsaeed/Social_Media.git
    ```

2. **Install Dependencies**
    ```sh
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory of the project and configure the required environment variables.

4. **Start the Development Server**:
    ```sh
    npm start
    ```
# Contributing
I welcome contributions! Please fork the repository and create a pull request with your changes.