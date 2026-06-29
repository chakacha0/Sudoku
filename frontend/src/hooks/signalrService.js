import * as signalR from "@microsoft/signalr";

const HUB_URL = "http://localhost:5000/gamehub";

class SignalRService {
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();
  }

  async start() {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setTimeout(() => this.start(), 5000); // Реконнект при ошибке
      }
    }
  }

  on(eventName, callback) {
    this.connection.on(eventName, callback);
  }

  off(eventName) {
    this.connection.off(eventName);
  }

  async invoke(methodName, ...args) {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      return await this.connection.invoke(methodName, ...args);
    } else {
      console.error("Cannot invoke: Connection not established");
    }
  }
}

const signalrService = new SignalRService();
export default signalrService;
