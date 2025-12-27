import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatusPage from "./pages/StatusPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import ReelsPage from "./pages/ReelsPage";
import ReelsLandingPage from "./pages/ReelsLandingPage";
import UpscalePage from "./pages/UpscalePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/status/:jobId" element={<StatusPage />} />
        <Route path="/flashcards/:jobId" element={<FlashcardsPage />} />
        <Route path="/reels/:jobId" element={<ReelsPage />} />
        <Route path="/reels-creator" element={<ReelsLandingPage />} />
        <Route path="/upscale" element={<UpscalePage />} />
      </Routes>
    </BrowserRouter>
  );
}
