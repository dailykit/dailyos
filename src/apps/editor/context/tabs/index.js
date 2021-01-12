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
   contextMenuInfo: {},
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
                     filePath: payload.filePath,
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
         const newState = {
            ...state,
            onToggleInfo: payload,
         }
         return newState
      }

      case 'SET_POPUP_INFO': {
         return {
            ...state,
            popupInfo: payload,
         }
      }
      case 'SET_CONTEXT_MENU_INFO': {
         const newState = {
            ...state,
            popupInfo: {
               ...state.popupInfo,
               ...payload.showPopup,
            },
            contextMenuInfo: payload,
         }
         return newState
      }

      case 'SET_DRAFT': {
         const tabs = state.tabs
         const tabIndex = state.tabs.findIndex(tab => tab.path === payload.path)
         if (tabIndex !== -1) {
            tabs[tabIndex] = {
               ...tabs[tabIndex],
               draft: payload.content,
            }
            const newState = {
               ...state,
               tabs: tabs,
            }
            return newState
         }
      }
      case 'REMOVE_DRAFT': {
         const tabs = state.tabs
         const tabIndex = state.tabs.findIndex(tab => tab.path === payload.path)
         if (tabIndex !== -1) {
            tabs[tabIndex] = {
               ...tabs[tabIndex],
               draft: '',
            }
            const newState = {
               ...state,
               tabs: tabs,
            }
            return newState
         }
      }
      case 'SET_VERSION': {
         const tabs = state.tabs
         const tabIndex = state.tabs.findIndex(tab => tab.path === payload.path)
         if (tabIndex !== -1) {
            tabs[tabIndex] = {
               ...tabs[tabIndex],
               version: payload.version,
            }
            const newState = {
               ...state,
               tabs: tabs,
            }
            return newState
         }
      }
      case 'REMOVE_VERSION': {
         const tabs = state.tabs
         const tabIndex = state.tabs.findIndex(tab => tab.path === payload.path)
         if (tabIndex !== -1) {
            tabs[state.currentTab] = {
               ...tabs[state.currentTab],
               version: null,
            }
            const newState = {
               ...state,
               tabs: tabs,
            }
            return newState
         }
      }
      case 'UPDATE_LAST_SAVED': {
         const tabs = state.tabs
         const tabIndex = state.tabs.findIndex(tab => tab.path === payload.path)
         if (tabIndex !== -1) {
            tabs[tabIndex] = {
               ...tabs[tabIndex],
               lastSaved: Date.now(),
            }
            const newState = {
               ...state,
               tabs: tabs,
            }
            return newState
         }
      }
      case 'UPDATE_LINKED_FILE': {
         if (state.tabs.some(tab => tab.path === payload.path)) {
            const tabId =
               state.tabs.findIndex(tab => tab.path === payload.path) >= 0 &&
               state.tabs.findIndex(tab => tab.path === payload.path)
            const tabs = state.tabs
            tabs[tabId] = {
               ...tabs[tabId],
               linkedCss: payload.linkedCss,
               linkedJs: payload.linkedJs,
            }
            const newState = {
               ...state,
               tabs: tabs,
            }
            return newState
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
   const { state, dispatch } = React.useContext(Context)
   const globalState = state

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
            payload: data,
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

   const setContextMenuInfo = React.useCallback(
      data => {
         dispatch({
            type: 'SET_CONTEXT_MENU_INFO',
            payload: data,
         })
      },
      [dispatch, history]
   )

   const setDraft = React.useCallback(data => {
      dispatch({
         type: 'SET_DRAFT',
         payload: data,
      })
   })
   const removeDraft = React.useCallback(data => {
      dispatch({
         type: 'REMOVE_DRAFT',
         payload: data,
      })
   })
   const setVersion = React.useCallback(data => {
      dispatch({
         type: 'SET_VERSION',
         payload: data,
      })
   })
   const removeVersion = React.useCallback(data => {
      dispatch({
         type: 'REMOVE_VERSION',
         payload: data,
      })
   })
   const updateLastSaved = React.useCallback(data => {
      dispatch({
         type: 'UPDATE_LAST_SAVED',
         payload: data,
      })
   })
   const updateLinkedFile = React.useCallback(data => {
      dispatch({
         type: 'UPDATE_LINKED_FILE',
         payload: data,
      })
   })

   return {
      toggleSideBar,
      toggleSidePanel,
      globalState,
      onToggleInfo,
      setPopupInfo,
      setContextMenuInfo,
      setDraft,
      removeDraft,
      setVersion,
      removeVersion,
      updateLastSaved,
      updateLinkedFile,
   }
}
