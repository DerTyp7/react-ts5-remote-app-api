/* eslint-disable react-hooks/exhaustive-deps */
import { TS5ConnectionHandler } from "../handlers/teamspeak/connectionHandler";
import { IClient, IChannel, IConnection, ITS5ConnectionHandler } from "../interfaces/teamspeak";
import { useEffect, useState } from "react";

export default function useTSRemoteApp({ remoteAppPort = 5899 }: { remoteAppPort: number }) {
  const [clients, setClients] = useState<IClient[]>([]);
  const [channels, setChannels] = useState<IChannel[]>([]);
  const [connections, setConnections] = useState<IConnection[]>([]);
  const [activeConnectionId, setActiveConnectionId] = useState<number>(1);

  const [currentConnection, setCurrentConnection] = useState<IConnection | undefined>(undefined);
  const [currentChannel, setCurrentChannel] = useState<IChannel | undefined>(undefined);
  const [currentClient, setCurrentClient] = useState<IClient | undefined>(undefined);

  const [clientsInChannel, setClientsInChannel] = useState<IClient[]>([]);

  useEffect(() => {
    const tsConnection: ITS5ConnectionHandler = new TS5ConnectionHandler(
      remoteAppPort,
      setConnections,
      setChannels,
      setClients,
      setActiveConnectionId
    );
    tsConnection.connect();
  }, []);

  useEffect(() => {
    const currentConnection = connections.find((connection) => connection.id === activeConnectionId);
    setCurrentConnection(currentConnection);

    if (currentConnection) {
      const currentClient = clients.find((client) => client.id === currentConnection.clientId);
      setCurrentClient(currentClient);
      if (currentClient) {
        const currentChannel = channels.find((channel) => channel.id === currentClient.channel?.id);
        setCurrentChannel(currentChannel);
      }
    }

    if (currentChannel) {
      const clientsInChannel = clients.filter((client) => {
        return client.channel?.id === currentChannel?.id && client.channel.connection.id === activeConnectionId;
      });
      setClientsInChannel(clientsInChannel);
    }
  }, [clients, channels, connections, activeConnectionId]);

  return {
    clients,
    channels,
    connections,
    activeConnectionId,
    currentConnection,
    currentChannel,
    currentClient,
    clientsInChannel,
  };
}
