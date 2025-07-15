import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuration options
export const options = {
  vus: 50, // number of virtual users
  duration: '30s', // duration of the test
};

export default function () {
  const res = http.get('http://localhost:8081/api/users'); 

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1); // simulate user wait time
}
