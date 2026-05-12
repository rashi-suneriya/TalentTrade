import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, Film, CheckCircle2, Loader2, FileText, FileArchive, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const FileUpload = ({ onUpload, accept, maxSize, uploadUrl, label }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'docx', 'pptx', 'xlsx', 'txt', 'md'].includes(ext)) return <FileText className="w-5 h-5" />;
    if (['zip', 'rar', '7z'].includes(ext)) return <FileArchive className="w-5 h-5" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon className="w-5 h-5" />;
    if (['mp4', 'mov', 'webm', 'avi'].includes(ext)) return <Film className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const reason = rejectedFiles[0].errors[0].code;
      if (reason === 'file-too-large') toast.error('File is too large');
      else if (reason === 'file-invalid-type') toast.error('Invalid file type');
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (res.data.success) {
        onUpload(res.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [uploadUrl, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? accept.reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}) : undefined,
    maxSize,
    multiple: false,
  });

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {label && <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">{label}</label>}
      
      {!file || error ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${
            isDragActive 
              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
              : 'border-slate-200 dark:border-slate-800 hover:border-indigo-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center">
            {isDragActive ? 'Drop files here' : 'Drag & drop or click to upload'}
          </p>
          {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {file.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                getFileIcon(file.name)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-slate-800 dark:text-white truncate">
                {file.name}
              </div>
              <div className="text-xs text-slate-500">
                {formatSize(file.size)}
              </div>
            </div>
            {!uploading ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <button 
                  onClick={() => { setFile(null); setProgress(0); setError(null); }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            )}
          </div>
          
          {uploading && (
            <div className="mt-4">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <span>{progress}% Uploading</span>
                <span>Please wait...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
