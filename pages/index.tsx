import { useEffect, useState, useRef } from "react"
import {useSpring, animated as a} from '@react-spring/web'
import { Icon } from '@iconify-icon/react'
import parse from 'html-react-parser'

import { useRouter } from "next/router"

// import realms.json from ../data/realms.json
import { realms } from "../data/realms.json"
// Should not import the named export 'realms'.'map' (imported as 'realms') from default-exporting module (only default export is available soon)
// ? ????? fix?
// give me a stack overflow link or something pls
//    copilot: https://stackoverflow.com/questions/56238356/understanding-es-module-exports-imports

export default function Index() {

  // Sort realms alphabetically
  realms.sort((a, b) => a.name.localeCompare(b.name))

  const [simcSpring, setSimcSpring] = useSpring(() => ({opacity: 0, scale: 0.9}))

  const [simcLoadSpring, setSimcLoadSpring] = useSpring(() => ({opacity: 1, scale: 1}))

  const [query, setQuery] = useState("")

  const simCQuery = useRouter()

  const [realm, setRealm] = useState("")

  const [timestamp, setTimestamp] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)

  const customRef = useRef<HTMLTextAreaElement>(null)

  const simcRef = useRef<HTMLDivElement>(null)

  const [timeToActivate, setTimeToActivate] = useState(0)

  const [activated, setActivated] = useState(false)

  const resetCountdown = () => {
    setTimestamp(Date.now())
    setTimeToActivate(timestamp + 500)
  }

  const check_user = async () => {
    if (inputRef.current && inputRef.current.value.length > 0) {
      const name = inputRef.current.value
      console.log(realm)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() >= timeToActivate) {
        setActivated(true)
        check_user()
        clearInterval(interval)
      }
      console.log(timeToActivate, Date.now())
    }
    , 100)
    return () => clearInterval(interval)
  }, [activated, timeToActivate])

  const [customFilled, setCustomFilled] = useState(false)

  const [simcText, setSimcText] = useState("")

  const [simcHTML, setSimcHTML] = useState("")

  const [simulating, setSimulating] = useState(false)

  const [error, setError] = useState(false)

  const [simulationReady, setSimulationReady] = useState(false)

  const [simcLink, setSimcLink] = useState("")

  const [simulationLoaded, setSimulationLoaded] = useState(false)

  useEffect(() => {
    const do_simulation = async () => {
      const resp = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          simc: simcText
        })
      })
      if (resp.ok) {
        const data = await resp.json()
        setSimcHTML(data.data)
        setSimcLink(data.link)
        setSimulationReady(true)
      } else {
        setError(true)
      }
      setSimulating(false)
    }

    if (simulating) {
      do_simulation()
      setError(false)
    }
  }, [simulating])

  useEffect(() => {
    if (simulationLoaded) {
      setSimcSpring({opacity: 1, scale: 1})
      setSimcLoadSpring({opacity: 0, scale: 0.9})
    }
  }, [simulationLoaded, setSimcSpring, setSimcLoadSpring])

  const returnToMenu = () => {
    setSimcSpring({opacity: 0, scale: 0.9})
    setSimcLoadSpring({opacity: 1, scale: 1, onRest: () => {
      setSimulationLoaded(false)
      setSimulationReady(false)
    }})
  }

  return (
    <>
      <a.div style={simcLoadSpring} className="w-full h-full bg-zinc-900 absolute">
        {/* {!customFilled && <div className="form-control w-full max-w-xs right-0 left-0 m-auto top-10 absolute">
          <input ref={inputRef} onInput={resetCountdown} type="text" placeholder="Character name (e.g 'Oiku')" className="input input-bordered w-full max-w-xs" />
          <div className="left-0 right-0 relative m-auto">
            <div className="dropdown">
              <label tabIndex={0} className="btn m-1">{realm.length === 0 ? "Realm" : realm} {realm.length > 0 && inputRef.current && inputRef.current.value && <Icon className="animate-spin ml-4" icon="fluent:spinner-ios-20-filled" />}</label>
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 overflow-auto max-h-96 grid">
                <input onInput={(e) => setQuery(e.currentTarget.value)} type="text" placeholder="Search for realm..." className="input w-full max-w-xs" />
                {realms.filter(realm => realm.name.toLowerCase().includes(query.toLowerCase())).map(realm => (
                  <li onClick={(e) => {
                    inputRef.current?.focus()
                    setRealm(realm.name)
                    }} key={realm.name}>
                    <a className="btn btn-ghost btn-block">{realm.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>} */}
        <div className="left-0 right-0 m-auto fixed w-full text-center top-5">
          <ul>
            <li>Go to Raidbots (or open your own SimC generator)</li>
            <li>Copy <b>&quot;Show Simc Input&quot;</b> to the box below</li>
          </ul>
          {error && <div className="alert alert-error w-80 left-0 right-0 m-auto">An error has occurred. Either the SimC text is invalid, was entered wrong, or there&apos;s a problem on the server. Please try again.</div>}
          <textarea disabled={simulating || simulationReady} onInput={(e) => {
            setCustomFilled(e.currentTarget.value.length === 0 ? false : true)
            setSimcText(e.currentTarget.value)
          }} className="textarea w-[600px] h-[400px]" placeholder="Paste SimC profile here"></textarea>
          <br />
          {customFilled && <button disabled={simulating || simulationReady} onClick={() => setSimulating(true)} className="btn btn-primary">{!simulating ? simulationReady ? <Icon className="text-emerald-500" icon="material-symbols:check-circle-rounded" /> : "Simulate" : <Icon className="animate-spin text-zinc-100" icon="fluent:spinner-ios-20-filled" />}</button>}
        </div>
      </a.div>
      {simulationReady && <div className="w-[99%] h-8 absolute z-10 bg-zinc-900/60 backdrop-blur-sm"><p className="text-center top-1 m-auto relative">View the static page <a target="_blank" rel="noreferrer" href={`/simc/${simcLink}`}>here</a></p></div>
      }
      <a.iframe onLoad={() => setSimulationLoaded(true)} srcDoc={simcHTML} style={simcSpring} className={`w-full h-full absolute ${!simulationLoaded ? "hidden" : "block"}`}></a.iframe>
      {simulationLoaded && <button onClick={returnToMenu} className="text-zinc-200 btn btn-circle fixed m-12 right-0 opacity-50 hover:opacity-100 overflow-x-hidden z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>}
    </>
  )
}

