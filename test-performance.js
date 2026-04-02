"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceTest = void 0;
var http = require("http");
var perf_hooks_1 = require("perf_hooks");
var PerformanceTest = /** @class */ (function () {
    function PerformanceTest(hostname, port, path) {
        if (hostname === void 0) { hostname = 'localhost'; }
        if (port === void 0) { port = 3000; }
        if (path === void 0) { path = '/api/categories'; }
        this.hostname = hostname;
        this.port = port;
        this.path = path;
    }
    PerformanceTest.prototype.makeRequest = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var startTime = perf_hooks_1.performance.now();
            var options = {
                hostname: _this.hostname,
                port: _this.port,
                path: _this.path,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            var req = http.request(options, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    var endTime = perf_hooks_1.performance.now();
                    var responseTime = endTime - startTime;
                    resolve({
                        responseTime: responseTime,
                        statusCode: res.statusCode || 0,
                        success: res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 300,
                    });
                });
            });
            req.on('error', function (_err) {
                var endTime = perf_hooks_1.performance.now();
                var responseTime = endTime - startTime;
                resolve({
                    responseTime: responseTime,
                    statusCode: 0,
                    success: false,
                });
            });
            req.setTimeout(10000, function () {
                req.destroy();
                var endTime = perf_hooks_1.performance.now();
                var responseTime = endTime - startTime;
                resolve({
                    responseTime: responseTime,
                    statusCode: 0,
                    success: false,
                });
            });
            req.end();
        });
    };
    PerformanceTest.prototype.runLoadTest = function () {
        return __awaiter(this, arguments, void 0, function (concurrentRequests) {
            var startTime, requests, i, results, endTime, responseTimes, successfulRequests, failedRequests, totalTime, statusCodeDistribution, testResult;
            if (concurrentRequests === void 0) { concurrentRequests = 1000; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("\uD83D\uDE80 Starting load test: ".concat(concurrentRequests, " concurrent requests to ").concat(this.hostname, ":").concat(this.port).concat(this.path));
                        console.log('⏳ Testing in progress...');
                        startTime = perf_hooks_1.performance.now();
                        requests = [];
                        // Запускаем все запросы одновременно
                        for (i = 0; i < concurrentRequests; i++) {
                            requests.push(this.makeRequest());
                        }
                        return [4 /*yield*/, Promise.all(requests)];
                    case 1:
                        results = _a.sent();
                        endTime = perf_hooks_1.performance.now();
                        responseTimes = results.map(function (r) { return r.responseTime; });
                        successfulRequests = results.filter(function (r) { return r.success; }).length;
                        failedRequests = results.filter(function (r) { return !r.success; }).length;
                        totalTime = endTime - startTime;
                        statusCodeDistribution = {};
                        results.forEach(function (r) {
                            statusCodeDistribution[r.statusCode] = (statusCodeDistribution[r.statusCode] || 0) + 1;
                        });
                        testResult = {
                            totalRequests: concurrentRequests,
                            totalTime: totalTime,
                            averageTime: responseTimes.reduce(function (sum, time) { return sum + time; }, 0) / responseTimes.length,
                            minTime: Math.min.apply(Math, responseTimes),
                            maxTime: Math.max.apply(Math, responseTimes),
                            successfulRequests: successfulRequests,
                            failedRequests: failedRequests,
                            requestsPerSecond: (successfulRequests / totalTime) * 1000,
                            responseTimes: responseTimes,
                            statusCodeDistribution: statusCodeDistribution,
                        };
                        return [2 /*return*/, testResult];
                }
            });
        });
    };
    PerformanceTest.prototype.printResults = function (result) {
        console.log('\n📊 PERFORMANCE TEST RESULTS');
        console.log('================================');
        console.log("\uD83D\uDCC8 Total Requests: ".concat(result.totalRequests));
        console.log("\u2705 Successful: ".concat(result.successfulRequests));
        console.log("\u274C Failed: ".concat(result.failedRequests));
        console.log("\uD83D\uDCCA Success Rate: ".concat(((result.successfulRequests / result.totalRequests) * 100).toFixed(2), "%"));
        console.log('\n⏱️  TIMING STATISTICS');
        console.log('-------------------');
        console.log("\u23F3 Total Time: ".concat(result.totalTime.toFixed(2), "ms"));
        console.log("\uD83D\uDCCA Average Response Time: ".concat(result.averageTime.toFixed(2), "ms"));
        console.log("\u26A1 Min Response Time: ".concat(result.minTime.toFixed(2), "ms"));
        console.log("\uD83D\uDC0C Max Response Time: ".concat(result.maxTime.toFixed(2), "ms"));
        console.log("\uD83D\uDE80 Requests per Second: ".concat(result.requestsPerSecond.toFixed(2)));
        console.log('\n📊 STATUS CODE DISTRIBUTION');
        console.log('-------------------------');
        Object.entries(result.statusCodeDistribution)
            .sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return parseInt(a) - parseInt(b);
        })
            .forEach(function (_a) {
            var code = _a[0], count = _a[1];
            var percentage = ((count / result.totalRequests) * 100).toFixed(2);
            console.log("   ".concat(code, ": ").concat(count, " requests (").concat(percentage, "%)"));
        });
        // Процентили
        var sortedTimes = __spreadArray([], result.responseTimes, true).sort(function (a, b) { return a - b; });
        var p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
        var p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
        var p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
        var p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
        console.log('\n📊 PERCENTILES');
        console.log('-------------');
        console.log("   50th percentile (p50): ".concat(p50.toFixed(2), "ms"));
        console.log("   90th percentile (p90): ".concat(p90.toFixed(2), "ms"));
        console.log("   95th percentile (p95): ".concat(p95.toFixed(2), "ms"));
        console.log("   99th percentile (p99): ".concat(p99.toFixed(2), "ms"));
        console.log('\n🎯 PERFORMANCE ANALYSIS');
        console.log('----------------------');
        if (result.averageTime < 100) {
            console.log('✅ Excellent: Average response time under 100ms');
        }
        else if (result.averageTime < 500) {
            console.log('👍 Good: Average response time under 500ms');
        }
        else if (result.averageTime < 1000) {
            console.log('⚠️  Fair: Average response time under 1s');
        }
        else {
            console.log('❌ Poor: Average response time over 1s');
        }
        if (result.successfulRequests === result.totalRequests) {
            console.log('✅ Perfect: All requests completed successfully');
        }
        else if (result.successfulRequests / result.totalRequests > 0.95) {
            console.log('👍 Good: Over 95% success rate');
        }
        else {
            console.log('❌ Poor: Less than 95% success rate');
        }
    };
    return PerformanceTest;
}());
exports.PerformanceTest = PerformanceTest;
// Запуск теста
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var tester, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tester = new PerformanceTest();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, tester.runLoadTest(1000)];
                case 2:
                    result = _a.sent();
                    tester.printResults(result);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('❌ Test failed:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Запускаем тест, если файл выполнен напрямую
if (require.main === module) {
    main();
}
