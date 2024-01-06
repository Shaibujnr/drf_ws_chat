import "./App.css";
import User from "./components/User";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="bg-white p-6 w-8/12 rounded-md shadow-md">
          <h1 class="text-2xl font-bold mb-4">Chat</h1>

          <div class="grid grid-cols-2 gap-4" style={{ height: 500 }}>
            <div class="h-full">
              <h3>User1</h3>
              <User
                userUUID={"7e23353f-c0b3-43a1-880b-94f84969ad33"}
                withUserUUID={"8fd045c9-46a0-4493-9341-bb86807c16e4"}
              />
            </div>

            <div class="h-full">
              <h3>User2</h3>
              <User
                userUUID={"8fd045c9-46a0-4493-9341-bb86807c16e4"}
                withUserUUID={"7e23353f-c0b3-43a1-880b-94f84969ad33"}
              />
            </div>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
