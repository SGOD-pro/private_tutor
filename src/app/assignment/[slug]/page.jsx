"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

function SlugAssignment({ params }) {
  const { slug } = params;
  const [value, setValue] = useState(`<h1 className=" text-3xl capitalize font-semibold mx-auto"> not found</h1>`);

  useEffect(() => {
    axios.get(`/api/assignment/show-assignment?id=${slug}`)
      .then(response => {
        setValue(response.data.data);
      })
      .catch(error => {
        console.log(error);
        setValue(` <h1 className=" text-3xl capitalize font-semibold mx-auto"> not found</h1>`)
      });
  }, [slug]);

  return (
    <>
      {/* Use DOMPurify directly */}
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(value) }} />
    </>
  );
}

export default SlugAssignment;
