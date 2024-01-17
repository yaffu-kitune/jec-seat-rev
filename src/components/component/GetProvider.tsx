import { signIn } from "next-auth/react";

interface GetProvidersProps {
    providers: string;
    children: React.ReactNode;
}


export default function GetProviders({ providers, children }: GetProvidersProps) {
  return (
    <button
      className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-black flex items-center justify-center rounded-lg p-2"
      onClick={() => signIn(`${providers}`)}
    >
      {children}
    </button>
  );
}
