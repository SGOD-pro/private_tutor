"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllBatches } from "@/store/slices/SubjectBatch";
import { setSubject } from "@/store/slices/Subjects";

import Navbar from "./components/Navbar";
import ToastComponent from "./components/ToastComponent";
import axios from "axios";
import Offline from "./components/Offline";

interface AppState {
  Subjects: {
    allSubjects: any[];
  };
  Batches: {
    allBatches: any[];
  };
}

function Main({ children }: { children: React.ReactNode }) {
  const subjects = useSelector((state: AppState) => state.Subjects.allSubjects);
  const batches = useSelector((state: AppState) => state.Batches.allBatches);
  const dispatch = useDispatch();
  
  const fetchSubjectsAndBatches = useCallback(async () => {
    try {
      // Fetch subjects if not already fetched
      if (subjects.length === 0) {
        const subjectsResponse = await axios.get("/api/subjects/getsubjects");
        dispatch(setSubject(subjectsResponse.data.allSubjects));
      }
      
      // Fetch batches if not already fetched
      if (batches.length === 0) {
        const batchesResponse = await axios.get("/api/batches/getBatches");
        dispatch(setAllBatches(batchesResponse.data.allBatches));
      }
    } catch (error) {
      console.error(error);
    }
  }, [subjects, batches, dispatch]);

  useEffect(() => {
    fetchSubjectsAndBatches();
  }, [fetchSubjectsAndBatches]);

  const [showNav, setShowNav] = useState(false);
  const showNavFunc = useCallback((e: MouseEvent) => {
    if ((e.target as HTMLElement).id !== "show-nav-icon") {
      setShowNav(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", showNavFunc);
    return () => {
      document.removeEventListener("click", showNavFunc);
    };
  }, [showNavFunc]);

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <main className="flex bg-[#00ADB5] w-screen h-screen overflow-auto">
      {!isOnline ? (
        <div className="absolute left-0 top-0 w-full h-full z-[1000]">
          <Offline />
        </div>
      ) : (
        <>
          <Navbar show={showNav} setShow={setShowNav} />
          <ToastComponent />
          <div
            className="w-full h-full shadow-left-side sm:rounded-l-3xl md:rounded-l-[4rem] sm:ml-2 p-1 md:p-5 bg-gradient-radial relative z-0 overflow-hidden"
          >
            <i
              className="pi pi-align-left bg-[#00ADB5] opacity-50 hover:opacity-100 rounded-full p-2 mb-3 absolute z-50 top-2 left-2 sm:hidden"
              id="show-nav-icon"
              onClick={() => setShowNav(true)}
            ></i>
            {children}
          </div>
        </>
      )}
    </main>
  );
}

export default Main;
