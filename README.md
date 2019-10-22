# Spidermap Application for American Airlines

Tech Stack:
- ec2 compute instance
- nginx server with reverse proxy 
- strapi api backend
- react frontend

Current Deployment Method:
- Develop API on local machine
- Push commits to github
- Push updates manually via scp or rsync to ec2 instance

Scaling:
- Upgrade ec2 instance before production
- Upgrade mongodb replica set before production 
