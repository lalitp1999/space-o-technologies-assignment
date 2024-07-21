
# Clone the repository:
https://github.com/lalitp1999/space-o-technologies-assignment.git

# Install the dependencies:
composer install

# Copy the .env.example to .env:
cp .env.example .env

# Generate the application key:
php artisan key:generate

# Set up your database credentials in the .env file.

# Set News api Key
NEWSAPI_KEY=17ef36b0ce904ad8915b32687216cd67

# Run the migrations:
php artisan migrate --seed

# node module dependencies
npm install

# Run project Laravel 
php artisan serve

# Run React Project same path open new terminal
npm run dev

# If any have test api then open this link becuase I have used to api tester.
http://127.0.0.1:8000/api-tester

# check Test Case I have create test case 
php artisan test