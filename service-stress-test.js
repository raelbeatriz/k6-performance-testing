import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // traffic ramp-up from 1 to a higher 100 users over 2 minutes.
    { duration: '5m', target: 100 }, // stay at higher 100 users for 5 minutes
    { duration: '2m', target: 0 }, // ramp-down to 0 users
  ],
};

export default function () {
  let res = http.get('http://localhost:8081');
  console.log('Response status:', res.status);
  check(res, {
    'is status 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });
  sleep(1);
}

// This will export to HTML as filename "service-stress-test.html" AND also stdout using the text summary
export function handleSummary(data) {
    return {
      "service-stress-test.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }