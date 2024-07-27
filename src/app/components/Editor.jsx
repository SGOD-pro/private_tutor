"use client"
import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import SelectCom from '../assignment/SelectCom'
import axios from 'axios';
import { showToast } from "@/store/slices/Toast";
import { useDispatch } from 'react-redux';
import { pushAssignment } from "@/store/slices/Assignments"
export default function App() {
  const editorRef = useRef(null);
  const batchId = useRef(null);
  const subDate = useRef(null);
  const [loading, setloading] = useState(false)
  const appDispatch = useDispatch();
  const show = ({ summary, detail, type }) => {
    appDispatch(
      showToast({
        severity: type,
        summary,
        detail,
        visible: true,
      })
    );
  };
  const submitForm = (e) => {
    e.preventDefault();
    if (!editorRef.current || !batchId.current || !subDate.current) {
      show({
        summary: "Validation Error",
        type: "warn",
        detail: "Cannot get proper crediantial details",
      });
      return;
    }
    console.log(editorRef.current.getContent(), batchId.current);
    setloading(true)

    axios
      .post('/api/assignment', { explanation: editorRef.current.getContent(), batch: batchId.current, submissionDate: subDate.current }, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((response) => {
        pushAssignment(response.data.data);
        show({
          summary: "Added successfuly",
          type: "success",
          detail: response.data.message || "Assignment added",
        });
      }).catch((error) => {
        show({
          summary: "Error",
          type: "error",
          detail: error.response.data.message || "Internal server error",
        });
      }).finally(() => {
        setloading(false)
      });
  }
  return (
    <>
      <form action="" className='w-full h-[97%] flex flex-col my-2 ' onSubmit={submitForm}>
        <Editor
          apiKey={process.env.NEXT_PUBLIC_EDITOR_KEY}
          onInit={(evt, editor) => editorRef.current = editor}
          // initialValue="<p>This is the initial content of the editor.</p>"

          init={{
            height: "90%",
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'print', 'preview', 'anchor',
              'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'paste', 'help', 'wordcount '
            ],
            toolbar: "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent removeformat | help",
            content_style: `
            body, html, .mce-content-body {
              font-family: Helvetica, Arial, sans-serif;
              font-size: 14px;
              border-radius: 8rem;
              background-color: black;
              color: white;
              outline: none;
            }
          `,
            placeholder: "Write here...",
            skin: 'oxide-dark',
            content_css: 'dark',
          }}
        />
        <div className="flex gap-1 sm:gap-3 justify-end items-end mt-2  mr-3">
          <div className="sm:w-1/2 sm:min-w-96 overflow-auto custom-scrollbar">
            <SelectCom batchId={batchId} subDate={subDate} />
          </div>
          <button className='font-semibold border border-emerald-500 text-emerald-500 hover:bg-slate-200/10 rounded shadow shadow-black mb-1 sm:mb-0'>
            {!loading ?
              <i className="pi pi-cloud-upload p-3"></i> :
              <i className="pi pi-spin pi-spinner p-3"></i>
            }
          </button>
        </div>
      </form>
    </>
  );
}