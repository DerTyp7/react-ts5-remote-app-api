import { ILogger } from "utils/logger";
import { IConnection, IChannel, IClient, ITS5DataHandler } from "interfaces/teamspeak";


/**
 * Handles data received from TS5 client (list of connections, channels and clients)
 * Updates the states of useTSRemoteApp.tsx
 */
export class TS5DataHandler implements ITS5DataHandler {
  // Local lists of connections, channels and clients
  // These lists are used to keep track of the data, independent of the App.tsx state
  localConnections: IConnection[];
  localChannels: IChannel[];
  localClients: IClient[];

  // State setters for App.tsx
  setConnections: React.Dispatch<React.SetStateAction<IConnection[]>>;
  setChannels: React.Dispatch<React.SetStateAction<IChannel[]>>;
  setClients: React.Dispatch<React.SetStateAction<IClient[]>>;

  logger: ILogger;
  constructor(
    // State setters for App.tsx
    setConnections: React.Dispatch<React.SetStateAction<IConnection[]>>,
    setChannels: React.Dispatch<React.SetStateAction<IChannel[]>>,
    setClients: React.Dispatch<React.SetStateAction<IClient[]>>,

    logger: ILogger,
  ) {
    this.setConnections = setConnections;
    this.setChannels = setChannels;
    this.setClients = setClients;

    this.localConnections = [];
    this.localChannels = [];
    this.localClients = [];

    this.logger = logger;
  }

  get connections(): IConnection[] {
    return this.localConnections;
  }

  get channels(): IChannel[] {
    return this.localChannels;
  }

  get clients(): IClient[] {
    return this.localClients;
  }

  // Update App.tsx states
  private updateConnectionsState() {
    this.setConnections([...this.localConnections]);
  }

  private updateChannelsState() {
    this.setChannels([...this.localChannels]);
  }

  private updateClientsState() {
    this.setClients([...this.localClients]);
  }

  // Clear all data
  clearAll() {
    this.localConnections = [];
    this.localChannels = [];
    this.localClients = [];

    this.updateConnectionsState();
    this.updateChannelsState();
    this.updateClientsState();
  }

  // Add data to local lists and update states
  addConnection(connection: IConnection) {
    this.logger.log("Adding connection...", connection)

    const existingConnection: IConnection | undefined = this.localConnections.find((localConnection: IConnection) => localConnection.id === connection.id);

    if (existingConnection == undefined) {
      this.localConnections.push(connection);
      this.updateConnectionsState();
      this.logger.log("Connection added")
    } else {
      this.logger.log("Connection already exists")
    }
  }

  addChannel(channel: IChannel) {
    this.logger.log("Adding channel...", channel)
    const existingChannel: IChannel | undefined = this.localChannels.find((localChannel: IChannel) => localChannel.id === channel.id && localChannel.connection.id === channel.connection.id);

    if (existingChannel == undefined) {
      this.localChannels.push(channel);
      this.updateChannelsState();
      this.logger.log("Channel added")
    } else {
      this.logger.log("Channel already exists")
    }
  }

  addClient(client: IClient) {
    this.logger.log("Adding client...", client)
    const existingClient: IClient | undefined = this.localClients.find((localClient: IClient) => localClient.id === client.id && localClient.channel?.connection.id === client.channel?.connection.id);

    if (existingClient == undefined) {
      this.localClients.push(client);
      this.updateClientsState();
      this.logger.log("Client added")
    } else {
      this.logger.log("Client already exists")
    }
  }

  // Update data in local lists and update states
  updateConnection(connection: IConnection) {
    this.logger.log("Updating connection...", connection)
    const existingConnection: IConnection | undefined = this.localConnections.find((localConnection: IConnection) => localConnection.id === connection.id);

    if (existingConnection !== undefined) {
      this.localConnections[this.localConnections.indexOf(existingConnection)] = connection;
      this.updateConnectionsState();
      this.logger.log("Connection updated")
    } else {
      this.logger.log("Connection does not exist")
    }
  }

  updateChannel(channel: IChannel) {
    this.logger.log("Updating channel...", channel)
    const existingChannel: IChannel | undefined = this.localChannels.find((localChannel: IChannel) => localChannel.id === channel.id && localChannel.connection.id === channel.connection.id);

    if (existingChannel !== undefined) {
      this.localChannels[this.localChannels.indexOf(existingChannel)] = channel;
      this.updateChannelsState();
      this.logger.log("Channel updated")
    } else {
      this.logger.log("Channel does not exist")
    }
  }

  updateClient(client: IClient) {
    this.logger.log("Updating client...", client)
    const existingClient: IClient | undefined = this.localClients.find((localClient: IClient) => localClient.id === client.id && localClient.channel?.connection.id === client.channel?.connection.id);

    if (existingClient !== undefined) {
      this.localClients[this.localClients.indexOf(existingClient)] = client;
      this.updateClientsState();
      this.logger.log("Client updated")
    } else {
      this.logger.log("Client does not exist")
    }
  }

  // Remove data from local lists and update states
  removeConnection(connection: IConnection) {
    this.logger.log("Removing connection...", connection)
    const existingConnection: IConnection | undefined = this.localConnections.find((localConnection: IConnection) => localConnection.id === connection.id);

    if (existingConnection !== undefined) {
      this.localConnections.splice(this.localConnections.indexOf(existingConnection), 1);

      // Remove all channels and clients associated with the connection
      this.localChannels = this.localChannels.filter((localChannel: IChannel) => localChannel.connection.id !== connection.id);
      this.localClients = this.localClients.filter((localClient: IClient) => localClient.channel?.connection.id !== connection.id);

      this.updateChannelsState();
      this.updateClientsState();
      this.updateConnectionsState();
      this.logger.log("Connection removed")
    } else {
      this.logger.log("Connection does not exist")
    }
  }

  removeChannel(channel: IChannel) {
    this.logger.log("Removing channel...", channel)
    const existingChannel: IChannel | undefined = this.localChannels.find((localChannel: IChannel) => localChannel.id === channel.id && localChannel.connection.id === channel.connection.id);

    if (existingChannel !== undefined) {
      this.localChannels.splice(this.localChannels.indexOf(existingChannel), 1);

      // Remove all clients associated with the channel
      this.localClients = this.localClients.filter((localClient: IClient) => localClient.channel?.id !== channel.id);

      this.updateClientsState();
      this.updateChannelsState();
      this.logger.log("Channel removed")
    } else {
      this.logger.log("Channel does not exist")
    }
  }

  removeClient(client: IClient) {
    this.logger.log("Removing client...", client)
    const existingClient: IClient | undefined = this.localClients.find((localClient: IClient) => localClient.id === client.id && localClient.channel?.connection.id === client.channel?.connection.id);

    if (existingClient !== undefined) {
      this.localClients.splice(this.localClients.indexOf(existingClient), 1);
      this.updateClientsState();
      this.logger.log("Client removed")
    } else {
      this.logger.log("Client does not exist")
    }
  }

  // Helper functions
  getConnectionById(id: number): IConnection | undefined {
    return this.localConnections.find((connection: IConnection) => connection.id === id);
  }

  getChannelById(id: number, connectionId: number): IChannel | undefined {
    return this.localChannels.find((channel: IChannel) => channel.id === id && channel.connection?.id === connectionId);
  }

  getClientById(id: number, connectionId: number): IClient | undefined {
    return this.localClients.find((client: IClient) => client.id === id && client.channel?.connection.id === connectionId);
  }
}