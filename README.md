# Spidermap Application for American Airlines

##To do:

  Generate PDF:
   - Clean up PDF export for listview (currently cuts words in half at page break)

  Database Saves:
    - Filter out origin location in destinations list (pointmap map tile)
    - If 'isadmin' is true, show the option to save to the global map store

  Charting:
    - Avoid adding labels twice (if origin label already exists, don't add the destination label for the same place)
    - Adjusting label options will be reduced to the following options: Above, Below, Left, Right
      (..of the location dot)
    - Clicking on a destination label will toggle between the various modes/positions of the label.
      E.g. click once, label moves to the right of the dot; twice, to the bottom; three times, to the left; and last, back to the start (on top of the dot)
    Charting:Maybe:
      - Add "spread" factor from origin -- meaning, if the end user wants to increase X distance between destinations, they and increase or decrease
      - Add "bend" factor that adds extra curve to the plotted paths

  Optimization:
    - When a Dropdown component mounts, fetch the api resources (only if not exists in the store). Once set, we shouldn't need to fetch if the data is already in the Redux store. Currently, we fetch new data every time the Dropdown component mounts.

  Extra:
    - Create search for Adding Destinations / Removing Destinations


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
