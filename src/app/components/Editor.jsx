"use client"
import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import SelectCom from '../assignment/SelectCom'
export default function App() {
  const editorRef = useRef(null);
  const batchId = useRef(null);

  const submitForm = (e) => {
    e.preventDefault();
    if (!editorRef.current || !batchId.current) {
      return;
    }
    console.log(editorRef.current.getContent(), batchId.current);
  }
  return (
    <>
      <form action="" className='w-full h-full flex flex-col my-2' onSubmit={submitForm}>
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
        <div className="flex gap-3 justify-end items-stretch mt-2">
          <SelectCom batchId={batchId} />
          <button className='font-semibold border border-emerald-500 text-emerald-500 hover:bg-slate-200/10 rounded-xl shadow shadow-black'>
            <i className="pi pi-cloud-upload px-3 py-1"></i>
          </button>	</div>
      </form>
    </>
  );
}