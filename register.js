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

const CRNs = ["34406","34406","34406","34406","34406","34406","34406","34406"];

function formatCRNString() {
	// CRN_IN=34406&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=&CRN_IN=
	return CRNs.map(crn => `CRN_IN=${crn}`).join("&");
}

var dataString = `term_in=202002&RSTS_IN=DUMMY&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&RSTS_IN=RW&assoc_term_in=DUMMY&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&assoc_term_in=&CRN_IN=DUMMY&${formatCRNString()}&start_date_in=DUMMY&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&start_date_in=&end_date_in=DUMMY&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&end_date_in=&SUBJ=DUMMY&CRSE=DUMMY&SEC=DUMMY&LEVL=DUMMY&CRED=DUMMY&GMOD=DUMMY&TITLE=DUMMY&MESG=DUMMY&MESG=DUMMY&REG_BTN=DUMMY&REG_BTN=Submit%2BChanges&regs_row=0&wait_row=0&add_row=${CRNs.length}`;

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
