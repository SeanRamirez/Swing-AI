import { useState, useCallback } from 'react';
import { Upload as UploadIcon, Video, FileVideo, X, Play, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  analysisResult?: SwingAnalysisData;
  error?: string;
}

import { aiService, SwingAnalysisData } from '../services/ai-service';

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate files first
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    acceptedFiles.forEach(file => {
      const validation = aiService.validateVideoFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(`${file.name}: ${validation.error}`);
      }
    });

    // Show validation errors
    if (invalidFiles.length > 0) {
      alert(`Some files could not be processed:\n${invalidFiles.join('\n')}`);
    }

    if (validFiles.length === 0) return;

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    newFiles.forEach((file, index) => {
      processFile(file, validFiles[index]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    multiple: true
  });

  const processFile = async (file: UploadedFile, actualFile: File) => {
    try {
      // Simulate upload progress
      await simulateUpload(file.id);
      
      // Update status to processing
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'processing', progress: 100 }
            : f
        )
      );

      // Call AI service for analysis
      await analyzeVideo(file, actualFile);

    } catch (error) {
      console.error('Error processing file:', error);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error', error: 'Failed to process video' }
            : f
        )
      );
    }
  };

  const simulateUpload = (fileId: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId 
                ? { ...file, progress }
                : file
            )
          );
          
          resolve();
        } else {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId 
                ? { ...file, progress }
                : file
            )
          );
        }
      }, 200);
    });
  };

  const analyzeVideo = async (file: UploadedFile, actualFile: File) => {
    try {
      setIsAnalyzing(true);
      
      // Call AI service using the service layer
      const result = await aiService.analyzeSwing(actualFile);
      
      // Update file with analysis results
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'completed', 
                analysisResult: result.data 
              }
            : f
        )
      );

    } catch (error) {
      console.error('AI analysis error:', error);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === file.id 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Analysis failed'
              }
            : f
        )
      );
    } finally {
      setIsAnalyzing(false);
    }
  };



  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const viewAnalysis = (file: UploadedFile) => {
    if (file.analysisResult) {
      // Navigate to analysis page with the results
      navigate('/analysis', { 
        state: { analysisData: file.analysisResult } 
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <UploadIcon className="h-5 w-5 text-blue-500 animate-bounce" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <UploadIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'AI Analysis in Progress...';
      case 'completed':
        return 'Analysis Complete';
      case 'error':
        return 'Analysis Failed';
      default:
        return 'Ready to upload';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Swing Video</h1>
        <p className="text-gray-600 mt-2">
          Get instant AI-powered analysis of your golf swing
        </p>
        <p className="text-sm text-blue-600 mt-2">
          AI Service: http://localhost:8000
        </p>
      </div>

      {/* Upload Area */}
      <div className="card mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive
              ? 'border-emerald-400 bg-emerald-50'
              : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
          }`}
        >
          <input {...getInputProps()} />
          <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop your video here' : 'Drag & drop your swing video'}
          </p>
          <p className="text-gray-500 mb-4">
            or click to browse files
          </p>
          <p className="text-sm text-gray-400">
            Supports MP4, MOV, AVI, MKV (Max 100MB)
          </p>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Uploaded Videos</h2>
          <div className="space-y-4">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <FileVideo className="h-10 w-10 text-emerald-500" />
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {getStatusText(file.status)}
                      </p>
                      {file.status === 'uploading' && (
                        <p className="text-xs text-gray-500">
                          {Math.round(file.progress)}% complete
                        </p>
                      )}
                      {file.status === 'error' && (
                        <p className="text-xs text-red-500">
                          {file.error}
                        </p>
                      )}
                    </div>
                    
                    {getStatusIcon(file.status)}
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Analysis Results Preview */}
                {file.status === 'completed' && file.analysisResult && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <h4 className="font-medium text-emerald-900 mb-3">Analysis Results</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(file.analysisResult.scores.overall_score)}`}>
                          {Math.round(file.analysisResult.scores.overall_score)}
                        </div>
                        <div className="text-sm text-emerald-700">Overall</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${getScoreColor(file.analysisResult.scores.form_score)}`}>
                          {Math.round(file.analysisResult.scores.form_score)}
                        </div>
                        <div className="text-sm text-emerald-700">Form</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${getScoreColor(file.analysisResult.scores.tempo_score)}`}>
                          {Math.round(file.analysisResult.scores.tempo_score)}
                        </div>
                        <div className="text-sm text-emerald-700">Tempo</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg font-semibold ${getScoreColor(file.analysisResult.scores.power_score)}`}>
                          {Math.round(file.analysisResult.scores.power_score)}
                        </div>
                        <div className="text-sm text-emerald-700">Power</div>
                      </div>
                    </div>
                    <button
                      onClick={() => viewAnalysis(file)}
                      className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      View Full Analysis
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Preview */}
      {uploadedFiles.some(file => file.status === 'completed') && (
        <div className="card mt-8 bg-gradient-to-r from-emerald-50 to-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Analysis Complete!
          </h3>
          <p className="text-gray-600 mb-4">
            Your swing has been analyzed by our AI. View detailed results and recommendations.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/analysis')}
              className="btn-primary"
            >
              View All Analyses
            </button>
            <button 
              onClick={() => setUploadedFiles([])}
              className="btn-secondary"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card mt-8 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 Tips for Best Results
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Record from a side angle for best swing analysis</li>
          <li>• Ensure good lighting and clear video quality</li>
          <li>• Include the full swing motion from setup to follow-through</li>
          <li>• Keep the camera steady and avoid movement</li>
          <li>• AI analysis typically takes 10-30 seconds per video</li>
        </ul>
      </div>
    </div>
  );
};

export default Upload;
