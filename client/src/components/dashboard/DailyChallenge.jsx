import { ArrowRight, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";

const DailyChallenge = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-violet-600 to-blue-600 p-7 text-white shadow-xl shadow-violet-600/10">

      <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full border-[30px] border-white/10" />

      <div className="relative">
        <div className="flex items-center gap-2">
          <Star size={17} className="fill-yellow-300 text-yellow-300" />

          <span className="text-sm font-semibold text-violet-100">
            CHALLENGE OF THE DAY
          </span>
        </div>

        <h3 className="mt-5 text-2xl font-extrabold">
          Two Sum
        </h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-violet-100">
          Find two numbers in an array whose sum equals a given target.
          Test your problem-solving skills with this classic challenge.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="rounded-full bg-green-400/20 px-3 py-1 text-xs font-bold text-green-100">
            Easy
          </span>

          <span className="flex items-center gap-1.5 text-sm text-violet-100">
            <Clock size={15} />
            15 min
          </span>

          <span className="text-sm font-semibold text-yellow-200">
            +100 XP
          </span>
        </div>

        <Link
          to="/problems"
          className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-violet-700 transition hover:bg-violet-50"
        >
          Solve Challenge
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
};

export default DailyChallenge;