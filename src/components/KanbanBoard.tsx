"use client"

import React from "react"
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MoreVertical, ExternalLink, Calendar, Trash2 } from "lucide-react"

type Status = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED"

type Application = {
  id: string
  company: string
  role: string
  status: Status
  jobUrl: string | null
  notes: string | null
  salaryExpected: number | null
  salaryOffered: number | null
  resumeUrl: string | null
  coverLetterUrl: string | null
  appliedAt: string
  interviewRounds: { id: string; type: "PHONE" | "TECHNICAL" | "ONSITE" | "OTHER"; scheduledAt: string | null; notes: string | null }[]
  contacts: { id: string; name: string; role: string | null; email: string | null; linkedinUrl: string | null; notes: string | null }[]
}

interface KanbanBoardProps {
  applications: Application[]
  updateStatus: (id: string, newStatus: string) => void
  deleteApp: (id: string) => void
  onCardClick: (app: Application) => void
}

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: "APPLIED", label: "Applied", color: "bg-blue-500" },
  { id: "INTERVIEW", label: "Interviews", color: "bg-yellow-500" },
  { id: "OFFER", label: "Offers", color: "bg-green-500" },
  { id: "REJECTED", label: "Rejected", color: "bg-red-500" },
]

export default function KanbanBoard({ applications, updateStatus, deleteApp, onCardClick }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const [activeId, setActiveId] = React.useState<string | null>(null)

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!over) return

    const activeApp = applications.find((app) => app.id === active.id)
    const overId = over.id as string

    // If over a column or an item in another column
    let newStatus: Status | null = null
    
    if (COLUMNS.find(col => col.id === overId)) {
      newStatus = overId as Status
    } else {
      const overApp = applications.find(app => app.id === overId)
      if (overApp) {
        newStatus = overApp.status
      }
    }

    if (activeApp && newStatus && activeApp.status !== newStatus) {
      updateStatus(activeApp.id, newStatus)
    }

    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[600px]">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            label={column.label}
            color={column.color}
            apps={applications.filter((app) => app.status === column.id)}
            deleteApp={deleteApp}
            onCardClick={onCardClick}
          />
        ))}
      </div>
      
      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: "0.5",
            },
          },
        }),
      }}>
        {activeId ? (
          <div className="rotate-3">
             <ApplicationCard 
               app={applications.find(a => a.id === activeId)!} 
               isOverlay 
               deleteApp={() => {}} 
             />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function KanbanColumn({ id, label, color, apps, deleteApp, onCardClick }: { 
  id: string, 
  label: string, 
  color: string, 
  apps: Application[],
  deleteApp: (id: string) => void
  onCardClick: (app: Application) => void
}) {
  return (
    <div className="flex flex-col gap-4 bg-gray-100/50 rounded-2xl p-4 border border-gray-200/50">
      <div className="flex items-center justify-between px-2 mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">{label}</h3>
          <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {apps.length}
          </span>
        </div>
      </div>

      <SortableContext items={apps.map(a => a.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 min-h-[150px]">
          {apps.map((app) => (
            <SortableApplicationCard key={app.id} app={app} deleteApp={deleteApp} onCardClick={onCardClick} />
          ))}
          {apps.length === 0 && (
            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center p-8">
               <span className="text-gray-400 text-xs italic text-center">Drop here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function SortableApplicationCard({ app, deleteApp, onCardClick }: { app: Application, deleteApp: (id: string) => void, onCardClick: (app: Application) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-100 border-2 border-gray-200 rounded-xl h-[100px] opacity-30"
      />
    )
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ApplicationCard app={app} deleteApp={deleteApp} onCardClick={onCardClick} />
    </div>
  )
}

function ApplicationCard({ app, isOverlay, deleteApp, onCardClick }: { 
  app: Application, 
  isOverlay?: boolean,
  deleteApp: (id: string) => void
  onCardClick?: (app: Application) => void
}) {
  return (
    <div
      className={`bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative ${isOverlay ? 'cursor-grabbing' : 'cursor-grab active:cursor-grabbing'}`}
      onClick={(e) => { if (onCardClick && !isOverlay) { e.stopPropagation(); onCardClick(app) } }}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-900 text-sm leading-tight">{app.company}</h4>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {app.jobUrl && (
            <a 
              href={app.jobUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-black"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={12} />
            </a>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              deleteApp(app.id);
            }}
            className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      
      <p className="text-xs text-gray-600 font-medium mb-3">{app.role}</p>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
          <Calendar size={10} />
          {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
        <div className="flex -space-x-1">
          <div className="w-4 h-4 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[8px] font-bold text-gray-400">
            {app.company[0]}
          </div>
        </div>
      </div>
    </div>
  )
}
