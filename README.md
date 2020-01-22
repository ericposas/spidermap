# Spidermap Application for American Airlines

## To do:
  - Update order (alpha sort) of saved spidermap locations
  - Use system fonts when exporting jpg/png image

#### Tech Stack:
  - Lightsail ec2 compute instance
  - nginx server with reverse proxy
  - Strapi CMS API backend
  - React frontend

#### Current Deployment Method:
  - Develop application on local machine
  - `git push` on local machine
  - `git pull` on Lightsail instance
  - `cd spidermap/strapi-backend/`
  - `pm2 start -- strapi start`

#### Scaling:
  - Pending / TBD
