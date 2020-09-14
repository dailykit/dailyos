import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const Context = React.createContext()

const initialState = {
   tabs: [],
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
         const tabExists = state.tabs.find(tab => tab.path === payload.path)
         if (tabExists) {
            return state
         }
         return {
            ...state,
            tabs: [...state.tabs, { title: payload.title, path: payload.path }],
         }
      }
      // Delete Tab
      case 'DELETE_TAB': {
         return {
            ...state,
            tabs: state.tabs.filter((_, index) => index !== payload.index),
         }
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

   const setTabTitle = React.useCallback(
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
      (title, path) => {
         dispatch({
            type: 'ADD_TAB',
            payload: { title, path },
         })
         history.push(path)
      },
      [dispatch]
   )

   const switchTab = path => history.push(path)

   const removeTab = (e, { tab, index }) => {
      e && e.stopPropagation()
      dispatch({ type: 'DELETE_TAB', payload: { tab, index } })

      const tabsCount = tabs.length
      // closing last remaining tab
      if (index === 0 && tabsCount === 1) {
         history.push('/apps/safety')
      }
      // closing first tab when there's more than one tab
      else if (index === 0 && tabsCount > 1) {
         history.push(tabs[index + 1].path)
      }
      // closing any tab when there's more than one tab
      else if (index > 0 && tabsCount > 1) {
         history.push(tabs[index - 1].path)
      }
   }

   const doesTabExists = path => tabs.find(tab => tab.path === path) || false

   return {
      tab,
      tabs,
      addTab,
      switchTab,
      removeTab,
      setTabTitle,
      doesTabExists,
   }
}
