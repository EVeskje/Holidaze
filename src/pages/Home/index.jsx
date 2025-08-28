import { Hero } from "../../components/Hero";
import { Card } from "../../components/Card";

export const Home = () => {
  return (
    <>
      <Hero />
      <section className="mt-3 flex flex-wrap gap-3 sm:gap-5 max-w-7xl mx-auto px-1">
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </section>
    </>
  );
};
