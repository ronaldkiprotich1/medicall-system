import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export let options = {
  stages: [
    { duration: '5s', target: 5 },   // ramp up to 5 virtual users
    { duration: '10s', target: 5 },  // hold for 10 seconds
    { duration: '5s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
    http_req_failed: ['rate<0.01'],    // <1% failure rate
  },
};

const BASE_URL = 'http://localhost:8081';
const token = 'YOUR_JWT_TOKEN_HERE'; // replace with your actual token

export default function () {
  const payload = JSON.stringify({
    userId: 1,
    doctorId: 1,
    appointmentDate: new Date().toISOString().split('T')[0], // today's date
    timeSlot: `slot-${uuidv4().slice(0, 8)}` // simulate unique time slots
  });

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.post(`${BASE_URL}/appointments`, payload, headers);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
