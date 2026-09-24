/**
 * Status Badge Component
 * Adheres strictly to Zero-Pill discipline:
 * Unboxed metadata with quiet typographic dots, no pill capsules or candy badges.
 */

import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const getStatusConfig = (s: string) => {
    switch (s.toLowerCase()) {
      case 'online':
      case 'completed':
      case 'ready':
        return { dotColor: 'bg-emerald-400', textColor: 'text-emerald-400', label: s };
      case 'in-progress':
      case 'processing':
      case 'generating':
      case 'running':
        return { dotColor: 'bg-amber-400 animate-pulse', textColor: 'text-amber-400', label: s };
      case 'storyboarding':
      case 'scripting':
      case 'review':
        return { dotColor: 'bg-sky-400', textColor: 'text-sky-400', label: s };
      case 'offline':
      case 'failed':
        return { dotColor: 'bg-rose-400', textColor: 'text-rose-400', label: s };
      case 'unconfigured':
      case 'draft':
      default:
        return { dotColor: 'bg-slate-500', textColor: 'text-slate-400', label: s };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.textColor} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} aria-hidden="true" />
      <span className="capitalize">{config.label}</span>
    </span>
  );
};
