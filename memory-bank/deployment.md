# Vercel Deployment Guide

This document outlines the process for deploying the Next.js application to Vercel.

## Deployment Plan

1.  **Connect to Vercel**: Connect the GitHub repository to a new Vercel project. This will enable continuous deployment, automatically deploying new changes pushed to the main branch.
2.  **Configure Environment Variables**: Add the necessary environment variables from the local `.env` file to the Vercel project settings. This includes secrets for Supabase and Stripe.
3.  **Deploy the Application**: Trigger the initial deployment on Vercel. The build process should run automatically.
4.  **Set Up a Custom Domain**: After a successful deployment, connect a custom domain through the Vercel dashboard.
5.  **Verify Deployment**: Test the deployed application to ensure all services are connected and functioning correctly.

## Vercel Project Details

-   **Project URL**: (To be added after deployment)
-   **Custom Domain**: (To be added after setup)

## Environment Variables

The following environment variables need to be configured in the Vercel project settings:

-   `NEXT_PUBLIC_SUPABASE_URL`
-   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
-   `SUPABASE_SERVICE_ROLE_KEY`
-   `STRIPE_SECRET_KEY`
-   `STRIPE_WEBHOOK_SECRET`
-   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
