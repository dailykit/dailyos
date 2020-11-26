import React, { useRef } from 'react'
import MonacoEditor, { monaco } from '@monaco-editor/react'
import { useMutation } from '@apollo/react-hooks'
import PropTypes from 'prop-types'

// State
import { Context } from '../../state'

// Components
import ReferenceFile from './ReferenceFile'
import EditorOptions from './EditorOptions'
import History from './History'

// Queries
import { GET_FILE_FETCH, UPDATE_FILE, DRAFT_FILE } from '../../queries'

// Styles
import { EditorWrapper } from './styles'

// Helpers
import fetchCall from '../../utils/fetchCall'

const Editor = ({ path }) => {
    const monacoRef = useRef()
    const editorRef = useRef()

    const { state, dispatch } = React.useContext(Context)

    const [code, setCode] = React.useState('')
    const [file, setFile] = React.useState({})
    const [isModalVisible, toggleModal] = React.useState(false)
    const [updateFile] = useMutation(UPDATE_FILE)
    const [draftFile] = useMutation(DRAFT_FILE)

    React.useEffect(() => {
        monaco.init().then(monaco => {
            monacoRef.current = monaco
        })
    }, [])

    React.useEffect(() => {
        const body = JSON.stringify({
            query: GET_FILE_FETCH,
            variables: {
                path: path,
            },
        })
        fetchCall(body).then(({ data }) => {
            const { getFile } = data
            console.log(getFile)
            setCode(getFile.content)
            setFile(getFile)
        })
    }, [path])

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
        dispatch({ type: 'UPDATE_LAST_SAVED' })
        draftFile({
            variables: {
                path: path,
                content: code,
            },
        })
    }

    const viewCurrentVersion = () => {
        setCode(state.tabs[state.currentTab].draft)
        dispatch({ type: 'REMOVE_VERSION', payload: path })
        dispatch({ type: 'REMOVE_DRAFT', payload: path })
    }

    const selectVersion = contentVersion => {
        if (state.tabs.find(tab => tab.path === path).draft === '') {
            dispatch({
                type: 'SET_DRAFT',
                payload: {
                    content: editorRef.current.getValue(),
                    path: path,
                },
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
        contextmenu: false,
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

    return (
        <EditorWrapper isHistoryVisible={state.isHistoryVisible}>
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
            />
            <MonacoEditor
                height="100vh"
                width="calc(100% - 1px)"
                language="javascript"
                theme="light"
                value={code}
                options={options}
                editorDidMount={handleEditorDidMount}
            />
            {state.isHistoryVisible && Object.keys(file).length > 0 && (
                <History
                    commits={file.commits}
                    path={path}
                    selectVersion={selectVersion}
                    viewCurrentVersion={viewCurrentVersion}
                />
            )}
        </EditorWrapper>
    )
}

Editor.propTypes = {
    path: PropTypes.string,
}

export default Editor
