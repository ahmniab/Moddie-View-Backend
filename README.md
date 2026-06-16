<div align="center">
  <img src="media/images/ModdieView-Room.png" alt="ModdieView Room" width="100%" />
  <img src="media/images/animated-title.svg" alt="ModdieView" />
  <p>A real-time, synchronized media viewing application to watch videos together with friends.</p>
</div>

# Moddie View Backend


This backend powers the Moddie View application, handling real-time synchronization via WebSockets, interacting with the YouTube API for video search, and managing room states.

## Technologies Used

- **Node.js** & **Express**: For the core server and REST API.
- **Socket.io**: For real-time bidirectional event-based communication.
- **TypeScript**: For static typing and better developer experience.
- **Redis**: For caching and state management.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v16.0.0 or higher)
- [npm](https://www.npmjs.com/)
- [Redis](https://redis.io/)


## Environment Variables

The project uses `.env` files located in the `config` directory. To run the project locally, modify `config/.env.development` with the required variables. Here is an example of what it looks like:

```env
## Environment ##
NODE_ENV=development

## Server ##
PORT=3000
HOST=localhost

## Setup jet-logger ##
JET_LOGGER_MODE=console
JET_LOGGER_FILEPATH=jet-logger.log
JET_LOGGER_TIMESTAMP=true
JET_LOGGER_FORMAT=line

## Redis ##
REDIS_HOST=localhost
REDIS_PORT=6379
# REDIS_USERNAME=default
# REDIS_PASSWORD=

## External APIs ##
YOUTUBE_API_KEY=your_youtube_api_key_here

## Security / Auth ##
JWT_SECRET=your_jwt_secret_here
```

## Getting Started

Follow these steps to get the backend up and running locally.

### 1. Install Dependencies

```bash
npm install
```
*(Or use `npm run clean-install` for a fresh installation)*

### 2. Configure Environment Variables

Navigate to the `config` folder and ensure `.env.development` is set up correctly with your database credentials and API keys.

### 3. Start Database and Redis

Make sure that your Redis and PostgreSQL instances are running and accessible on the ports specified in your `.env.development` file.

### 4. Run the Application

**Development Mode:**
To run the server with hot-reloading for development:
```bash
npm run dev:watch
```

**Production Mode:**
To build and run the server in a production-like environment:
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev`: Runs the application in development mode using `ts-node`.
- `npm run dev:watch`: Runs the application in development mode using `nodemon` for auto-restarts on file changes.
- `npm run build`: Lints the code and compiles TypeScript to JavaScript in the `dist` folder.
- `npm start`: Runs the compiled application in production mode.
- `npm run lint`: Runs ESLint on the project.
- `npm run format`: Formats the code using Prettier.
- `npm test`: Runs the test suite using Vitest.
- `npm run clean-install`: Removes `node_modules` and `package-lock.json`, then performs a fresh install.

## API & WebSockets

The backend exposes an Express API and a Socket.io server.

### Express Routes
- **`GET /api/youtube/search`**: Searches for YouTube videos (requires `YOUTUBE_API_KEY`).
- **`POST /api/room`**: Creates a new room and returns the room details.

### Socket.io
- The WebSocket server runs on the same port as the HTTP server.
- Used to handle room state, synchronize media playback, and process real-time events between users in a room.