# Hangout App

**Hangout App** is a social connection mobile application that enables users to build and engage with their network through 1st and 2nd-degree connections. The app allows users to connect with others directly, and also request hangouts with extended connections through mutual approvals. It is built using React Native for a responsive and native mobile experience, with a Node.js backend and MongoDB database for scalable data management.


## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Folder Structure](#folder-structure)
- [API Reference](#api-reference)
- [Future Enhancements](#future-enhancements)
- [Author](#author)
- [License](#license)


## Project Overview

The Hangout App is designed to simulate real-world social interaction logic. Every user can:

- Register and login securely
- Send and receive connection requests
- Accept or reject those requests
- View their 1st and 2nd-degree connections
- Send hangout requests to other users:
  - Direct hangout requests for 1st-degree connections
  - Routed hangout requests for 2nd-degree connections (requiring mutual approval)

The app maintains a clean and intuitive UI using material design principles with `react-native-paper`.


## Features

- Secure user registration and login with JWT-based token authentication
- Fetch and display all other users in the network
- Send connection requests and manage their status (sent, received, accepted)
- Send hangout requests, including conditional logic for 2nd-degree approvals
- Display connections in two categories:
  - 1st-degree: directly connected users
  - 2nd-degree: connected via a mutual user
- Responsive and modern mobile UI
- Scalable backend with clean RESTful API design


## System Architecture

Mobile App (React Native)
|
| Axios API Calls
v
Backend (Node.js + Express)
|
| Mongoose ODM
v
Database (MongoDB)

## Tech Stack

### Frontend (React Native)
- React Native
- react-native-paper (Material Design UI)
- react-native-vector-icons
- React Navigation
- Axios

### Backend (Node.js)
- Node.js
- Express.js
- Mongoose (MongoDB ODM)
- MongoDB (v8.0+)

---

## Setup Instructions

### Prerequisites

- Node.js and npm
- MongoDB (installed locally or MongoDB Atlas)
- React Native environment set up (Expo CLI or bare setup)

### Backend Setup

cd backend
npm install
node server.js
The backend runs on http://192.168.1.8:3001 or your own local IP.

Frontend Setup
cd frontend
npm install
npm start
Use a real device or emulator to run the React Native app.

Folder Structure
/HangoutApp
├── backend
│   ├── server.js
│   ├── models/
│   │   └── User.js
│   └── routes/
├── frontend
│   ├── App.js
│   ├── screens/
│   │   ├── UsersScreen.js
│   │   ├── RequestsScreen.js
│   │   └── ConnectionsScreen.js
│   ├── components/
│   └── utils/
API Reference
Authentication
POST /register: Register a new user

POST /login: Login and receive JWT token

Users
GET /users: Fetch all users

POST /send-request: Send a connection request

POST /accept-request: Accept a connection request

Hangout Requests
POST /send-hangout-request: Initiate a hangout request

Direct if 1st-degree

Requires mutual approval if 2nd-degree

Each request is stored with the fields:

{
  "from": "ObjectId",
  "via": "ObjectId (null for direct)",
  "status": "pending | approved | rejected"
}
