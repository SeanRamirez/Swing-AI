import { useState, useCallback } from 'react';
import { Upload as UploadIcon, Video, FileVideo, X, Play, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
}

const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    multiple: true
  });

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setUploadedFiles(prev => 
          prev.map(file => 
            file.id === fileId 
              ? { ...file, status: 'processing', progress: 100 }
              : file
          )
        );

        // Simulate AI analysis
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId 
                ? { ...file, status: 'completed' }
                : file
            )
          );
        }, 2000);
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
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
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
        return <div className="h-5 w-5 border-2 border-golf-500 border-t-transparent rounded-full animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
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
      default:
        return 'Ready to upload';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Swing Video</h1>
        <p className="text-gray-600 mt-2">
          Get instant AI-powered analysis of your golf swing
        </p>
      </div>

      {/* Upload Area */}
      <div className="card mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive
              ? 'border-golf-400 bg-golf-50'
              : 'border-gray-300 hover:border-golf-400 hover:bg-gray-50'
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
                    <FileVideo className="h-10 w-10 text-golf-500" />
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
                    </div>
                    
                    {getStatusIcon(file.status)}
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {file.status === 'uploading' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-golf-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Preview */}
      {uploadedFiles.some(file => file.status === 'completed') && (
        <div className="card mt-8 bg-gradient-to-r from-golf-50 to-blue-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Analysis Complete!
          </h3>
          <p className="text-gray-600 mb-4">
            Your swing has been analyzed. View detailed results and recommendations.
          </p>
          <div className="flex space-x-4">
            <button className="btn-primary">
              View Analysis
            </button>
            <button className="btn-secondary">
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
        </ul>
      </div>
    </div>
  );
};

export default Upload;
