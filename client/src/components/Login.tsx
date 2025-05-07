import { useCallback, useState } from "react";

type Props = { onSubmit: (name: string) => void };

export const Login = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmit(name);
    },
    [name, onSubmit]
  );
  return (
    <form onSubmit={handleSubmit}>
      <h1>login</h1>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="username"
      />
      <button type="submit">submit</button>
    </form>
  );
};
