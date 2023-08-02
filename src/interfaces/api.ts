export interface ITSRemoteAppOptions {
  remoteAppPort: number;
  auth: ITSRemoteAppAuthPayloadOptions,
}

export interface ITSRemoteAppAuthPayloadOptions {
  identifier: string,
  version: string,
  name: string,
  description: string
}