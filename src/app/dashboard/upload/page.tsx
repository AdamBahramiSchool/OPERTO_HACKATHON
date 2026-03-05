"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileStats, setFileStats] = useState<{
    totalFiles: number;
    htmlFiles: number;
    jsFiles: number;
    otherFiles: number;
  } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.zip')) {
      setError('Please upload a .zip file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(0);
    setStatus('Reading zip file...');

    try {
      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Please log in to upload files');
      }

      const cid = `CID-${user.id.substring(0, 8).toUpperCase()}`;

      // Send to API for processing
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', user.id);

      setStatus('Uploading and processing...');
      setProgress(30);

      const response = await fetch('/api/upload-bundle', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      setProgress(100);
      setStatus('Upload complete!');
      setSuccess(true);
      setFileStats(result.stats);

      // Reset file input
      event.target.value = '';

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Build Files</h1>
          <p className="text-slate-400">Upload your /dist or /src folder as a .zip file for analysis</p>
        </div>

        {/* Upload Card */}
        <div className="glass rounded-xl p-8 border border-white/10 max-w-2xl mx-auto">
          {/* Upload Area */}
          <div className="mb-6">
            <label
              htmlFor="file-upload"
              className={`
                relative block w-full p-12 border-2 border-dashed rounded-xl
                transition-all cursor-pointer
                ${uploading 
                  ? 'border-indigo-500/50 bg-indigo-500/5 cursor-not-allowed' 
                  : 'border-white/20 hover:border-indigo-500/50 hover:bg-white/5'
                }
              `}
            >
              <input
                id="file-upload"
                type="file"
                accept=".zip"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              
              <div className="text-center">
                <svg
                  className={`mx-auto h-12 w-12 mb-4 ${uploading ? 'text-indigo-400' : 'text-slate-400'}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                
                <p className="text-lg font-medium mb-2">
                  {uploading ? 'Processing...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-slate-400">
                  ZIP file containing your /dist or /src folder
                </p>
              </div>
            </label>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{status}</span>
                <span className="text-sm font-medium text-indigo-400">{progress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400 flex-shrink-0 mt-0.5">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <p className="font-medium text-red-400">Upload Failed</p>
                  <p className="text-sm text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && fileStats && (
            <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start gap-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400 flex-shrink-0 mt-0.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <div className="flex-1">
                  <p className="font-medium text-emerald-400 mb-2">Upload Successful!</p>
                  <p className="text-sm text-emerald-300 mb-4">Your files have been processed and stored.</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-slate-400 mb-1">Total Files</p>
                      <p className="text-lg font-bold text-white">{fileStats.totalFiles}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-slate-400 mb-1">HTML Files</p>
                      <p className="text-lg font-bold text-indigo-400">{fileStats.htmlFiles}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-slate-400 mb-1">JS Files</p>
                      <p className="text-lg font-bold text-purple-400">{fileStats.jsFiles}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5">
                      <p className="text-xs text-slate-400 mb-1">Other Files</p>
                      <p className="text-lg font-bold text-cyan-400">{fileStats.otherFiles}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="glass rounded-xl p-6 border border-white/10 max-w-2xl mx-auto mt-6">
          <h2 className="text-lg font-bold mb-4">Instructions</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>Compress your <code className="px-1.5 py-0.5 rounded bg-white/10">/dist</code> or <code className="px-1.5 py-0.5 rounded bg-white/10">/src</code> folder into a .zip file</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>We'll extract text from HTML files, readable strings from JS files, and special files like robots.txt and sitemap.xml</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>All content will be bundled into a single markdown file for AI analysis</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-1">•</span>
              <span>Maximum file size: 50MB</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}

