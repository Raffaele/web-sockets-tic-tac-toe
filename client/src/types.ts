export type Owner = 0 | 1 | 2;

export type User = {
  uuid: string;
  userName: string;
  playingWith: string | null;
};

type SetupMessage = {
  action: "setup";
  existingConnections: User[];
  uuid: string;
};

type DisconnectMessage = {
  action: "disconnect";
  uuid: string;
};

type ConnectMessage = {
  action: "connect";
  uuid: string;
  userName: string;
};

type StartChallengeMessage = {
  action: "startChallenge";
  uuids: [string, string];
};

type ExitChallengeMessage = {
  action: "exitChallenge";
  uuids: [string, string];
};

type PlayStepMessage = {
  action: "playStep";
  position: number;
};

export type SocketMessage =
  | SetupMessage
  | DisconnectMessage
  | ConnectMessage
  | StartChallengeMessage
  | ExitChallengeMessage
  | PlayStepMessage;

export type WinningPosition = [number, number, number];

type FairResult = {
  result: "FAIR";
};

type WinResult = {
  result: "WIN";
  position: WinningPosition;
};

type LostResult = {
  result: "LOST";
  position: WinningPosition;
};

export type GameResult = FairResult | WinResult | LostResult;