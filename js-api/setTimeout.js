let times = [];
const start = performance.now()
setTimeout(function run() {
  const timeout = performance.now() - start;
  // 20ms 结束
  if (timeout > 20) {
    console.log(times);
    console.log("调用次数:", times.length);
    return;
  }
  times.push(timeout);
  // 否则重新调度
  setTimeout(run);
});