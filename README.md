# Spidermap Application for American Airlines

##To do:

  Generate PDF:
   - For all map types

  Database Saves:
    - Save user's created maps to their User profile in the form of the CSV parser
    - Will save a simple list (DFW, LAX, PHX, PHL, etc.) in the database for a specific user

  Setting Origins and Destinations:
    - Add a quick "loading" graphic or animation when lists are getting data from the server
      (small loading ui graphic on the side of the dropdown list menu)
    - Create a "Clear list" button that clears the selectedOrigin, selectedOrigins and selectedDestinations arrays

  CSV Upload:
    - Add a way to close the modal if user changes mind and doesn't want to upload

  Charting:
    - Avoid adding labels twice (if origin label already exists, don't add the destination label for the same place)
    - Adjusting label options will be reduced to the following options: Above, Below, Left, Right
      (..of the location dot)
    - Clicking on a destination label will toggle between the various modes/positions of the label.
      E.g. click once, label moves to the right of the dot; twice, to the bottom; three times, to the left; and last, back to the start (on top of the dot)
    Charting:Maybe:
      - Add "spread" factor from origin -- meaning, if the end user wants to increase X distance between destinations, they and increase or decrease
      - Add "bend" factor that adds extra curve to the plotted paths


  Timer:
    - Set a time limit on the sessionStorage -- auto logout()
    - Use setTimeout() with a timer of 15 minutes or so
    - Every time the user interacts with the application, reset the timer
    - Upon timer run out, invalidate the jwt by deleting the sessionStorage variable
    - Upon timer run out, redirect user to a "you have been logged out page"

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
