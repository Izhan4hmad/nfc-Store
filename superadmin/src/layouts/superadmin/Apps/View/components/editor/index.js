/* eslint-disable no-param-reassign */
import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from 'custom-build-for-gocsm'
import './components/style.css'
import { useAppServices } from 'hook/services'

export default function Editor({ handleChange, ...props }) {
  const AppService = useAppServices()
  function uploadAdapter(loader) {
    return {
      upload: async () =>
        new Promise((resolve, reject) =>
          // eslint-disable-next-line no-promise-executor-return
          loader.file.then(async (file) => {
            // console.log(file, 'file')
            const form = new FormData()
            form.append('image', file, file.name)
            const desiredPath = `design/${'467748'}/logo/marketplace`
            const { response } = await AppService.utils.upload_image({
              toaster: true,
              payload: form,
              query: `desiredPath=${desiredPath}`,
            })
            if (response) resolve({ default: response.data })
          })
        ),
    }
  }
  function uploadPlugin(editor) {
    // console.log(editor, 'editor')
    // eslint-disable-next-line new-cap
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => new uploadAdapter(loader)
  }
  return (
    <div className="App">
      <CKEditor
        config={{
          extraPlugins: [uploadPlugin],
          mediaEmbed: { previewsInData: true },
          alignment: {
            options: ['left', 'right'],
          },
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'link',
            'subscript',
            'superscript',
            '|',
            'fontSize',
            'fontFamily',
            '|',
            'bulletedList',
            'numberedList',
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
            'sourceEditing',
            '|',
            'undo',
            'redo',
          ],
          fontSize: {
            options: [8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36],
            supportAllValues: true,
          },
          link: {
            addTargetToExternalLinks: true,
          },
        }}
        editor={ClassicEditor}
        onReady={(editor) => {}}
        onBlur={(event, editor) => {}}
        onFocus={(event, editor) => {}}
        onChange={(event, editor) => {
          handleChange(editor.getData())
        }}
        {...props}
      />
    </div>
  )
}
