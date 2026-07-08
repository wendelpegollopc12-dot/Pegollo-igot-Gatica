# Proj1

Basic ecommerce web page for learning system integration.

This project includes:
- Product CRUD using Supabase.
- Frontend using HTML, and JavaScript.
- Test payment checkout using PayMongo.
- Local backend using Node.js and Express.

## Accounts Needed

- Supabase: https://supabase.com/
- PayMongo: https://www.paymongo.com/products/accept-payments/payments-api

## Setup
- Install Extension/s: Live Server
- Install dependencies (just do npm install)

- Create a .env file. In the project root:
  
  SUPABASE_URL=your_supabase_project_url_here
  SUPABASE_KEY=your_supabase_anon_key_here
  PAYMONGO_SECRET_KEY=your_paymongo_test_secret_key_here

- Run Project: node server.js

### Notes
- do not forget to set up the database table. Copy the SQL from the supabase text file and paste it into the supabase SQL editor.
- localhost:5500 is the frontend ecommerce page.
- localhost:3000 is the payment backend.
- If localhost:3000 shows Cannot GET /, that is normal unless a homepage route is added.
- The Buy button sends a request to http://localhost:3000/create-checkout.
- Keep your PayMongo secret key only in .env, never in frontend JavaScript.
- Keep also your Supabase URL and Supabase key in .env so they are not committed directly in frontend files.
- Make sure that your .env is added to .gitignore before pushing the project to GitHub.
