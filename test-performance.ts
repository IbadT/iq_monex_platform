import * as http from 'http';
import { performance } from 'perf_hooks';

interface TestResult {
  totalRequests: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  successfulRequests: number;
  failedRequests: number;
  requestsPerSecond: number;
  responseTimes: number[];
  statusCodeDistribution: Record<number, number>;
}

interface RequestResult {
  responseTime: number;
  statusCode: number;
  success: boolean;
}

class PerformanceTest {
  private readonly hostname: string;
  private readonly port: number;
  private readonly path: string;

  constructor(hostname: string = 'localhost', port: number = 3000, path: string = '/api/categories') {
    this.hostname = hostname;
    this.port = port;
    this.path = path;
  }

  private makeRequest(): Promise<RequestResult> {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const options = {
        hostname: this.hostname,
        port: this.port,
        path: this.path,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const req = http.request(options, (res: http.IncomingMessage) => {
        let data = '';
        
        res.on('data', (chunk: any) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const endTime = performance.now();
          const responseTime = endTime - startTime;
          
          resolve({
            responseTime,
            statusCode: res.statusCode || 0,
            success: res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300,
          });
        });
      });

      req.on('error', (_err: any) => {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        resolve({
          responseTime,
          statusCode: 0,
          success: false,
        });
      });

      req.setTimeout(10000, () => {
        req.destroy();
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        resolve({
          responseTime,
          statusCode: 0,
          success: false,
        });
      });

      req.end();
    });
  }

  async runLoadTest(concurrentRequests: number = 1000): Promise<TestResult> {
    console.log(`🚀 Starting load test: ${concurrentRequests} concurrent requests to ${this.hostname}:${this.port}${this.path}`);
    console.log('⏳ Testing in progress...');
    
    const startTime = performance.now();
    const requests: Promise<RequestResult>[] = [];
    
    // Запускаем все запросы одновременно
    for (let i = 0; i < concurrentRequests; i++) {
      requests.push(this.makeRequest());
    }
    
    // Ждем завершения всех запросов
    const results = await Promise.all(requests);
    const endTime = performance.now();
    
    // Анализируем результаты
    const responseTimes = results.map(r => r.responseTime);
    const successfulRequests = results.filter(r => r.success).length;
    const failedRequests = results.filter(r => !r.success).length;
    const totalTime = endTime - startTime;
    
    // Распределение статус кодов
    const statusCodeDistribution: Record<number, number> = {};
    results.forEach(r => {
      statusCodeDistribution[r.statusCode] = (statusCodeDistribution[r.statusCode] || 0) + 1;
    });
    
    const testResult: TestResult = {
      totalRequests: concurrentRequests,
      totalTime,
      averageTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
      minTime: Math.min(...responseTimes),
      maxTime: Math.max(...responseTimes),
      successfulRequests,
      failedRequests,
      requestsPerSecond: (successfulRequests / totalTime) * 1000,
      responseTimes,
      statusCodeDistribution,
    };
    
    return testResult;
  }

  printResults(result: TestResult): void {
    console.log('\n📊 PERFORMANCE TEST RESULTS');
    console.log('================================');
    
    console.log(`📈 Total Requests: ${result.totalRequests}`);
    console.log(`✅ Successful: ${result.successfulRequests}`);
    console.log(`❌ Failed: ${result.failedRequests}`);
    console.log(`📊 Success Rate: ${((result.successfulRequests / result.totalRequests) * 100).toFixed(2)}%`);
    
    console.log('\n⏱️  TIMING STATISTICS');
    console.log('-------------------');
    console.log(`⏳ Total Time: ${result.totalTime.toFixed(2)}ms`);
    console.log(`📊 Average Response Time: ${result.averageTime.toFixed(2)}ms`);
    console.log(`⚡ Min Response Time: ${result.minTime.toFixed(2)}ms`);
    console.log(`🐌 Max Response Time: ${result.maxTime.toFixed(2)}ms`);
    console.log(`🚀 Requests per Second: ${result.requestsPerSecond.toFixed(2)}`);
    
    console.log('\n📊 STATUS CODE DISTRIBUTION');
    console.log('-------------------------');
    Object.entries(result.statusCodeDistribution)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([code, count]) => {
        const percentage = ((count / result.totalRequests) * 100).toFixed(2);
        console.log(`   ${code}: ${count} requests (${percentage}%)`);
      });
    
    // Процентили
    const sortedTimes = [...result.responseTimes].sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
    
    console.log('\n📊 PERCENTILES');
    console.log('-------------');
    console.log(`   50th percentile (p50): ${p50.toFixed(2)}ms`);
    console.log(`   90th percentile (p90): ${p90.toFixed(2)}ms`);
    console.log(`   95th percentile (p95): ${p95.toFixed(2)}ms`);
    console.log(`   99th percentile (p99): ${p99.toFixed(2)}ms`);
    
    console.log('\n🎯 PERFORMANCE ANALYSIS');
    console.log('----------------------');
    
    if (result.averageTime < 100) {
      console.log('✅ Excellent: Average response time under 100ms');
    } else if (result.averageTime < 500) {
      console.log('👍 Good: Average response time under 500ms');
    } else if (result.averageTime < 1000) {
      console.log('⚠️  Fair: Average response time under 1s');
    } else {
      console.log('❌ Poor: Average response time over 1s');
    }
    
    if (result.successfulRequests === result.totalRequests) {
      console.log('✅ Perfect: All requests completed successfully');
    } else if (result.successfulRequests / result.totalRequests > 0.95) {
      console.log('👍 Good: Over 95% success rate');
    } else {
      console.log('❌ Poor: Less than 95% success rate');
    }
  }
}

// Запуск теста
async function main() {
  const tester = new PerformanceTest();
  
  try {
    const result = await tester.runLoadTest(1000);
    tester.printResults(result);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Запускаем тест, если файл выполнен напрямую
if (require.main === module) {
  main();
}

export { PerformanceTest, TestResult };
