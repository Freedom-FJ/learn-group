const start = performance.now()

function sendPostMessage() {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = () => { 
    console.log(performance.now() - start, 'MessageChannel') // 1.2433269917964935 MessageChannel
  }
  port.postMessage(null);
}



setTimeout(() => {
  console.log(performance.now() - start, 'setTimeout') // 2.011711001396179 setTimeout
});

setImmediate(() => {
  console.log(performance.now() - start, 'setImmediate') // 0.354654997587204 setImmediate
});


sendPostMessage()



// console.log('outer');

// setImmediate(() => {
//   setTimeout(() => {
//     console.log('setTimeout', performance.now() - start);
//   }, 0);
//   setImmediate(() => {
//     console.log('setImmediate', performance.now() - start);
//   });
// });


// var fs = require('fs')

// fs.readFile(__filename, () => {
//     setTimeout(() => {
//         console.log('setTimeout', performance.now() - start);
//     }, 0);

//     setImmediate(() => {
//         console.log('setImmediate', performance.now() - start);
        
//         // process.nextTick(() => {
//         //   console.log('nextTick 2');
//         // });
//     });

//     // process.nextTick(() => {
//     //   console.log('nextTick 1');
//     // });
// });
