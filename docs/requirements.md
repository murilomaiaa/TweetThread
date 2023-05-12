# Use cases
## Auth
- SignUp
  As a user, I want to create an account with a valid email and password. 
  **POST /auth/signup** 
  - Return a success message as a response.
  
- Login 
  As a user I want to authenticate using email and password 
  **POST /auth/login** 
  - Return a success message and a JSON Web Token (JWT) for authenticated requests.

## Tweet Threads
- Create Thread
  As a authenticated user, I want to create a tweeter thread sending a transcript. To generate this thread, the application will use ChatGPT API
  **POST /tweet-threads** 
  - Return the generated tweet thread as a response.

## List Threads
- List Threads 
  As a authenticated user, I want to list all my tweet threads.
  **GET /tweet-threads** 
  - Return the tweet threads as a response.