# System Patterns: SaaS Web App Template 2025

## 1. System Architecture

The template leverages a modern Jamstack architecture with Next.js for the frontend and server-side rendering, and Supabase for the backend services.

- **Framework (Full-stack):** Next.js (via Next-forge) will handle both the client-side rendering (React components) and server-side logic (API routes, server components).
- **Backend as a Service (BaaS):** Supabase provides all backend functionalities, including:
  - **Authentication:** Handled by Supabase Auth.
  - **Database:** A managed Postgres database provided by Supabase.
  - **File Storage:** Managed by Supabase Storage.
  - **Serverless Functions:** Custom backend logic will be deployed as Supabase Edge Functions.

This architecture simplifies development and deployment by consolidating the backend into a managed service, while Next.js provides a powerful framework for building the user interface and application logic.

## 2. Design Patterns

- **Component-Based Architecture:** The frontend is built with reusable React components.
- **Serverless Functions:** Business logic that doesn't fit into the client-side or Next.js API routes will be implemented as serverless functions on Supabase.
- **Stateless Authentication:** Supabase Auth manages JWT-based sessions, ensuring the application remains stateless.

## 3. Critical Implementation Paths

- **Authentication Flow:** Integrate Next.js with Supabase Auth for user registration, login, session management, and protected routes.
- **Data Access:** Interact with the Supabase Postgres database using the `supabase-js` client library.
- **File Uploads:** Implement file uploads from the Next.js application to Supabase Storage.
- **Custom Logic:** Develop and deploy custom business logic using Supabase Edge Functions.
