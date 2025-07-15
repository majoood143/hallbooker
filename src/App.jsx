import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { RTLProvider } from "./contexts/RTLContext";
import Routes from "./Routes";

function App() {
  return (
    <RTLProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </RTLProvider>
  );
}

export default App;