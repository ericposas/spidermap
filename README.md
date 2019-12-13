# Spidermap Application for American Airlines

## To do:

#### Programming:

  - Try to match Spider Map to AA's radial example


  - Generate PDF:
    - Clean up PDF export for listview (currently cuts words in half at page break)


#### Design:

  - Login:
    - On input boxes, hide border, add bottom border only


  - Spidermap, Pointmap, Listview panel buttons:
    - Match closer to mockups
    - Match dropdown input elements to mockups
    - reverse grey/white colors on inactive "generate map" buttons


  - Dropdowns:
    - Move multi-select dropdown by 10% to 20% of page height
    - Alter "Clear list" to be less prominent, text-style button (like "Edit")
    - Widen slightly "Export map" panel
    - File select dropdown -- stylize like mockups



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
