import React from 'react'
import { TabPanels } from '@reach/tabs'

// State
import { Context } from '../../state'

// Components
import { Editor } from '../../components'

// Styles
import {
    MainWrapper,
    TabsNav,
    TabOptions,
    StyledTabs,
    StyledTabList,
    StyledTab,
    StyledTabPanel,
} from './styles'

// Assets
import {
    CloseIcon,
    CaretLeftIcon,
    CaretRightIcon,
    CaretDownIcon,
    CaretUpIcon,
} from '../../assets/Icons'

const Main = () => {
    const { state, dispatch } = React.useContext(Context)

    if (state.tabs.length === 0) {
        return (
            <MainWrapper id="main">
                Select a file from the explorer.
            </MainWrapper>
        )
    }
    return (
        <MainWrapper isSidebarVisible={state.isSidebarVisible}>
            <StyledTabs
                index={state.currentTab}
                onChange={index =>
                    dispatch({ type: 'SET_TAB_INDEX', payload: index })
                }
            >
                <StyledTabList>
                    {state.tabs.map((tab, index) => (
                        <StyledTab key={index}>
                            <span title={tab.name}>{`${
                                tab.name.length > 12
                                    ? `${tab.name.slice(0, 10)}...`
                                    : tab.name
                            }`}</span>
                            <span
                                onClick={e => {
                                    e.stopPropagation()
                                    dispatch({
                                        type: 'REMOVE_TAB',
                                        payload: index,
                                    })
                                }}
                            >
                                {CloseIcon}
                            </span>
                        </StyledTab>
                    ))}
                </StyledTabList>

                <TabPanels>
                    {state.tabs.map((tab, index) => (
                        <StyledTabPanel key={index}>
                            <Editor {...tab} />
                        </StyledTabPanel>
                    ))}
                </TabPanels>
            </StyledTabs>
            <TabsNav>
                <span onClick={() => dispatch({ type: 'LEFT_TAB' })}>
                    {CaretLeftIcon}
                </span>
                <span onClick={() => dispatch({ type: 'RIGHT_TAB' })}>
                    {CaretRightIcon}
                </span>
                <span
                    onClick={() =>
                        dispatch({
                            type: 'TOGGLE_TAB_DROPDOWN',
                            payload: !state.isTabDropDownVisible,
                        })
                    }
                >
                    {state.isTabDropDownVisible ? CaretUpIcon : CaretDownIcon}
                </span>
                {state.isTabDropDownVisible && (
                    <TabOptions>
                        <ul>
                            <li
                                onClick={() =>
                                    dispatch({ type: 'CLOSE_ALL_TABS' })
                                }
                            >
                                Close All Tabs
                            </li>
                        </ul>
                    </TabOptions>
                )}
            </TabsNav>
        </MainWrapper>
    )
}

export default Main
