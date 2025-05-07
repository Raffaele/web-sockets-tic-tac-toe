type Props = {
  userName: string;
  playingWith: string | null;
  startChallenge: () => void;
};

export const Player = ({ userName, playingWith, startChallenge }: Props) => {
  return (
    <li
      style={{
        display: "inline-block",
        border: "1px solid black",
        padding: 8,
        borderRadius: 8,
        textAlign: "center",
        marginRight: 8,
      }}
    >
      <header style={{ fontWeight: "bold", fontSize: "2em" }}>
        {userName}
      </header>
      <hr />
      <footer>
        {playingWith ? <>BUSY</> : <button onClick={startChallenge}>GO</button>}
      </footer>
    </li>
  );
};
