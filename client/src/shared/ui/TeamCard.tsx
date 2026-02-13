import { Team } from '@/shared/types';
import { cn } from '@/shared/lib/utils';

interface TeamCardProps {
  team: Team;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * TeamCard Component - 팀 선택 카드
 * 반응형 디자인 적용
 */
export function TeamCard({
  team,
  onClick,
  selected = false,
  disabled = false
}: TeamCardProps) {
  const team_name = [team.name_prefix, team.name_suffix];
  const teamLabel = team_name.filter(Boolean).join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${teamLabel} 팀 선택`}
      className={cn(
        // Gaming card layout
        'group relative overflow-hidden',
        'flex flex-col items-center justify-center',
        'w-full aspect-square',
        'p-5 md:p-6 lg:p-7',
        'bg-dark-card',
        'border-2',
        'transition-all duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral',

        // 기본 상태
        !selected && !disabled && [
          'border-dark-border',
          'hover:border-coral',
          'hover:shadow-[0_0_30px_rgba(233,95,92,0.4)]',
          'hover:-translate-y-1',
          'active:translate-y-0'
        ],

        // 선택 상태 - Neon glow
        selected && [
          'border-coral',
          'shadow-[0_0_40px_rgba(233,95,92,0.6)]',
          'scale-105'
        ],

        // 비활성 상태
        disabled && [
          'opacity-30',
          'cursor-not-allowed',
          'border-dark-border'
        ],

        // 활성 상태 커서
        !disabled && 'cursor-pointer'
      )}
    >
      {/* Animated corner accents - Gaming HUD style */}
      <div className={cn(
        "absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-all duration-300",
        selected ? 'border-coral' : 'border-dark-border group-hover:border-coral'
      )} />
      <div className={cn(
        "absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-all duration-300",
        selected ? 'border-coral' : 'border-dark-border group-hover:border-coral'
      )} />
      <div className={cn(
        "absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-all duration-300",
        selected ? 'border-coral' : 'border-dark-border group-hover:border-coral'
      )} />
      <div className={cn(
        "absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-all duration-300",
        selected ? 'border-coral' : 'border-dark-border group-hover:border-coral'
      )} />

      {/* Selection glow effect */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-yellow/10 animate-pulse" />
      )}

      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Team Name - Gaming typography */}
      <div className="relative z-10 flex flex-col items-center gap-1 md:gap-1.5">
        {team_name.map((name, index) =>
          name && (
            <span
              key={index}
              className={cn(
                'font-display font-black',
                'text-xl md:text-2xl lg:text-3xl',
                'leading-tight text-center uppercase tracking-wider',
                'transition-all duration-300',
                selected
                  ? 'text-white drop-shadow-[0_0_10px_rgba(233,95,92,0.8)]'
                  : 'text-gray-300',
                !selected && !disabled && 'group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(233,95,92,0.6)]'
              )}
            >
              {name}
            </span>
          )
        )}
      </div>

      {/* Selection badge - Gaming style */}
      {selected && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-coral border border-coral shadow-[0_0_15px_rgba(233,95,92,0.8)] animate-scale-in">
          <span className="text-xs font-black text-white uppercase tracking-wider">Selected</span>
        </div>
      )}
    </button>
  );
}
