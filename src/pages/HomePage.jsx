import CinematicParticles from "../components/CinematicParticles";
import Header from "../components/Header";
import HeroCinematic from "../components/HeroCinematic";
import UploadBox from "../components/UploadBox";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import { API_BASE_URL } from "../config";

export default function HomePage() {

  async function handleSubmit(payload) {
    const backend = API_BASE_URL;


    // If FILE upload
    if (payload.file) {
      const form = new FormData();
      form.append("video", payload.file);

      const res = await fetch(`${backend}/api/process/file`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data.jobId) {
        window.location.href = `/status/${data.jobId}`;
      }
      return;
    }

    // If URL upload
    if (payload.url) {
      const res = await fetch(`${backend}/api/process/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: payload.url }),
      });

      const data = await res.json();
      if (data.jobId) {
        window.location.href = `/status/${data.jobId}`;
      }
      return;
    }

    alert("No file or URL found.");
  }

  return (
    <div className="min-h-screen relative pb-0 overflow-x-hidden bg-depth">
      {/* Grain texture for consistency */}
      <div className="bg-grain opacity-20" />

      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 pb-20">
          <HeroCinematic />
          <UploadBox onSubmit={handleSubmit} />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
