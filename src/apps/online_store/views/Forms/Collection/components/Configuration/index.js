import React from 'react'
import { RRule } from 'rrule'

import { CollectionContext } from '../../../../../context/collection'
import {
   StyledHeading,
   StyledForm,
   StyledDisplay,
   StyledContainer,
} from './styled'

const Configuration = () => {
   const { dispatch } = React.useContext(CollectionContext)
   const [rule, setRule] = React.useState(undefined)
   const [freq, setFreq] = React.useState('1')
   const [start, setStart] = React.useState('')
   const [until, setUntil] = React.useState('')
   const [count, setCount] = React.useState('30')
   const [gap, setGap] = React.useState('1')
   const [wkst, setWkst] = React.useState('1')
   const [byWeekDay, setByWeekDay] = React.useState([])
   const [byMonth, setByMonth] = React.useState([])

   const toggleByDay = obj => {
      const index = byWeekDay.findIndex(wk => wk.weekday === obj.weekday)
      if (index === -1) {
         const copy = byWeekDay
         copy.push(obj)
         setByWeekDay([...copy])
      } else {
         const copy = byWeekDay
         copy.splice(index, 1)
         setByWeekDay([...copy])
      }
   }

   const toggleByMonth = e => {
      const { value } = e.target
      const index = byMonth.findIndex(mon => mon === value)
      if (index === -1) {
         const copy = byMonth
         copy.push(value)
         setByMonth([...copy])
      } else {
         const copy = byMonth
         copy.splice(index, 1)
         setByMonth([...copy])
      }
   }

   React.useEffect(() => {
      let rule = {
         freq,
         count,
         interval: gap,
         wkst,
         byweekday: byWeekDay,
         bymonth: byMonth,
      }
      if (start) {
         let temp = new Date(start)
         rule.dtstart = new Date(
            Date.UTC(
               temp.getUTCFullYear(),
               temp.getUTCMonth(),
               temp.getUTCDate(),
               temp.getUTCHours(),
               temp.getUTCMinutes(),
               temp.getUTCSeconds()
            )
         )
      }
      if (until) {
         let temp = new Date(until)
         rule.until = new Date(
            Date.UTC(
               temp.getUTCFullYear(),
               temp.getUTCMonth(),
               temp.getUTCDate(),
               temp.getUTCHours(),
               temp.getUTCMinutes(),
               temp.getUTCSeconds()
            )
         )
      }
      const avail = new RRule(rule)
      if (avail) {
         setRule(avail)
         dispatch({
            type: 'AVAILABILITY',
            payload: avail.toString(),
         })
      }
   }, [freq, start, until, count, gap, wkst, byWeekDay, byMonth])

   return (
      <React.Fragment>
         <StyledHeading>Collection Availability</StyledHeading>
         <StyledContainer>
            <StyledForm>
               <div>
                  <label>
                     <input
                        name="freq"
                        type="radio"
                        value="0"
                        checked={freq === '0'}
                        onChange={e => setFreq(e.target.value)}
                     />
                     Repeat Yearly
                  </label>
                  <label>
                     <input
                        name="freq"
                        type="radio"
                        value="1"
                        checked={freq === '1'}
                        onChange={e => setFreq(e.target.value)}
                     />
                     Repeat Monthly
                  </label>
                  <label>
                     <input
                        name="freq"
                        type="radio"
                        value="2"
                        checked={freq === '2'}
                        onChange={e => setFreq(e.target.value)}
                     />
                     Repeat Weekly
                  </label>
                  <label>
                     <input
                        name="freq"
                        type="radio"
                        value="3"
                        checked={freq === '3'}
                        onChange={e => setFreq(e.target.value)}
                     />
                     Repeat Daily
                  </label>
               </div>
               <div>
                  <label>
                     From
                     <input
                        name="dtstart"
                        type="date"
                        value={start}
                        onChange={e => setStart(e.target.value)}
                     />
                  </label>
                  <label>
                     Till
                     <input
                        name="until"
                        type="date"
                        value={until}
                        onChange={e => setUntil(e.target.value)}
                     />
                  </label>
               </div>
               <div>
                  <label>
                     Count
                     <input
                        type="number"
                        max="1000"
                        min="1"
                        value={count}
                        name="count"
                        onChange={e => setCount(e.target.value)}
                     />
                  </label>
               </div>
               <div>
                  <label>
                     Interval
                     <input
                        type="number"
                        value={gap}
                        min="1"
                        name="interval"
                        onChange={e => setGap(e.target.value)}
                     />
                  </label>
               </div>
               <div>
                  Week starts on <br />
                  <label>
                     <input
                        type="radio"
                        name="wkst"
                        value="0"
                        checked={wkst === '0'}
                        onChange={e => setWkst(e.target.value)}
                     />
                     Monday
                  </label>
                  <label>
                     <input
                        type="radio"
                        name="wkst"
                        value="1"
                        checked={wkst === '1'}
                        onChange={e => setWkst(e.target.value)}
                     />
                     Tuesday
                  </label>
                  <label>
                     <input
                        type="radio"
                        name="wkst"
                        value="2"
                        checked={wkst === '2'}
                        onChange={e => setWkst(e.target.value)}
                     />
                     Wednesday
                  </label>
                  <label>
                     <input
                        type="radio"
                        name="wkst"
                        value="3"
                        checked={wkst === '3'}
                        onChange={e => setWkst(e.target.value)}
                     />
                     Thursday
                  </label>
                  <label>
                     <input
                        type="radio"
                        name="wkst"
                        value="4"
                        checked={wkst === '4'}
                        onChange={e => setWkst(e.target.value)}
                     />
                     Friday
                  </label>
                  <label>
                     <input
                        type="radio"
                        name="wkst"
                        value="5"
                        checked={wkst === '5'}
                        onChange={e => setWkst(e.target.value)}
                     />
                     Saturday
                  </label>
                  <label>
                     <input
                        type="radio"
                        name="wkst"
                        value="6"
                        checked={wkst === '6'}
                        onChange={e => setWkst(e.target.value)}
                     />
                     Sunday
                  </label>
               </div>
               <div>
                  Available on <br />
                  <label>
                     <input
                        type="checkbox"
                        name="byweekday"
                        value="0"
                        checked={byWeekDay.includes(RRule.MO)}
                        onChange={() => toggleByDay(RRule.MO)}
                     />
                     Every Monday
                  </label>
                  <label>
                     <input
                        type="checkbox"
                        name="byweekday"
                        value="1"
                        checked={byWeekDay.includes(RRule.TU)}
                        onChange={() => toggleByDay(RRule.TU)}
                     />
                     Every Tuesday
                  </label>
                  <label>
                     <input
                        type="checkbox"
                        name="byweekday"
                        value="2"
                        checked={byWeekDay.includes(RRule.WE)}
                        onChange={() => toggleByDay(RRule.WE)}
                     />
                     Every Wednesday
                  </label>
                  <label>
                     <input
                        type="checkbox"
                        name="byweekday"
                        value="3"
                        checked={byWeekDay.includes(RRule.TH)}
                        onChange={() => toggleByDay(RRule.TH)}
                     />
                     Every Thursday
                  </label>
                  <label>
                     <input
                        type="checkbox"
                        name="byweekday"
                        value="4"
                        checked={byWeekDay.includes(RRule.FR)}
                        onChange={() => toggleByDay(RRule.FR)}
                     />
                     Every Friday
                  </label>
                  <label>
                     <input
                        type="checkbox"
                        name="byweekday"
                        value="5"
                        checked={byWeekDay.includes(RRule.SA)}
                        onChange={() => toggleByDay(RRule.SA)}
                     />
                     Every Saturday
                  </label>
                  <label>
                     <input
                        type="checkbox"
                        name="byweekday"
                        value="6"
                        checked={byWeekDay.includes(RRule.SU)}
                        onChange={() => toggleByDay(RRule.SU)}
                     />
                     Every Sunday
                  </label>
               </div>
               <div>
                  Available in <br />
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="1"
                        checked={byMonth.includes('1')}
                        onChange={toggleByMonth}
                     />
                     Jan
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="2"
                        checked={byMonth.includes('2')}
                        onChange={toggleByMonth}
                     />
                     Feb
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="3"
                        checked={byMonth.includes('3')}
                        onChange={toggleByMonth}
                     />
                     Mar
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="4"
                        checked={byMonth.includes('4')}
                        onChange={toggleByMonth}
                     />
                     Apr
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="5"
                        checked={byMonth.includes('5')}
                        onChange={toggleByMonth}
                     />
                     May
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="6"
                        checked={byMonth.includes('6')}
                        onChange={toggleByMonth}
                     />
                     Jun
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="7"
                        checked={byMonth.includes('7')}
                        onChange={toggleByMonth}
                     />
                     Jul
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="8"
                        checked={byMonth.includes('8')}
                        onChange={toggleByMonth}
                     />
                     Aug
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="9"
                        checked={byMonth.includes('9')}
                        onChange={toggleByMonth}
                     />
                     Sep
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="10"
                        checked={byMonth.includes('10')}
                        onChange={toggleByMonth}
                     />
                     Oct
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="11"
                        checked={byMonth.includes('11')}
                        onChange={toggleByMonth}
                     />
                     Nov
                  </label>
                  <label>
                     <input
                        name="bymonth"
                        type="checkbox"
                        value="12"
                        checked={byMonth.includes('12')}
                        onChange={toggleByMonth}
                     />
                     Dec
                  </label>
               </div>
            </StyledForm>
            <StyledDisplay>{rule && rule.toText()}</StyledDisplay>
         </StyledContainer>
      </React.Fragment>
   )
}

export default Configuration
