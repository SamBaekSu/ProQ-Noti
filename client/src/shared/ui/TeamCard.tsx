import { Team } from '@/shared/types';

type TeamCardProps = {
  team: Team;
  onClick?: () => void;
};

export function TeamCard({ team, onClick }: TeamCardProps) {
  const team_name = [team.name_prefix, team.name_suffix];
  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-center items-center text-center rounded-xl shadow-bottom bg-white hover:bg-gray-200 cursor-pointer"
      style={{
        width: '100%',
        aspectRatio: '1 / 1',
        fontSize: 'clamp(15px, 3.5vw, 16px)',
        padding: '1vh'
      }}
    >
      {team_name.map((value, id) => (
        <span key={id} className="font-ganpan text-primary-navy font-bold">
          {value}
        </span>
      ))}
    </div>
  );
}
