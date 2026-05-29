import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AnalyzeForm } from "@/components/AnalyzeForm";
import { UI_TEXT, FRIENDLY_MESSAGES } from "@/lib/constants";

describe("AnalyzeForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("başarılı analizde üç sonuç kartını gösterir", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ok: true,
          result: {
            summary: "Genel değerlendirme.",
            score: 72,
            strengths: ["Güçlü madde"],
            weaknesses: ["Zayıf madde"],
            suggestions: ["Öneri madde"],
          },
          preview: null,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const user = userEvent.setup();
    render(<AnalyzeForm />);
    await user.type(screen.getByLabelText(UI_TEXT.inputLabel), "Örnek ürün linki");
    await user.click(screen.getByRole("button", { name: new RegExp(UI_TEXT.analyzeButton) }));

    await waitFor(() => {
      expect(screen.getByText("Güçlü madde")).toBeInTheDocument();
    });
    expect(screen.getByText(UI_TEXT.resultsTitle)).toBeInTheDocument();
  });

  it("anahtar yoksa (no-key) çökmeden nazik bir mesaj gösterir", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: false, reason: "no-key" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const user = userEvent.setup();
    render(<AnalyzeForm />);
    await user.type(screen.getByLabelText(UI_TEXT.inputLabel), "Bir ürün");
    await user.click(screen.getByRole("button", { name: new RegExp(UI_TEXT.analyzeButton) }));

    await waitFor(() => {
      expect(screen.getByText(FRIENDLY_MESSAGES["no-key"])).toBeInTheDocument();
    });
  });
});
