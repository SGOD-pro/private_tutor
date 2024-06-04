"use client";

import { notFound } from "next/navigation";
import React from "react";
import ShowExam from "../pages/ShowExam";  
import AllStudents from "../pages/AllStudents";  
import ShowAssignments from "../pages/ShowAssignments";  
import AllAttendence from "../pages/AllAttendence";  

const pages = {
  "show-exam": <ShowExam />,
  "all-students": <AllStudents />,
  "show-assignments": <ShowAssignments />,
  'attendence':<AllAttendence/>,
};

function Page({ params }) {
  const { slug } = params;
  const content = pages[slug];

  if (content) {
    return content;
  } else {
    notFound();
  }
}

export default Page;
