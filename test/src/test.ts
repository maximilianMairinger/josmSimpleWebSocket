import josmSimpleWebSocket from "./../../app/src/josmSimpleWebSocket"
import { Data } from "josm"


console.log("qiuwhehiqhiuwhieu", 123);
debugger

(async () => {
  let data = await josmSimpleWebSocket("testClient", "127.0.0.1:8080", console.log) as Data

  //@ts-ignore
  window.send = (msg) => {
    data.set(msg)
  }
})()

