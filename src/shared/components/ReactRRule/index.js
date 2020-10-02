import React from 'react'
import { RRule } from 'rrule'
import { Checkbox, Text, Input } from '@dailykit/ui'

import { Wrapper, Label, FlexItems, FlexItem, InputGroup } from './styled'

import { getUTCDate, getPSQLRule, reversePSQLObject } from './utils'

const Component = ({ value, onChange }) => {
   const [state, setState] = React.useState({
      freq: 1,
      dtstart: '',
      until: '',
      count: 30,
      interval: 1,
      wkst: 0,
      byweekday: [],
      bymonth: [],
   })

   // Handlers
   const toggleByDay = value => {
      const index = state.byweekday.findIndex(
         wk => RRule[wk].weekday === RRule[value].weekday
      )
      if (index === -1) {
         const copy = state.byweekday
         copy.push(value)
         setState({ ...state, byweekday: [...copy] })
      } else {
         const copy = state.byweekday
         copy.splice(index, 1)
         setState({ ...state, byweekday: [...copy] })
      }
   }

   const toggleByMonth = value => {
      const index = state.bymonth.findIndex(mon => mon === +value)
      if (index === -1) {
         const copy = state.bymonth
         copy.push(+value)
         setState({ ...state, bymonth: [...copy] })
      } else {
         const copy = state.bymonth
         copy.splice(index, 1)
         setState({ ...state, bymonth: [...copy] })
      }
   }

   // Effects
   React.useEffect(() => {
      const rule = { ...state }
      if (!state.byweekday.length) {
         delete rule.byweekday
      }
      if (!state.bymonth.length) {
         delete rule.bymonth
      }
      if (state.dtstart) {
         rule.dtstart = getUTCDate(state.dtstart)
      } else {
         const d = new Date().toISOString().split('T')[0]
         rule.dtstart = getUTCDate(d)
      }
      if (state.until) {
         rule.until = getUTCDate(state.until)
      } else {
         delete rule.until
      }
      if (state.byweekday.length) {
         rule.byweekday = state.byweekday.map(day => RRule[day])
      }
      const rruleObj = new RRule(rule)
      const output = {
         object: rruleObj,
         psqlObject: getPSQLRule(rule),
         string: rruleObj.toString(),
         text: rruleObj.toText(),
      }
      output.psqlObject.text = output.text
      onChange(output)
   }, [state])

   React.useEffect(() => {
      if (value) {
         const rruleObject = reversePSQLObject(value)
         setState({ ...state, ...rruleObject })
      }
   }, [])

   return (
      <Wrapper>
         <InputGroup>
            <Text as="subtitle">Repeat</Text>
            <FlexItems>
               <FlexItem>
                  <input
                     type="radio"
                     name="freq"
                     value={0}
                     checked={state.freq === 0}
                     onChange={e =>
                        setState({ ...state, freq: +e.target.value })
                     }
                  />
                  <span>Yearly</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="freq"
                     value={1}
                     checked={state.freq === 1}
                     onChange={e =>
                        setState({ ...state, freq: +e.target.value })
                     }
                  />
                  <span>Monthly</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="freq"
                     value={2}
                     checked={state.freq === 2}
                     onChange={e =>
                        setState({ ...state, freq: +e.target.value })
                     }
                  />
                  <span>Weekly</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="freq"
                     value={3}
                     checked={state.freq === 3}
                     onChange={e =>
                        setState({ ...state, freq: +e.target.value })
                     }
                  />
                  <span>Daily</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="freq"
                     value={4}
                     checked={state.freq === 4}
                     onChange={e =>
                        setState({ ...state, freq: +e.target.value })
                     }
                  />
                  <span>Hourly</span>
               </FlexItem>
            </FlexItems>
         </InputGroup>
         <InputGroup>
            <Text as="subtitle">Start date</Text>
            <input
               type="date"
               name="dtstart"
               value={state.dtstart}
               onChange={e => setState({ ...state, dtstart: e.target.value })}
            />
         </InputGroup>
         <InputGroup>
            <Text as="subtitle">End date</Text>
            <input
               type="date"
               name="until"
               value={state.until}
               onChange={e => setState({ ...state, until: e.target.value })}
            />
         </InputGroup>
         <InputGroup>
            <Input
               type="number"
               label="Count"
               name="count"
               max="1000"
               min="1"
               value={state.count}
               onChange={e => setState({ ...state, count: +e.target.value })}
               style={{ maxWidth: 300 }}
            />
         </InputGroup>
         <InputGroup>
            <Input
               type="number"
               label="Interval"
               name="interval"
               min="1"
               value={state.interval}
               onChange={e => setState({ ...state, interval: +e.target.value })}
               style={{ maxWidth: 300 }}
            />
         </InputGroup>
         <InputGroup>
            <Text as="subtitle">Week starts on</Text>
            <FlexItems>
               <FlexItem>
                  <input
                     type="radio"
                     name="wkst"
                     value={0}
                     checked={state.wkst === 0}
                     onChange={e =>
                        setState({ ...state, wkst: +e.target.value })
                     }
                  />
                  <span>Monday</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="wkst"
                     value={1}
                     checked={state.wkst === 1}
                     onChange={e =>
                        setState({ ...state, wkst: +e.target.value })
                     }
                  />
                  <span>Tuesday</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="wkst"
                     value={2}
                     checked={state.wkst === 2}
                     onChange={e =>
                        setState({ ...state, wkst: +e.target.value })
                     }
                  />
                  <span>Wednesday</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="wkst"
                     value={3}
                     checked={state.wkst === 3}
                     onChange={e =>
                        setState({ ...state, wkst: +e.target.value })
                     }
                  />
                  <span>Thursday</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="wkst"
                     value={4}
                     checked={state.wkst === 4}
                     onChange={e =>
                        setState({ ...state, wkst: +e.target.value })
                     }
                  />
                  <span>Friday</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="wkst"
                     value={5}
                     checked={state.wkst === 5}
                     onChange={e =>
                        setState({ ...state, wkst: +e.target.value })
                     }
                  />
                  <span>Saturday</span>
               </FlexItem>
               <FlexItem>
                  <input
                     type="radio"
                     name="wkst"
                     value={6}
                     checked={state.wkst === 6}
                     onChange={e =>
                        setState({ ...state, wkst: +e.target.value })
                     }
                  />
                  <span>Sunday</span>
               </FlexItem>
            </FlexItems>
         </InputGroup>
         <InputGroup>
            <Text as="subtitle">On every</Text>
            <FlexItems>
               <Checkbox
                  id="byMonday"
                  checked={state.byweekday.includes('MO')}
                  onChange={() => toggleByDay('MO')}
               >
                  Monday
               </Checkbox>
               <Checkbox
                  id="byTuesday"
                  checked={state.byweekday.includes('TU')}
                  onChange={() => toggleByDay('TU')}
               >
                  Tuesday
               </Checkbox>
               <Checkbox
                  id="byWednesday"
                  checked={state.byweekday.includes('WE')}
                  onChange={() => toggleByDay('WE')}
               >
                  Wednesday
               </Checkbox>
               <Checkbox
                  id="byThursday"
                  checked={state.byweekday.includes('TH')}
                  onChange={() => toggleByDay('TH')}
               >
                  Thursday
               </Checkbox>
               <Checkbox
                  id="byFriday"
                  checked={state.byweekday.includes('FR')}
                  onChange={() => toggleByDay('FR')}
               >
                  Friday
               </Checkbox>
               <Checkbox
                  id="bySaturday"
                  checked={state.byweekday.includes('SA')}
                  onChange={() => toggleByDay('SA')}
               >
                  Saturday
               </Checkbox>
               <Checkbox
                  id="bySunday"
                  checked={state.byweekday.includes('SU')}
                  onChange={() => toggleByDay('SU')}
               >
                  Sunday
               </Checkbox>
            </FlexItems>
         </InputGroup>
         <InputGroup>
            <Text as="subtitle">In</Text>
            <FlexItems>
               <Checkbox
                  id="Jan"
                  checked={state.bymonth.includes(1)}
                  onChange={() => toggleByMonth(1)}
               >
                  January
               </Checkbox>
               <Checkbox
                  id="Feb"
                  checked={state.bymonth.includes(2)}
                  onChange={() => toggleByMonth(2)}
               >
                  February
               </Checkbox>
               <Checkbox
                  id="Mar"
                  checked={state.bymonth.includes(3)}
                  onChange={() => toggleByMonth(3)}
               >
                  March
               </Checkbox>
               <Checkbox
                  id="Apr"
                  checked={state.bymonth.includes(4)}
                  onChange={() => toggleByMonth(4)}
               >
                  April
               </Checkbox>
               <Checkbox
                  id="May"
                  checked={state.bymonth.includes(5)}
                  onChange={() => toggleByMonth(5)}
               >
                  May
               </Checkbox>
               <Checkbox
                  id="Jun"
                  checked={state.bymonth.includes(6)}
                  onChange={() => toggleByMonth(6)}
               >
                  June
               </Checkbox>
               <Checkbox
                  id="Jun"
                  checked={state.bymonth.includes(7)}
                  onChange={() => toggleByMonth(7)}
               >
                  July
               </Checkbox>
               <Checkbox
                  id="Aug"
                  checked={state.bymonth.includes(8)}
                  onChange={() => toggleByMonth(8)}
               >
                  August
               </Checkbox>
               <Checkbox
                  id="Sep"
                  checked={state.bymonth.includes(9)}
                  onChange={() => toggleByMonth(9)}
               >
                  September
               </Checkbox>
               <Checkbox
                  id="Sep"
                  checked={state.bymonth.includes(10)}
                  onChange={() => toggleByMonth(10)}
               >
                  October
               </Checkbox>
               <Checkbox
                  id="Nov"
                  checked={state.bymonth.includes(11)}
                  onChange={() => toggleByMonth(11)}
               >
                  November
               </Checkbox>
               <Checkbox
                  id="Dec"
                  checked={state.bymonth.includes(12)}
                  onChange={() => toggleByMonth(12)}
               >
                  December
               </Checkbox>
            </FlexItems>
         </InputGroup>
      </Wrapper>
   )
}

export default Component
