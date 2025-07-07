import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export let options = {
  vus: 5,
  duration: '30s',
};

export default function () {
  let res = http.get('http://localhost:8081');
  console.log('Response status:', res.status);
  check(res, {
    'is status 200': (r) => r.status === 200,
    'response time < 400ms': (r) => r.timings.duration < 400,
  });
  sleep(1);
}

// This will export to HTML as filename "service-smoke-test.html" AND also stdout using the text summary
export function handleSummary(data) {
    return {
      "service-smoke-test.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }