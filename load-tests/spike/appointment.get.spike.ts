import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  
    { duration: '10s', target: 100 }, 
    { duration: '30s', target: 10 },   
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], 
    http_req_failed: ['rate<0.01'],    
  },
};

const BASE_URL = 'http://localhost:8081/api';

export default function () {
  const res = http.get(`${BASE_URL}/appointments`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
