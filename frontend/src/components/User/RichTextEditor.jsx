import React, { useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // If ReactQuill uses findDOMNode internally, you might need to access its editor reference this way
    if (editorRef.current) {
      // Accessing Quill instance using editorRef.current.getEditor()
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
        // onChange method provided by parent component
        onChange(content);
      }}
      modules={{
        toolbar: [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          [{ 'align': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          ['clean']
        ]
      }}
      className="bg-white rounded-lg shadow"
    />
  );
};

export default RichTextEditor;
