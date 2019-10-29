const axios = require('axios');
let value = 500;

setInterval(async () => {
  await axios.post('http://localhost:3001/api/v1/ws/sensors', {
    "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMzA6QUU6QTQ6NzU6NEI6QjgifSwiZXhwIjoxNTcyNjE2Mjk1LCJpYXQiOjE1NzIwMTE0OTV9.xJgnAP9B20-snHweinIn-FcGZQYhsglpeb5wSHc2814",
    "sensorData": [
      { "type": "co2", "value": (Math.floor(Math.random() * Math.floor(10))) % 7 ? value - 9 : value + 9 }
    ]
  });
}, 6000);