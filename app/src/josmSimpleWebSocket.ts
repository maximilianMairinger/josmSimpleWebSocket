export default function() {
  const ws = new WebSocket("ws://127.0.0.1:8080")
  ws.addEventListener("message", (q) => {
    console.log("Message:", q.data)
  })
  ws.addEventListener("open", () => {
    console.log("con")
  })
}
