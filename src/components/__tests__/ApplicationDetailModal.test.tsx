import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ApplicationDetailModal from "../ApplicationDetailModal"

// Mock fetch
global.fetch = jest.fn()

const mockApplication = {
  id: "app-1",
  company: "Apple",
  role: "iOS Engineer",
  status: "APPLIED" as const,
  jobUrl: "https://apple.com/jobs",
  notes: "Need to prepare for SWIFT questions",
  salaryExpected: 150000,
  salaryOffered: null,
  resumeUrl: "https://drive.google.com/resume",
  coverLetterUrl: null,
  appliedAt: new Date().toISOString(),
  interviewRounds: [],
  contacts: [],
}

describe("ApplicationDetailModal", () => {
  const mockOnClose = jest.fn()
  const mockOnUpdate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the application details", () => {
    render(
      <ApplicationDetailModal 
        application={mockApplication} 
        onClose={mockOnClose} 
        onUpdate={mockOnUpdate} 
      />
    )
    
    expect(screen.getByText("Apple")).toBeInTheDocument()
    expect(screen.getByText("iOS Engineer")).toBeInTheDocument()
    expect(screen.getByDisplayValue("150000")).toBeInTheDocument() // Expected Salary input
  })

  it("calls onClose when the close button is clicked", async () => {
    render(
      <ApplicationDetailModal 
        application={mockApplication} 
        onClose={mockOnClose} 
        onUpdate={mockOnUpdate} 
      />
    )
    
    // Find the close button (it's the X icon button at the top)
    const closeButtons = screen.getAllByRole("button")
    // In lucide-react, the X icon is rendered inside a button
    // The first button usually is the close button in header
    await userEvent.click(closeButtons[0])
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it("updates overview details successfully", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    })

    render(
      <ApplicationDetailModal 
        application={mockApplication} 
        onClose={mockOnClose} 
        onUpdate={mockOnUpdate} 
      />
    )
    
    const salaryInput = screen.getByPlaceholderText("e.g. 100000") // Offered Salary
    await userEvent.type(salaryInput, "160000")
    
    const saveButton = screen.getByText("Save Changes")
    fireEvent.click(saveButton)

    expect(global.fetch).toHaveBeenCalledWith("/api/applications/app-1", expect.objectContaining({
      method: "PATCH",
      body: expect.stringContaining("160000"),
    }))

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled()
    })
  })
})
