
# Social Media API

This repository contains the backend API for a social media application built with Node.js and TypeScript. The API supports functionalities like post creation, comment management, file storage, and caching. Designed with scalability and modularity in mind, this project follows microservices principles like CQRS and uses Kafka for communation between services, Redis for caching, and MongoDB for data persistence.

Inorder prod deployment, I would use S3 for file management, instead using local, gets Presigned-url from S3, use public storage to make images available

## Table of Contents

- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## Project Structure

```plaintext
social-media-api/
├── src/
│   ├── config/              # Configuration files and environment setup
│   ├── commands/            # CQRS commands for actions like creating posts
│   ├── queries/             # CQRS queries for retrieving data
│   ├── handlers/            # Request and event handlers
│   ├── mediator/            # Mediator pattern for command/query handling
│   ├── models/              # Mongoose models for database entities
│   ├── producer/            # Kafka producers for message publishing
│   ├── redis/               # Redis caching utilities
│   ├── routes/              # API route definitions
│   ├── utils/               # Utility functions and helpers
│   ├── validation/          # Request validation schemas
│   ├── exceptions/          # Custom exceptions for error handling
│   ├── file-storage/        # File handling and storage logic
│   ├── tests/               # Test cases for API endpoints and services
│   └── index.ts             # Main entry point
├── .env.dev                 # Example environment file for development
├── docker-compose.yml       # Docker Compose file for containerized setup
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project metadata and dependencies
```

## Setup and Installation

### Prerequisites

- Node.js and npm installed on your machine.
- Docker and Docker Compose.

### Installation

1. **Clone the repository:**
   
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the root directory, using `.env.dev` as a reference, and add necessary environment variables (see [Environment Variables](#environment-variables)).

4. **Run the Application with Docker:**
   Use Docker Compose to start up the application and its dependencies.
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

5. **Start the Application in Development Mode:**
   For direct local development, run:
   ```bash
   npm run start-dev
   ```

### Environment Variables

The following environment variables should be set in your `.env` file:

```plaintext
KAFKA_BROKERS=localhost:9092,localhost:9093
KAFKA_CLIENT_ID=API_SERVER
MONGO_URL=mongodb://localhost:27017/social_media
POST_EVENT_TOPIC=post-events
COMMENT_EVENT_TOPIC=comment-events
FILE_BASE_URL=http://localhost:3000/
```

## Usage

The API provides several endpoints for interacting with posts, comments, and files. These include endpoints for:

- **Creating posts with images**
- **Adding and deleting comments**
- **Retrieving paginated lists of posts with comments**

### API Endpoints

See more details from postman json

- `POST /api/posts/` - Create a new post.
- `GET /api/posts/` - Retrieve all posts with pagination.
- `POST /api/posts/:id/comments` - Add a comment to a post.
- `DELETE /api/posts/:postId/comments/:commentId` - Delete a comment from a post.
- `POST /api/upload/:fileId` - Uploads a file to local storage system
- `GET /api/upload/presigned` - Generates presigned url to upload a file
- `GET /api/file/:filename` - View uploaded file
