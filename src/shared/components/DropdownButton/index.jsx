import React from 'react'
import styled, { css } from 'styled-components'

import { useOnClickOutside } from '../../hooks'
import { ChevronUp, ChevronDown } from '../../assets/icons'

const DropdownContext = React.createContext()

const initialState = {
   isOpen: false,
}

const reducers = (state, { type, payload }) => {
   switch (type) {
      case 'TOGGLE_DROPDOWN':
         return { ...state, isOpen: payload }
      default:
         return state
   }
}

const useDropdown = () => React.useContext(DropdownContext)

const DropdownButton = ({ title, children, ...props }) => {
   const ref = React.useRef()
   const [state, dispatch] = React.useReducer(reducers, initialState)

   useOnClickOutside(ref, () => toggle(false))

   const toggle = value => {
      dispatch({ type: 'TOGGLE_DROPDOWN', payload: value })
   }

   return (
      <DropdownContext.Provider value={{ state, dispatch, toggle }}>
         <Section {...props} ref={ref}>
            <Header>
               <span>{title}</span>
               <button onClick={() => toggle(!state.isOpen)}>
                  {state.isOpen ? (
                     <ChevronUp color="#fff" />
                  ) : (
                     <ChevronDown color="#fff" />
                  )}
               </button>
            </Header>
            {children}
         </Section>
      </DropdownContext.Provider>
   )
}

const Options = ({ children, ...props }) => {
   const { state, toggle } = useDropdown()

   if (!state.isOpen) return null
   return (
      <List onClick={() => toggle(false)} {...props}>
         {children.map((node, index) => (
            <li key={index}>{node}</li>
         ))}
      </List>
   )
}

DropdownButton.Option = ({ children, ...props }) => {
   return <Button {...props}>{children}</Button>
}

DropdownButton.Options = Options

export { DropdownButton }

const Section = styled.section(
   () => css`
      position: relative;
   `
)

const Header = styled.header(
   () => css`
      width: 100%;
      height: 40px;
      display: flex;
      border-radius: 2px;
      align-items: center;
      border: 1px solid rgb(0, 167, 225);
      span {
         flex: 1;
         padding: 0 12px;
      }
      button {
         width: 40px;
         color: #fff;
         border: none;
         height: inherit;
         cursor: pointer;
         background: rgba(0, 0, 0, 0)
            linear-gradient(rgb(40, 193, 247) -4.17%, rgb(0, 167, 225) 100%)
            repeat scroll 0% 0%;
      }
   `
)

const List = styled.ul(
   () => css`
      left: 0;
      right: 0;
      padding: 0;
      z-index: 1000;
      background: #fff;
      margin: 2px 0 0 0;
      max-height: 280px;
      overflow-y: auto;
      position: absolute;
      border-radius: 2px;
      border: 1px solid #e3e3e3;
      li {
         list-style: none;
      }
   `
)

const Button = styled.button(
   () => css`
      width: 100%;
      height: 40px;
      border: none;
      display: block;
      font-size: 16px;
      cursor: pointer;
      background: transparent;
      :hover {
         color: #fff;
         background: rgba(0, 0, 0, 0)
            linear-gradient(rgb(40, 193, 247) -4.17%, rgb(0, 167, 225) 100%)
            repeat scroll 0% 0%;
      }
   `
)
