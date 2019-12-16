# Spidermap Application for American Airlines

## To do:

#### Programming:

  - Add "Update Existing" and "Save as New" options when saving maps to DB


#### Design:

  - Style upload .CSV modal

  - Style MyMaps and GlobalMaps map tiles


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
