# VehicleCare – Vehicle Service Log

VehicleCare is a web application for managing vehicle details and service history in one place. Users can register or log in, manage their vehicles, record service details, and review upcoming service schedules.

## Features

- User registration and login with JWT authentication
- Add, view, update, and delete vehicles
- Record and manage vehicle service history
- View upcoming service schedules
- User-specific data protected by authentication

## Tech Stack

- **Frontend:** React, Vite, Bootstrap, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcryptjs

## Requirements

Install the following before running the project:

- Node.js and npm
- MongoDB Community Server

## Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd vehicle-service-log
```

### 2. Configure the backend

Open a terminal in the `server` folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
PORT=5000
JWT_SECRET=replace_with_a_long_random_secret
```

Make sure MongoDB is running locally.

### 3. Configure the frontend

Open another terminal in the project root:

```bash
cd client
npm install
```

## Run the Application

Start the backend in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

The backend API runs at `http://localhost:5000/api`.

## Project Structure

```text
vehicle-service-log/
├── client/          # React frontend
├── server/          # Express backend
├── .gitignore
└── README.md
```

## Security Notes

- Keep `server/.env` private and do not commit it to Git.
- Use a strong, unique value for `JWT_SECRET`.
- Each user should access only their own vehicle and service records.

## Author

Ishwar Bachhav - ishwarbachhav2611@gmail.com
