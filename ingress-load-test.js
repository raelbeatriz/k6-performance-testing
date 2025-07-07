import http from 'k6/http';
import { check, json } from 'k6';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // traffic ramp-up from 1 to 20 users over 1 minute.
    { duration: '3m', target: 20 }, // stay at 20 users for 3 minutes
    { duration: '1m', target: 0 }, // ramp-down to 0 users
  ],
};
// export let options = {
//   vus: 5,       // Virtual Users
//   duration: '30s', // Test duration
// };

export default function () {
  // Base64-encoded username:password
  let authHeader = 'Basic eDE1dXNlcjoyOUQ2SEN1WnNxUGkqaVhAJDkxbzg0'; // Replace with actual base64-encoded credentials

  let headers = {
    'Authorization': authHeader,  // Include the Authorization header
    'User-Agent': 'k6/1.0', // Optional: add custom User-Agent header
  };

  let res = http.get('http://au-ecom-dev-hk.inchcapedigital.com/hk/lex-dis/cms', { headers: headers });
  console.log('Response status:', res.status);

  // Check if the response status is 200 (OK)
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

// This will export to HTML as filename "ingress-load-test.html" AND also stdout using the text summary
export function handleSummary(data) {
    return {
      "ingress-load-test.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}