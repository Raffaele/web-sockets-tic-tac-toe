import http from "http";
import { WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";
import url from "url";

const PORT = 3000;

const server = http.createServer();
const webSocketServer = new WebSocketServer({ server });

const connections = new Map();

webSocketServer.on("connection", (connection, request) => {
  const { userName } = url.parse(request.url, true).query;
  const uuid = uuidv4();

  connections.values().forEach(({ connection }) => {
    connection.send(
      JSON.stringify({
        uuid,
        userName,
        action: "connect",
      })
    );
  });

  const existingConnections = Array.from(
    connections,
    ([, { uuid, userName, playingWith }]) => ({
      uuid,
      userName,
      playingWith,
    })
  );

  connection.send(
    JSON.stringify({ action: "setup", existingConnections, uuid })
  );

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));

  connections.set(uuid, { connection, userName, uuid, playingWith: null });
});

function handleMessage(bytes, senderUuid) {
  const message = JSON.parse(bytes.toString());
  if (message.action === "startChallenge") {
    const { uuid: challengeUuid } = message;
    connections.get(senderUuid).playingWith = challengeUuid;
    connections.get(challengeUuid).playingWith = senderUuid;
    connections.forEach(({ connection }) => {
      connection.send(
        JSON.stringify({
          uuids: [challengeUuid, senderUuid],
          action: "startChallenge",
        })
      );
    });
    return;
  }
  if (message.action === "exitChallenge") {
    endChallenge(senderUuid);
  }
  if (message.action === "playPosition") {
    const player = connections.get(senderUuid);
    if (!player?.playingWith) return;
    const opponent = connections.get(player.playingWith);
    if (!opponent) return;

    const { position } = message;
    opponent.connection.send(
      JSON.stringify({
        position,
        action: "playStep",
      })
    );
  }

  if (message.action === "resetGame") {
    const player = connections.get(senderUuid);
    if (!player?.playingWith) return;
    const opponent = connections.get(player.playingWith);
    if (!opponent) return;
    player.connection.send(
      JSON.stringify({
        action: "resetGame",
      })
    );
    opponent.connection.send(
      JSON.stringify({
        action: "resetGame",
      })
    );
  }
}

function endChallenge(senderUuid) {
  const player = connections.get(senderUuid);
  if (!player) return;
  const opponentUuid = player.playingWith;
  if (!opponentUuid) return;
  const opponent = connections.get(opponentUuid);
  if (!opponent) return;
  opponent.playingWith = null;
  connections.forEach(({ connection }) => {
    connection.send(
      JSON.stringify({
        uuids: [senderUuid, opponentUuid],
        action: "exitChallenge",
      })
    );
  });
}

function handleClose(uuid) {
  endChallenge(uuid);
  connections.delete(uuid);
  connections.forEach(({ connection }) => {
    connection.send(
      JSON.stringify({
        uuid,
        action: "disconnect",
      })
    );
  });
}

server.listen(PORT, () => {
  console.log(`Web socket server is running on port ${PORT}`);
});
