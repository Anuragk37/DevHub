import React, { useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../assets/css/Quill/CustomQuill.css';

// Register custom size formats with Quill
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
Quill.register(Size, true);

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const quill = editorRef.current.getEditor();
      if (quill) {
        quill.on('text-change', () => {
          onChange(editorRef.current.getEditor().root.innerHTML);
        });
      }
    }
  }, [onChange]);

  return (
    <ReactQuill
      ref={editorRef}
      value={value}
      onChange={(content, delta, source, editor) => {
        onChange(content);
      }}
      modules={{
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'size': Size.whitelist }], // Use the custom size array
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'align': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          ['clean'],
        ],
      }}
      className="bg-white rounded-lg shadow"
    />
  );
};

export default RichTextEditor;
