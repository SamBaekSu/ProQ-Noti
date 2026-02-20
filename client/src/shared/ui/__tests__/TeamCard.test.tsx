import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { TeamCard } from '../TeamCard';
import type { Team } from '@/shared/types';

describe('TeamCard', () => {
  const mockTeam: Team = {
    id: 1,
    name_abbr: 'T1',
    name_prefix: 'T1',
    name_suffix: null,
    created_at: '2024-01-01'
  };

  const mockTeamWithSuffix: Team = {
    id: 2,
    name_abbr: 'GEN',
    name_prefix: 'Gen.G',
    name_suffix: 'Esports',
    created_at: '2024-01-01'
  };

  it('should render team name', () => {
    render(<TeamCard team={mockTeam} />);

    expect(screen.getByText('T1')).toBeInTheDocument();
  });

  it('should render team name with prefix and suffix', () => {
    render(<TeamCard team={mockTeamWithSuffix} />);

    expect(screen.getByText('Gen.G')).toBeInTheDocument();
    expect(screen.getByText('Esports')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<TeamCard team={mockTeam} onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'T1 팀 선택' });
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const mockOnClick = vi.fn();
    render(<TeamCard team={mockTeam} onClick={mockOnClick} disabled={true} />);

    const button = screen.getByRole('button', { name: 'T1 팀 선택' });
    fireEvent.click(button);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('should show selected badge when selected', () => {
    render(<TeamCard team={mockTeam} selected={true} />);

    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('should not show selected badge when not selected', () => {
    render(<TeamCard team={mockTeam} selected={false} />);

    expect(screen.queryByText('Selected')).not.toBeInTheDocument();
  });

  it('should have disabled attribute when disabled', () => {
    render(<TeamCard team={mockTeam} disabled={true} />);

    const button = screen.getByRole('button', { name: 'T1 팀 선택' });
    expect(button).toBeDisabled();
  });

  it('should not have disabled attribute when not disabled', () => {
    render(<TeamCard team={mockTeam} disabled={false} />);

    const button = screen.getByRole('button', { name: 'T1 팀 선택' });
    expect(button).not.toBeDisabled();
  });

  it('should have correct aria-label', () => {
    render(<TeamCard team={mockTeam} />);

    const button = screen.getByRole('button', { name: 'T1 팀 선택' });
    expect(button).toHaveAttribute('aria-label', 'T1 팀 선택');
  });

  it('should have correct aria-label for team with suffix', () => {
    render(<TeamCard team={mockTeamWithSuffix} />);

    const button = screen.getByRole('button', { name: 'Gen.G Esports 팀 선택' });
    expect(button).toHaveAttribute('aria-label', 'Gen.G Esports 팀 선택');
  });

  it('should prevent default and stop propagation on click', () => {
    const mockOnClick = vi.fn();
    render(<TeamCard team={mockTeam} onClick={mockOnClick} />);

    const button = screen.getByRole('button', { name: 'T1 팀 선택' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
      writable: true
    });
    Object.defineProperty(event, 'stopPropagation', {
      value: vi.fn(),
      writable: true
    });

    button.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('should handle team with only prefix', () => {
    const teamWithOnlyPrefix: Team = {
      id: 3,
      name_abbr: 'DK',
      name_prefix: 'DWG KIA',
      name_suffix: null,
      created_at: '2024-01-01'
    };

    render(<TeamCard team={teamWithOnlyPrefix} />);

    expect(screen.getByText('DWG KIA')).toBeInTheDocument();
  });

  it('should work without onClick handler', () => {
    render(<TeamCard team={mockTeam} />);

    const button = screen.getByRole('button', { name: 'T1 팀 선택' });

    // Should not throw error
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('should have correct default prop values', () => {
    render(<TeamCard team={mockTeam} />);

    const button = screen.getByRole('button', { name: 'T1 팀 선택' });

    expect(button).not.toBeDisabled();
    expect(screen.queryByText('Selected')).not.toBeInTheDocument();
  });
});
