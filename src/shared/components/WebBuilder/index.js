import React, { useEffect, useState } from 'react'
import 'grapesjs/dist/css/grapes.min.css'
import grapesjs from 'grapesjs'
import axios from 'axios'
import styled from 'styled-components'
const url = `${process.env.REACT_APP_DAILYOS_SERVER_URI}/api/assets`

export default function Builder() {
   useEffect(() => {
      const editor = grapesjs.init({
         // Indicate where to init the editor. You can also pass an HTMLElement
         container: '#gjs',
         // Get the content for the canvas directly from the element
         // As an alternative we could use: `components: '<h1>Hello World Component!</h1>'`,
         fromElement: true,
         // Size of the editor
         height: '300px',
         width: 'auto',
         plugins: ['grapesjstabs'],
         pluginsOpts: {
            grapesjstabs: {
               tabsBlock: {
                  category: 'Extra',
               },
            },
         },

         // Disable the storage manager for the moment
         storageManager: {
            id: 'gjs-', // Prefix identifier that will be used inside storing and loading
            type: 'local', // Type of the storage
            autosave: true, // Store data automatically
            autoload: false, // Autoload stored data on init
            stepsBeforeSave: 1, // If autosave enabled, indicates how many changes are necessary before store method is triggered
            storeComponents: true, // Enable/Disable storing of components in JSON format
            storeStyles: true, // Enable/Disable storing of rules in JSON format
            storeHtml: true, // Enable/Disable storing of components as HTML string
            storeCss: true, // Enable/Disable storing of rules as CSS string
         },
         deviceManager: {
            devices: [
               {
                  name: 'Desktop',
                  width: '', // default size
               },
               {
                  name: 'Mobile',
                  width: '320px', // this value will be used on canvas width
                  widthMedia: '480px', // this value will be used in CSS @media
               },
            ],
         },
         blockManager: {
            appendTo: '.blocks-container',
            blocks: [
               {
                  id: 'section', // id is mandatory
                  label: '<b>Section</b>', // You can use HTML/SVG inside labels
                  attributes: { class: 'gjs-block-section' },
                  content: `<section>
                  <h1>This is a simple title</h1>
                  <div>This is just a Lorem text: Lorem ipsum dolor sit amet</div>
                </section>`,
               },
               {
                  id: 'text',
                  label: 'Text',
                  content:
                     '<div data-gjs-type="text">Insert your text here</div>',
               },
               {
                  id: 'image',
                  label: 'Image',
                  // Select the component once it's dropped
                  select: true,
                  // You can pass components as a JSON instead of a simple HTML string,
                  // in this case we also use a defined component type `image`
                  content: { type: 'image' },
                  // This triggers `active` event on dropped components and the `image`
                  // reacts by opening the AssetManager
                  activate: true,
               },
            ],
         },
         content: {
            tagName: 'div',
            draggable: false,
            attributes: { 'some-attribute': 'some-value' },
            components: [
               {
                  tagName: 'span',
                  content: '<b>Some static content</b>',
               },
               {
                  tagName: 'div',
                  // use `content` for static strings, `components` string will be parsed
                  // and transformed in Components
                  components: '<span>HTML at some point</span>',
               },
            ],
         },

         layerManager: {
            appendTo: '.layers-container',
         },
         // We define a default panel as a sidebar to contain layers
         panels: {
            defaults: [
               {
                  id: 'layers',
                  el: '.panel__left',
               },
               {
                  id: 'panel-switcher',
                  el: '.panel__switcher',

                  buttons: [
                     {
                        id: 'show-layers',
                        active: true,
                        label: 'Layers',
                        command: 'show-layers',
                        // Once activated disable the possibility to turn it off
                        togglable: false,
                     },
                     {
                        id: 'show-style',
                        active: true,
                        label: 'Styles',
                        command: 'show-styles',
                        togglable: false,
                     },
                     {
                        id: 'show-traits',
                        active: true,
                        label: 'Traits',
                        command: 'show-traits',
                        togglable: false,
                     },
                     {
                        id: 'show-blocks',
                        active: true,
                        label: 'Blocks',
                        command: 'show-blocks',
                        togglable: false,
                     },
                  ],
               },
               {
                  id: 'panel-devices',
                  el: '.panel__devices',
                  buttons: [
                     {
                        id: 'device-desktop',
                        label: 'D',
                        command: 'set-device-desktop',
                        active: true,
                        togglable: false,
                     },
                     {
                        id: 'device-mobile',
                        label: 'M',
                        command: 'set-device-mobile',
                        togglable: false,
                     },
                  ],
               },
            ],
         },
         selectorManager: {
            appendTo: '.styles-container',
         },
         styleManager: {
            appendTo: '.styles-container',
            sectors: [
               {
                  name: 'Dimension',
                  open: false,
                  // Use built-in properties
                  buildProps: ['width', 'min-height', 'padding'],
                  // Use `properties` to define/override single property
                  properties: [
                     {
                        // Type of the input,
                        // options: integer | radio | select | color | slider | file | composite | stack
                        type: 'integer',
                        name: 'The width', // Label for the property
                        property: 'width', // CSS property (if buildProps contains it will be extended)
                        units: ['px', '%'], // Units, available only for 'integer' types
                        defaults: 'auto', // Default value
                        min: 0, // Min value, available only for 'integer' types
                     },
                  ],
               },
               {
                  name: 'Extra',
                  open: false,
                  buildProps: ['background-color', 'box-shadow', 'custom-prop'],
                  properties: [
                     {
                        id: 'custom-prop',
                        name: 'Custom Label',
                        property: 'font-size',
                        type: 'select',
                        defaults: '32px',
                        // List of options, available only for 'select' and 'radio'  types
                        options: [
                           { value: '12px', name: 'Tiny' },
                           { value: '18px', name: 'Medium' },
                           { value: '32px', name: 'Big' },
                        ],
                     },
                  ],
               },
            ],
         },
         traitManager: {
            appendTo: '.traits-container',
         },
      })

      const assetManager = editor.AssetManager
      axios.get(`${url}?type=images`).then(data => {
         console.log(data)
         data.data.data.map(image => {
            return assetManager.add(image.url)
         })
      })

      editor.Panels.addPanel({
         id: 'panel-top',
         el: '.panel__top',
      })
      editor.Panels.addPanel({
         id: 'basic-actions',
         el: '.panel__basic-actions',
         buttons: [
            {
               id: 'visibility',
               active: true, // active by default
               className: 'btn-toggle-borders',
               label: '<u>B</u>',
               command: 'sw-visibility', // Built-in command
            },
            {
               id: 'export',
               className: 'btn-open-export',
               label: 'Exp',
               command: 'export-template',
               context: 'export-template', // For grouping context of buttons from the same panel
            },
            {
               id: 'show-json',
               className: 'btn-show-json',
               label: 'JSON',
               context: 'show-json',
               command(editor) {
                  editor.Modal.setTitle('Components JSON')
                     .setContent(
                        `<textarea style="width:100%; height: 250px;">
                   ${JSON.stringify(editor.getComponents())}
                 </textarea>`
                     )
                     .open()
               },
            },
         ],
      })

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

      //command for responsive templates

      editor.Commands.add('set-device-desktop', {
         run: editor => editor.setDevice('Desktop'),
      })
      editor.Commands.add('set-device-mobile', {
         run: editor => editor.setDevice('Mobile'),
      })

      editor.on('storage:load', function (e) {
         console.log('Loaded ', e)
      })
      editor.on('storage:store', function (e) {
         console.log(
            'Run',
            editor.getHtml() + '<style>' + editor.getCss() + '</style>'
         )
      })

      editor.BlockManager.add('div', {
         label: 'Test',
         content: `<div class="test-div">Hello</div>
         <style>
         .test-div{
         color: blue;
         font-size: 48px;
         }
         </style>
         `,
      })
   })

   return (
      <StyledDiv>
         <div className="panel__top">
            <div className="panel__basic-actions"></div>
            <div className="panel__devices"></div>
            <div className="panel__switcher"></div>
         </div>
         <div className="editor-row">
            <div className="editor-canvas">
               <div id="gjs">
                  <h1>Hello World Component</h1>
               </div>
            </div>
            <div className="panel__left">
               <div className="layers-container"></div>
               <div className="styles-container"></div>
               <div className="traits-container"></div>
               <div className="blocks-container"></div>
            </div>
         </div>
      </StyledDiv>
   )
}

export const StyledDiv = styled.div`
   border: 2px solid #444;
   #gjs {
      border: none;
   }

   /* Reset some default styling */
   .gjs-cv-canvas {
      top: 0;
      width: 100%;
      height: 100%;
   }
   .gjs-block {
      width: auto;
      height: auto;
      min-height: auto;
   }

   .gjs-block {
      width: auto;
      height: auto;
      min-height: auto;
   }
   .panel__top {
      padding: 0;
      width: 100%;
      display: flex;
      position: initial;
      justify-content: center;
      justify-content: space-between;
   }
   .panel__basic-actions {
      position: initial;
   }

   .editor-row {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      height: 300px;
   }

   .editor-canvas {
      flex-grow: 1;
   }

   .panel__left {
      flex-basis: 230px;
      position: relative;
      overflow-y: auto;
   }

   .panel__switcher {
      position: initial;
   }

   .panel__devices {
      position: initial;
   }

   .gjs-one-bg {
      background-color: white;
   }

   /* Secondary color for the text color */
   .gjs-two-color {
      color: black;
   }

   /* Tertiary color for the background */
   .gjs-three-bg {
      background: white;
      color: black;
   }

   /* Quaternary color for the text color */
   .gjs-four-color,
   .gjs-four-color-h:hover {
      color: black;
   }
`
