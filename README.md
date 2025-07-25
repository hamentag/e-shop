# E-Shop Website
🔗 [GitHub Repository](https://github.com/hamentag/e-shop)
🔗 [Deployed site](https://prime.eshop-in.pro)
**********************
#### Demo account
> Use `demo@example.com` as the email and `eshop` as the password to log in
**********************
### Developers
> `Hamza Amentag `        
> `Soumya Zariouh`
### Summary
The E-Shop website is a full-stack application aimed at providing a seamless online shopping experience. With a focus on user-friendly features, streamlined order placement functionality, and efficient administrative tools, the platform caters to both customers and administrators. Key highlights include a comprehensive product catalog, persistent shopping carts, secure order processing, and an easy-to-use interface accessible across various devices.
**********************
### Application Functionality
The application encompasses multiple features designed to facilitate a seamless online shopping experience, addressing the following user stories:
* As a User (Not Logged In)
    * Access & Browsing: Users can access the website via the internet to browse and purchase products.
    * View Products: Users can see all available products.
    * Product Details: Users can view detailed information about each product.
    * Account Management: Users can create an account if they don't have one, or log into their existing account.
    * Sorting & Filtering: Users can sort and filter products by various characteristics.
    * UI/UX: The website offers an aesthetically pleasing and intuitive user interface across devices.
* As a User (Logged In)
    * Persistent Cart: Logged-in users have a persistent cart across devices.
    * Cart Management: Users can add, edit, and remove products from their cart. Changes are reflected only for the respective user.
    * Checkout: Users can check out items in their cart, simulating a typical e-commerce checkout experience.
    * Order History: Logged-in users can view their order history.
    * User Profile: Users can view and edit their profile information.
* As an Administrator
    * Product Management: Administrators can view, add, edit, and remove products.
    * User Management: Administrators have access to a list of all users and can modify or delete user accounts.
    * Order Management: Administrators can view all orders, modify order status, and manage stock status.
    * Dashboard: Administrators have access to a dashboard for streamlined management.
    * Order Management: Administrators can view and filter orders, modify order status, and promote user accounts.
* As an Engineer
    * Database Seeding: Engineers ensure a well-seeded database to simulate various scenarios.
    * Security: Engineers ensure user data security to prevent unauthorized access or manipulation.
**********************

### Setup Instructions



#### Daily Scheduled Task (pg_cron)

This project uses pg_cron to run a daily scheduled task at 6 AM that updates top brands in the database.

##### Setup Instructions (run once as admin)

1. Enable the pg_cron extension in your PostgreSQL database:

CREATE EXTENSION IF NOT EXISTS pg_cron;

2. Grant permission to your PostgreSQL user (skip this step if you're using a PostgreSQL superuser):

        GRANT USAGE ON SCHEMA cron TO your_user;
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA cron TO your_user;


3. Register the scheduled task (run this once to start the daily job):

        SELECT cron.schedule(
            'daily_top_brands',
            '0 6 * * *',
            $$SELECT update_top_brands();$$
        );

    This setup is only required during initial installation by the developer or admin.

