import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const Context = React.createContext()

const initialState = {
   tabs: [],
   isHistoryVisible: false,
   isTabDropDownVisible: false,
   isSidebarVisible: false,
   isSidePanelVisible: false,
   onToggleInfo: {},
   popupInfo: {
      createTypePopup: false,
      fileTypePopup: false,
      formTypePopup: false,
   },
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'SET_TITLE': {
         const { tabs } = state
         const index = tabs.findIndex(tab => tab.path === payload.path)
         tabs[index] = {
            ...tabs[index],
            title: payload.title,
         }
         return {
            ...state,
            tabs,
         }
      }
      case 'ADD_TAB': {
         const tabIndex = state.tabs.findIndex(tab => tab.path === payload.path)
         if (tabIndex === -1) {
            return {
               ...state,
               tabs: [
                  {
                     title: payload.name,
                     name: payload.name,
                     path: payload.path,
                     filePath: payload.path,
                     draft: '',
                     version: null,
                     lastSaved: '',
                     id: payload.id,
                     linkedCss: payload.linkedCss,
                     linkedJs: payload.linkedJs,
                  },
                  ...state.tabs,
               ],
            }
         }
         return state
      }
      case 'TOGGLE_SIDEBAR': {
         return {
            ...state,
            isSidebarVisible: !state.isSidebarVisible,
         }
      }
      case 'TOGGLE_SIDEPANEL': {
         return {
            ...state,
            isSidePanelVisible: !state.isSidePanelVisible,
         }
      }
      case 'ADD_ON_TOGGLE_INFO': {
         if (Object.entries(payload).length) {
            const newState = {
               ...state,
               onToggleInfo: {
                  name: payload.name,
                  path: payload.path,
                  type: payload.type,
               },
            }
            return newState
         } else {
            const newState = {
               ...state,
               onToggleInfo: {},
            }
            return newState
         }
      }

      case 'SET_POPUP_INFO': {
         return {
            ...state,
            popupInfo: payload,
         }
      }

      // Store Tab Data
      case 'STORE_TAB_DATA': {
         const tabs = state.tabs
         const tabIndex = tabs.findIndex(tab => tab.path === payload.path)
         if (tabIndex !== -1) {
            tabs[tabIndex].data = {
               ...tabs[tabIndex].data,
               ...payload.data,
            }
            return {
               ...state,
               tabs,
            }
         }
         return state
      }
      // Delete Tab
      case 'DELETE_TAB': {
         return {
            ...state,
            tabs: state.tabs.filter((_, index) => index !== payload.index),
         }
      }
      case 'CLOSE_ALL_TABS':
         return {
            ...state,
            tabs: [],
         }
      default:
         return state
   }
}

export const TabProvider = ({ children }) => {
   const [state, dispatch] = React.useReducer(reducers, initialState)

   return (
      <Context.Provider value={{ state, dispatch }}>
         {children}
      </Context.Provider>
   )
}

export const useTabs = () => {
   const history = useHistory()
   const location = useLocation()

   const {
      state: { tabs },
      dispatch,
   } = React.useContext(Context)

   const tab = tabs.find(tab => tab.path === location.pathname)

   const setTitle = React.useCallback(
      title => {
         dispatch({
            type: 'SET_TITLE',
            payload: {
               title,
               path: tab.path,
            },
         })
      },
      [dispatch, tab]
   )

   const addTab = React.useCallback(
      data => {
         dispatch({
            type: 'ADD_TAB',
            payload: data,
         })
         history.push(data.path)
      },
      [dispatch, history]
   )

   const switchTab = React.useCallback(path => history.push(path), [history])

   const removeTab = React.useCallback(
      ({ tab, index }) => {
         dispatch({ type: 'DELETE_TAB', payload: { tab, index } })

         const tabsCount = tabs.length
         // closing last remaining tab
         if (index === 0 && tabsCount === 1) {
            history.push('/editor')
         }
         // closing first tab when there's more than one tab
         else if (index === 0 && tabsCount > 1) {
            history.push(tabs[index + 1].path)
         }
         // closing any tab when there's more than one tab
         else if (index > 0 && tabsCount > 1) {
            history.push(tabs[index - 1].path)
         }
      },
      [tabs, dispatch, history]
   )

   const closeAllTabs = React.useCallback(() => {
      dispatch({ type: 'CLOSE_ALL_TABS' })
      switchTab('/editor')
   }, [switchTab, dispatch])

   const doesTabExists = path => tabs.find(tab => tab.path === path) || false

   return {
      tab,
      tabs,
      addTab,
      setTitle,
      switchTab,
      removeTab,
      closeAllTabs,
      doesTabExists,
      dispatch,
   }
}

export const useGlobalContext = () => {
   const history = useHistory()
   const location = useLocation()
   const globalState = initialState
   const {
      state: { tabs },
      dispatch,
   } = React.useContext(Context)

   const toggleSideBar = React.useCallback(() => {
      dispatch({ type: 'TOGGLE_SIDEBAR' })
   }, [dispatch, history])

   const toggleSidePanel = React.useCallback(() => {
      dispatch({ type: 'TOGGLE_SIDEPANEL' })
   }, [dispatch, history])

   const onToggleInfo = React.useCallback(
      data => {
         dispatch({
            type: 'ADD_ON_TOGGLE_INFO',
            payload: {
               ...initialState.popupInfo,
               ...data,
            },
         })
      },
      [dispatch, history]
   )

   const setPopupInfo = React.useCallback(
      data => {
         dispatch({
            type: 'SET_POPUP_INFO',
            payload: data,
         })
      },
      [dispatch, history]
   )

   return {
      toggleSideBar,
      toggleSidePanel,
      globalState,
      onToggleInfo,
      setPopupInfo,
   }
}
