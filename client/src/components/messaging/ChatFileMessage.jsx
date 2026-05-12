import { Download, FileText, Image as ImageIcon, File } from 'lucide-react';

const ChatFileMessage = ({ attachment, isSender }) => {
  if (!attachment) return null;

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (attachment.type === 'image') {
    return (
      <div className="group relative">
        <a 
          href={attachment.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-transform active:scale-95"
        >
          <img 
            src={attachment.url} 
            alt={attachment.name} 
            className="max-w-[240px] max-h-[320px] object-cover hover:opacity-90 transition-opacity"
          />
        </a>
        <div className={`absolute bottom-2 ${isSender ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          <div className="bg-black/50 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-lg font-bold">
            {formatSize(attachment.size)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
      isSender 
        ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-200' 
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white shadow-sm'
    } max-w-[280px]`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isSender ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
      }`}>
        <FileText className={`w-5 h-5 ${isSender ? 'text-white' : 'text-slate-500'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold truncate">{attachment.name}</div>
        <div className={`text-[10px] font-bold uppercase tracking-wider ${
          isSender ? 'text-indigo-100' : 'text-slate-400'
        }`}>
          {formatSize(attachment.size)}
        </div>
      </div>
      <a 
        href={attachment.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`p-2 rounded-lg transition-colors ${
          isSender ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600'
        }`}
      >
        <Download className="w-4 h-4" />
      </a>
    </div>
  );
};

export default ChatFileMessage;
