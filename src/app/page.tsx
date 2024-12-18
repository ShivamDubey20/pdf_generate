import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <Card className="w-full max-w-4xl shadow-lg rounded-lg border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold tracking-tight text-blue-600">
            Expand Your Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-lg text-gray-700 mb-6 text-center">
            Unlock a world of learning through quizzes and questions. Enhance your understanding step by step.
          </p>
          <Separator className="my-4 w-full" />

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-6">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-4 shadow-md transition-all duration-300"
            >
              <Link href="/quizz/new" className="flex items-center gap-2">
                Start Quiz <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-8 py-4 hover:bg-gray-100 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-600">
        <p>
          &copy; {new Date().getFullYear()} Expand Knowledge. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
