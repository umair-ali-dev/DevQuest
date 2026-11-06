# DevQuest – Build. Solve. Level Up.

DevQuest is a MERN-stack competitive programming platform where developers can practice coding problems, execute solutions in multiple programming languages, track their progress, and compete through a leaderboard.

The platform provides an integrated coding workspace powered by Monaco Editor and Judge0, with automated test-case evaluation and personalized performance tracking.

## Features

### Authentication & User Management

- User registration and login.
- JWT-based authentication using HTTP-only cookies.
- Protected routes and authenticated API endpoints.
- Profile management.
- Password change functionality.
- User profile avatars with fallback handling.

### Coding Problems

- Browse published programming problems.
- View problem descriptions, constraints, examples, and difficulty levels.
- Problem categorization and tags.
- Difficulty levels: Easy, Medium, and Hard.
- Administrative problem management.
- Create, edit, publish, and manage coding problems.
- Test cases remain hidden from public problem responses.

### Coding Workspace

- Integrated Monaco code editor.
- JavaScript, Python, and Java support.
- Language selection with starter code.
- Run code with custom standard input (stdin).
- Submit solutions for automated evaluation.
- Resizable coding workspace.
- Execution console and test-case panel.
- Reset editor functionality.

### Code Execution & Evaluation

- Judge0 Community Edition integration.
- Remote code execution.
- Automated evaluation against problem test cases.
- Submission verdicts, including Accepted and Wrong Answer.
- Execution time and memory usage reporting.
- Individual test-case results.
- Server-side test-case evaluation.

### Submission History

- View previous submissions.
- Inspect submission verdicts.
- Filter and paginate submission records.
- Review submission details and results.

### Dashboard & Progress Tracking

- Total submissions.
- Unique problems solved.
- Acceptance rate.
- Daily coding activity.
- Current coding streak.
- Recent problems.
- Difficulty distribution.
- Activity visualization.

### Leaderboard

- User rankings.
- Competitive performance statistics.
- Paginated leaderboard results.

### Profile & Settings

- User profile editing.
- Coding statistics.
- Solved problem information.
- Recent submissions.
- Leaderboard ranking.
- Dark and light themes.
- Persistent theme preference.
- Account settings and password management.

### User Interface

- Responsive design.
- Dark and light themes.
- Dashboard navigation.
- Mobile-friendly layouts.
- Modern interface with Lucide icons.

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS v4
- Axios
- Monaco Editor
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Zod
- Helmet
- Express Rate Limit
- Cookie Parser
- CORS

### Code Execution

- Judge0 Community Edition (Public Instance)

### Database

- MongoDB Atlas

### Development & Deployment

- Git
- GitHub
- Render (planned deployment platform)

## Project Architecture

DevQuest follows a separated frontend and backend architecture within a single repository.

```text
DevQuest/
│
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # Authentication and theme contexts
│   │   ├── pages/           # Application pages
│   │   ├── services/        # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                  # Express backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Authentication and authorization
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── services/            # Business logic and Judge0 integration
│   ├── utils/               # Shared utilities
│   ├── validators/          # Request validation
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

Follow these instructions to run DevQuest locally.

### Prerequisites

Make sure you have installed:

- Node.js (LTS recommended).
- npm.
- Git.
- MongoDB Atlas account or a MongoDB instance.
- A modern web browser.

### 1. Clone the Repository

Replace `umair-ali-dev` with the GitHub account that owns the repository.

```bash
git clone https://github.com/umair-ali-dev/DevQuest.git
cd DevQuest
```

### 2. Install Frontend Dependencies

Open a terminal in the project root and run:

```bash
cd client
npm install
```

### 3. Configure Frontend Environment Variables

Create a `.env` file inside the `client` directory.

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Install Backend Dependencies

Open a second terminal in the project root and run:

```bash
cd server
npm install
```

### 5. Configure Backend Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

JUDGE0_API_URL=https://ce.judge0.com
JUDGE0_API_KEY=
```

#### Environment Variable Reference

| Variable | Description |
|---|---|
| `PORT` | Backend server port. |
| `NODE_ENV` | Application environment. |
| `CLIENT_URL` | Allowed frontend origin. |
| `MONGODB_URI` | MongoDB connection string. |
| `JWT_SECRET` | Private secret used to sign JWTs. |
| `JWT_EXPIRES_IN` | JWT expiration duration. |
| `JUDGE0_API_URL` | Judge0 execution API endpoint. |
| `JUDGE0_API_KEY` | Optional Judge0 API key, if required by the selected instance. |

**Security:** Never commit real `.env` files, database connection strings, JWT secrets, API keys, or other credentials. Keep secrets in backend environment variables. Variables prefixed with `VITE_` are bundled into the browser application and must never contain secrets.

### 6. Run the Backend

From the `server` directory:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

API health endpoint:

```text
http://localhost:5000/api/health
```

### 7. Run the Frontend

From the `client` directory in the other terminal:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

You should now be able to use DevQuest locally.

## Code Execution

DevQuest integrates with the public Judge0 Community Edition instance.

The application currently supports:

| Language | Judge0 Language ID |
|---|---:|
| JavaScript | 63 |
| Python | 71 |
| Java | 62 |

Code execution is handled through the backend rather than exposing execution configuration or credentials in the frontend.

**Important:** The public Judge0 instance is an external service. Submitted source code and execution input are sent to that service for processing. Its availability, usage limits, and policies are outside DevQuest's control. Do not submit secrets or sensitive personal data as code or input.

## Security Considerations

DevQuest includes several security measures:

- Password hashing with bcryptjs.
- JWT authentication.
- HTTP-only authentication cookies.
- Protected API routes.
- Role-based administrative access.
- Request validation using Zod.
- Rate limiting on sensitive endpoints.
- Helmet security headers.
- CORS origin restrictions.
- Hidden problem test cases.
- Server-side submission evaluation.
- Environment-based secret management.

Before production deployment, configure HTTPS, exact allowed origins, secure cookie settings, and appropriate CSRF protection for the actual frontend/backend hosting arrangement. Review proxy and rate-limit configuration for the hosting provider.

## Deployment

The planned production architecture uses Render with two separate services:

| Component | Render Service |
|---|---|
| React frontend | Static Site |
| Express backend | Web Service |
| Database | MongoDB Atlas |
| Code execution | Public Judge0 CE |

Production environment variables must be configured through Render's environment settings. Do not put backend secrets in frontend build variables.

The application has been prepared for deployment, but production hosting and deployment configuration are not yet completed.

## Development Status

- [x] MERN project foundation.
- [x] MongoDB Atlas integration.
- [x] Authentication and authorization.
- [x] Problem management.
- [x] Monaco coding workspace.
- [x] Judge0 integration.
- [x] Automated submission evaluation.
- [x] Submission history.
- [x] Dashboard and progress tracking.
- [x] Leaderboard.
- [x] User profile and settings.
- [x] Dark and light themes.
- [x] ESLint checks.
- [x] Production frontend build.
- [ ] GitHub repository setup and initial push.
- [ ] Render production deployment.
- [ ] Production deployment verification.

## License

No open-source license has been added yet. All rights are reserved by the project owner unless a license is subsequently added.

---

**DevQuest — Build. Solve. Level Up.**
