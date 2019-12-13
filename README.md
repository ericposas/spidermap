# Spidermap Application for American Airlines

## To do:

#### Programming:

  - Try to match Spider Map to AA's radial example


  - Generate PDF:
    - Clean up PDF export for listview (currently cuts words in half at page break)


#### Design:

  - Style upload .CSV modal

  - Style MyMaps and GlobalMaps map tiles

  - Dropdowns:
    - Move multi-select dropdown by 10% to 20% of page height


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
