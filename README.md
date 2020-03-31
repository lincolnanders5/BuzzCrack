# BuzzCrack
My tool for looking up multiple courses at a time and registering for specific CRNs without touching BuzzPort.


## Setting up project
BuzzCrack works on [Node.js](https://nodejs.org/en/); download it and run the following in the `BuzzCrack` directory after [cloning](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository).
```
npm install
```

BuzzCrack needs a [cookie](https://www.howtogeek.com/119458/htg-explains-whats-a-browser-cookie/) to "impersonate" you in order to register/look up classes.

Steps to get/refresh token:
1. Log in to Buzzport
2. Open Registration
3. Open browser web inspector
4. Copy SESSID cookie
  - Safari: Dev Tools > Storage > Cookies
  - Chrome: Dev Tools > Application > Cookies
5. Create and paste into `.env` file like "SESSION_TOKEN=..."

## Section Look-Up
Looking up open sections is done by providing a list of course names.
Locate and replace the `classes` array in `course.js` file.
Change the values there with your own course names (e.g. CS 5901).

Run the look-up with `node course.js`

Something similar to the following will be printed:
```
CS 5901
status  crn     section mode days time               rem   wl_cap wl_act  wl_rem  instr
SR      42400   JDA     L    M    09:30 am-10:20 am  14    10     0       10      Anders, L.
SR      19023   SLS     L    M    12:30 pm-01:20 pm  27    10     0       10      Burdell, G. P.
...
```
This will give you information about all open sections of the course desired. Notably, the remaining open spots (`rem`), waitlist capacity (`wl_cap`), and waitlist remaining spots (`wl_rem`)

## Registration
Registration is done by providing a list of CRNs to register for. 
Locate and replace the `CRNs` array in `register.js` file. 
Change the values there with your own CRNs, found by looking up with the `course.js` section.

Finally, run `node register.js`
