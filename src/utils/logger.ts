export const logger = async (userId, logLevel, eventName, message) => {
   // const logEndpoint = 'http://localhost:3002/log';
   // const logEndpoint = 'https://madeservices.com.au/logger/log';
   const logEndpoint = 'https://sclogs.com.au/logger/log';
    try {
      const response = await fetch(logEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer 5cc9912a79346e11e4158a8eca0828292197a39f959b715a08cbfd6c91e1c666',
          'origin': 'https://smileconnect.com.au',
        },
        body: JSON.stringify({ userId, logLevel, eventName, message }),
      });
      } catch (error) {
      console.error('Error submitting log entry:', error);
    }
  };
  