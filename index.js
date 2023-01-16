import app from './app.js'
const port = process.env.PORT || 4001 // sets to port to connect to.

app.listen(port, () => console.log(`App running at http://localhost:${port}/`)) // must pass in which port we want it to listen to. It will listen on localhost as we haven't configured it differently. Local host is a standard domain name which represents this computer you're running on. It maps to the IP address of your local computer. We want to get some feedback on this so we can provide a callback function and once listen has succefully launched the server and is listening on the port. It will execute the callback function if we provide one. We can do any post configuration we want.  

// We can run our app with nodemon. It will restart the server when changes are made. 