# Spidermap Application for American Airlines

## To do:

### Programming:

  UI:
  - Remove mandatory filename input before uploading csv
  - Add notification when csv is loading
  - Add notification for when you save a map

  Filtering Options:
  - Add Filtered Search for selected locations

  Generate PDF:
   - Clean up PDF export for listview (currently cuts words in half at page break)

  Charting:
    - Avoid adding labels twice (if origin label already exists, don't add the destination label for the same place)
    - Adjusting label options will be reduced to the following options: Above, Below, Left, Right
      (..of the location dot)
    - Clicking on a destination label will toggle between the various modes/positions of the label.
      E.g. click once, label moves to the right of the dot; twice, to the bottom; three times, to the left; and last, back to the start (on top of the dot)
    Charting:Maybe:
      - Add "spread" factor from origin -- meaning, if the end user wants to increase X distance between destinations, they and increase or decrease
      - Add "bend" factor that adds extra curve to the plotted paths

### Design:
  Throughout:
    - Add AA fonts
    - Use AA grey on all fonts (that are black)
    - Change logo

  Login:
    - On input boxes, hide border, add bottom border only
    - "Please sign-in to continue" - change size to half to 75% of current size
    - Submit button - change to blue button style
    - Create account button - grey btn style
    - Align "create account" items to bottom of page

  Dashboard:
    - Move all Dashboard item down towards center (logo lockup, welcome msg, buttons)
    - Add all icons on options -- "create a map", "edit/view", etc.
    - Add a little more space between "create a map", "edit/view" buttons and widen the column that they live on
    - Shorten "Dashboard", "Back", and "Log out" buttons

  Spidermap, Pointmap, Listview panel buttons:
    - Match closer to mockups
    - Match dropdown input elements to mockups
    - reverse grey/white colors on inactive "generate map" buttons

  Dropdowns:
    - Move multi-select dropdown by 10% to 20% of page height
    - Alter "Clear list" to be less prominent, text-style button (like "Edit")
    - Widen slightly "Export map" panel
    - File select dropdown -- stylize like mockups
    - Remove "Save map" icon


#Tech Stack:
  - Lightsail ec2 compute instance
  - nginx server with reverse proxy
  - Strapi CMS API backend
  - React frontend

#Current Deployment Method:
  - Develop API on local machine
  - Push commits to github
  - Pull from git on Lightsail instance

#Scaling:
  - Pending / TBD
