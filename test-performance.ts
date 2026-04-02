// # Тест с фиксированным количеством запросов
// npx tsx test-performance.ts --url http://localhost:3000/api/categories --requests 1000

// # Тест с фиксированной длительностью (10 секунд)
// npx tsx test-performance.ts --url https://iqmonex.ru/api/categories --duration 10

// # С плавным увеличением нагрузки (ramp-up 5ms между запросами)
// npx tsx test-performance.ts --url http://localhost:3000/api/categories --requests 1000 --ramp-up 5

import * as http from 'http';
import * as https from 'https';
import { performance } from 'perf_hooks';

interface TestResult {
  totalRequests: number;
  totalTime: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  successfulRequests: number;
  failedRequests: number;
  requestsPerSecond: number;
  responseTimes: number[];
  statusCodeDistribution: Record<number, number>;
  throughput: {
    requestsPerSecond: number;
    totalTimeSeconds: number;
    averageConcurrency: number;
  };
}

interface RequestResult {
  responseTime: number;
  statusCode: number;
  success: boolean;
  startTime: number;
  endTime: number;
}

class PerformanceTest {
  private readonly hostname: string;
  private readonly port: number;
  private readonly path: string;
  private readonly useHttps: boolean;
  private readonly timeout: number;

  constructor(
    hostname: string = 'localhost',
    port: number = 3000,
    path: string = '/api/categories',
    useHttps: boolean = false,
    timeout: number = 10000,
  ) {
    this.hostname = hostname;
    this.port = port;
    this.path = path;
    this.useHttps = useHttps;
    this.timeout = timeout;
  }

  private makeRequest(): Promise<RequestResult> {
    return new Promise((resolve) => {
      const startTime = performance.now();

      const protocol = this.useHttps ? https : http;

      const options = {
        hostname: this.hostname,
        port: this.port,
        path: this.path,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Connection: 'keep-alive',
        },
        rejectUnauthorized: false,
      };

      const req = protocol.request(options, (res: http.IncomingMessage) => {
        let data = '';

        res.on('data', (chunk: any) => {
          data += chunk;
        });

        res.on('end', () => {
          const endTime = performance.now();
          const responseTime = endTime - startTime;

          let isValidJson = true;
          try {
            if (data.length > 0) {
              JSON.parse(data);
            }
          } catch {
            isValidJson = false;
          }

          resolve({
            responseTime,
            startTime,
            endTime,
            statusCode: res.statusCode || 0,
            success:
              res.statusCode !== undefined &&
              res.statusCode >= 200 &&
              res.statusCode < 300 &&
              isValidJson,
          });
        });
      });

      req.on('error', () => {
        const endTime = performance.now();
        resolve({
          responseTime: endTime - startTime,
          startTime,
          endTime,
          statusCode: 0,
          success: false,
        });
      });

      req.setTimeout(this.timeout, () => {
        req.destroy();
        const endTime = performance.now();
        resolve({
          responseTime: endTime - startTime,
          startTime,
          endTime,
          statusCode: 0,
          success: false,
        });
      });

      req.end();
    });
  }

  async runLoadTest(
    targetRequests: number = 1000,
    rampUpMs: number = 0,
    durationSeconds: number = 0,
  ): Promise<TestResult> {
    console.log(`🚀 Starting load test:`);
    console.log(
      `   Target: ${this.useHttps ? 'https://' : 'http://'}${this.hostname}:${this.port}${this.path}`,
    );
    console.log(`   Requests: ${targetRequests}`);
    console.log(`   Ramp-up: ${rampUpMs}ms between requests`);
    if (durationSeconds > 0) {
      console.log(`   Duration: ${durationSeconds}s (fixed time mode)`);
    }

    const startTime = performance.now();
    // const requests: Promise<RequestResult>[] = [];
    const results: RequestResult[] = [];

    // Настраиваем пул соединений
    const maxSockets = Math.min(targetRequests, 1000);
    if (!this.useHttps) {
      http.globalAgent.maxSockets = maxSockets;
    } else {
      https.globalAgent.maxSockets = maxSockets;
    }

    let requestsSent = 0;
    let stopSending = false;

    // Функция отправки запросов
    const sendRequest = async () => {
      if (stopSending) return;
      requestsSent++;
      const result = await this.makeRequest();
      results.push(result);

      // Если не достигли цели и не остановлены, отправляем следующий
      if (
        !stopSending &&
        (durationSeconds > 0 || requestsSent < targetRequests)
      ) {
        if (rampUpMs > 0) {
          setTimeout(() => sendRequest(), rampUpMs);
        } else {
          sendRequest(); // рекурсивный вызов без задержки
        }
      }
    };

    // Запускаем начальное количество параллельных запросов
    const initialConcurrency =
      durationSeconds > 0 ? 100 : Math.min(targetRequests, 100);

    for (let i = 0; i < initialConcurrency; i++) {
      sendRequest();
    }

    // Ждем завершения
    if (durationSeconds > 0) {
      // Режим фиксированной длительности
      await new Promise((resolve) =>
        setTimeout(resolve, durationSeconds * 1000),
      );
      stopSending = true;

      // Ждем завершения всех запущенных запросов
      while (results.length < requestsSent) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } else {
      // Режим фиксированного количества запросов
      while (results.length < targetRequests) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      stopSending = true;
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const totalTimeSeconds = totalTime / 1000;

    // Анализируем результаты
    const responseTimes = results.map((r) => r.responseTime);
    const successfulRequests = results.filter((r) => r.success).length;
    const failedRequests = results.filter((r) => !r.success).length;

    // ПРАВИЛЬНЫЙ РАСЧЕТ RPS
    // RPS = общее количество успешных запросов / общее время теста в секундах
    const actualRps = successfulRequests / totalTimeSeconds;

    // Средняя конкуренция (average concurrency)
    // = RPS * среднее время ответа (в секундах)
    const avgResponseTimeSeconds =
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length / 1000;
    const averageConcurrency = actualRps * avgResponseTimeSeconds;

    // Распределение статус-кодов
    const statusCodeDistribution: Record<number, number> = {};
    results.forEach((r) => {
      statusCodeDistribution[r.statusCode] =
        (statusCodeDistribution[r.statusCode] || 0) + 1;
    });

    const testResult: TestResult = {
      totalRequests: results.length,
      totalTime,
      averageResponseTime:
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      successfulRequests,
      failedRequests,
      requestsPerSecond: actualRps,
      responseTimes,
      statusCodeDistribution,
      throughput: {
        requestsPerSecond: actualRps,
        totalTimeSeconds,
        averageConcurrency,
      },
    };

    return testResult;
  }

  printResults(result: TestResult): void {
    console.log('\n📊 PERFORMANCE TEST RESULTS');
    console.log('================================');

    console.log(`📈 Total Requests: ${result.totalRequests}`);
    console.log(`✅ Successful: ${result.successfulRequests}`);
    console.log(`❌ Failed: ${result.failedRequests}`);
    console.log(
      `📊 Success Rate: ${((result.successfulRequests / result.totalRequests) * 100).toFixed(2)}%`,
    );

    console.log('\n⏱️  TIMING STATISTICS');
    console.log('-------------------');
    console.log(
      `⏳ Total Test Duration: ${result.totalTime.toFixed(2)}ms (${(result.totalTime / 1000).toFixed(2)}s)`,
    );
    console.log(
      `📊 Avg Response Time: ${result.averageResponseTime.toFixed(2)}ms`,
    );
    console.log(`⚡ Min Response Time: ${result.minResponseTime.toFixed(2)}ms`);
    console.log(`🐌 Max Response Time: ${result.maxResponseTime.toFixed(2)}ms`);

    console.log('\n🚀 THROUGHPUT (CORRECT METRICS)');
    console.log('-------------------------------');
    console.log(
      `📈 Actual RPS: ${result.throughput.requestsPerSecond.toFixed(2)} req/sec`,
    );
    console.log(
      `⏱️  Total Test Time: ${result.throughput.totalTimeSeconds.toFixed(2)} seconds`,
    );
    console.log(
      `🔄 Average Concurrency: ${result.throughput.averageConcurrency.toFixed(2)} concurrent requests`,
    );
    console.log(
      `💡 Formula: RPS = ${result.successfulRequests} / ${result.throughput.totalTimeSeconds.toFixed(2)}s = ${result.throughput.requestsPerSecond.toFixed(2)}`,
    );

    // Теоретическая пропускная способность
    const theoreticalMaxRps = (1000 / result.averageResponseTime) * 1000;
    console.log(
      `\n📐 THEORETICAL MAX (single thread): ${theoreticalMaxRps.toFixed(2)} RPS`,
    );
    console.log(`   (if processing 1 request at a time)`);

    console.log('\n📊 STATUS CODE DISTRIBUTION');
    console.log('-------------------------');
    Object.entries(result.statusCodeDistribution)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([code, count]) => {
        const percentage = ((count / result.totalRequests) * 100).toFixed(2);
        const emoji = code === '200' ? '✅' : code === '0' ? '❌' : '⚠️';
        console.log(`   ${emoji} ${code}: ${count} requests (${percentage}%)`);
      });

    // Процентили
    const sortedTimes = [...result.responseTimes].sort((a, b) => a - b);

    console.log('\n📊 PERCENTILES');
    console.log('-------------');
    console.log(
      `   50th percentile (p50): ${this.calculatePercentile(sortedTimes, 50).toFixed(2)}ms`,
    );
    console.log(
      `   75th percentile (p75): ${this.calculatePercentile(sortedTimes, 75).toFixed(2)}ms`,
    );
    console.log(
      `   90th percentile (p90): ${this.calculatePercentile(sortedTimes, 90).toFixed(2)}ms`,
    );
    console.log(
      `   95th percentile (p95): ${this.calculatePercentile(sortedTimes, 95).toFixed(2)}ms`,
    );
    console.log(
      `   99th percentile (p99): ${this.calculatePercentile(sortedTimes, 99).toFixed(2)}ms`,
    );

    console.log('\n🎯 PERFORMANCE ANALYSIS');
    console.log('----------------------');

    // Оценка производительности
    if (result.averageResponseTime < 100) {
      console.log('✅ Excellent: Average response time under 100ms');
    } else if (result.averageResponseTime < 500) {
      console.log('👍 Good: Average response time under 500ms');
    } else if (result.averageResponseTime < 1000) {
      console.log('⚠️  Fair: Average response time under 1s');
    } else {
      console.log('❌ Poor: Average response time over 1s');
    }

    // Оценка пропускной способности
    if (result.throughput.requestsPerSecond > 1000) {
      console.log(
        `✅ Excellent Throughput: ${result.throughput.requestsPerSecond.toFixed(0)} RPS`,
      );
    } else if (result.throughput.requestsPerSecond > 500) {
      console.log(
        `👍 Good Throughput: ${result.throughput.requestsPerSecond.toFixed(0)} RPS`,
      );
    } else if (result.throughput.requestsPerSecond > 100) {
      console.log(
        `⚠️  Fair Throughput: ${result.throughput.requestsPerSecond.toFixed(0)} RPS`,
      );
    } else {
      console.log(
        `❌ Poor Throughput: ${result.throughput.requestsPerSecond.toFixed(0)} RPS`,
      );
    }

    // Оценка успешности
    const successRate =
      (result.successfulRequests / result.totalRequests) * 100;
    if (successRate === 100) {
      console.log('✅ Perfect: All requests completed successfully');
    } else if (successRate >= 99.9) {
      console.log('👍 Excellent: 99.9% success rate');
    } else if (successRate >= 99) {
      console.log('👍 Good: 99% success rate');
    } else if (successRate >= 95) {
      console.log('⚠️  Fair: 95% success rate');
    } else {
      console.log('❌ Poor: Less than 95% success rate');
    }
  }

  private calculatePercentile(sorted: number[], percentile: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
  }
}

// Парсинг аргументов командной строки
function parseArgs(): {
  url: string;
  concurrency: number;
  rampUp: number;
  duration: number;
} {
  const args = process.argv.slice(2);
  let url = 'http://localhost:3000/api/categories';
  let concurrency = 1000;
  let rampUp = 0;
  let duration = 0;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      url = args[i + 1];
      i++;
    } else if (args[i] === '--requests' && args[i + 1]) {
      concurrency = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--ramp-up' && args[i + 1]) {
      rampUp = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--duration' && args[i + 1]) {
      duration = parseInt(args[i + 1]);
      i++;
    }
  }

  return { url, concurrency, rampUp, duration };
}

async function main() {
  const { url, concurrency, rampUp, duration } = parseArgs();

  let protocol = 'http';
  let hostname = 'localhost';
  let port = 3000;
  let path = '/api/categories';

  try {
    const parsedUrl = new URL(url);
    protocol = parsedUrl.protocol.replace(':', '');
    hostname = parsedUrl.hostname;
    port = parseInt(parsedUrl.port) || (protocol === 'https' ? 443 : 80);
    path = parsedUrl.pathname + parsedUrl.search;
  } catch (error) {
    console.error('❌ Invalid URL:', url);
    process.exit(1);
  }

  const tester = new PerformanceTest(
    hostname,
    port,
    path,
    protocol === 'https',
    10000,
  );

  try {
    let result;
    if (duration > 0) {
      result = await tester.runLoadTest(0, rampUp, duration);
    } else {
      result = await tester.runLoadTest(concurrency, rampUp, 0);
    }
    tester.printResults(result);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { PerformanceTest, TestResult };

// import * as http from 'http';
// import { performance } from 'perf_hooks';

// interface TestResult {
//   totalRequests: number;
//   totalTime: number;
//   averageTime: number;
//   minTime: number;
//   maxTime: number;
//   successfulRequests: number;
//   failedRequests: number;
//   requestsPerSecond: number;
//   responseTimes: number[];
//   statusCodeDistribution: Record<number, number>;
// }

// interface RequestResult {
//   responseTime: number;
//   statusCode: number;
//   success: boolean;
// }

// class PerformanceTest {
//   private readonly hostname: string;
//   private readonly port: number;
//   private readonly path: string;

//   constructor(hostname: string = 'localhost', port: number = 3000, path: string = '/api/categories') {
//     this.hostname = hostname;
//     this.port = port;
//     this.path = path;
//   }

//   private makeRequest(): Promise<RequestResult> {
//     return new Promise((resolve) => {
//       const startTime = performance.now();

//       const options = {
//         hostname: this.hostname,
//         port: this.port,
//         path: this.path,
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       };

//       const req = http.request(options, (res: http.IncomingMessage) => {
//         let data = '';

//         res.on('data', (chunk: any) => {
//           data += chunk;
//         });

//         res.on('end', () => {
//           const endTime = performance.now();
//           const responseTime = endTime - startTime;

//           resolve({
//             responseTime,
//             statusCode: res.statusCode || 0,
//             success: res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300,
//           });
//         });
//       });

//       req.on('error', (_err: any) => {
//         const endTime = performance.now();
//         const responseTime = endTime - startTime;

//         resolve({
//           responseTime,
//           statusCode: 0,
//           success: false,
//         });
//       });

//       req.setTimeout(10000, () => {
//         req.destroy();
//         const endTime = performance.now();
//         const responseTime = endTime - startTime;

//         resolve({
//           responseTime,
//           statusCode: 0,
//           success: false,
//         });
//       });

//       req.end();
//     });
//   }

//   async runLoadTest(concurrentRequests: number = 1000): Promise<TestResult> {
//     console.log(`🚀 Starting load test: ${concurrentRequests} concurrent requests to ${this.hostname}:${this.port}${this.path}`);
//     console.log('⏳ Testing in progress...');

//     const startTime = performance.now();
//     const requests: Promise<RequestResult>[] = [];

//     // Запускаем все запросы одновременно
//     for (let i = 0; i < concurrentRequests; i++) {
//       requests.push(this.makeRequest());
//     }

//     // Ждем завершения всех запросов
//     const results = await Promise.all(requests);
//     const endTime = performance.now();

//     // Анализируем результаты
//     const responseTimes = results.map(r => r.responseTime);
//     const successfulRequests = results.filter(r => r.success).length;
//     const failedRequests = results.filter(r => !r.success).length;
//     const totalTime = endTime - startTime;

//     // Распределение статус кодов
//     const statusCodeDistribution: Record<number, number> = {};
//     results.forEach(r => {
//       statusCodeDistribution[r.statusCode] = (statusCodeDistribution[r.statusCode] || 0) + 1;
//     });

//     const testResult: TestResult = {
//       totalRequests: concurrentRequests,
//       totalTime,
//       averageTime: responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length,
//       minTime: Math.min(...responseTimes),
//       maxTime: Math.max(...responseTimes),
//       successfulRequests,
//       failedRequests,
//       requestsPerSecond: (successfulRequests / totalTime) * 1000,
//       responseTimes,
//       statusCodeDistribution,
//     };

//     return testResult;
//   }

//   printResults(result: TestResult): void {
//     console.log('\n📊 PERFORMANCE TEST RESULTS');
//     console.log('================================');

//     console.log(`📈 Total Requests: ${result.totalRequests}`);
//     console.log(`✅ Successful: ${result.successfulRequests}`);
//     console.log(`❌ Failed: ${result.failedRequests}`);
//     console.log(`📊 Success Rate: ${((result.successfulRequests / result.totalRequests) * 100).toFixed(2)}%`);

//     console.log('\n⏱️  TIMING STATISTICS');
//     console.log('-------------------');
//     console.log(`⏳ Total Time: ${result.totalTime.toFixed(2)}ms`);
//     console.log(`📊 Average Response Time: ${result.averageTime.toFixed(2)}ms`);
//     console.log(`⚡ Min Response Time: ${result.minTime.toFixed(2)}ms`);
//     console.log(`🐌 Max Response Time: ${result.maxTime.toFixed(2)}ms`);
//     console.log(`🚀 Requests per Second: ${result.requestsPerSecond.toFixed(2)}`);

//     console.log('\n📊 STATUS CODE DISTRIBUTION');
//     console.log('-------------------------');
//     Object.entries(result.statusCodeDistribution)
//       .sort(([a], [b]) => parseInt(a) - parseInt(b))
//       .forEach(([code, count]) => {
//         const percentage = ((count / result.totalRequests) * 100).toFixed(2);
//         console.log(`   ${code}: ${count} requests (${percentage}%)`);
//       });

//     // Процентили
//     const sortedTimes = [...result.responseTimes].sort((a, b) => a - b);
//     const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
//     const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
//     const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
//     const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

//     console.log('\n📊 PERCENTILES');
//     console.log('-------------');
//     console.log(`   50th percentile (p50): ${p50.toFixed(2)}ms`);
//     console.log(`   90th percentile (p90): ${p90.toFixed(2)}ms`);
//     console.log(`   95th percentile (p95): ${p95.toFixed(2)}ms`);
//     console.log(`   99th percentile (p99): ${p99.toFixed(2)}ms`);

//     console.log('\n🎯 PERFORMANCE ANALYSIS');
//     console.log('----------------------');

//     if (result.averageTime < 100) {
//       console.log('✅ Excellent: Average response time under 100ms');
//     } else if (result.averageTime < 500) {
//       console.log('👍 Good: Average response time under 500ms');
//     } else if (result.averageTime < 1000) {
//       console.log('⚠️  Fair: Average response time under 1s');
//     } else {
//       console.log('❌ Poor: Average response time over 1s');
//     }

//     if (result.successfulRequests === result.totalRequests) {
//       console.log('✅ Perfect: All requests completed successfully');
//     } else if (result.successfulRequests / result.totalRequests > 0.95) {
//       console.log('👍 Good: Over 95% success rate');
//     } else {
//       console.log('❌ Poor: Less than 95% success rate');
//     }
//   }
// }

// // Запуск теста
// async function main() {
//   const tester = new PerformanceTest();

//   try {
//     const result = await tester.runLoadTest(1000);
//     tester.printResults(result);
//   } catch (error) {
//     console.error('❌ Test failed:', error);
//     process.exit(1);
//   }
// }

// // Запускаем тест, если файл выполнен напрямую
// if (require.main === module) {
//   main();
// }

// export { PerformanceTest, TestResult };
