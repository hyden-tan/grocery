function concurrentRequest(requestFns, maxConcurrent) {
  const result = [];
  let curConcurent = 0;
  let requestIndex = 0;

  return new Promise((res, rej) => {
    
    const isRequestComplete = () => curConcurent === 0 && requestIndex >= requestFns.length;

    function takeRequst () {
      // 当前并发已满 或者 无剩余未处理请求
      if (curConcurent >= maxConcurrent || requestIndex >= requestFns.length - 1) {
        return;
      }

      curConcurent += 1;
      const curRequestIndex = (requestIndex += 1);
      const requestPromise = requestFns[requestIndex]();

      requestPromise.then(res => {
        result[curRequestIndex] = res;
      }).catch(console.log).finally(() => {
        if (isRequestComplete()) {
          res(result);
        } else {
          takeRequst();
        }
      });
    }

    requestFns.slice(0, maxConcurrent).forEach(() => takeRequst());
  });
}




