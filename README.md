# Spidermap Application for American Airlines

##To do:

  Uploaded Files:
    - Create a 'My Files' component that will list a user's uploaded CSV files
    
  Database Saves:
    - Save user's created maps to their User profile

  Optimization:
    - When a Dropdown component mounts, fetch the api resources (only if not exists in the store). Once set, we shouldn't need to fetch if the data is already in the Redux store. Currently, we fetch new data every time the Dropdown component mounts.

  Setting Origins and Destinations:
    - Add a quick "loading" graphic or animation when lists are getting data from the server
    - Create a "Clear list" button that clears the selectedOrigin, selectedOrigins and selectedDestinations arrays

  Charting:
    - We will need some sort of manual adjustment for labels -- collision avoidance for paths and text is very difficult. Maybe we have a "labeling" option on the GeneratePointmap page that allows the end user to edit the x and y coords of each label in increments
    - Point-to-point map logic is in a great place
    - Need to modify the point-to-point map to a spidermap version with only one origin point

  CSV option:
    - CSV upload option
    - decide on a CSV format
    - format should delimit origins and destinations
    - use npm csv-reader
    - create route that can parse the data -- and send to the frontend to generate the ski/spider map

  Timer:
    - Set a time limit on the sessionStorage -- auto logout()
    - Use setTimeout() with a timer of 15 minutes or so
    - Every time the user interacts with the application, reset the timer
    - Upon timer run out, invalidate the jwt by deleting the sessionStorage variable
    - Upon timer run out, redirect user to a "you have been logged out page"

#Tech Stack:
  - ec2 compute instance
  - nginx server with reverse proxy
  - strapi api backend
  - react frontend

#Current Deployment Method:
  - Develop API on local machine
  - If adding new Content Types, you'll need to do that locally and then update the server application
  - Push commits to github
  - Push updates manually via scp or rsync to ec2 instance

#Scaling:
  - Upgrade ec2 instance before production
  - Increase elastic block storage on ec2 instance before production
  - Upgrade mongodb replica set before production
