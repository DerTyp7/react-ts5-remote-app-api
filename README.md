# React TeamSpeak5 RemoteApp API

[![npm](https://img.shields.io/npm/v/react-ts5-remote-app-api.svg)](https://www.npmjs.com/package/react-ts5-remote-app-api) ![downloads](https://img.shields.io/npm/dt/react-ts5-remote-app-api.svg)

This is a ReactJS hook for the TeamSpeak5 RemoteApp API.

It gathers all the events and methods from the API and makes them available as React states.

Please note that this is still a work in progress and not all events and methods are implemented yet.

Projects which are using this hook: [TS5 OBS Overlay](https://github.com/DerTyp7/ts5-obs-overlay)

## Table of Contents

- [React TeamSpeak5 RemoteApp API](#react-teamspeak5-remoteapp-api)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Examples](#examples)
    - [Get all clients in the current channel](#get-all-clients-in-the-current-channel)
  - [Types](#types)
    - [IConnection](#iconnection)
    - [IChannel](#ichannel)
    - [IClient](#iclient)

## Installation

```bash
npm install react-ts5-remote-app-api
```

## Usage

```Typescript
import useTSRemoteApp, { IClient } from "react-ts5-remote-app-api";

export default function App() {
  const {
      clients,
      channels,
      connections,
      activeConnectionId,
      currentConnection,
      currentChannel,
      currentClient,
    clientsInChannel,
   } = useTSRemoteApp({
         remoteAppPort: 5899
      });

 ...
}
```

## Examples

### Get all clients in the current channel

```Typescript
import useTSRemoteApp, { IClient } from "react-ts5-remote-app-api";

default function App() {
  const { clientsInChannel } = useTSRemoteApp({
    remoteAppPort: 5899,
  });

  return (
    <div className="App">
     {clientsInChannel.map((client) => {
        return <div key={client.id}>{client.properties.nickname}</div>;
      })}
    </div>
  );
}
```

## Types

The types are based on the TeamSpeak5 message types.

### IConnection

```Typescript
interface IConnection {
  channelInfos?: IChannelInfos;
  clientId: number;
  clientInfos?: IClientInfo[];
  id: number;
  properties?: IServerProperties;
}

interface IServerProperties {
  antiFloodPointsNeededCommandBlock: number;
  antiFloodPointsNeededIpBlock: number;
  antiFloodPointsNeededPluginBlock: number;
  antiFloodPointsTickReduce: number;
  askForPrivilegeKeyAfterNickname: boolean;
  askForPrivilegeKeyForChannelCreation: boolean;
  askForPrivilegeKeyForModify: boolean;
  awayMessage: string;
  badges: string;
  channelGroupId: string;
  channelGroupInheritedChannelId: string;
  clientType: number;
  connectionBandwidthReceived: number;
  connectionBandwidthSent: number;
  connectionClientIp: string;
  connectionConnectedTime: number;
  connectionFiletransferBandwidthReceived: number;
  connectionFiletransferBandwidthSent: number;
  connectionPacketloss: number;
  connectionPing: number;
  connectionPacketsReceived: number;
  connectionPacketsSent: number;
  connectionPort: number;
  connectionQueryBandwidthReceived: number;
  connectionQueryBandwidthSent: number;
  connectionServerIp: string;
  connectionServerPort: number;
  connectionThrottleBandwidthReceived: number;
  connectionThrottleBandwidthSent: number;
  country: string;
  created: number;
  defaultChannel: string;
  defaultChannelPassword: string;
  defaultServerGroup: string;
  defaultToken: string;
  flagAvatar: string;
  iconId: number;
  inputHardware: boolean;
  inputMuted: boolean;
  isChannelCommander: boolean;
  isMuted: boolean;
  isPrioritySpeaker: boolean;
  isRecording: boolean;
  isTalker: boolean;
  isTts: boolean;
  metaData: string;
  monthBytesDownloaded: number;
  monthBytesUploaded: number;
  myteamspeakAvatar: string;
  myteamspeakId: string;
  neededServerQueryViewPower: number;
  nickname: string;
  nicknamePhonetic: string;
  outputHardware: boolean;
  outputMuted: boolean;
  outputOnlyMuted: boolean;
  permissionHints: number;
  platform: string;
  serverPassword: string;
  signedBadges: string;
  talkPower: number;
  talkRequest: number;
  talkRequestMsg: string;
  totalBytesDownloaded: number;
  totalBytesUploaded: number;
  totalConnections: number;
  type: number;
  uniqueIdentifier: string;
  unreadMessages: number;
  userTag: string;
  version: string;
  volumeModificator: number;
}
```

### IChannel

```Typescript
interface IChannel {
  id: number;
  connection: IConnection;
  order: string;
  parentId: string;
  properties: IChannelProperties;
}

interface IChannelProperties {
  bannerGfxUrl: string;
  bannerMode: number;
  codec: number;
  codecIsUnencrypted: boolean;
  codecLatencyFactor: number;
  codecQuality: number;
  deleteDelay: number;
  description: string;
  flagAreSubscribed: boolean;
  flagDefault: boolean;
  flagMaxclientsUnlimited: boolean;
  flagMaxfamilyclientsInherited: boolean;
  flagMaxfamilyclientsUnlimited: boolean;
  flagPassword: boolean;
  flagPermanent: boolean;
  flagSemiPermanent: boolean;
  forcedSilence: boolean;
  iconId: number;
  maxclients: number;
  maxfamilyclients: number;
  name: string;
  namePhonetic: string;
  neededTalkPower: number;
  order: string;
  permissionHints: number;
  storageQuota: number;
  topic: string;
  uniqueIdentifier: string;
}
```

### IClient

```Typescript
interface IClient {
  id: number;
  talkStatus: number;
  channel: IChannel;
  properties: IClientProperties;
}

interface IChannelInfos {
  rootChannels: IChannel[];
  subChannels: { [key: number]: IChannel[] };
}

interface IClientInfo {
  channelId: number;
  id: number;
  properties: IClientProperties;
}

interface IClientProperties {
  away: boolean;
  awayMessage: string;
  badges: string;
  channelGroupId: string;
  channelGroupInheritedChannelId: string;
  country: string;
  created: number;
  databaseId: string;
  defaultChannel: string;
  defaultChannelPassword: string;
  defaultToken: string;
  description: string;
  flagAvatar: string;
  flagTalking: boolean;
  iconId: number;
  idleTime: number;
  inputDeactivated: boolean;
  inputHardware: boolean;
  inputMuted: boolean;
  integrations: string;
  isChannelCommander: boolean;
  isMuted: boolean;
  isPrioritySpeaker: boolean;
  isRecording: boolean;
  isTalker: boolean;
  lastConnected: number;
  metaData: string;
  monthBytesDownloaded: number;
  monthBytesUploaded: number;
  myteamspeakAvatar: string;
  myteamspeakId: string;
  neededServerQueryViewPower: number;
  nickname: string;
  nicknamePhonetic: string;
  outputHardware: boolean;
  outputMuted: boolean;
  outputOnlyMuted: boolean;
  permissionHints: number;
  platform: string;
  serverGroups: string;
  serverPassword: string;
  signedBadges: string;
  talkPower: number;
  talkRequest: number;
  talkRequestMsg: string;
  totalBytesDownloaded: number;
  totalBytesUploaded: number;
  totalConnections: number;
  type: number;
  uniqueIdentifier: string;
  unreadMessages: number;
  userTag: string;
  version: string;
  volumeModificator: number;
}
```
