
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import VideoPage from "../pages/VideoPage";
import MainPage from "../pages/MainPage";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-[#faf8f5] font-sans text-black selection:bg-black selection:text-white">
      <Header />
      <VideoPage />
      <MainPage />
    </div>
  );
}