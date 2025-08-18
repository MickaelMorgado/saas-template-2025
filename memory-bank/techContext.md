Y# Tech Context

## Supabase Database Schema

This document outlines the current structure of the Supabase database, including tables, columns, and row-level security (RLS) policies.

### Core Tables (from `database.sql`)

#### `users`
- **Purpose:** Stores user profile information, linked to `auth.users`.
- **RLS:** Enabled.
  - Users can view their own data.
  - Users can update their own data.
- **Trigger:** `handle_new_user` automatically creates a user profile upon sign-up.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Foreign key to `auth.users`. Primary key. |
| `full_name` | `text` | User's full name. |
| `avatar_url` | `text` | URL for the user's avatar image. |
| `billing_address` | `jsonb` | Customer's billing address. |
| `payment_method` | `jsonb` | Customer's payment instruments. |

#### `customers`
- **Purpose:** Maps user IDs to Stripe customer IDs.
- **RLS:** Enabled. This is a private table with no policies, making it inaccessible to users.

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Foreign key to `auth.users`. Primary key. |
| `stripe_customer_id` | `text` | The user's customer ID in Stripe. |

#### `products`
- **Purpose:** Stores product information synced from Stripe.
- **RLS:** Enabled.
  - Public read-only access is allowed.

| Column | Type | Description |
|---|---|---|
| `id` | `text` | Product ID from Stripe. Primary key. |
| `active` | `boolean` | Whether the product is available for purchase. |
| `name` | `text` | Product name. |
| `description` | `text` | Product description. |
| `image` | `text` | URL of the product image in Stripe. |
| `metadata` | `jsonb` | Additional structured information. |

#### `prices`
- **Purpose:** Stores pricing information for products, synced from Stripe.
- **RLS:** Enabled.
  - Public read-only access is allowed.

| Column | Type | Description |
|---|---|---|
| `id` | `text` | Price ID from Stripe. Primary key. |
| `product_id` | `text` | Foreign key to `products`. |
| `active` | `boolean` | Whether the price can be used for new purchases. |
| `description` | `text` | A brief description of the price. |
| `unit_amount` | `bigint` | Price in the smallest currency unit. |
| `currency` | `text` | Three-letter ISO currency code. |
| `type` | `pricing_type` | `one_time` or `recurring`. |
| `interval` | `pricing_plan_interval` | `day`, `week`, `month`, or `year`. |
| `interval_count` | `integer` | Number of intervals between billings. |
| `trial_period_days` | `integer` | Default number of trial days. |
| `metadata` | `jsonb` | Additional structured information. |

#### `subscriptions`
- **Purpose:** Stores user subscription information, synced from Stripe.
- **RLS:** Enabled.
  - Users can only view their own subscriptions.

| Column | Type | Description |
|---|---|---|
| `id` | `text` | Subscription ID from Stripe. Primary key. |
| `user_id` | `uuid` | Foreign key to `auth.users`. |
| `status` | `subscription_status` | `trialing`, `active`, `canceled`, etc. |
| `metadata` | `jsonb` | Additional structured information. |
| `price_id` | `text` | Foreign key to `prices`. |
| `quantity` | `integer` | Number of units/seats. |
| `cancel_at_period_end` | `boolean` | If true, subscription will be canceled at the end of the billing period. |
| `created` | `timestamp with time zone` | Creation timestamp. |
| `current_period_start` | `timestamp with time zone` | Start of the current billing period. |
| `current_period_end` | `timestamp with time zone` | End of the current billing period. |
| `ended_at` | `timestamp with time zone` | End timestamp if the subscription has ended. |
| `cancel_at` | `timestamp with time zone` | Future cancellation timestamp. |
| `canceled_at` | `timestamp with time zone` | Cancellation timestamp. |
| `trial_start` | `timestamp with time zone` | Trial start timestamp. |
| `trial_end` | `timestamp with time zone` | Trial end timestamp. |

### Migrated Tables

#### `homepage_sections`
- **Purpose:** Manages dynamic content sections on the homepage.
- **RLS:** Enabled.
  - Public read access is allowed.
  - Authenticated users can insert, update, and delete records.

| Column | Type | Description |
|---|---|---|
| `id` | `bigint` | Primary key. |
| `title` | `text` | Section title. |
| `content` | `text` | Section content. |
| `image_url` | `text` | URL for an associated image. |
| `cta_text` | `text` | Call-to-action button text. |
| `cta_url` | `text` | Call-to-action button URL. |
| `order` | `int` | Display order of the section. |
| `created_at` | `timestamptz` | Creation timestamp. |

### Manually Added Tables (from remote schema pull)

#### `admin_settings`
- **Purpose:** Stores admin-specific settings for the application.
- **RLS:** Enabled.
  - Only admins can access these settings.

| Column | Type | Description |
|---|---|---|
| `id` | `bigint` | Primary key. |
| `setting_name` | `text` | The name of the setting. |
| `setting_value` | `jsonb` | The value of the setting. |

#### `leads`
- **Purpose:** Captures lead information from contact forms or other sources.
- **RLS:** Not explicitly defined in the migration, but likely should be restricted.

| Column | Type | Description |
|---|---|---|
| `name` | `text` | Name of the lead. |
| `email` | `text` | Email of the lead. |
| `company` | `text` | Company of the lead. |
| `message` | `text` | Message from the lead. |

#### `user_roles`
- **Purpose:** Manages user roles, specifically for identifying administrators.
- **RLS:** Enabled.
  - Users can view their own role.
  - The service role can manage all roles.

| Column | Type | Description |
|---|---|---|
| `user_id` | `uuid` | Foreign key to `auth.users`. Primary key. |
| `is_admin` | `boolean` | Whether the user is an administrator. |
| `created_at` | `timestamp with time zone` | Creation timestamp. |

## Functions

#### `add_admin_role(admin_email text)`
- **Purpose:** Assigns the admin role to a user based on their email address.

#### `create_user_role()`
- **Purpose:** A trigger function that creates a default non-admin role for new users upon sign-up.

#### `is_admin()`
- **Purpose:** Checks if the currently authenticated user has the admin role.

#### `remove_admin_role(admin_email text)`
- **Purpose:** Removes the admin role from a user based on their email address.
