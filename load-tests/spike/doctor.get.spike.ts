import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },    
    { duration: '5s', target: 100 },    
    { duration: '10s', target: 100 },   
    { duration: '5s', target: 5 },      
    { duration: '10s', target: 5 },     
  ],
  thresholds: {
    http_req_duration: ['p(95)<1200'],      
    http_req_failed: ['rate<0.01'],         
  },
  
  httpReqTimeout: '10s',
};

const BASE_URL = 'http://localhost:8081'; 

export default function () {
  const res = http.get(`${BASE_URL}/api/doctor`, {
    headers: {
      'Accept': 'application/json',
    },
    timeout: '10s', // ensures no early drop
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1); 
}
