# Spidermap Application for American Airlines

## To do:

#### Programming:

  - File Save:
    - Add JPG support


  - Legal / Comments:
    - Format legal/comment section in various map views


  - Generate PDF:
   - Clean up PDF export for listview (currently cuts words in half at page break)


  - Mapping:
    - Avoid adding labels twice (if origin label already exists, don't add the destination label for the same place)


  - Map Right-click Context menu (with a hint on main UI):
    - Options for elongating or shortening the location (1. code, 2. city, 3. full city code and region)
    - Options for altering location of the label (in relation to the dot): 1. Above, 2. Below, 3. Left, 4. Right


#### Design:

  - Throughout:
    - Shrink down logo by 25%
    - Use hi-res BG
    - Add AA fonts
    - Use AA grey on all fonts (that are black)
    - Change logo


  - Login:
    - On input boxes, hide border, add bottom border only
    - "Please sign-in to continue" - change size to half to 75% of current size
    - Submit button - change to blue button style
    - Create account button - grey btn style
    - Align "create account" items to bottom of page


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
    - Remove "Save map" icon



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
