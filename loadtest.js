import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    find_capacity: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { target: 100,  duration: '60m' },
        { target: 250,  duration: '60m' },
        { target: 500,  duration: '60m' },
        { target: 750,  duration: '60m' },
        { target: 1000, duration: '60m' },
        { target: 1000, duration: '60m' },  // hold at 1000 for 10 min
        { target: 0,    duration: '60m' },
      ],
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.02'],
  },
};

export default function () {
  const res = http.get('https://neongate.store/');
  check(res, {
    'status ok': (r) => r.status >= 200 && r.status < 400,
    'fast enough': (r) => r.timings.duration < 1000,
  });
  sleep(Math.random() * 2 + 1);
}