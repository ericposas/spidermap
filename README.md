# Spidermap Application for American Airlines

To do:
- Set a time limit on the sessionStorage -- auto logout()

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
