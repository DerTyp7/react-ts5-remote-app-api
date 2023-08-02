import { IAuthSenderPayload, IChannel, IClient, IConnection, ITS5ConnectionHandler, ITS5DataHandler, ITS5MessageHandler } from "../../interfaces/teamspeak";
import { TS5DataHandler } from "./dataHandler";
import { TS5MessageHandler } from "./messageHandler";
import { ILogger } from "../../utils/logger";
import { ITSRemoteAppAuthPayloadOptions } from "../../interfaces/api";


// Establish connection to TS5 client
// Main class
export class TS5ConnectionHandler implements ITS5ConnectionHandler {
  ws: WebSocket; // Websocket connection to TS5 client
  authenticated = false; // Is the connection authenticated?
  remoteAppPort: number; // Port of TS5 client
  logger: ILogger; // Logger
  authPayload: ITSRemoteAppAuthPayloadOptions; // Authentication payload
  dataHandler: ITS5DataHandler; // Handles data/lists and states
  messageHandler: ITS5MessageHandler; // Handles messages received from TS5 client

  constructor(
    // Port of TS5 client
    remoteAppPort: number,
    authPayload: ITSRemoteAppAuthPayloadOptions,
    logger: ILogger,
    // State setters for dataHandler
    setConnections: React.Dispatch<React.SetStateAction<IConnection[]>>,
    setChannels: React.Dispatch<React.SetStateAction<IChannel[]>>,
    setClients: React.Dispatch<React.SetStateAction<IClient[]>>,
    setActiveConnectionStateId: React.Dispatch<React.SetStateAction<number>>,
  ) {


    // Create websocket connection to TS5 client
    this.remoteAppPort = remoteAppPort;
    this.authPayload = authPayload;
    this.logger = logger;
    this.ws = new WebSocket(`ws://localhost:${this.remoteAppPort}`);

    // Create dataHandler and messageHandler
    this.dataHandler = new TS5DataHandler(setConnections, setChannels, setClients, logger);
    this.messageHandler = new TS5MessageHandler(this.ws, this.dataHandler, setActiveConnectionStateId, logger);
  }

  reconnect() {
    this.logger.log("Reconnecting...")
    this.ws.close();

    this.ws = new WebSocket(`ws://localhost:${this.remoteAppPort}`);

    this.dataHandler.clearAll();
    this.authenticated = false;
    this.connect();
  }

  // Connect to TS5 client
  connect() {
    this.logger.log('Connecting to TS5 client...');

    // Create authentication payload
    const initalPayload: IAuthSenderPayload = {
      type: "auth",
      payload: {
        ...this.authPayload,
        content: {
          apiKey: localStorage.getItem("apiKey") ?? "",
        },
      }
    };

    this.ws.onopen = () => {
      // Send authentication payload to TS5 client
      this.ws.send(JSON.stringify(initalPayload));
      this.logger.wsSent(initalPayload);
    };

    this.ws.onclose = (event) => {
      this.logger.log("WebSocket connection closed", event);

      // If the connection was closed before authentication, remove the API key from local storage
      // OBS weirdly caches the localstorage and is very stubborn about clearing it (even when clicken "Clear Cache")
      if (!this.authenticated) {
        this.logger.log("WebSocket connection closed before authentication");
        localStorage.removeItem("apiKey");
      }

      setTimeout(() => {
        this.reconnect();
      }, 2000);
    };

    // Handle messages received from TS5 client
    // See TS5MessageHandler class
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      this.logger.wsReceived(data)

      switch (data.type) {
        case "auth":
          this.messageHandler.handleAuthMessage(data);
          this.authenticated = true;
          break;
        case "clientMoved":
          this.messageHandler.handleClientMovedMessage(data);
          break;
        case "clientPropertiesUpdated":
          this.messageHandler.handleClientPropertiesUpdatedMessage(data);
          break;
        case "talkStatusChanged":
          this.messageHandler.handleTalkStatusChangedMessage(data);
          break;
        case "serverPropertiesUpdated":
          this.messageHandler.handleServerPropertiesUpdatedMessage(data);
          break;
        case "connectStatusChanged":
          this.messageHandler.handleConnectStatusChangedMessage(data);
          break;
        case "clientSelfPropertyUpdated":
          this.messageHandler.handleClientSelfPropertyUpdatedMessage(data);
          break;
        case "channels":
          this.messageHandler.handleChannelsMessage(data);
          break;
        default:
          this.logger.log(`No handler for event type: ${data.type}`);
          break;
      }
    };
  }
}






