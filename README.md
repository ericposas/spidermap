# Spidermap Application for American Airlines

To do:
  Searchable Dropdowns and CSV option:
    - Create searchable dropdowns for the following..
    - Search by Code
    - Search by Region
    - CSV upload option
  Timer:
    - Set a time limit on the sessionStorage -- auto logout()
    - Use setTimeout() with a timer of 15 minutes or so
    - Every time the user interacts with the application, reset the timer
    - Upon timer run out, invalidate the jwt by deleting the sessionStorage variable
    - Upon timer run out, redirect user to a "you have been logged out page"

Tech Stack:
  - ec2 compute instance
  - nginx server with reverse proxy
  - strapi api backend
  - react frontend

Current Deployment Method:
  - Develop API on local machine
  - If adding new Content Types, you'll need to do that locally and then update the server application
  - Push commits to github
  - Push updates manually via scp or rsync to ec2 instance

Scaling:
  - Upgrade ec2 instance before production
  - Increase elastic block storage on ec2 instance before production
  - Upgrade mongodb replica set before production
