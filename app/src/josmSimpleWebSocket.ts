import { send, off } from "process"
import { Data, DataBase, DataSubscription } from "josm"
import { constructSocket } from "./lib/ws"
import getBaseUrl from "get-base-url"

type Dat = Data | DataBase


export default function(data_identifier?: Dat | string, url?: string, externalChangeListener: (newVal: string) => void = () => {}): Promise<Dat> {
  return new Promise((res) => {
    if (url === undefined) getBaseUrl(undefined, "ws://")
    else if (!url.startsWith("ws://")) url = "ws://" + url


    const ws = new WebSocket(url)
    const {send, onMessage, offMessage} = constructSocket(ws)
  
  
    let mainFunc = {
      data(data: any) {
        sub.active(false);
        externalChangeListenerSub.active(true, false);
        (dat as Data).set(data);
        externalChangeListenerSub.active(false);
        sub.active(true, false);
      },
      dataBase(data: any) {
        
      }
    }

  
    let dat: Dat


    let sub: DataSubscription<any>
    let externalChangeListenerSub: DataSubscription<any>


    let initFunc = ({type, data, write, read}: {type: "data" | "database", data: any, write: boolean, read: boolean}) => {
      offMessage(initFunc)
      if (type === "data") {
        dat = new Data(data)
        externalChangeListenerSub = new DataSubscription(dat, externalChangeListener, false)
        
        if (write) sub = dat.get(send)
        if (read) {
          
          if (externalChangeListener) externalChangeListener(data)
          onMessage(mainFunc.data)
        }
        
      }
      else if (type === "database") {
        // dat = new Data(data)
        onMessage(mainFunc.dataBase)
      }

      

      res(dat)
    }
    
  
    ws.addEventListener("open", async () => {
      if (data_identifier !== undefined && typeof data_identifier !== "string") {
        if (data_identifier instanceof Data) {
          onMessage(mainFunc.data)
          await send({intent: "put", type: "data", data: data_identifier})
          sub = data_identifier.get(send)
          externalChangeListenerSub = new DataSubscription(data_identifier, externalChangeListener, false)
        }
        else {
          await send({intent: "put", type: "database", data: data_identifier})
          onMessage(mainFunc.dataBase)
        }

        dat = data_identifier as any
        res(data_identifier)
      }
      else {
        if (data_identifier !== undefined) send({intent: "get", identifier: data_identifier})
        else send({intent: "get"})
        onMessage(initFunc)
      }
    })
  })
}

