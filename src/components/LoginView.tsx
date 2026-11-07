import React, { useState } from 'react';
import { Waves, ArrowRight } from 'lucide-react';

export interface UserProfile {
  name: string;
  role: string;
  badgeId: string;
}

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [customRole, setCustomRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalRole = role === 'Other' ? customRole.trim() || 'Guest' : role;

    onLogin({
      name: name.trim(),
      role: finalRole,
      badgeId: `MW-${finalRole.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
    });
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#087E8B] to-[#20C9C3] flex items-center justify-center text-white shadow-lg">
            <Waves className="w-8 h-8" />
          </div>
        </div>

        <h1>Marine Watch</h1>
        <p>Enter your name and role to access the marine conservation portal.</p>

        <form onSubmit={handleSubmit} className="text-left">
          {/* Your Name */}
          <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
            Your Name
          </label>
          <input
            type="text"
            placeholder="e.g. Alex Johnson"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          {/* Your Role */}
          <label className="block text-xs font-semibold text-[#183B4E] mb-2 uppercase tracking-wider">
            Your Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Student">Student</option>
            <option value="Researcher">Researcher</option>
            <option value="Marine Biologist">Marine Biologist</option>
            <option value="Conservation Volunteer">Conservation Volunteer</option>
            <option value="Other">Other</option>
          </select>

          {role === 'Other' && (
            <input
              type="text"
              placeholder="Enter your custom role..."
              value={customRole}
              onChange={(e) => setCustomRole(e.target.value)}
              required
            />
          )}

          {/* Continue Button with natural downward space */}
          <div className="mt-3">
            <button type="submit" className="w-full flex items-center justify-center gap-2">
              <span>Continue to Marine Watch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
