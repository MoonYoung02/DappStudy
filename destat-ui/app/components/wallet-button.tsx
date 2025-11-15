import { useAccount, useDisconnect } from "wagmi";
import { rabbykit } from "~/root";
import { Button } from "./ui/button";

export default function WalletButton() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  console.log(isConnected);
  return (
    <div>
      {isConnected ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        <Button onClick={() => rabbykit.open()}>Connect</Button>
      )}
    </div>
  );
}
