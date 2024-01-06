import "./App.css";
import Chat from "./components/Chat";
import Connect from "./components/Connect";

function App() {
  return (
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="bg-white p-6 w-8/12 rounded-md shadow-md">
        <h1 class="text-2xl font-bold mb-4">Centered Grid</h1>

        <div class="grid grid-cols-2 gap-4" style={{ height: 500 }}>
          <div class="h-full">
            <h3>User1</h3>
            {/* <Chat /> */}
            <Connect />
          </div>

          <div class="h-full">
            <h3>User2</h3>
            {/* <Chat /> */}
            <Connect />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
