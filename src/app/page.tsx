import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  return (
    <Card>
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Image
        src="/whitecarrot.png"
        alt="White Carrot Logo"
        width={200}
        height={200}
      />
      <h1 className="text-4xl font-bold mt-4">Welcome to White Carrot!</h1>
      <p className="mt-2 text-lg text-center">
        This is a starter template for a Next.js application using TypeScript and Tailwind CSS.
      </p>
    </div>
    </Card>
  );
}
