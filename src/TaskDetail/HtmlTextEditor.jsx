import React from 'react';

export const HtmlTextEditor = () => {
  const quillToolbarOptions = [
    // more info here: https://quilljs.com/docs/modules/toolbar/
    ['bold', 'italic', 'underline', 'strike'], // toggle buttons
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
  ];

  quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: quillToolbarOptions,
    },
  });

  return (
    <div id='editor'>
      {/* Create the editor container */}
      <p>Hello World!</p>
      <p>
        Some initial <strong>bold</strong> text
      </p>
      <p>
        <br />
      </p>

      {/* Include the Quill library */}
      <script src='https://cdn.quilljs.com/1.3.6/quill.js'></script>

      {/* Initialize Quill editor */}
      {quill}
    </div>
  );
};
