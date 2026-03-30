"use client"

import { useState } from "react"
import {
  X,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  Trash2,
  Plus,
  ExternalLink,
  User,
} from "lucide-react"

type InterviewType = "PHONE" | "TECHNICAL" | "ONSITE" | "OTHER"

type InterviewRound = {
  id: string
  type: InterviewType
  scheduledAt: string | null
  notes: string | null
}

type Contact = {
  id: string
  name: string
  role: string | null
  email: string | null
  linkedinUrl: string | null
  notes: string | null
}

type Application = {
  id: string
  company: string
  role: string
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED"
  jobUrl: string | null
  notes: string | null
  salaryExpected: number | null
  salaryOffered: number | null
  resumeUrl: string | null
  coverLetterUrl: string | null
  appliedAt: string
  interviewRounds: InterviewRound[]
  contacts: Contact[]
}

interface Props {
  application: Application
  onClose: () => void
  onUpdate: () => void
}

const INTERVIEW_TYPES: { value: InterviewType; label: string }[] = [
  { value: "PHONE", label: "📞 Phone Screen" },
  { value: "TECHNICAL", label: "💻 Technical" },
  { value: "ONSITE", label: "🏢 Onsite" },
  { value: "OTHER", label: "💬 Other" },
]

const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  PHONE: "📞 Phone Screen",
  TECHNICAL: "💻 Technical",
  ONSITE: "🏢 Onsite",
  OTHER: "💬 Other",
}

export default function ApplicationDetailModal({ application: initialApp, onClose, onUpdate }: Props) {
  const [app, setApp] = useState<Application>(initialApp)
  const [activeTab, setActiveTab] = useState<"overview" | "interviews" | "contacts">("overview")
  const [saving, setSaving] = useState(false)

  // Overview state
  const [salaryExpected, setSalaryExpected] = useState(app.salaryExpected?.toString() ?? "")
  const [salaryOffered, setSalaryOffered] = useState(app.salaryOffered?.toString() ?? "")
  const [resumeUrl, setResumeUrl] = useState(app.resumeUrl ?? "")
  const [coverLetterUrl, setCoverLetterUrl] = useState(app.coverLetterUrl ?? "")
  const [notes, setNotes] = useState(app.notes ?? "")
  const [overviewSaved, setOverviewSaved] = useState(false)

  // Interview form state
  const [showInterviewForm, setShowInterviewForm] = useState(false)
  const [iType, setIType] = useState<InterviewType>("PHONE")
  const [iDate, setIDate] = useState("")
  const [iNotes, setINotes] = useState("")
  const [addingInterview, setAddingInterview] = useState(false)

  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false)
  const [cName, setCName] = useState("")
  const [cRole, setCRole] = useState("")
  const [cEmail, setCEmail] = useState("")
  const [cLinkedin, setCLinkedin] = useState("")
  const [cNotes, setCNotes] = useState("")
  const [addingContact, setAddingContact] = useState(false)

  async function saveOverview() {
    setSaving(true)
    await fetch(`/api/applications/${app.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notes: notes || null,
        salaryExpected: salaryExpected || null,
        salaryOffered: salaryOffered || null,
        resumeUrl: resumeUrl || null,
        coverLetterUrl: coverLetterUrl || null,
      }),
    })
    setSaving(false)
    setOverviewSaved(true)
    setTimeout(() => setOverviewSaved(false), 2000)
    onUpdate()
  }

  async function addInterview() {
    setAddingInterview(true)
    const res = await fetch(`/api/applications/${app.id}/interviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: iType, scheduledAt: iDate || null, notes: iNotes || null }),
    })
    if (res.ok) {
      const round = await res.json()
      setApp(prev => ({ ...prev, interviewRounds: [...prev.interviewRounds, round] }))
      setIType("PHONE"); setIDate(""); setINotes("")
      setShowInterviewForm(false)
      onUpdate()
    }
    setAddingInterview(false)
  }

  async function deleteInterview(roundId: string) {
    await fetch(`/api/applications/${app.id}/interviews`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roundId }),
    })
    setApp(prev => ({ ...prev, interviewRounds: prev.interviewRounds.filter(r => r.id !== roundId) }))
    onUpdate()
  }

  async function addContact() {
    setAddingContact(true)
    const res = await fetch(`/api/applications/${app.id}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cName, role: cRole || null, email: cEmail || null, linkedinUrl: cLinkedin || null, notes: cNotes || null }),
    })
    if (res.ok) {
      const contact = await res.json()
      setApp(prev => ({ ...prev, contacts: [...prev.contacts, contact] }))
      setCName(""); setCRole(""); setCEmail(""); setCLinkedin(""); setCNotes("")
      setShowContactForm(false)
      onUpdate()
    }
    setAddingContact(false)
  }

  async function deleteContact(contactId: string) {
    await fetch(`/api/applications/${app.id}/contacts`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactId }),
    })
    setApp(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== contactId) }))
    onUpdate()
  }

  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{app.company}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{app.role}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {(["overview", "interviews", "contacts"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab}
              {tab === "interviews" && app.interviewRounds.length > 0 && (
                <span className="ml-1.5 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {app.interviewRounds.length}
                </span>
              )}
              {tab === "contacts" && app.contacts.length > 0 && (
                <span className="ml-1.5 bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {app.contacts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    <DollarSign size={12} className="inline mr-1" />Expected Salary
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 95000"
                    value={salaryExpected}
                    onChange={e => setSalaryExpected(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    <DollarSign size={12} className="inline mr-1" />Offered Salary
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 100000"
                    value={salaryOffered}
                    onChange={e => setSalaryOffered(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <FileText size={12} className="inline mr-1" />Resume Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={resumeUrl}
                    onChange={e => setResumeUrl(e.target.value)}
                    className={inputClass}
                  />
                  {resumeUrl && (
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center px-3 border border-gray-200 rounded-lg text-gray-500 hover:text-black transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  <FileText size={12} className="inline mr-1" />Cover Letter Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://docs.google.com/..."
                    value={coverLetterUrl}
                    onChange={e => setCoverLetterUrl(e.target.value)}
                    className={inputClass}
                  />
                  {coverLetterUrl && (
                    <a href={coverLetterUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center px-3 border border-gray-200 rounded-lg text-gray-500 hover:text-black transition-colors">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any notes about this role..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <button
                onClick={saveOverview}
                disabled={saving}
                className="w-full bg-black text-white text-sm py-2.5 rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : overviewSaved ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          )}

          {/* ── INTERVIEWS ── */}
          {activeTab === "interviews" && (
            <div className="space-y-4">
              {app.interviewRounds.length === 0 && !showInterviewForm && (
                <div className="text-center py-10 text-gray-400">
                  <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No interview rounds yet</p>
                </div>
              )}

              {app.interviewRounds.map(round => (
                <div key={round.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{INTERVIEW_TYPE_LABELS[round.type]}</div>
                    {round.scheduledAt && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar size={11} />
                        {new Date(round.scheduledAt).toLocaleString(undefined, {
                          month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </div>
                    )}
                    {round.notes && <p className="text-xs text-gray-500 mt-1.5">{round.notes}</p>}
                  </div>
                  <button
                    onClick={() => deleteInterview(round.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {showInterviewForm ? (
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <select value={iType} onChange={e => setIType(e.target.value as InterviewType)} className={inputClass}>
                    {INTERVIEW_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input
                    type="datetime-local"
                    value={iDate}
                    onChange={e => setIDate(e.target.value)}
                    className={inputClass}
                  />
                  <textarea
                    rows={2}
                    placeholder="Notes..."
                    value={iNotes}
                    onChange={e => setINotes(e.target.value)}
                    className={`${inputClass} resize-none`}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowInterviewForm(false)} className="flex-1 border border-gray-200 text-sm py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={addInterview} disabled={addingInterview} className="flex-1 bg-black text-white text-sm py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50">
                      {addingInterview ? "Adding..." : "Add Round"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowInterviewForm(true)}
                  className="w-full border-2 border-dashed border-gray-200 text-gray-500 text-sm py-3 rounded-xl hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Interview Round
                </button>
              )}
            </div>
          )}

          {/* ── CONTACTS ── */}
          {activeTab === "contacts" && (
            <div className="space-y-4">
              {app.contacts.length === 0 && !showContactForm && (
                <div className="text-center py-10 text-gray-400">
                  <User size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No contacts yet</p>
                </div>
              )}

              {app.contacts.map(contact => (
                <div key={contact.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="space-y-1">
                    <div className="font-medium text-gray-900 text-sm">{contact.name}</div>
                    {contact.role && <div className="text-xs text-gray-500">{contact.role}</div>}
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors">
                          <Mail size={11} />{contact.email}
                        </a>
                      )}
                      {contact.linkedinUrl && (
                        <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors">
                          <ExternalLink size={11} />LinkedIn
                        </a>
                      )}
                    </div>
                    {contact.notes && <p className="text-xs text-gray-500">{contact.notes}</p>}
                  </div>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              {showContactForm ? (
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <input placeholder="Name *" value={cName} onChange={e => setCName(e.target.value)} className={inputClass} />
                  <input placeholder="Title / Role (e.g. Recruiter)" value={cRole} onChange={e => setCRole(e.target.value)} className={inputClass} />
                  <input type="email" placeholder="Email" value={cEmail} onChange={e => setCEmail(e.target.value)} className={inputClass} />
                  <input type="url" placeholder="LinkedIn URL" value={cLinkedin} onChange={e => setCLinkedin(e.target.value)} className={inputClass} />
                  <textarea rows={2} placeholder="Notes..." value={cNotes} onChange={e => setCNotes(e.target.value)} className={`${inputClass} resize-none`} />
                  <div className="flex gap-2">
                    <button onClick={() => setShowContactForm(false)} className="flex-1 border border-gray-200 text-sm py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={addContact} disabled={addingContact || !cName} className="flex-1 bg-black text-white text-sm py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50">
                      {addingContact ? "Adding..." : "Add Contact"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full border-2 border-dashed border-gray-200 text-gray-500 text-sm py-3 rounded-xl hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Contact
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
