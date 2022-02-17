import {Platform} from 'react-native';
import {Thread} from '@minar-kotonoha/react-native-threads';

const workerPool = {},
  messageQueue = [];
let workerIds = [],
  partsTotal = 0,
  currentPart = 0;

export default class WorkerPool {
  constructor({amount, worker}) {
    this.amount = amount || 5;
    this.Worker = worker;
  }

  spawnWorkers() {
    workerIds = [...Array(this.amount)].map((i, v) => {
      let webWorker =
        Platform.OS === 'web' ? new this.Worker() : new Thread(this.Worker);

      workerPool[v] = {worker: webWorker};

      webWorker.onmessage = (event) => {
        // console.log(`Freed worker #${v}`);
        workerIds.push(v);

        if (messageQueue.length) {
          this.postMessage(messageQueue.pop());
        }

        const data = typeof event === 'string' ? JSON.parse(event) : event.data;
        workerPool[v].listener && workerPool[v].listener({data});
      };

      return v;
    });
  }

  terminateWorkers() {
    Object.keys(workerPool).forEach((id) => workerPool[id].worker.terminate());
  }

  executeWhenAvailable(callback, data) {
    if (workerIds.length) {
      return callback(workerIds.pop());
    }

    return messageQueue.push(data);
  }

  postMessage(data) {
    setTimeout(
      () =>
        this.executeWhenAvailable((id) => {
          let worker = workerPool[id].worker;

          // console.log("postMessage with worker #" + id);
          worker.postMessage(
            Platform.OS === 'web' ? data : JSON.stringify(data),
          );
        }, data),
      0,
    );
  }

  addEventListener(event, callback) {
    Object.keys(workerPool).forEach((i) => {
      workerPool[i].listener = (e) => {
        // updating current progress to keep track from outside
        e.data.partsTotal = partsTotal;
        e.data.currentPart = currentPart++;
        callback(e);
      };
    });
  }

  get freeWorkers() {
    return workerIds;
  }

  // these two needed to set initial state to track percentage of work done
  startOver(length) {
    currentPart = 0;
    partsTotal = length;
  }
}
