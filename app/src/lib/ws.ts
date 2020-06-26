export function constructSocket(ws: WebSocket) {
  let map: Map<any, any> = new Map
  return {
    onMessage(f: (s: any) => void) {
      let a = (s) => {
        f(JSON.parse(s.data))
      }
      map.set(f, a)
      ws.addEventListener("message", a)
      return f
    },
    offMessage(f: (s: any) => void) {
      ws.removeEventListener("message", map.get(f))
      map.delete(f)
      return f
    },
    send(msg: any) {
      return ws.send(JSON.stringify(msg))
    }
  }
}