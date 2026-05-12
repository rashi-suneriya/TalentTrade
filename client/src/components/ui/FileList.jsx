import { FileText, FileArchive, Image as ImageIcon, File, Download, Trash2 } from 'lucide-react';

const FileList = ({ files = [], onDelete }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'pptx':
      case 'xlsx':
      case 'txt':
      case 'md':
        return <FileText className="w-5 h-5" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <FileArchive className="w-5 h-5" />;
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (!files.length) return null;

  return (
    <div className="space-y-2">
      {files.map((file, idx) => (
        <div 
          key={file._id || idx} 
          className="flex items-center gap-4 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg flex items-center justify-center flex-shrink-0">
            {getFileIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-800 dark:text-white truncate">
              {file.name}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {formatSize(file.size)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a 
              href={file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            {onDelete && (
              <button 
                onClick={() => onDelete(file._id || file.publicId)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
