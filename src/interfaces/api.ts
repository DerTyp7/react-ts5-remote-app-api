export interface ITSRemoteAppOptions {
  remoteAppPort: number;
  logging: boolean;
  auth: ITSRemoteAppAuthPayloadOptions,
}

export interface ITSRemoteAppAuthPayloadOptions {
  identifier: string,
  version: string,
  name: string,
  description: string
}