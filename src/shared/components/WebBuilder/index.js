import React, { useEffect, useState, useRef } from 'react'
import { useQuery } from '@apollo/react-hooks'
import 'grapesjs/dist/css/grapes.min.css'
import 'grapesjs-preset-webpage'
import grapesjs from 'grapesjs'
import axios from 'axios'
import { InlineLoader } from '../InlineLoader'
import { toast } from 'react-toastify'
import { logger, randomSuffix } from '../../utils'
import { config } from './config'
import { StyledDiv } from './style'
const url = `${process.env.REACT_APP_DAILYOS_SERVER_URI}/api/assets`

const Builder = React.forwardRef(
   (
      {
         path = '',
         content = '',
         onChangeContent,
         linkedCss = [],
         linkedJs = [],
         tab = {},
      },
      ref
   ) => {
      const editorRef = useRef()
      const linkedCssArray = linkedCss.map(file => {
         let url = `https://test.dailykit.org/template/files${file.cssFile.path}`
         if (/\s/.test(url)) {
            url = url.split(' ').join('%20')
         }
         return url
      })
      const linkedJsArray = linkedJs.map(file => {
         let url = `https://test.dailykit.org/template/files${file.jsFile.path}`
         if (/\s/.test(url)) {
            url = url.split(' ').join('%20')
         }
         return url
      })
      const [mount, setMount] = useState(false)
      const toggler = useRef(true)

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
         console.log('mouting')
         const editor = grapesjs.init({
            ...config,
            canvas: {
               styles: linkedCssArray,
               scripts: linkedJsArray,
            },
         })
         editorRef.current = editor
         setMount(true)
         console.log('after mouting')
         return () => {
            console.log('before unmounting')
            console.log('editor', editorRef.current)
            const code =
               editorRef.current.getHtml() +
               `<style>+ ${editorRef.current.getCss()} +</style>`
            onChangeContent(code)
            editorRef.current.destroy()
            console.log('after unmounting')
         }
      }, [])

      // useEffect(() => {
      //    if (editorRef.current) {
      //       return () => {
      //          console.log('before unmounting')
      //          console.log('editor', editorRef.current)
      //          const code =
      //             editorRef.current.getHtml() +
      //             `<style>+ ${editorRef.current.getCss()} +</style>`
      //          onChangeContent(code)
      //          editorRef.current.destroy()
      //          console.log('after unmounting')
      //       }
      //    }
      // }, [])

      React.useImperativeHandle(ref, () => ({
         func(action) {
            console.log(editorRef.current.Panels.getPanels())
            editorRef.current.Commands.add('set-device-desktop', {
               run: function (ed) {
                  ed.setDevice('Desktop')
               },
               stop: function () {},
            })
            editorRef.current.Commands.add('set-device-tablet', {
               run: function (ed) {
                  ed.setDevice('Tablet')
               },
               stop: function () {},
            })
            editorRef.current.Commands.add('set-device-mobile', {
               run: function (ed) {
                  ed.setDevice('Mobile portrait')
               },
               stop: function () {},
            })
            editorRef.current.Commands.add('save-template', {
               run(editor) {
                  const updatedCode =
                     editor.getHtml() + '<style>' + editor.getCss() + '</style>'
                  updateCode(updatedCode, path)
               },
            })
            //stop command
            if (action === 'core:fullscreen' || action.includes('set-device')) {
               editorRef.current.stopCommand(action)
            }
            //run command
            editorRef.current.runCommand(action)
         },
      }))

      //loading all dailykit images in webBuilder image component

      if (mount && editorRef?.current) {
         const editor = editorRef.current
         const assetManager = editorRef.current.AssetManager
         axios.get(`${url}?type=images`).then(data => {
            data.data.data.map(image => {
               return assetManager.add(image.url)
            })
         })

         // editor.Canvas.getDocument().head.insertAdjacentHTML(
         //    'beforeend',
         //    '<link href="https://test.dailykit.org/template/files/Riofit%20Meals/css/style.css" rel="stylesheet" />'
         // )
         // linkedCssArray.map(url => {

         // })

         //Adding a save button in webBuilder
         // if (!editor.Panels.getButton('devices-c', 'save')) {
         //    editor.Panels.addButton('devices-c', [
         //       {
         //          id: 'save',
         //          className: 'fa fa-floppy-o icon-blank',
         //          command: function (editor1, sender) {
         //             const updatedCode =
         //                editor.getHtml() +
         //                '<style>' +
         //                editor.getCss() +
         //                '</style>'
         //             updateCode(updatedCode, path)
         //          },
         //          attributes: { title: 'Save Template' },
         //       },
         //    ])
         // }

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

         //call mutation for storing the template
         editor.on('storage:store', function (e) {
            const updatedCode =
               editor.getHtml() + '<style>' + editor.getCss() + '</style>'
            updateCode(updatedCode, path)
         })

         // editor.getModel().set('dmode', 'absolute')

         // editor.Canvas.({
         //    styles: linkedCssArray,
         //    scripts: linkedJsArray,
         // })
         // console.log(editor.Canvas.postRender)

         //set the content in the editor
         if (content) {
            editor.setComponents(content)
         }
         // editor.Panels.removePanel('views')
         if (!editor.Panels.getButton('views', 'sidePanelToggler')) {
            editor.Panels.addButton('views', {
               id: 'sidePanelToggler',
               className: 'fa fa-chevron-right',
               command: function (editor) {
                  console.log(editor.Panels.getPanel('views'))
                  console.log(editor.Panels.getButton('views', 'open-sm'))
                  toggler.current = !toggler.current
                  editor.Panels.getButton('views', 'sidePanelToggler').set(
                     'className',
                     toggler.current
                        ? 'fa fa-chevron-right icon-blank'
                        : 'fa fa-chevron-left icon-blank'
                  )
                  if (editor.Panels.getPanel('views-container')) {
                     editor.Panels.getPanel('views-container').set(
                        'visible',
                        toggler.current
                     )
                     editor.Panels.getButton('views', 'open-sm').set(
                        'attributes',
                        {
                           style: `display:${
                              toggler.current ? 'block' : 'none'
                           }`,
                        }
                     )
                     editor.Panels.getButton('views', 'open-tm').set(
                        'attributes',
                        {
                           style: `display:${
                              toggler.current ? 'block' : 'none'
                           }`,
                        }
                     )
                     editor.Panels.getButton('views', 'open-layers').set(
                        'attributes',
                        {
                           style: `display:${
                              toggler.current ? 'block' : 'none'
                           }`,
                        }
                     )
                     editor.Panels.getButton('views', 'open-blocks').set(
                        'attributes',
                        {
                           style: `display:${
                              toggler.current ? 'block' : 'none'
                           }`,
                        }
                     )
                     editor.Panels.getButton('views', 'open-blocks').set(
                        'active',
                        true
                     )
                  }
               },

               active: false,
            })
         }

         // editor.Panels.getPanel('views').set('visible', false)
         editor.Panels.removePanel('commands')
         editor.Panels.removePanel('devices-c')
         editor.Panels.removePanel('options')
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
)

export default Builder
