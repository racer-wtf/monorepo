import { Navbar } from "@/components/composites/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 xl:px-0">
        <span>Hello, world!</span>
      </main>
    </div>
  );
}
