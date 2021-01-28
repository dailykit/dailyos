import React, { useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import MonacoEditor, { monaco } from '@monaco-editor/react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Loader } from '@dailykit/ui'
import { toast } from 'react-toastify'
import { useTabs, useGlobalContext } from '../../../context'

// Components
import ReferenceFile from './ReferenceFile'
import EditorOptions from './EditorOptions'
import History from './History'
import { WebBuilder } from '../../../../../shared/components'
import { logger } from '../../../../../shared/utils'

// Queries
import { GET_FILE_FETCH, UPDATE_FILE, DRAFT_FILE } from '../../../graphql'

// Styles
import { EditorWrapper } from './styles'
import { pathToArray } from 'graphql/jsutils/Path'

const Editor = () => {
   const { tab, addTab } = useTabs()

   const {
      globalState,
      setDraft,
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
   const [file, setFile] = React.useState({})
   const [isModalVisible, toggleModal] = React.useState(false)
   const [updateFile] = useMutation(UPDATE_FILE)
   const [draftFile] = useMutation(DRAFT_FILE, {
      onCompleted: () => {
         toast.success('File Saved successfully')
      },
      onError: error => {
         toast.error('Something went wrong')
         logger(error)
      },
   })
   const [language, setLanguage] = React.useState('javascript')
   const [theme, setTheme] = React.useState('vs-light')
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
            default:
               setLanguage('javascript')
         }
         setCode(getFile.content)
         setFile(getFile)
      },
      onError: error => {
         toast.error('Something went wrong!')
         logger(error)
      },
      fetchPolicy: 'cache-and-network',
   })
   React.useEffect(() => {
      monaco.init().then(monacoReference => {
         monacoRef.current = monacoReference
      })
   }, [])

   const selectFile = async filePath => {
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
         name: filePath.split('/').pop(),
         path: filePath,
      }
      const op = {
         identifier: id,
         range,
         text: JSON.stringify(text, null, 2),
         forceMoveMarkers: true,
      }
      editorRef.current.executeEdits(code, [op])
   }

   function handleEditorDidMount(_, editor) {
      editor.getAction('editor.action.formatDocument').run()
      editorRef.current = editor
      editorRef.current.addCommand(
         monacoRef.current.KeyMod.Shift && monacoRef.current.KeyCode.KEY_2,
         () => toggleModal(!isModalVisible)
      )
      editorRef.current.addCommand(
         monacoRef.current.KeyMod.CtrlCmd | monacoRef.current.KeyCode.KEY_S,
         function () {
            draft()
         }
      )
   }

   const publish = message => {
      const content = editorRef.current.getValue()
      updateFile({
         variables: {
            path,
            content,
            message,
         },
      })
   }

   const draft = () => {
      const content = editorRef.current.getValue()
      updateLastSaved({
         path,
      })

      draftFile({
         variables: {
            path: `/${path}`,
            content,
         },
      })
   }

   const viewCurrentVersion = () => {
      setCode(tab.draft)
      removeVersion({ path })
      removeDraft({ path })
   }

   const selectVersion = contentVersion => {
      if (tab && tab?.draft === '') {
         setDraft({
            content: editorRef.current.getValue(),
            path,
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

   // disposing monaco editor whenever changing tab or before re-initializing the monaco
   // React.useEffect(() => {
   //    if (editorRef.current) {
   //       return () => {
   //          logger         editorRef.current.dispose()
   //       }
   //    }
   // }, [])
   React.useEffect(() => {
      setIsWebBuilderOpen(false)
      webBuilderRef.current = null
   }, [path])

   if (loading) return <Loader />
   return (
      <>
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
                  tab={tab}
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

export default Editor
