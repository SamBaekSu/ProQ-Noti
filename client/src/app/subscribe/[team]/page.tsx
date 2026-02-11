import { Metadata } from 'next';
import SubscribePageClient from './SubscribePageClient';

type Props = {
  params: Promise<{ team: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { team } = await params;
  const teamName = decodeURIComponent(team);

  return {
    title: `ProQ-Noti | ${teamName}`,
    description: `${teamName} 선수들의 실시간 게임 상태를 확인하세요.`,
    openGraph: {
      title: `ProQ-Noti | ${teamName}`,
      description: `${teamName} 선수들의 실시간 게임 상태를 확인하세요.`,
      images: ['/og-image.png'] // Assuming we have or will have one
    }
  };
}

export default async function Page({ params }: Props) {
  const { team } = await params;
  const subDecodedTeam = decodeURIComponent(team);

  return <SubscribePageClient teamName={subDecodedTeam} />;
}
