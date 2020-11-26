import React from 'react'
import { ThemeProvider } from 'styled-components'

// State
import { Context, initialState, reducers } from './state'

// Sections
import Sidebar from './sections/Sidebar'
import Main from './sections/Main'

// Styles
import { Wrapper } from './styles'

const theme = {
    basePt: 8,
    colors: {
        light: '#efefef',
        grey: {
            light: '#b5b5b5',
        },
    },
    border: {
        color: '#E0C9C9',
    },
}

const App = () => {
    const [state, dispatch] = React.useReducer(reducers, initialState)
    return (
        <ThemeProvider theme={theme}>
            <Context.Provider value={{ state, dispatch }}>
                <Wrapper isSidebarVisible={state.isSidebarVisible}>
                    <Sidebar />
                    <Main />
                </Wrapper>
            </Context.Provider>
        </ThemeProvider>
    )
}

export default App
