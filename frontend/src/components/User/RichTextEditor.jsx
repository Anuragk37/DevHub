import React, { useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../assets/css/Quill/CustomQuill.css';

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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': Size.whitelist }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
      ['blockquote', 'code-block'],
    ],
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={editorRef}
        value={value}
        onChange={(content, delta, source, editor) => {
          onChange(content);
        }}
        modules={modules}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
};

export default RichTextEditor;