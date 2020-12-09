import React from 'react'
import { Row } from './style'

export default function Dropdown({ options, label, clickHandler }) {
   return (
      <Row>
         <div className="span4">
            <label className="control-label">{label}</label>
            <select className="language-picker">
               {options.map(opt => {
                  return (
                     <option key={opt.id} onClick={() => clickHandler(opt)}>
                        {opt.title}
                     </option>
                  )
               })}
            </select>
         </div>
      </Row>
   )
}
