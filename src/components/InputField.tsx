import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: LucideIcon;
}

const InputField: React.FC<InputFieldProps> = ({ icon: Icon, ...props }) => {
    return (
        <div className="mb-4 flex items-center border rounded-md px-2">
            <Icon className="text-gray-400 mr-2" />
            <input className="w-full py-2 outline-none bg-transparent" {...props} />
        </div>
    );
};

export default React.memo(InputField);
