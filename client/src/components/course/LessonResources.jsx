import { useState } from 'react';
import FileUpload from '../ui/FileUpload';
import FileList from '../ui/FileList';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { FilePlus2 } from 'lucide-react';

const LessonResources = ({ courseId, lessonId, resources = [], editable = false }) => {
  const [currentResources, setCurrentResources] = useState(resources);

  const handleUploadSuccess = async (fileData) => {
    try {
      const res = await api.post(`/lessons/courses/${courseId}/lessons/${lessonId}/resources`, {
        name: fileData.name,
        url: fileData.url,
        publicId: fileData.publicId,
        type: fileData.type,
        size: fileData.size
      });

      if (res.data.success) {
        // Find the updated lesson resources from the returned course object
        let updatedResources = [];
        res.data.course.curriculum.forEach(section => {
          const lesson = section.lessons.find(l => l._id === lessonId);
          if (lesson) updatedResources = lesson.resources;
        });
        setCurrentResources(updatedResources);
        toast.success('Resource added!');
      }
    } catch (error) {
      toast.error('Failed to save resource info');
    }
  };

  const handleDelete = async (resourceId) => {
    try {
      const res = await api.delete(`/lessons/courses/${courseId}/lessons/${lessonId}/resources/${resourceId}`);
      if (res.data.success) {
        let updatedResources = [];
        res.data.course.curriculum.forEach(section => {
          const lesson = section.lessons.find(l => l._id === lessonId);
          if (lesson) updatedResources = lesson.resources;
        });
        setCurrentResources(updatedResources);
        toast.success('Resource removed');
      }
    } catch (error) {
      toast.error('Failed to delete resource');
    }
  };

  return (
    <div className="space-y-6">
      {editable && (
        <div className="space-y-3">
          <FileUpload 
            label="Upload Resource"
            uploadUrl="/upload/lesson-file"
            accept={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip']}
            maxSize={50 * 1024 * 1024}
            onUpload={handleUploadSuccess}
          />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1">
            Max 50MB: PDF, DOCX, ZIP, etc.
          </p>
        </div>
      )}

      {currentResources.length > 0 ? (
        <div className="space-y-3">
          {!editable && (
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
              <FilePlus2 className="w-4 h-4 text-indigo-500" />
              Lesson Resources
            </h4>
          )}
          <FileList 
            files={currentResources} 
            onDelete={editable ? handleDelete : null} 
          />
        </div>
      ) : !editable && (
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-sm text-slate-400 font-medium">No resources available for this lesson.</p>
        </div>
      )}
    </div>
  );
};

export default LessonResources;
