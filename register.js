/**
 *	Author: Lincoln Anders <contact@lincolnanders.com>
 *	Created: Oct 30, 2019
 *	Updated: Mar 30, 2020
 *	Repository: https://github.com/lincolnanders5/BuzzCrack
 *
 *	register.js
 *	Register for courses by providing an array of CRNs.
 *
 *	(c) Copyright by Lincoln Anders
 **/

 /*
 	Steps to get/refresh token:
 		1. Log in to Buzzport
 		2. Open Registration
 		3. Open browser web inspector
 		4. Copy SESSID cookie
 			- Safari: Dev Tools > Storage > Cookies
 			- Chrome: Dev Tools > Application > Cookies
 		5. Paste into `.env` file like "SESSION_TOKEN=..."
 */

// TODO: Replace your CRN values here!
const CRNs = ["87138", "88247", "86306", "86350", "80220"];

const cheerio = require('cheerio');
var request = require('request');

// Store token in .env to reduce repetition
require("dotenv").config();

var headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'br, gzip, deflate',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'oscar.gatech.edu',
    'Origin': 'https://oscar.gatech.edu',
    'Referer': 'https://oscar.gatech.edu/pls/bprod/bwckcoms.P_Regs',
    'Cookie': `CPSESSID=${process.env.SESSION_TOKEN};`
};

function formatCRNString() {
	// CRN_IN=34406&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=
	return CRNs.map(crn => `CRN_IN=${crn}`).join("&");
}

var dataString = `term_in=202008&RSTS_IN=DUMMY&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&assoc_term_in=DUMMY&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&CRN_IN=DUMMY&${formatCRNString()}&start_date_in=DUMMY&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&end_date_in=DUMMY&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&SUBJ=DUMMY&CRSE=DUMMY&SEC=DUMMY&LEVL=DUMMY&CRED=DUMMY&GMOD=DUMMY&TITLE=DUMMY&MESG=DUMMY&MESG=DUMMY&REG_BTN=DUMMY&REG_BTN=Submit%2BChanges&regs_row=0&wait_row=0&add_row=${CRNs.length}`;

var options = {
    url: 'https://oscar.gatech.edu/pls/bprod/bwckcoms.P_Regs',
    method: 'POST',
    headers: headers,
    body: dataString
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

request(options, callback);
