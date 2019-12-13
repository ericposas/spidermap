# Spidermap Application for American Airlines

## To do:

#### Programming:

  - Try to match Spider Map to AA's radial example


  - Generate PDF:
    - Clean up PDF export for listview (currently cuts words in half at page break)


#### Design:

  - Throughout:
    - Use hi-res BG


  - Login:
    - On input boxes, hide border, add bottom border only
    - "Please sign-in to continue" - change size to half to 75% of current size


  - Dashboard:
    - Move all Dashboard item down towards center (logo lockup, welcome msg, buttons)
    - Add all icons on options -- "create a map", "edit/view", etc.
    - Add a little more space between "create a map", "edit/view" buttons and widen the column that they live on
    - Shorten "Dashboard", "Back", and "Log out" buttons


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
