import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "react-i18next";

// 이미지 import
import heroImageStudent from "../assets/tona-hero-illustration.png";
import heroImageNeighbor from "../assets/hero-illustration.png";
import heroImageEvaluation from "../assets/thdMain.png";
import globalCommunityMap from "../assets/map.png";
import postImageKorea from "../assets/post-korea.png";
import postImageJapan from "../assets/post-japan.png";
import logoWithTitle from "../assets/logoWithTitle.png";

// ✨ 여러 캐릭터 파일을 import 합니다.
import char1 from "../assets/char1.png";
import char2 from "../assets/char2.png";
import char3 from "../assets/char3.png";
import char4 from "../assets/char4.png";

// 아이콘 이미지 import
import messageIcon from "../assets/message.png";
import connectIcon from "../assets/connect.png";
import searchIcon from "../assets/search.png";
import bookIcon from "../assets/book-icon.png";
import networkIcon from "../assets/network.png";
import pingIcon from "../assets/ping.png";
import safeIcon from "../assets/safe.png";
import LanguageSelector from "../components/LanguageSelector";

export default function LandingPage() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const navPages = [
    { id: "neighbor", label: t("landing.neighborCommunication") },
    { id: "student", label: t("common.studentsWorkers") },
    { id: "evaluation", label: t("common.localEvaluation") },
    { id: "community", label: t("common.globalCommunity") },
  ];

  const mainContainerRef = useRef(null);
  const pageRefs = useRef([]);

  const useInViewOptions = { threshold: 0.2 };
  const { ref: neighborRef, inView: neighborInView } =
    useInView(useInViewOptions);
  const { ref: studentRef, inView: studentInView } =
    useInView(useInViewOptions);
  const { ref: evaluationRef, inView: evaluationInView } =
    useInView(useInViewOptions);
  const { ref: loginFormRef, inView: loginFormInView } =
    useInView(useInViewOptions);
  const { ref: communityContainerRef, inView: communityContainerInView } =
    useInView(useInViewOptions);
  const { ref: communityMapRef, inView: communityMapInView } = useInView({
    ...useInViewOptions,
    delay: 300,
  });

  // ✨ 캐릭터 위치, 애니메이션 지연시간, 그리고 해당 캐릭터 이미지 파일을 배열로 관리합니다.
  const characterData = [
    { top: "20%", left: "20%", delay: "0.2s", src: char1 }, // 북미
    { top: "42%", left: "30%", delay: "0.8s", src: char2 }, // 남미
    { top: "25%", left: "50%", delay: "0.1s", src: char3 }, // 유럽
    { top: "40%", left: "45%", delay: "1.0s", src: char4 }, // 아프리카
    { top: "20%", left: "60%", delay: "0.4s", src: char1 }, // 한국 (반복 사용)
    { top: "30%", left: "70%", delay: "0.6s", src: char2 }, // 일본 (반복 사용)
    { top: "50%", left: "70%", delay: "1.2s", src: char3 }, // 호주 (반복 사용)
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const container = mainContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const pageHeight = container.offsetHeight;
      const newIndex = Math.round(container.scrollTop / pageHeight);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLoginModalOpen(false);
      }
    };
    if (isLoginModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoginModalOpen]);

  const scrollToPage = (index) => {
    pageRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* ========== 상단 고정 헤더 ========== */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-10">
            <img src={logoWithTitle} alt="Logo" className="h-10" />
            <nav className="hidden md:flex items-center gap-6 text-gray-600 font-semibold">
              <button
                onClick={() => scrollToPage(0)}
                className="hover:text-[#3E8BDC]"
              >
                {t("common.introduction")}
              </button>
              <button
                onClick={() => scrollToPage(1)}
                className="hover:text-[#3E8BDC]"
              >
                {t("common.studentsWorkers")}
              </button>
              <button
                onClick={() => scrollToPage(2)}
                className="hover:text-[#3E8BDC]"
              >
                {t("common.localEvaluation")}
              </button>
              <button
                onClick={() => scrollToPage(3)}
                className="hover:text-[#3E8BDC]"
              >
                {t("community")}
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => (window.location.href = "/signin")}
              className="bg-[#3E8BDC] text-white font-bold px-6 py-2 rounded-md hover:bg-[#3577BE]"
            >
              {t("common.login")}
            </button>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* ========== 오른쪽 고정 스크롤 내비게이션 ========== */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 z-10 scrollbar-hide">
        <ul className="flex flex-col items-center justify-center gap-4">
          {navPages.map((page, index) => (
            <li key={page.id}>
              <button
                onClick={() => scrollToPage(index)}
                className="block"
                title={page.label}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "w-2 h-8 bg-[#3E8BDC]"
                      : "w-2 h-2 bg-gray-300 hover:bg-gray-500"
                  }`}
                ></span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ========== 메인 세로 스크롤 컨테이너 ========== */}
      <main
        ref={mainContainerRef}
        className="w-full max-w-[1200px] self-center h-full snap-y snap-mandatory overflow-y-auto scrollbar-hide mx-auto"
      >
        {/* 페이지 1, 2, 3은 이전과 동일 */}
        <section
          ref={(el) => (pageRefs.current[0] = el)}
          className="w-full h-screen snap-start overflow-y-auto pt-20 bg-white scrollbar-hide"
        >
          <div className="flex w-full items-center p-12 text-left">
            <div className="w-full md:w-1/2">
              <h1 className="text-5xl font-black leading-normal">
                {t("landing.neighborCommunication")}
                <br />
                {t("landing.closestNetwork")}
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                {t("landing.neighborDescription")}
              </p>
              <button
                onClick={() => scrollToPage(1)}
                className="mt-8 inline-block rounded-full bg-[#3E8BDC] px-10 py-4 text-lg font-bold text-white transition-colors hover:bg-[#3577BE]"
              >
                {t("landing.viewStudentWorkerService")}
              </button>
            </div>
            <div className="hidden md:block md:w-1/2 pl-20 -mt-8">
              <img
                src={heroImageNeighbor}
                alt={t("landing.networkConnectedPeople")}
              />
            </div>
          </div>
          <div ref={neighborRef} className="px-4 py-24 bg-white">
            <div className="mx-auto max-w-5xl flex flex-col md:flex-row justify-around gap-8">
              <div
                className={`flex flex-col items-center text-center p-8 bg-white rounded-xl w-full shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 ${
                  neighborInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src={messageIcon}
                  alt={t("common.communication")}
                  className="w-27 h-27 mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">
                  {t("common.communication")}
                </h3>
                <p className="text-gray-600">
                  {t("landing.communicationDescription")}
                </p>
              </div>
              <div
                className={`flex flex-col items-center text-center p-8 bg-white rounded-xl w-full shadow-md transition-all duration-300 ease-out delay-200 hover:shadow-xl hover:-translate-y-2 ${
                  neighborInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src={connectIcon}
                  alt={t("common.connection")}
                  className="w-27 h-27 mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">
                  {t("common.connection")}
                </h3>
                <p className="text-gray-600">
                  {t("landing.connectionDescription")}
                </p>
              </div>
              <div
                className={`flex flex-col items-center text-center p-8 bg-white rounded-xl w-full shadow-md transition-all duration-300 ease-out delay-300 hover:shadow-xl hover:-translate-y-2 ${
                  neighborInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src={searchIcon}
                  alt={t("common.discovery")}
                  className="w-27 h-27 mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">
                  {t("common.discovery")}
                </h3>
                <p className="text-gray-600">
                  {t("landing.discoveryDescription")}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-24 bg-white text-center">
            <h2 className="text-4xl font-bold mb-8">
              {t("landing.connectWithNeighbors")}
            </h2>
            <a
              href="#"
              className="inline-block rounded-full bg-[#3E8BDC] px-12 py-5 text-xl font-bold text-white hover:bg-[#3577BE]"
            >
              {t("landing.exploreCommunity")}
            </a>
          </div>
        </section>

        <section
          ref={(el) => (pageRefs.current[1] = el)}
          className="w-full h-screen snap-start overflow-y-auto pt-20 scrollbar-hide"
        >
          <div className="flex w-full items-center p-12 text-left bg-white">
            <div className="w-full md:w-1/2">
              <h1 className="text-5xl font-black leading-tight">
                {t("landing.customizedManagement")}
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                {t("landing.adaptEasily")}
              </p>
              <button
                onClick={() => scrollToPage(2)}
                className="mt-8 inline-block rounded-full bg-[#3E8BDC] px-10 py-4 text-lg font-bold text-white transition-colors hover:bg-[#3577BE]"
              >
                {t("landing.viewLocalEvaluation")}
              </button>
            </div>
            <div className="hidden md:block md:w-1/2 pl-20">
              <img
                src={heroImageStudent}
                alt={t("landing.laptopUser")}
                className="w-full"
              />
            </div>
          </div>
          <div ref={studentRef} className="px-4 py-24 bg-white">
            <div className="mx-auto max-w-5xl flex flex-col md:flex-row justify-around gap-8">
              <div
                className={`flex flex-col items-center text-center p-8 bg-white rounded-xl w-full shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 ${
                  studentInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src={bookIcon}
                  alt={t("common.mutualHelp")}
                  className="w-27 h-27 mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">
                  {t("common.mutualHelp")}
                </h3>
                <p className="text-gray-600">
                  {t("landing.mutualHelpDescription")}
                </p>
              </div>
              <div
                className={`flex flex-col items-center text-center p-8 bg-white rounded-xl w-full shadow-md transition-all duration-300 ease-out delay-200 hover:shadow-xl hover:-translate-y-2 ${
                  studentInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src={networkIcon}
                  alt={t("common.network")}
                  className="w-27 h-27 mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">
                  {t("common.network")}
                </h3>
                <p className="text-gray-600">
                  {t("landing.networkDescription")}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-24 bg-white text-center">
            <h2 className="text-3xl font-bold mb-6">
              {t("landing.userReviews")}
            </h2>
            <p className="text-xl text-gray-700">
              "{t("landing.userTestimonial")}"
            </p>
          </div>
          <div className="px-4 py-20 bg-[#DDEBFF] text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">
              {t("landing.connectWithSimilar")}
            </h2>
            <button
              onClick={() => scrollToPage(3)}
              className="inline-block rounded-lg bg-[#3E8BDC] px-12 py-5 text-xl font-bold text-white hover:bg-[#3577BE] shadow-md"
            >
              {t("landing.goCommunity")}
            </button>
          </div>
        </section>

        <section
          ref={(el) => (pageRefs.current[2] = el)}
          className="w-full h-screen snap-start overflow-y-auto pt-20 bg-white scrollbar-hide"
        >
          <div className="flex w-full items-center p-12 text-left">
            <div className="w-full md:w-1/2">
              <h1 className="text-5xl font-black leading-normal">
                {t("landing.localEvaluationTitle")}
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                {t("landing.findOptimalPlace")}
              </p>
              <button
                onClick={() => scrollToPage(3)}
                className="mt-8 inline-block rounded-full bg-[#3E8BDC] px-10 py-4 text-lg font-bold text-white transition-colors hover:bg-[#3577BE]"
              >
                {t("landing.goGlobalCommunity")}
              </button>
            </div>
            <div className="hidden md:block md:w-1/2 pl-8">
              <img
                src={heroImageEvaluation}
                alt={t("landing.evaluatingPeople")}
                className="w-full"
              />
            </div>
          </div>
          <div ref={evaluationRef} className="px-4 py-24 bg-white">
            <div className="mx-auto max-w-5xl flex flex-col md:flex-row justify-around gap-8">
              <div
                className={`flex flex-col items-center text-center p-8 bg-white rounded-xl w-full shadow-md transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2 ${
                  evaluationInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src={pingIcon}
                  alt={t("common.location")}
                  className="w-27 h-27 mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">
                  {t("common.location")}
                </h3>
                <p className="text-gray-600">
                  {t("landing.locationDescription")}
                </p>
              </div>
              <div
                className={`flex flex-col items-center text-center p-8 bg-white rounded-xl w-full shadow-md transition-all duration-300 ease-out delay-200 hover:shadow-xl hover:-translate-y-2 ${
                  evaluationInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
              >
                <img
                  src={safeIcon}
                  alt={t("common.safety")}
                  className="w-27 h-27 mb-4"
                />
                <h3 className="text-2xl font-bold mb-2">
                  {t("common.safety")}
                </h3>
                <p className="text-gray-600">
                  {t("landing.safetyDescription")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 페이지 4: 글로벌 커뮤니티 */}
        <section
          ref={(el) => {
            pageRefs.current[3] = el;
            communityContainerRef(el);
          }}
          className="w-full h-screen snap-start overflow-y-auto pt-24 p-4 bg-white scrollbar-hide"
        >
          <div
            className={`max-w-6xl mx-auto border border-gray-200 rounded-2xl shadow-lg p-6 md:p-10 transition-all duration-1000 ease-out ${
              communityContainerInView
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <header className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                {t("landing.globalCommunityTitle")}
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                {t("landing.connectWorldwide")}
              </p>
            </header>

            {/* 지도와 캐릭터들을 함께 감싸는 컨테이너 */}
            <div ref={communityMapRef} className="my-6 relative ">
              {/* 지도 이미지 */}
              <img
                src={globalCommunityMap}
                alt={t("landing.globalCommunityMap")}
                className={`w-4/5 mx-auto transition-opacity duration-700 ease-out ${
                  communityMapInView ? "opacity-100" : "opacity-0"
                }`}
                style={{ transform: "translate(-5%, -10%)" }} // 이 부분을 추가 및 조정
              />

              {/* ✨ 캐릭터 이미지들 (배열을 사용해 렌더링하고 각기 다른 src 사용) */}
              {communityMapInView && (
                <>
                  {characterData.map((char, index) => (
                    <img
                      key={index}
                      src={char.src} // ✨ 각 캐릭터에 맞는 src 사용
                      alt={`${t("landing.characterIcon")} ${index + 1}`}
                      className="absolute character-pin appear-animation"
                      style={{
                        top: char.top,
                        left: char.left,
                        animationDelay: char.delay,
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                {t("landing.recentPosts")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1">
                  <img
                    src={postImageKorea}
                    alt={t("landing.koreaIntroduction")}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-bold text-lg">
                      {t("landing.introduceKorea")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("landing.koreaDescription")}
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1">
                  <img
                    src={postImageJapan}
                    alt={t("landing.japanIntroduction")}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-bold text-lg">
                      {t("landing.introduceJapan")}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t("landing.japanDescription")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-10"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
