# Frontend Guidelines for Supabase Integration

This document provides standardized guidelines for integrating Supabase into our frontend projects, ensuring consistency, maintainability, and ease of onboarding for new developers.

## 1. Singleton Instance of Supabase Client
**Principle:**
Always use a single instance of the Supabase client throughout the entire project to prevent multiple connections, reduce overhead, and ensure consistent behavior.

**Implementation:**

Create a dedicated file, e.g., `src/lib/supabaseClient.ts`, that exports a singleton instance.
Import this instance wherever needed, avoiding re-instantiation.

**Example:**

```typescript
// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**Usage:**

```typescript
import { supabase } from 'src/lib/supabaseClient';

// Use supabase for queries, auth, etc.
```

## 2. Dedicated Edge Functions Management
**Principle:**
Create a specific file for managing the names and invocation of edge functions. This centralizes function references, making updates and maintenance easier.

**Implementation:**

Create a file, e.g., `src/utils/edgeFunctions.ts`.
Export constants or functions that return the edge function names or URLs.

**Example:**

```typescript
// src/utils/edgeFunctions.ts

export const EDGE_FUNCTIONS = {

  getUserData: 'get-user-data',

  submitForm: 'submit-form',

  // Add other edge function names here

};
```

**Usage:**

```typescript
import { EDGE_FUNCTIONS } from 'src/utils/edgeFunctions';

const { data, error } = await supabase.functions.invoke(EDGE_FUNCTIONS.getUserData, { body: {...} });
```

## 3. Generating Supabase Types
**Principle:** Before working on a feature that requires Supabase data, run the `gen-types` script to get all available invoke function names. This will provide more context of the Supabase structure to implement features.

**Implementation:**

```bash
npm run gen-types
```

## 4. Consistent Naming and Usage
- Use clear, descriptive names for all functions, variables, and constants.
- Follow a naming convention (e.g., camelCase for functions, UPPER_SNAKE_CASE for constants).
- Document any custom edge functions with comments or in the dedicated file.

## 5. Security and Environment Variables
- Store your Supabase URL and keys in environment variables (`.env.local`, `.env.production`).
- Never hardcode sensitive credentials.
- Use `NEXT_PUBLIC_` prefix for variables that need to be exposed to the client.

## 6. Error Handling and Loading States
- Always handle errors gracefully.
- Provide user feedback for loading states.
- Use centralized error handling where possible.

## 7. Authentication
- Use Supabase Auth for user management.
- Keep auth logic centralized, e.g., in a dedicated auth service or store.
- Persist user sessions securely.
- Whenever possible, use the Supabase client instance from the `useAuthStore` hook to ensure all API requests are authenticated. For services that are not React components, the Supabase client should be passed as a parameter.

## 8. Code Quality and Documentation
- Write clear comments for complex logic.
- Document edge function names and their purposes in the dedicated file.
- Maintain consistent code style with Prettier and ESLint.

## 9. Onboarding for New Developers
1. Clone the project and install dependencies.
2. Set up environment variables (`.env.local`).
3. Review `src/lib/supabaseClient.ts` for singleton setup.
4. Familiarize with `src/utils/edgeFunctions.ts`.
5. Run the project and test basic Supabase operations.

## 10. Additional Best Practices
- Regularly update dependencies (`@supabase/supabase-js`).
- Write tests for critical data operations.
- Keep security in mind, especially with API keys and user data.
- All password validation should use the `PASSWORD_REGEX` constant from `src/lib/constants.ts` to ensure consistency.
- All password fields should have a visibility toggle with an eye icon.
- When creating a new step with radio buttons, use the `RadioCard` component to ensure consistency and maintainability.
- Use the `Typography` component from MUI for all text elements instead of native HTML tags like `h1`, `p`, etc. This ensures consistency in typography across the application.

## 11. Authenticated Edge Function Invocations
**Principle:**
All Supabase function invocations must be authenticated using the user's session. This ensures that only authenticated users can access protected edge functions.

**Implementation:**

Retrieve the `supabaseClient` and `session` from the `useAuthStore`.
Verify that a session exists before attempting to invoke a function.
Pass the `access_token` in the `Authorization` header.

**Example:**

```typescript
import { useAuthStore } from 'src/stores/authStore';

import { EDGE_FUNCTIONS } from 'src/utils/edgeFunctions';

// Inside a component or hook

const { supabaseClient, session } = useAuthStore();

const invokeMyFunction = async (payload: any) => {

  if (!session) {

    throw new Error('Not authenticated');

  }

  const { data, error } = await supabaseClient.functions.invoke(

    EDGE_FUNCTIONS.myFunction,

    {

      body: payload,

      headers: {

        Authorization: `Bearer ${session.access_token}`,

      },

    }

  );

  if (error) {

    // Handle error

  }

  return data;

};
```

This guideline aims to streamline Supabase integration, promote best practices, and facilitate onboarding. Developers should adhere to these standards to ensure a cohesive codebase.

---

## Supabase Google Auth Setup Guide

This guide provides a step-by-step process for configuring the Google Auth provider in Supabase, with a special focus on setting up the **Authorised redirect URIs**.

### 1. Enable Google Auth in Supabase

1.  Navigate to your Supabase project.
2.  Go to **Authentication** -> **Providers**.
3.  Find **Google** in the list and enable it.

### 2. Configure Google Cloud Console Project

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select your project or create a new one.
3.  Navigate to **APIs & Services** -> **Credentials**.
4.  Click **Create Credentials** and select **OAuth client ID**.
5.  Choose **Web application** as the application type.
6.  Give it a name (e.g., "Supabase Auth").

### 3. Set Authorised Redirect URIs

This is a critical step. You need to tell Google which URLs are allowed to be redirected to after a user authenticates.

1.  In your Supabase project's Google Auth provider settings, you will find a **Redirect URI**. It will look something like this:
    `https://<your-project-ref>.supabase.co/auth/v1/callback`

2.  Copy this URI.

3.  In the Google Cloud Console, under the **Authorised redirect URIs** section of your OAuth client ID configuration, paste the URI you copied from Supabase.

#### Handling Local Development

For local development (e.g., running your app on `localhost`), you need to add another redirect URI.

1.  When using the Supabase CLI for local development, the redirect URI will use your local Supabase instance. The URL is typically:
    `http://localhost:54321/auth/v1/callback`

2.  Add this local callback URI to the **Authorised redirect URIs** list in your Google Cloud Console.

**IMPORTANT:** You must have both the production URI and the local development URI in the Google Cloud Console to ensure authentication works in both environments.

### 4. Get Google Credentials

1.  After creating the OAuth client ID, Google will provide you with a **Client ID** and a **Client Secret**.
2.  Copy both of these values.

### 5. Finalize Supabase Configuration

1.  Go back to your Supabase project's Google Auth provider settings.
2.  Paste the **Client ID** and **Client Secret** from the Google Cloud Console into the corresponding fields in Supabase.
3.  Save the configuration.

Your Google Auth provider should now be set up correctly for both production and local development.
