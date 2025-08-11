// /* eslint-disable no-param-reassign */
// import React from 'react'
// import { CKEditor } from '@ckeditor/ckeditor5-react'
// import ClassicEditor from 'custom-build-for-gocsm'
// import './components/style.css'
// import { useAppServices } from 'hook/services'

// export default function Editor({ handleChange, ...props }) {
//   const AppService = useAppServices()
//   function uploadAdapter(loader) {
//     return {
//       upload: async () =>
//         new Promise((resolve, reject) =>
//           // eslint-disable-next-line no-promise-executor-return
//           loader.file.then(async (file) => {
//             // console.log(file, 'file')
//             const form = new FormData()
//             form.append('image', file, file.name)
//             const desiredPath = `design/${'467748'}/logo/marketplace`
//             const { response } = await AppService.utils.upload_image({
//               toaster: false,
//               payload: form,
//               query: `desiredPath=${desiredPath}`,
//             })
//             if (response) resolve({ default: response.data })
//           })
//         ),
//     }
//   }
//   function uploadPlugin(editor) {
//     // console.log(editor, 'editor')
//     // eslint-disable-next-line new-cap
//     editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new uploadAdapter(loader)
//   }
//   return (
//     <div className="App">
//       <CKEditor
//         config={{
//           extraPlugins: [uploadPlugin],
//           mediaEmbed: { previewsInData: true },
//           alignment: {
//             options: ['left', 'right'],
//           },
//           toolbar: [
//             'heading',
//             '|',
//             'bold',
//             'italic',
//             'underline',
//             'link',
//             'subscript',
//             'superscript',
//             '|',
//             'fontSize',
//             'fontFamily',
//             '|',
//             'bulletedList',
//             'numberedList',
//             '|',
//             'indent',
//             'outdent',
//             '|',
//             'imageUpload',
//             'mediaEmbed',
//             '|',
//             'insertTable',
//             'blockQuote',
//             '|',
//             'findAndReplace',
//             'pageBreak',
//             '|',
//             'sourceEditing',
//             '|',
//             'undo',
//             'redo',
//           ],
//           fontSize: {
//             options: [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36],
//             supportAllValues: true,
//           },
//           link: {
//             addTargetToExternalLinks: true,
//           },
//         }}
//         editor={ClassicEditor}
//         onReady={(editor) => {}}
//         onBlur={(event, editor) => {}}
//         onFocus={(event, editor) => {}}
//         onChange={(event, editor) => {
//           handleChange(editor.getData())
//         }}
//         {...props}
//       />
//     </div>
//   )
// }


/* eslint-disable no-param-reassign */
import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from 'custom-build-for-gocsm'
import './components/style.css'
import { useAppServices } from 'hook/services'

export default function Editor({ handleChange,data, ...props }) {
  const AppService = useAppServices()

  function uploadAdapter(loader) {
    return {
      upload: async () =>
        new Promise((resolve, reject) =>
          loader.file.then(async (file) => {
            const form = new FormData()
            form.append('image', file, file.name)
            const desiredPath = `design/${'467748'}/logo/marketplace`
            const { response } = await AppService.utils.upload_image({
              toaster: false,
              payload: form,
              query: `desiredPath=${desiredPath}`,
            })
            if (response) resolve({ default: response.data })
          })
        ),
    }
  }

  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new uploadAdapter(loader)
  }

  return (
    <div className="App">
      <CKEditor
        config={{
          extraPlugins: [uploadPlugin],
          mediaEmbed: { previewsInData: true },
          alignment: {
            options: ['left', 'center', 'right', 'justify'],
          },
          fontSize: {
            options: [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 48, 64],
            supportAllValues: true,
          },
          fontFamily: {
            options: [
              'default',
              'Arial, sans-serif',
              'Courier New, Courier, monospace',
              'Georgia, serif',
              'Lucida Sans Unicode, Lucida Grande, sans-serif',
              'Tahoma, Geneva, sans-serif',
              'Times New Roman, Times, serif',
              'Trebuchet MS, Helvetica, sans-serif',
              'Verdana, Geneva, sans-serif',
            ],
            supportAllValues: true,
          },
          fontColor: {
            colors: [
              { color: '#000000', label: 'Black' },
              { color: '#FF0000', label: 'Red' },
              { color: '#00FF00', label: 'Green' },
              { color: '#0000FF', label: 'Blue' },
              { color: '#FFFF00', label: 'Yellow' },
              { color: '#FFA500', label: 'Orange' },
              { color: '#800080', label: 'Purple' },
              { color: '#808080', label: 'Gray' },
            ],
          },
          fontBackgroundColor: {
            colors: [
              { color: '#FFFF00', label: 'Yellow' },
              { color: '#FFA500', label: 'Orange' },
              { color: '#00FF00', label: 'Green' },
              { color: '#00FFFF', label: 'Cyan' },
              { color: '#FF00FF', label: 'Magenta' },
              { color: '#FF0000', label: 'Red' },
              { color: '#0000FF', label: 'Blue' },
              { color: '#808080', label: 'Gray' },
            ],
          },
          toolbar: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'subscript',
            'superscript',
            '|',
            'fontSize',
            'fontFamily',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'alignment',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            '|',
            'indent',
            'outdent',
            '|',
            'imageUpload',
            'mediaEmbed',
            '|',
            'insertTable',
            'blockQuote',
            '|',
            'findAndReplace',
            'pageBreak',
            '|',
            'horizontalLine',
            'specialCharacters',
            'highlight',
            '|',
            'sourceEditing',
            '|',
            'removeFormat',
          ],
          link: {
            addTargetToExternalLinks: true,
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
        }}
        editor={ClassicEditor}
        onReady={(editor) => {}}
        onBlur={(event, editor) => {}}
        onFocus={(event, editor) => {}}
        data={data}
        onChange={(event, editor) => {
          handleChange(editor.getData())
        }}
        {...props}
      />
    </div>
  )
}
