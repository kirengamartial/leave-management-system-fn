# Leave Management System – Frontend

## Overview

This is the frontend application for the Leave Management System. It is built with React and provides a modern, user-friendly interface for employees and managers to manage leave requests, approvals, balances, and user profiles.

The frontend communicates with the backend microservices via the API Gateway.

---

## Features

- User authentication (email/password & Google OAuth2)
- Role-based dashboards (Staff, Manager, Admin)
- Leave application, approval, and history
- User profile management
- Responsive and modern UI

---

## Environment Variables

Create a `.env` file in the `frontend` directory with the following content:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Set this to your API Gateway's public URL in production (e.g., `https://leave-system.martialkirenga.engineer`).

---

## Setup & Running Locally

1. Clone the repository.
2. Navigate to the `frontend` directory.
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Create a `.env` file as shown above.
5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
6. The app will be available at `http://localhost:5173` by default.

---

## Useful Links

- **Production Backend:** [https://leave-system.martialkirenga.engineer](https://leave-system.martialkirenga.engineer)
- **API Gateway Docker Image:** [martial123/api-gateway](https://hub.docker.com/r/martial123/api-gateway)

---

## Notes

- This frontend is designed to work with the backend microservices architecture described in the backend README.
- Make sure the API base URL matches your backend deployment.
# leave-management-system-fn
