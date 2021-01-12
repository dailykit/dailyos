import React, { useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import MonacoEditor, { monaco } from '@monaco-editor/react'
import { useMutation } from '@apollo/react-hooks'
import { Flex, Form } from '@dailykit/ui'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { useQuery } from '@apollo/react-hooks'
import { useTabs, useGlobalContext } from '../../../context'

// Components
import ReferenceFile from './ReferenceFile'
import EditorOptions from './EditorOptions'
import History from './History'
import { WebBuilder } from '../../../../../shared/components'

// Queries
import { GET_FILE_FETCH, UPDATE_FILE, DRAFT_FILE } from '../../../graphql'

// Styles
import { EditorWrapper } from './styles'

// Helpers
import fetchCall from '../../../utils/fetchCall'
import { Tab } from '@reach/tabs'

const Editor = () => {
   const { tab, tabs, addTab } = useTabs()

   const {
      globalState,
      setDraft,
      setVersion,
      removeVersion,
      updateLastSaved,
      removeDraft,
   } = useGlobalContext()
   const { path } = useParams()
   const history = useHistory()
   const monacoRef = useRef()
   const editorRef = useRef()
   const webBuilderRef = useRef()

   const [code, setCode] = React.useState('')
   const [undoManager, setUndoManager] = React.useState(false)
   const [file, setFile] = React.useState({})
   const [isModalVisible, toggleModal] = React.useState(false)
   const [updateFile] = useMutation(UPDATE_FILE)
   const [draftFile] = useMutation(DRAFT_FILE, {
      onCompleted: () => {
         toast.success('File Saved successfully')
      },
      onError: error => {
         toast.error('Something went wrong')
         console.log(error)
      },
   })
   const [language, setLanguage] = React.useState('javascript')
   const [theme, setTheme] = React.useState('vs-light')
   const [themes] = React.useState([
      { id: 1, title: 'Light', value: 'vs-light' },
      { id: 2, title: 'Dark', value: 'vs-dark' },
   ])
   const [isDark, setIsDark] = React.useState(false)
   const [isWebBuilderOpen, setIsWebBuilderOpen] = React.useState(false)
   const callWebBuilderFunc = action => {
      webBuilderRef.current.func(action)
   }

   const { loading } = useQuery(GET_FILE_FETCH, {
      variables: {
         path: `/${path}`,
      },
      onCompleted: data => {
         const { getFile } = data
         const fileType = getFile.path.split('.').pop()
         switch (fileType) {
            case 'js':
               setLanguage('javascript')
               break
            case 'html':
               setLanguage(fileType)
               break
            case 'css':
               setLanguage(fileType)
               break
            case 'pug':
               setLanguage(fileType)
               break
         }
         setCode(getFile.content)
         setFile(getFile)
      },
      onError: error => {
         toast.error('Something went wrong!')
         console.log(error)
      },
   })
   React.useEffect(() => {
      monaco.init().then(monaco => {
         monacoRef.current = monaco
      })
   }, [])

   // React.useEffect(() => {
   //    const body = JSON.stringify({
   //       query: GET_FILE_FETCH,
   //       variables: {
   //          path: `/${path}`,
   //       },
   //    })
   //    fetchCall(body).then(({ data }) => {
   //       const { getFile } = data
   //       const fileType = getFile.path.split('.').pop()
   //       switch (fileType) {
   //          case 'js':
   //             console.log(fileType)
   //             setLanguage('javascript')
   //             break
   //          case 'html':
   //             setLanguage(fileType)
   //             break
   //          case 'css':
   //             setLanguage(fileType)
   //             break
   //          case 'pug':
   //             setLanguage(fileType)
   //             break
   //       }
   //       setCode(getFile.content)
   //       setFile(getFile)
   //    })
   // }, [path])

   const selectFile = async path => {
      toggleModal(false)
      const position = editorRef.current.getPosition()

      const range = new monacoRef.current.Range(
         position.lineNumber,
         position.column,
         position.lineNumber,
         position.column
      )

      const id = { major: 1, minor: 1 }

      const text = {
         name: path.split('/').pop(),
         path: path,
      }
      const op = {
         identifier: id,
         range: range,
         text: JSON.stringify(text, null, 2),
         forceMoveMarkers: true,
      }
      editorRef.current.executeEdits(code, [op])
   }

   function handleEditorDidMount(_, editor) {
      editorRef.current = editor

      editorRef.current.addCommand(
         monacoRef.current.KeyMod.Shift | monacoRef.current.KeyCode.KEY_2,
         () => toggleModal(!isModalVisible)
      )
   }

   const publish = message => {
      const code = editorRef.current.getValue()
      updateFile({
         variables: {
            path,
            content: code,
            message,
         },
      })
   }

   const draft = () => {
      const code = editorRef.current.getValue()
      updateLastSaved({
         path,
      })
      draftFile({
         variables: {
            path: path,
            content: code,
         },
      })
   }

   const viewCurrentVersion = () => {
      setCode(tab.draft)
      removeVersion({ path })
      removeDraft({ path })
   }

   const selectVersion = contentVersion => {
      if (tabs.find(tab => tab.filePath === path).draft === '') {
         setDraft({
            content: editorRef.current.getValue(),
            path: path,
         })
      }
      setCode(contentVersion)
   }

   const options = {
      fontFamily: 'monospace',
      fontSize: '16px',
      wordWrap: true,
      quickSuggestions: true,
      autoIndent: true,
      contextmenu: true,
      formatOnType: true,
      highlightActiveIndentGuide: true,
      quickSuggestionsDelay: 100,
      renderIndentGuides: true,
      renderLineHighlight: 'all',
      roundedSelection: true,
      scrollBeyondLastColumn: 5,
      scrollBeyondLastLine: false,
      selectOnLineNumbers: true,
      selectionHighlight: true,
      smoothScrolling: true,
   }

   const undo = () => {
      editorRef.current.focus()
      editorRef.current.getModel().undo()
   }

   const redo = () => {
      editorRef.current.focus()
      editorRef.current.getModel().redo()
   }

   // const setDarkTheme = () => {
   //    setIsDark(!isDark)
   // }

   // const langFormatProvider = {
   //    provideDocumentFormattingEdits(model, options, token) {
   //       return [
   //          {
   //             text: YourFormatter(model.getValue()), // put formatted text here
   //             range: model.getFullModelRange(),
   //          },
   //       ]
   //    },
   // }
   // const languageId = language
   // monaco.languages.registerDocumentFormattingEditProvider(
   //    languageId,
   //    langFormatProvider
   // )
   // const templateAreas = ()=>{
   //    let area = ''
   //    if(globalState.isHistoryVisible ){
   //       area = "'head head head head' 'main main main aside'"
   //    }else if(isWebBuilderOpen){
   //       area = ""
   //    }
   // }
   React.useEffect(() => {
      setTheme(isDark ? 'vs-dark' : 'vs-light')
   }, [isDark])

   React.useEffect(() => {
      if (!tab) {
         history.push('/editor')
      }
   }, [addTab, tab])
   return (
      <>
         {/* <div style={{ position: 'absolute', margin: '16px 0' }}>
            <Flex container alignItems="center" justifyContent="space-around">
               <Form.Label htmlFor="theme" title="theme">
                  Dark Theme
               </Form.Label>
               <Form.Toggle
                  name="first_time"
                  onChange={setDarkTheme}
                  value={isDark}
               />
            </Flex>
         </div> */}
         <EditorWrapper isHistoryVisible={globalState.isHistoryVisible}>
            {isModalVisible && (
               <ReferenceFile
                  title="Add File"
                  toggleModal={toggleModal}
                  selectFile={selectFile}
               />
            )}

            <EditorOptions
               publish={publish}
               draft={draft}
               lastSaved={file.lastSaved}
               isBuilderOpen={val => setIsWebBuilderOpen(val)}
               isDarkMode={val => setIsDark(val)}
               language={language}
               undoEditor={undo}
               redoEditor={redo}
               undoWebBuilder={() => callWebBuilderFunc('core:undo')}
               redoWebBuilder={() => callWebBuilderFunc('core:redo')}
               fullscreen={() => callWebBuilderFunc('core:fullscreen')}
               saveTemplate={() => callWebBuilderFunc('save-template')}
               deviceManager={command => callWebBuilderFunc(command)}
            />

            {!isWebBuilderOpen ? (
               <MonacoEditor
                  height="86vh"
                  width="100%"
                  language={language}
                  theme={theme}
                  value={code}
                  options={options}
                  editorDidMount={handleEditorDidMount}
               />
            ) : (
               <WebBuilder
                  content={editorRef.current.getValue()}
                  onChangeContent={updatedCode => setCode(updatedCode)}
                  path={tab?.filePath}
                  linkedCss={tab?.linkedCss}
                  linkedJs={tab?.linkedJs}
                  ref={webBuilderRef}
               />
            )}
            {globalState.isHistoryVisible && Object.keys(file).length > 0 && (
               <History
                  commits={file.commits}
                  path={path}
                  selectVersion={selectVersion}
                  viewCurrentVersion={viewCurrentVersion}
               />
            )}
         </EditorWrapper>
      </>
   )
}

Editor.propTypes = {
   path: PropTypes.string,
}

export default Editor
