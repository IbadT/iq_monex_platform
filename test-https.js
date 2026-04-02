const https = require('https');
const http = require('http');

async function makeRequest(url) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: parsedUrl.pathname,
      method: 'GET',
      rejectUnauthorized: false, // игнорировать самоподписанный сертификат
    };
    
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          responseTime,
          success: res.statusCode >= 200 && res.statusCode < 300,
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        statusCode: 0,
        responseTime: Date.now() - startTime,
        success: false,
        error: error.message,
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        statusCode: 0,
        responseTime: Date.now() - startTime,
        success: false,
        error: 'Timeout',
      });
    });
    
    req.end();
  });
}

async function runLoadTest(url, concurrentRequests = 1000) {
  console.log(`🚀 Starting load test: ${concurrentRequests} concurrent requests to ${url}`);
  console.log('⏳ Testing in progress...');
  
  const startTime = Date.now();
  const requests = [];
  
  for (let i = 0; i < concurrentRequests; i++) {
    requests.push(makeRequest(url));
  }
  
  const results = await Promise.all(requests);
  const endTime = Date.now();
  
  const totalTime = endTime - startTime;
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const responseTimes = results.map(r => r.responseTime);
  const avgTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  const minTime = Math.min(...responseTimes);
  const maxTime = Math.max(...responseTimes);
  const rps = (successful / totalTime) * 1000;
//   const rps = (successful / totalTime) * 500;
  
  // Статус коды
  const statusCodes = {};
  results.forEach(r => {
    statusCodes[r.statusCode] = (statusCodes[r.statusCode] || 0) + 1;
  });
  
  // Процентили
  const sorted = [...responseTimes].sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p90 = sorted[Math.floor(sorted.length * 0.9)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  
  console.log('\n📊 PERFORMANCE TEST RESULTS');
  console.log('================================');
  console.log(`📈 Total Requests: ${concurrentRequests}`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Success Rate: ${((successful / concurrentRequests) * 100).toFixed(2)}%`);
  
  console.log('\n⏱️  TIMING STATISTICS');
  console.log('-------------------');
  console.log(`⏳ Total Time: ${totalTime.toFixed(2)}ms`);
  console.log(`📊 Average Response Time: ${avgTime.toFixed(2)}ms`);
  console.log(`⚡ Min Response Time: ${minTime.toFixed(2)}ms`);
  console.log(`🐌 Max Response Time: ${maxTime.toFixed(2)}ms`);
  console.log(`🚀 Requests per Second: ${rps.toFixed(2)}`);
  
  console.log('\n📊 STATUS CODE DISTRIBUTION');
  console.log('-------------------------');
  Object.entries(statusCodes).forEach(([code, count]) => {
    console.log(`   ${code}: ${count} requests (${((count / concurrentRequests) * 100).toFixed(2)}%)`);
  });
  
  console.log('\n📊 PERCENTILES');
  console.log('-------------');
  console.log(`   50th percentile (p50): ${p50.toFixed(2)}ms`);
  console.log(`   90th percentile (p90): ${p90.toFixed(2)}ms`);
  console.log(`   95th percentile (p95): ${p95.toFixed(2)}ms`);
  console.log(`   99th percentile (p99): ${p99.toFixed(2)}ms`);
  
  console.log('\n🎯 PERFORMANCE ANALYSIS');
  console.log('----------------------');
  if (avgTime < 100) console.log('✅ Excellent: Average response time under 100ms');
  else if (avgTime < 500) console.log('👍 Good: Average response time under 500ms');
  else if (avgTime < 1000) console.log('⚠️  Fair: Average response time under 1s');
  else console.log('❌ Poor: Average response time over 1s');
  
  if (successful === concurrentRequests) console.log('✅ Perfect: All requests completed successfully');
  else if (successful / concurrentRequests > 0.95) console.log('👍 Good: Over 95% success rate');
  else console.log('❌ Poor: Less than 95% success rate');
}

// Запуск теста
const url = process.argv[2] || 'https://iqmonex.ru/api/categories';
const concurrency = parseInt(process.argv[3]) || 1000;
// const concurrency = parseInt(process.argv[3]) || 500;

runLoadTest(url, concurrency).catch(console.error);