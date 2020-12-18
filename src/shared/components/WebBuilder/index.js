import React, { useEffect, useState, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs-preset-webpage'
import grapesjs from 'grapesjs'
import axios from 'axios'
import { InlineLoader } from '../InlineLoader'
import { toast } from 'react-toastify'
import { TEMPLATE, BLOCKS } from './graphql'
import { logger, randomSuffix } from '../../utils'
import { config } from './config'
import { StyledDiv } from './style'
const url = `${process.env.REACT_APP_DAILYOS_SERVER_URI}/api/assets`

export default function Builder({
   path = '',
   content = '',
   onChangeContent,
   linkedCss = [],
   linkedJs = [],
}) {
   const editorRef = useRef()
   const linkedCssArray = linkedCss.map(file => {
      const url = `https://test.dailykit.org/template/files${file.cssFile.path}`
         .split(' ')
         .join('%20')
      return url
   })
   const linkedJsArray = linkedJs.map(file => {
      return `https://test.dailykit.org/template/files${file.jsFile.path}`
         .split(' ')
         .join('%20')
   })
   const [mount, setMount] = useState(false)

   console.log('before initialize', linkedCss)

   // React.useEffect(() => {
   //    setLinkedCssArray(linkedCss)
   //    setLinkedJsArray(linkedJs)
   // }, [CssArray, JsArray])

   //mutation for saving the template
   const updateCode = (updatedCode, path) => {
      axios({
         url: process.env.REACT_APP_DATA_HUB_URI,
         method: 'POST',
         headers: {
            'x-hasura-admin-secret':
               process.env.REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET,
         },
         data: {
            query: `
         mutation updateFile($path: String!, $content: String!, $message: String!) {
            updateFile(path: $path, content: $content, message: $message) {
               ... on Error {
                  success
                  error
               }
               ... on Success {
                  success
                  message
               }
            }
         }
           `,
            variables: {
               path,
               content: updatedCode,
               message: 'update: template',
            },
         },
      })
         .then(data => toast.success('Template updated'))
         .catch(error => {
            toast.error('Failed to Add!')
            logger(error)
         })
   }

   // Initialize the grapejs editor by passing config object
   useEffect(() => {
      console.log('editor initialize1')
      const editor = grapesjs.init(config)
      editorRef.current = editor
      setMount(true)
      return () => {
         console.log('editor initialize2')
         editorRef.current = null
         const code = editor.getHtml() + `<style>+ ${editor.getCss()} +</style>`
         onChangeContent(code)
         editor.destroy()
      }
   }, [])

   //loading all dailykit images in webBuilder image component
   if (mount && editorRef.current.editor) {
      const editor = editorRef.current
      const assetManager = editorRef.current.AssetManager
      axios.get(`${url}?type=images`).then(data => {
         data.data.data.map(image => {
            return assetManager.add(image.url)
         })
      })

      const head = editor.Canvas.getDocument().head
      linkedCssArray.map(url => {
         head.insertAdjacentHTML(
            'beforeend',
            `<link href=${url} rel="stylesheet">`
         )
      })

      //Adding a save button in webBuilder
      if (!editor.Panels.getButton('devices-c', 'save')) {
         editor.Panels.addButton('devices-c', [
            {
               id: 'save',
               className: 'fa fa-floppy-o icon-blank',
               command: function (editor1, sender) {
                  const updatedCode =
                     editor.getHtml() + '<style>' + editor.getCss() + '</style>'
                  updateCode(updatedCode, path)
               },
               attributes: { title: 'Save Template' },
            },
         ])
      }

      // Define commands for style manager
      editor.Commands.add('show-layers', {
         getRowEl(editor) {
            return editor.getContainer().closest('.editor-row')
         },
         getLayersEl(row) {
            return row.querySelector('.layers-container')
         },

         run(editor, sender) {
            const lmEl = this.getLayersEl(this.getRowEl(editor))
            lmEl.style.display = ''
         },
         stop(editor, sender) {
            const lmEl = this.getLayersEl(this.getRowEl(editor))
            lmEl.style.display = 'none'
         },
      })

      //command for styles
      editor.Commands.add('show-styles', {
         getRowEl(editor) {
            return editor.getContainer().closest('.editor-row')
         },
         getStyleEl(row) {
            return row.querySelector('.styles-container')
         },

         run(editor, sender) {
            const smEl = this.getStyleEl(this.getRowEl(editor))
            smEl.style.display = ''
         },
         stop(editor, sender) {
            const smEl = this.getStyleEl(this.getRowEl(editor))
            smEl.style.display = 'none'
         },
      })

      //command for traits
      editor.Commands.add('show-traits', {
         getTraitsEl(editor) {
            const row = editor.getContainer().closest('.editor-row')
            return row.querySelector('.traits-container')
         },
         run(editor, sender) {
            this.getTraitsEl(editor).style.display = ''
         },
         stop(editor, sender) {
            this.getTraitsEl(editor).style.display = 'none'
         },
      })

      //Command for blocks
      editor.Commands.add('show-blocks', {
         getRowEl(editor) {
            return editor.getContainer().closest('.editor-row')
         },
         getBlockEl(row) {
            return row.querySelector('.blocks-container')
         },

         run(editor, sender) {
            const bmEl = this.getBlockEl(this.getRowEl(editor))
            bmEl.style.display = ''
         },
         stop(editor, sender) {
            const bmEl = this.getBlockEl(this.getRowEl(editor))
            bmEl.style.display = 'none'
         },
      })

      //command for device manager
      editor.Commands.add('set-device-desktop', {
         run: function (ed) {
            ed.setDevice('Desktop')
         },
         stop: function () {},
      })
      editor.Commands.add('set-device-tablet', {
         run: function (ed) {
            ed.setDevice('Tablet')
         },
         stop: function () {},
      })
      editor.Commands.add('set-device-mobile', {
         run: function (ed) {
            ed.setDevice('Mobile portrait')
         },
         stop: function () {},
      })

      //call mutation for storing the template
      editor.on('storage:store', function (e) {
         const updatedCode =
            editor.getHtml() + '<style>' + editor.getCss() + '</style>'
         updateCode(updatedCode, path)
      })

      // editor.Canvas.addFrame({
      //    styles: linkedCssArray,
      //    scripts: linkedJsArray,
      // })

      // editor.Canvas.({
      //    styles: linkedCssArray,
      //    scripts: linkedJsArray,
      // })
      // console.log(editor.Canvas.postRender)

      //set the content in the editor
      if (content) {
         editor.setComponents(content)
      }
   }

   return (
      <StyledDiv>
         <div className="editor-row">
            <div className="editor-canvas">
               <div id="gjs">
                  <InlineLoader />
               </div>
            </div>
         </div>
      </StyledDiv>
   )
}
