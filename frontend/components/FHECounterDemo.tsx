"use client";

import { useState } from "react";
import { AthleteRegistrationForm } from "./AthleteRegistrationForm";
import { AthleteDataViewer } from "./AthleteDataViewer";

export const AthleteRegistrationDemo = () => {
  const [activeTab, setActiveTab] = useState<"register" | "view">("register");

  const buttonClass =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 font-semibold shadow-sm " +
    "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const activeButtonClass = buttonClass + " bg-blue-600 text-white hover:bg-blue-700";
  const inactiveButtonClass = buttonClass + " bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="grid w-full gap-4">
      <div className="col-span-full mx-20 bg-black text-white">
        <p className="font-semibold text-3xl m-5">
          Biblock Entry -{" "}
          <span className="font-mono font-normal text-gray-400">
            Athlete Registration System
          </span>
        </p>
        <p className="text-lg mx-5 mb-5 text-gray-300">
          Privacy-preserving athlete registration using Fully Homomorphic Encryption (FHE)
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="col-span-full mx-20 flex gap-4">
        <button
          className={activeTab === "register" ? activeButtonClass : inactiveButtonClass}
          onClick={() => setActiveTab("register")}
        >
          Register Athlete
        </button>
        <button
          className={activeTab === "view" ? activeButtonClass : inactiveButtonClass}
          onClick={() => setActiveTab("view")}
        >
          View My Data
        </button>
      </div>

      {/* Tab Content */}
      <div className="col-span-full mx-20">
        {activeTab === "register" ? (
          <AthleteRegistrationForm />
        ) : (
          <AthleteDataViewer />
        )}
      </div>
    </div>
  );
};
