import { useState, useRef, useEffect } from 'react'
import html2canvas from 'html2canvas'
import {
  Wind, SlidersHorizontal, Cpu, Star, Clock, Calculator,
  IndianRupee, Calendar, Zap, Flame, BarChart2, Activity,
  Download, Pencil, Check, Info, CalendarDays
} from 'lucide-react'

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

function App() {
  const [capacity, setCapacity] = useState('')
  const [iseer, setIseer] = useState('')
  const [hours, setHours] = useState('')
  const [rate, setRate] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())

  const [showResults, setShowResults] = useState(false)
  const [powerKW, setPowerKW] = useState(0)
  const [dailyUnits, setDailyUnits] = useState(0)
  const [monthsData, setMonthsData] = useState([])
  const [yearlyBill, setYearlyBill] = useState(0)
  const [yearlyUnits, setYearlyUnits] = useState(0)

  const resultsSectionRef = useRef(null)
  const [tipOpen, setTipOpen] = useState(false)

  // Close tooltip when clicking anywhere else
  useEffect(() => {
    const handleClick = () => setTipOpen(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const initializeCalculator = () => {
    const c = parseFloat(capacity)
    const i = parseFloat(iseer)
    const h = parseFloat(hours)
    const r = parseFloat(rate)
    const y = parseInt(year)

    if (!c || !i || !h || !r || !y) {
      alert("Please fill in all fields with valid numbers.")
      return
    }

    const pkw = c / (i * 1000)
    const du = pkw * h

    setPowerKW(pkw)
    setDailyUnits(du)

    const newMonths = []
    for (let idx = 0; idx < 12; idx++) {
      const days = new Date(y, idx + 1, 0).getDate()
      newMonths.push({
        name: MONTHS[idx],
        maxDays: days,
        activeDays: days,
        hoursPerDay: h,
        isEditing: false
      })
    }
    setMonthsData(newMonths)
    setShowResults(true)

    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }

  const editRow = (index) => {
    setMonthsData(prev => prev.map((m, i) => i === index ? { ...m, isEditing: true } : m))
  }

  const saveRow = (index) => {
    const daysInput = document.getElementById(`edit-days-${index}`)
    const hoursInput = document.getElementById(`edit-hours-${index}`)

    const days = parseFloat(daysInput?.value)
    const hrs = parseFloat(hoursInput?.value)

    if (isNaN(days) || isNaN(hrs)) {
      alert("Enter valid numbers.")
      return
    }

    setMonthsData(prev => prev.map((m, i) => {
      if (i !== index) return m
      return {
        ...m,
        activeDays: Math.max(0, Math.min(days, m.maxDays)),
        hoursPerDay: Math.max(0, Math.min(hrs, 24)),
        isEditing: false
      }
    }))
  }

  // Recalculate totals whenever month data changes
  useEffect(() => {
    if (monthsData.length === 0) return

    let totalBill = 0
    let totalUnits = 0

    monthsData.forEach(m => {
      const units = powerKW * m.hoursPerDay * m.activeDays
      totalBill += units * rate
      totalUnits += units
    })

    setYearlyBill(totalBill)
    setYearlyUnits(totalUnits)
  }, [monthsData, powerKW, rate])

  const downloadImage = () => {
    const section = resultsSectionRef.current
    if (!section) return

    const actionBtns = section.querySelector('#action-buttons')
    const expTitle = section.querySelector('.export-title')

    if (actionBtns) actionBtns.style.display = 'none'
    if (expTitle) expTitle.style.display = 'block'

    const patch = document.createElement('style')
    patch.id = 'export-patch'
    patch.textContent = `
      #results-section {
        background: #080c18 !important;
        color: #e2e8f0 !important;
        padding: 24px 18px !important;
      }
      #results-section * { animation: none !important; transition: none !important; }
      #results-section .stat-card        { background: #111827 !important; border: 1px solid #1e2d47 !important; }
      #results-section .stat-card::after { display: block !important; height: 3px !important; border-radius: 0 !important; }
      #results-section .stat-card.teal::after  { background: #2dd4bf !important; }
      #results-section .stat-card.amber::after { background: #fbbf24 !important; }
      #results-section .stat-card.teal  .sc-icon { background: #134e4a !important; color: #2dd4bf !important; }
      #results-section .stat-card.amber .sc-icon { background: #451a03 !important; color: #fbbf24 !important; }
      #results-section .sc-label  { color: #64748b !important; }
      #results-section .sc-value  { color: #e2e8f0 !important; }
      #results-section .sec-head svg { color: #2dd4bf !important; }
      #results-section .sec-head-text { color: #64748b !important; }
      #results-section .year-badge { background: #134e4a !important; color: #2dd4bf !important; border-color: rgba(45,212,191,0.25) !important; }
      #results-section .sec-line   { background: #1e2d47 !important; }
      #results-section .month-card { background: #111827 !important; border: 1px solid #1e2d47 !important; box-shadow: none !important; }
      #results-section .month-dot  { background: #2dd4bf !important; }
      #results-section .month-name { color: #e2e8f0 !important; }
      #results-section .ms-lbl     { color: #64748b !important; }
      #results-section .ms-val     { color: #e2e8f0 !important; }
      #results-section .ms-val.hi  { color: #2dd4bf !important; }
      #results-section .yearly-card {
        background: #0b2e2b !important;
        border: 1px solid rgba(45,212,191,0.25) !important;
        box-shadow: none !important;
      }
      #results-section .yearly-label  { color: #2dd4bf !important; }
      #results-section .yearly-amount { color: #ffffff !important; }
      #results-section .yearly-units  { background: rgba(45,212,191,0.08) !important; border-color: rgba(45,212,191,0.18) !important; color: #94a3b8 !important; }
      #results-section .export-title  { color: #2dd4bf !important; }
    `
    document.head.appendChild(patch)

    setTimeout(() => {
      html2canvas(section, {
        scale: 2,
        backgroundColor: '#080c18',
        useCORS: true,
        logging: false,
        onclone(doc) {
          const root = doc.documentElement
          const vars = {
            '--bg':'#080c18','--surface':'#0d1220','--card':'#111827',
            '--border':'#1e2d47','--border-hi':'#2a4270',
            '--teal':'#2dd4bf','--teal-dim':'#134e4a',
            '--amber':'#fbbf24','--amber-dim':'#451a03',
            '--green':'#34d399','--green-dim':'#064e3b',
            '--text':'#e2e8f0','--muted':'#64748b','--muted-hi':'#94a3b8',
          }
          Object.entries(vars).forEach(([k,v]) => root.style.setProperty(k, v))

          const el = doc.getElementById('results-section')
          if (el) {
            el.style.position = 'absolute'
            el.style.top = '0'
            el.style.left = '0'
            el.style.width = '460px'
          }

          doc.querySelectorAll('.hide-on-print, #action-buttons').forEach(e => e.style.display = 'none')
        }
      }).then(canvas => {
        if (actionBtns) actionBtns.style.display = 'block'
        if (expTitle) expTitle.style.display = 'none'
        const p = document.getElementById('export-patch')
        if (p) document.head.removeChild(p)

        const link = document.createElement('a')
        link.download = 'AC_Bill_Report.png'
        link.href = canvas.toDataURL('image/png', 1.0)
        link.click()
      }).catch(err => {
        if (actionBtns) actionBtns.style.display = 'block'
        if (expTitle) expTitle.style.display = 'none'
        const p = document.getElementById('export-patch')
        if (p) document.head.removeChild(p)
        console.error(err)
        alert("Export failed. Please try again.")
      })
    }, 160)
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="app-header">
        <div className="header-icon">
          <Wind size={26} />
        </div>
        <h1>AC <em>Power</em> Calculator</h1>
        <p>Estimate your air conditioner's yearly electricity cost</p>
      </div>

      {/* Input card */}
      <div className="input-card">
        <div className="card-section-label">
          <SlidersHorizontal size={12} />
          Unit Parameters
        </div>

        <div className="input-row">
          <div className="input-group">
            <label><Cpu size={11} /> Capacity (W)</label>
            <input 
              type="number" 
              placeholder="3500" 
              value={capacity}
              onChange={e => setCapacity(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label><Star size={11} /> ISEER Rating</label>
            <input 
              type="number" 
              step="0.1" 
              placeholder="4.5" 
              value={iseer}
              onChange={e => setIseer(e.target.value)}
            />
          </div>
        </div>

        <div className="input-row">
          <div className="input-group">
            <label><Clock size={11} /> Hours / Day</label>
            <input 
              type="number" 
              step="0.5" 
              placeholder="8" 
              value={hours}
              onChange={e => setHours(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label><IndianRupee size={11} /> Rate / Unit</label>
            <input 
              type="number" 
              step="0.1" 
              placeholder="8" 
              value={rate}
              onChange={e => setRate(e.target.value)}
            />
          </div>
        </div>

        <div className="input-row single">
          <div className="input-group">
            <label><Calendar size={11} /> Calculation Year</label>
            <input 
              type="number" 
              placeholder="2026" 
              value={year}
              onChange={e => setYear(e.target.value)}
            />
          </div>
        </div>

        <button className="btn-calc" onClick={initializeCalculator}>
          <Calculator size={15} />
          Calculate Bill
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="results" id="results-section" ref={resultsSectionRef}>
          <div className="export-title">AC Consumption Report</div>

          {/* Summary */}
          <div className="summary-row">
            <div className="stat-card teal">
              <div className="sc-icon">
                <Zap size={15} />
              </div>
              <div className="sc-label">
                Power Draw
                <span 
                  className={`tip-wrap ${tipOpen ? 'open' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setTipOpen(!tipOpen)
                  }}
                >
                  <Info size={12} />
                  <span className="tip-box">Instantaneous draw in kW — energy consumed per hour while running. Not a daily or monthly figure.</span>
                </span>
              </div>
              <div className="sc-value">{powerKW.toFixed(3)} kW</div>
            </div>
            <div className="stat-card amber">
              <div className="sc-icon">
                <Flame size={15} />
              </div>
              <div className="sc-label">Base Units/Day</div>
              <div className="sc-value">{dailyUnits.toFixed(2)}</div>
            </div>
          </div>

          {/* Monthly breakdown */}
          <div className="sec-head">
            <BarChart2 size={13} />
            <span className="sec-head-text">Monthly Breakdown</span>
            <span className="year-badge">{year}</span>
            <div className="sec-line"></div>
          </div>

          <div className="month-list">
            {monthsData.map((m, i) => {
              const units = powerKW * m.hoursPerDay * m.activeDays
              const bill = units * rate

              if (m.isEditing) {
                return (
                  <div className="month-card" key={i}>
                    <div className="month-header">
                      <div className="month-name-wrap">
                        <div className="month-dot"></div>
                        <span className="month-name">{m.name}</span>
                      </div>
                      <button className="btn-save hide-on-print" onClick={() => saveRow(i)}>
                        <Check size={10} /> Save
                      </button>
                    </div>
                    <div className="edit-fields">
                      <div>
                        <label><CalendarDays size={10} /> Days (max {m.maxDays})</label>
                        <input 
                          type="number" 
                          id={`edit-days-${i}`}
                          defaultValue={m.activeDays} 
                          min="0" 
                          max={m.maxDays}
                        />
                      </div>
                      <div>
                        <label><Clock size={10} /> Hrs / Day</label>
                        <input 
                          type="number" 
                          id={`edit-hours-${i}`}
                          defaultValue={m.hoursPerDay} 
                          min="0" 
                          max="24" 
                          step="0.5"
                        />
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div className="month-card" key={i}>
                  <div className="month-header">
                    <div className="month-name-wrap">
                      <div className="month-dot"></div>
                      <span className="month-name">{m.name}</span>
                    </div>
                    <button className="btn-edit hide-on-print" onClick={() => editRow(i)}>
                      <Pencil size={10} /> Edit
                    </button>
                  </div>
                  <div className="month-stats">
                    <div className="ms">
                      <span className="ms-lbl"><CalendarDays size={9} /> Days</span>
                      <span className="ms-val">{m.activeDays}</span>
                    </div>
                    <div className="ms">
                      <span className="ms-lbl"><Clock size={9} /> Hrs/Day</span>
                      <span className="ms-val">{m.hoursPerDay}</span>
                    </div>
                    <div className="ms">
                      <span className="ms-lbl"><Activity size={9} /> Units/Month</span>
                      <span className="ms-val">{Math.round(units)}</span>
                    </div>
                    <div className="ms">
                      <span className="ms-lbl"><IndianRupee size={9} /> Bill</span>
                      <span className="ms-val hi">₹{bill.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Yearly total */}
          <div className="yearly-card">
            <div className="yearly-label">Total Yearly Bill</div>
            <div className="yearly-amount">
              ₹{yearlyBill.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}
            </div>
            <div className="yearly-units">
              <Activity size={13} />
              <span>{yearlyUnits.toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</span>&nbsp;units consumed
            </div>
          </div>

          <div id="action-buttons">
            <button className="btn-download" onClick={downloadImage}>
              <Download size={15} />
              Save as Image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
