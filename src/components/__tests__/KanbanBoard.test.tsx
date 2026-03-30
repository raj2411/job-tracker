import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import KanbanBoard from "../KanbanBoard"

// Mock router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

const mockApplications = [
  {
    id: "app-1",
    company: "Google",
    role: "Frontend Engineer",
    status: "APPLIED" as const,
    jobUrl: "https://google.com/careers",
    notes: null,
    salaryExpected: null,
    salaryOffered: null,
    resumeUrl: null,
    coverLetterUrl: null,
    appliedAt: new Date().toISOString(),
    interviewRounds: [],
    contacts: [],
  },
  {
    id: "app-2",
    company: "Meta",
    role: "Backend Engineer",
    status: "INTERVIEW" as const,
    jobUrl: null,
    notes: null,
    salaryExpected: null,
    salaryOffered: null,
    resumeUrl: null,
    coverLetterUrl: null,
    appliedAt: new Date().toISOString(),
    interviewRounds: [],
    contacts: [],
  }
]

describe("KanbanBoard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  it("renders the columns correctly", () => {
    const mockUpdate = jest.fn()
    const mockDelete = jest.fn()
    const mockView = jest.fn()

    render(
      <KanbanBoard
        applications={mockApplications}
        updateStatus={mockUpdate}
        deleteApp={mockDelete}
        onCardClick={mockView}
      />
    )

    expect(screen.getByText("Applied")).toBeInTheDocument()
    expect(screen.getByText("Interviews")).toBeInTheDocument()
    expect(screen.getByText("Offers")).toBeInTheDocument()
    expect(screen.getByText("Rejected")).toBeInTheDocument()
  })

  it("renders the application cards", () => {
    const mockUpdate = jest.fn()
    const mockDelete = jest.fn()
    const mockView = jest.fn()

    render(
      <KanbanBoard
        applications={mockApplications}
        updateStatus={mockUpdate}
        deleteApp={mockDelete}
        onCardClick={mockView}
      />
    )

    expect(screen.getByText("Google")).toBeInTheDocument()
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument()

    expect(screen.getByText("Meta")).toBeInTheDocument()
    expect(screen.getByText("Backend Engineer")).toBeInTheDocument()
  })
})
