"use client"; // Enable client-side rendering.
import { Card } from "@/components/ui/card"; // Import custom Card component.
import { Button } from "@/components/ui/button"; // Import custom Button component.
import { useState, useEffect } from "react"; // Import React hooks.
import { useRouter } from "next/navigation"; // Import Next.js router for navigation.

const UploadDoc = () => {
  const [document, setDocument] = useState<Blob | File | null>(null); // State to manage uploaded document.
  const [isLoadingQuizz, setIsLoadingQuizz] = useState<boolean>(false); // Loading state for quiz generation.
  const [isLoadingQA, setIsLoadingQA] = useState<boolean>(false); // Loading state for Q&A generation.
  const [error, setError] = useState<string>(""); // Error messages.

  const router = useRouter();

  // Load document from localStorage when the component mounts.
  useEffect(() => {
    const savedDocumentName = localStorage.getItem("documentName");
    if (savedDocumentName) {
      setDocument(new File([], savedDocumentName)); // Display document name even after reload.
    }
  }, []);

  // Save document to localStorage when a new one is uploaded.
  const handleFileUpload = (file: File | null) => {
    if (file) {
      setDocument(file);
      localStorage.setItem("documentName", file.name); // Save file name to localStorage.
    } else {
      setDocument(null);
      localStorage.removeItem("documentName"); // Remove file info if cleared.
    }
  };

  const handleGenerateQuizz = async () => {
    if (!document) {
      setError("Please upload a valid PDF file.");
      return;
    }
    setError("");
    setIsLoadingQuizz(true);

    const formData = new FormData();
    formData.append("pdf", document);

    try {
      const res = await fetch("/api/quizz/generate", {
        method: "POST",
        body: formData,
      });
      if (res.status === 200) {
        const data = await res.json();
        const quizzId = data.quizzId;
        router.push(`/quizz/${quizzId}`);
      } else {
        setError("Failed to generate quiz. Please try again.");
      }
    } catch (err) {
      console.error("Error while generating quiz:", err);
      setError("Failed to generate quiz. Please try again.");
    }
    setIsLoadingQuizz(false);
  };

  const handleGenerateQA = async () => {
    if (!document) {
      setError("Please upload a valid PDF file.");
      return;
    }
    setError("");
    setIsLoadingQA(true);

    const formData = new FormData();
    formData.append("pdf", document);

    try {
      const res = await fetch("/api/question/generate", {
        method: "POST",
        body: formData,
      });
      if (res.status === 200) {
        const data = await res.json();
        const categoryId = data.categoryId;
        router.push(`/question/${categoryId}`);
      } else {
        setError("Failed to generate questions. Please try again.");
      }
    } catch (err) {
      console.error("Error while generating questions:", err);
      setError("Failed to generate questions. Please try again.");
    }
    setIsLoadingQA(false);
  };

  const handleRemoveDocument = () => {
    setDocument(null);
    localStorage.removeItem("documentName");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <form className="space-y-6">
          {/* File Upload Section */}
          <label
            htmlFor="document"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <svg
                className="w-12 h-12 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V8a4 4 0 014-4h2a4 4 0 014 4v8m4 0a4 4 0 01-4 4H7a4 4 0 01-4-4m4 0h10"
                ></path>
              </svg>
              <p className="text-gray-600">
                {document ? document.name : "Drag a file here or click to upload"}
              </p>
              <p className="text-sm text-gray-500">Only PDF files are allowed</p>
            </div>
            <input
              type="file"
              id="document"
              className="hidden"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e?.target?.files?.[0] || null)}
            />
          </label>

          {/* Remove Document Button */}
          {document && (
            <div className="flex justify-center mt-4">
              <Button
                size="sm"
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                onClick={handleRemoveDocument}
              >
                Remove PDF
              </Button>
            </div>
          )}

          {/* Error Display Section */}
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          {/* Loading Message */}
          {(isLoadingQuizz || isLoadingQA) && (
            <p className="text-sm text-blue-600 text-center">
              Please wait for 5-10 seconds while we process your request.
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              type="button"
              onClick={handleGenerateQuizz}
              disabled={isLoadingQuizz || isLoadingQA}
              className={`w-full ${
                isLoadingQuizz
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-medium py-2 rounded-lg transition-all duration-200`}
            >
              {isLoadingQuizz ? "Generating Quiz..." : "Generate Quiz"}
            </Button>
            <Button
              size="lg"
              type="button"
              onClick={handleGenerateQA}
              disabled={isLoadingQuizz || isLoadingQA}
              className={`w-full ${
                isLoadingQA
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-medium py-2 rounded-lg transition-all duration-200`}
            >
              {isLoadingQA
                ? "Generating Questions..."
                : "Generate Questions & Answers"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UploadDoc;
