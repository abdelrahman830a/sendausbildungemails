"use client";

import { useState } from "react";
import { SendAusbildungEmails } from "@/app/actions/send-email";
import validator from "validator"; // Add this line

export default function AusbildungEmailSender() {
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Parse and validate emails
      const emails = emailInput
        .split(/[,;\s]+/)
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      if (emails.length === 0) {
        throw new Error(
          "Bitte geben Sie mindestens eine gültige E-Mail-Adresse ein."
        );
      }

      // Validate email format
      const invalidEmails = emails.filter((email) => !validator.isEmail(email)); // Updated email validation

      if (invalidEmails.length > 0) {
        throw new Error(
          `Ungültige E-Mail-Adressen: ${invalidEmails.join(", ")}`
        );
      }

      const result = await SendAusbildungEmails(emails);
      if (result.success) {
        alert("E-Mails wurden erfolgreich gesendet.");
      } else {
        const failedEmails = result.results
          .filter((res) => !res.success)
          .map((res) => res.email)
          .join(", ");
        alert(`Fehler beim Senden der folgenden E-Mails: ${failedEmails}`);
      }
      setEmailInput(""); // Clear input after successful send
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setErrorMessage(`Fehler beim Senden der E-Mails: ${error.message}`); // Enhanced error message
      } else {
        setErrorMessage("Fehler beim Senden der E-Mails: Unbekannter Fehler");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="emails"
            className="block text-sm font-medium text-gray-700">
            E-Mail-Adressen (durch Kommas, Leerzeichen oder Semikolons
            getrennt):
          </label>
          <input
            id="emails"
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="z.B. firma1@example.com, firma2@example.com"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-4 py-2 text-white font-medium rounded-md transition-colors
            ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}>
          {isLoading ? "Wird gesendet..." : "Bewerbungen senden"}
        </button>
      </form>
    </div>
  );
}
