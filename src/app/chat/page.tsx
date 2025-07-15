import ChatBox from "./components/ChatBox";

export default function ChatPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          💬 Personal AI Assistant
        </h1>
        <ChatBox />
      </div>
    </main>
  );
}
