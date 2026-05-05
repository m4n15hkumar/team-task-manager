import { Calendar, User, AlignLeft } from 'lucide-react';

const priorityColors = {
  Low: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  High: 'bg-red-100 text-red-800',
};

const TaskCard = ({ task, onUpdateStatus, onDelete, canEdit, canDelete }) => {
  const nextStatus = {
    'To Do': 'In Progress',
    'In Progress': 'Done',
    'Done': 'To Do'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {canDelete && (
          <button 
            onClick={() => onDelete(task._id)}
            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete task"
          >
            &times;
          </button>
        )}
      </div>
      
      <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2" title={task.title}>{task.title}</h4>
      
      {task.description && (
        <div className="flex items-start gap-1 text-gray-500 mb-3">
          <AlignLeft className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm line-clamp-2" title={task.description}>{task.description}</p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex flex-col gap-1">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="truncate max-w-[100px]" title={task.assignedTo?.name || 'Unassigned'}>
              {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
            </span>
          </div>
        </div>

        {canEdit && (
          <button
            onClick={() => onUpdateStatus(task._id, nextStatus[task.status])}
            className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-xs hover:bg-indigo-100 transition-colors"
          >
            Move &rarr;
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
