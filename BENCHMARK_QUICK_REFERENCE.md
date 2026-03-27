# Middleware Benchmark - Quick Reference

## 🚀 Running Benchmarks

### Basic Commands

```bash
# Standard benchmark (recommended for regular use)
npm run bench:middleware

# Quick test (for development)
npm run bench:middleware:quick

# Full benchmark (for CI/CD or final validation)
npm run bench:middleware:full
```

### Custom Configuration

```bash
# Run with specific iterations and concurrency
npx ts-node benchmarks/chains/run-benchmarks.ts \
  --iterations=2000 \
  --concurrency=15 \
  --output=custom-report.md
```

## 📊 Understanding Results

### Key Metrics

| Metric | What It Means | Good Value |
|--------|---------------|------------|
| **Avg (ms)** | Average response time | Lower is better |
| **P95 (ms)** | 95% of requests faster than this | < 2x Avg |
| **P99 (ms)** | 99% of requests faster than this | < 3x Avg |
| **RPS** | Requests per second | Higher is better |
| **Error Rate** | Percentage of failed requests | Should be 0% |

### Stack Comparison

```
Minimal Stack: ~0.5ms avg, ~2000 RPS  ✅ Fastest
Auth Stack:    ~1.7ms avg, ~588 RPS   ⚠️ Moderate
Full Stack:    ~4.0ms avg, ~250 RPS   ⚠️ Slowest but most secure
```

### Overhead Interpretation

- **Absolute Overhead**: Additional milliseconds added by middleware
- **Relative Overhead**: Percentage increase over baseline
- **Significantly Slower**: Yes/No based on >10% or >5ms threshold

## 🎯 Performance Budgets

Use these thresholds to validate performance:

```typescript
const budgets = {
  minimalStack: {
    maxAvgMs: 1.0,
    minRps: 1000,
    maxP95Ms: 2.0,
  },
  authStack: {
    maxAvgMs: 3.0,
    minRps: 500,
    maxP95Ms: 5.0,
  },
  fullStack: {
    maxAvgMs: 8.0,
    minRps: 200,
    maxP95Ms: 15.0,
  },
};
```

## 🔍 Common Issues

### Issue: High Variability in Results

**Symptoms**: Large standard deviation, inconsistent RPS

**Solutions**:
- Increase warmup iterations
- Close other applications
- Check for background processes
- Run multiple times and average

### Issue: Lower Than Expected RPS

**Symptoms**: RPS significantly below expected values

**Checklist**:
- [ ] Running in production mode?
- [ ] Debug logging enabled?
- [ ] Other processes consuming resources?
- [ ] Network latency (if testing remotely)?

### Issue: High Error Rate

**Symptoms**: Error rate > 1%

**Solutions**:
- Increase timeout (`--timeout=60000`)
- Reduce concurrency
- Check system resources (CPU, memory)
- Verify all dependencies loaded

## 📈 Optimization Priority

When results show performance issues, follow this priority:

### 1st: Security Middleware (30-40% improvement)
- Cache IP checks
- Async DDoS detection
- Circuit breaker pattern

### 2nd: Compression (20% improvement)
- Only compress >1KB responses
- Use faster algorithms (brotli)
- Conditional compression

### 3rd: JWT Validation (15-20% improvement)
- Token caching
- Algorithm optimization
- Session management

### 4th: Rate Limiting (10-15% improvement)
- Redis pipelining
- Local caching
- Sliding window

## 🧪 Development Workflow

### Before Making Changes

```bash
# 1. Run baseline benchmark
npm run bench:middleware:quick

# 2. Note current performance
# Minimal: ___ ms, Auth: ___ ms, Full: ___ ms
```

### After Making Changes

```bash
# 1. Run same benchmark
npm run bench:middleware:quick

# 2. Compare results
# Look for regressions > 10%

# 3. If improved, run full benchmark
npm run bench:middleware:full
```

### Before Deploying to Production

```bash
# Always run full benchmark
npm run bench:middleware:full

# Verify against performance budgets
# Document results in PR
```

## 📁 File Locations

```
benchmarks/chains/
├── run-benchmarks.ts          # Main script to run
├── README.md                  # Detailed documentation
└── stacks/
    ├── minimal.stack.ts       # Minimal config
    ├── auth.stack.ts          # Auth config
    └── full.stack.ts          # Full config

docs/
└── PERFORMANCE.md             # Full analysis report
```

## 🎓 Learning Resources

- **Main Documentation**: `benchmarks/chains/README.md`
- **Performance Analysis**: `docs/PERFORMANCE.md`
- **Implementation Details**: `BENCHMARK_IMPLEMENTATION_SUMMARY.md`

## 💡 Tips

1. **Run benchmarks regularly** - Catch regressions early
2. **Compare against baseline** - Don't optimize in isolation
3. **Focus on bottlenecks** - Target components with highest overhead
4. **Measure in production** - Test environment ≠ production
5. **Document everything** - Keep historical performance data

## 🆘 Getting Help

If you encounter issues:

1. Check `benchmarks/chains/README.md` for detailed troubleshooting
2. Review error messages carefully
3. Verify Node.js version (>= 18)
4. Ensure all dependencies installed
5. Check system resources

---

**Quick Start**: Just run `npm run bench:middleware` and check `docs/PERFORMANCE.md` for results!
