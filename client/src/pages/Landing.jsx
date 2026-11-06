import { ArrowRight, CheckCircle2, Code2, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">

      <Navbar />

      <main>
        <Hero />

        <Features />

        {/* How it works */}
        <section
          id="how-it-works"
          className="bg-white py-24 dark:bg-slate-950"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">

            <div className="mx-auto mb-16 max-w-2xl text-center">
              <p className="font-semibold uppercase tracking-widest text-violet-600">
                Simple Process
              </p>

              <h2 className="mt-4 text-4xl font-extrabold text-slate-900 dark:text-white">
                Your Journey Starts in Three Steps
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  number: "01",
                  icon: CheckCircle2,
                  title: "Create Your Account",
                  description:
                    "Join the DevQuest community and create your developer profile.",
                },
                {
                  number: "02",
                  icon: Code2,
                  title: "Solve Challenges",
                  description:
                    "Choose programming problems and write your own solutions.",
                },
                {
                  number: "03",
                  icon: Trophy,
                  title: "Earn and Compete",
                  description:
                    "Earn XP, improve your ranking, and track your progress.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="rounded-2xl border border-slate-200 p-8 dark:border-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-black text-violet-200 dark:text-violet-500/20">
                        {item.number}
                      </span>

                      <Icon className="text-violet-600" size={30} />
                    </div>

                    <h3 className="mt-8 text-xl font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 to-blue-600 px-8 py-14 text-center text-white sm:px-16">
              <h2 className="text-3xl font-extrabold sm:text-4xl">
                Ready to Challenge Yourself?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-violet-100">
                Start your coding journey today and become a stronger
                problem solver.
              </p>

              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-violet-700 transition hover:bg-violet-50"
              >
                Join DevQuest
                <ArrowRight size={18} />
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />

    </div>
  );
};

export default Landing;