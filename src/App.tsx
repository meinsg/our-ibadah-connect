import { BrowserRouter, Routes, Route } from "react-router-dom";

// Simple test page component to avoid complex imports
const TestPage = ({ title }: { title: string }) => (
  <div className="p-8">
    <h1 className="text-4xl font-bold">{title}</h1>
    <p className="text-lg mt-4">This is a test page to verify routing works</p>
  </div>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<TestPage title="Ouribadah - Home" />} />
      <Route path="/auth" element={<TestPage title="Auth Page" />} />
      <Route path="/mosques" element={<TestPage title="Mosques Page" />} />
      <Route path="*" element={<TestPage title="404 - Not Found" />} />
    </Routes>
  </BrowserRouter>
);

export default App;