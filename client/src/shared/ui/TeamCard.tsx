import { Team } from '@/shared/types';

type TeamCardProps = {
  team: Team;
  onClick?: () => void;
};

export function TeamCard({ team, onClick }: TeamCardProps) {
  const team_name = [team.name_prefix, team.name_suffix];
  const teamLabel = team_name.filter(Boolean).join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${teamLabel} 팀 선택`}
      className="
        group
        flex flex-col justify-center items-center text-center
        w-full aspect-square
        px-3 py-4
        rounded-xl shadow-bottom
        bg-primary-white
        hover:bg-gray-50 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-primary-mint focus:ring-offset-2
        active:scale-95
        transition-all duration-200
        cursor-pointer
      "
    >
      {team_name.map((value, id) => (
        <span
          key={id}
          className="
            font-ganpan text-primary-navy font-bold
            text-[15px] web:text-base
            leading-tight
            group-hover:text-primary-navy/90
            transition-colors
          "
        >
          {value}
        </span>
      ))}
    </button>
  );
}
