# Spidermap Application for American Airlines

##To do:

  UI:
  - Change "Airport Code" / "Category" selection to tab above selection dropdown
  - Remove mandatory filename input before uploading csv
  - Add notification when csv is loading
  
  Search:
  - Add Filtered Dropdowns
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
