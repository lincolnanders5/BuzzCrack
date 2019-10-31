// https://curl.trillworks.com/#node

const cheerio = require('cheerio');
var request = require('request');

/*
	Steps to get/refresh token:
		1. Log in to Buzzport
		2. Open Registration
		3. Open browser web inspector
		4. Copy CPSESSID cookie
			- Safari: Storage > Cookies
			- Chrome: Application > Cookies
			- Can run following JS from console to get cookie:
				document.cookie.split("CPSESSID=")[1].split(";")[0]
*/
var token = 'AQARMjAxOTEwMzAyMjA5MTQDABAwSlBCQkUzMzAyMDc2'

var headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Origin': 'https://oscar.gatech.edu',
    'Host': 'oscar.gatech.edu',
    'Referer': 'https://oscar.gatech.edu/pls/bprod/bwskfcls.P_GetCrse',
    'Accept-Encoding': 'br, gzip, deflate',
    'Cookie': `CPSESSID=${token};`
};

// Format magic string to return course info
var dataString = (term, subj, num) => `term_in=${term}&sel_subj=dummy&sel_subj=${subj}&SEL_CRSE=${num}&SEL_TITLE=&BEGIN_HH=0&BEGIN_MI=0&BEGIN_AP=a&SEL_DAY=dummy&SEL_PTRM=dummy&END_HH=0&END_MI=0&END_AP=a&SEL_CAMP=dummy&SEL_SCHD=dummy&SEL_SESS=dummy&SEL_INSTR=dummy&SEL_INSTR=%25&SEL_ATTR=dummy&SEL_ATTR=%25&SEL_LEVL=dummy&SEL_LEVL=%25&SEL_INSM=dummy&sel_dunt_code=&sel_dunt_unit=&call_value_in=&rsts=dummy&crn=dummy&path=1&SUB_BTN=View+Sections`;

var options = (term, subj, num) => {
	return {
		url: 'https://oscar.gatech.edu/pls/bprod/bwskfcls.P_GetCrse',
		method: 'POST',
		headers: headers,
		body: dataString(term, subj, num)
	}
};

// Chunk array arr into subarrays of length len
function chunk (arr, len) {
	var chunks = [], i = 0, n = arr.length;
	while (i < n) chunks.push(arr.slice(i, i += len));
	return chunks;
}

function req_callback(error, response, body) {
	if (!error && response.statusCode == 200) {
		// Load HTML body into JSON parser
		const $ = cheerio.load(body);
		const entries = $("td.dddefault").toArray();

		// Handle weird HTML
		const rows = entries.map(e => e.children[0].data || e.children[0].children[0].data);

		// Split into String[][], with each course section as a subarray
		const ch = chunk(rows, 20);

		// Map each section into JSON dictionary
		var column_headers = ["status", "crn", "subj", "num", "section", "campus", "mode",
			"cred", "title", "days", "time", "cap", "act", "rem", "wl_cap", "wl_act", "wl_rem",
			"instr", "loc", "attr"];
		const classes = ch.map(row_arr => {
			const section_dict = {};
			for (var i in row_arr) {
				const cur_column = column_headers[i];
				const cur_data = row_arr[i];
				section_dict[cur_column] = cur_data;
			}
			// Custom parse some fields
			section_dict.time = section_dict.time.padEnd(17, " ");
			section_dict.course = section_dict.subj + " " + section_dict.num;
			section_dict.rem = parseInt(section_dict.rem);
			return section_dict;
		});

		// Only show classes with open space, scheduled days, and announced times.
		var avaliable = classes.filter(c => {

			return c.rem != 0
		});

		const del_fields = ["subj", "num", "campus", "cred", "title", "cap", "act", "loc", "attr"];
		var str = avaliable.map(avaliable_section => {
			// Drop superfluous fields
			del_fields.forEach(field => delete avaliable_section[field]);

			// Convert section dictionary to array to format into string
			const section_arr = Object.values(avaliable_section);
			return section_arr.map(e => (e + '').padEnd(4, " ")).join("  ").trim()
		})

		if (avaliable.length == 0) str = ["No classes/seats open"];
		column_headers = column_headers.filter(header => !del_fields.includes(header));
		try {
			column_headers[column_headers.indexOf("time")] = "time               ";
			console.log(`${classes[0].course}\n${column_headers.map(h => h.padEnd(4," ")).join(" ")}\n${str.join(`\n`)}\n`);
		} catch (e) {
			console.log("Cookie has expired");
		}
	}
}

const classes = ["CS 2200", "CS 4001", "CS 2110", "PSYC 2210", "CS 3750", "PSYC 2210"];
classes.forEach(async cur_class => {
	const parts = cur_class.split(" ");
	const gen_opts = options("202002", parts[0], parts[1]);
	request(gen_opts, req_callback);
});
