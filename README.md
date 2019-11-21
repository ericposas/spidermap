# Spidermap Application for American Airlines

##To do:

  ListView:
    - Generate listview : in progress

  Database Saves:
    - Save user's created maps to their User profile

  Setting Origins and Destinations:
    - Add a quick "loading" graphic or animation when lists are getting data from the server
      (small loading ui graphic on the side of the dropdown list menu)
    - Create a "Clear list" button that clears the selectedOrigin, selectedOrigins and selectedDestinations arrays

  Charting:
    - Adjusting label options will be reduced to the following options: Above, Below, Left, Right
      (..of the location dot)

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
    - 

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
