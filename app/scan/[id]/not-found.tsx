import Link from "next/link"
import { Shield, AlertTriangle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl">Project Not Found</CardTitle>
                    <CardDescription className="text-base">
                        The project you're looking for doesn't exist or has been removed.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-blue-900 mb-1">Why did this happen?</h3>
                                <p className="text-sm text-blue-800">
                                    CodeShield Local uses in-memory storage. If the server was restarted,
                                    all project data is lost. This is a known limitation of the current MVP.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-gray-900">What can you do?</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Upload your project again to start a new scan</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Export reports immediately after scanning to save results</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>Consider running scans in a single session without server restarts</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/scan/upload" className="flex-1">
                            <Button className="w-full">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload New Project
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full">
                                Go to Home
                            </Button>
                        </Link>
                    </div>

                    <div className="text-xs text-gray-500 text-center pt-4 border-t">
                        <p>
                            <strong>Note:</strong> Persistent storage (SQLite) is planned for a future release.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
