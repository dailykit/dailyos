import React from 'react'

// State
import { Context } from '../../state'

// Components
import { FileExplorer } from '../../components'

// Styles
import { SidebarWrapper, SidebarActions, Header } from './styles'

// Assets
import { ExpandIcon, CollapseIcon } from '../../assets/Icons'

const Sidebar = () => {
    const { state, dispatch } = React.useContext(Context)
    return (
        <SidebarWrapper>
            <Header>
                <SidebarActions
                    onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
                >
                    {state.isSidebarVisible ? (
                        <ExpandIcon color="#9a8484" />
                    ) : (
                        <CollapseIcon color="#9a8484" />
                    )}
                </SidebarActions>
            </Header>
            <FileExplorer />
        </SidebarWrapper>
    )
}

export default Sidebar
