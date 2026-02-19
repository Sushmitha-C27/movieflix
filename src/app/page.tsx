'use client';

import { useEffect, useState } from "react";
import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Row from "@/components/Row";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      window.location.href = "/login";
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Banner />

      <section className="px-4 py-6 space-y-6">
        <Row title="Trending Now" category="trending" />
        <Row title="Top Rated" category="topRated" />
        <Row title="Action Movies" category="action" />
        <Row title="Comedy Movies" category="comedy" />
        <Row title="Horror Movies" category="horror" />
        <Row title="Romance Movies" category="romance" />
        <Row title="Documentaries" category="documentary" />
      </section>
    </main>
  );
}
