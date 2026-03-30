import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import RegisterPage from "../page"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

// Mock next-auth
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}))

// Mock fetch
global.fetch = jest.fn()

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the registration form", () => {
    render(<RegisterPage />)
    expect(screen.getByText("Create your account")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Raj Patel")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Create account" })).toBeInTheDocument()
  })

  it("calls Google signIn when 'Continue with Google' is clicked", async () => {
    render(<RegisterPage />)
    const googleBtn = screen.getByText("Continue with Google")
    await userEvent.click(googleBtn)
    expect(signIn).toHaveBeenCalledWith("google", { callbackUrl: "/dashboard" })
  })

  it("handles successful registration", async () => {
    const pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: "123" } }),
    })

    render(<RegisterPage />)

    await userEvent.type(screen.getByPlaceholderText("Raj Patel"), "John Doe")
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "john@test.com")
    await userEvent.type(screen.getByPlaceholderText("Min 8 characters"), "password123")

    fireEvent.submit(screen.getByRole("button", { name: "Create account" }))

    expect(global.fetch).toHaveBeenCalledWith("/api/register", expect.objectContaining({
      method: "POST",
      body: expect.stringContaining("John Doe"),
    }))

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/signin?registered=true")
    })
  })

  it("displays error when API fails", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email already exists" }),
    })

    render(<RegisterPage />)

    await userEvent.type(screen.getByPlaceholderText("Raj Patel"), "John Doe")
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "john@test.com")
    await userEvent.type(screen.getByPlaceholderText("Min 8 characters"), "password123")

    fireEvent.submit(screen.getByRole("button", { name: "Create account" }))

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument()
    })
  })
})
