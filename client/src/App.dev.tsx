import React from "react";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl text-center p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold">WorkWave — Safe Dev Mode</h1>
        <p className="mt-2 text-sm text-muted-foreground">The app is running in a lightweight fallback mode. Full UI and DB features are disabled to allow local development.</p>
      </div>
    </div>
  );
}
