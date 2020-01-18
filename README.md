# Spidermap Application for American Airlines

## To do:
  - Prevent adding of duplicate react object (with same key -- aka location or destination)
    - this happens when two categories host the same location
  - Add bend or curve to the spidermap paths
  - Add interactivity/labels to the spidermap dots
  

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
