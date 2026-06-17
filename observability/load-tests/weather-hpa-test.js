import http from 'k6/http';

export const options = {
  vus: 100,
  duration: '1m',
};

export default function () {
  http.get('http://weather-service:8081/api/weather?city=Colombo');
}
