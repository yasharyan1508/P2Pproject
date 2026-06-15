import { render, screen } from '@testing-library/react';
import { TransferProgressBar } from './TransferProgressBar';
import { describe, it, expect } from 'vitest';

describe('TransferProgressBar component', () => {
  it('renders correctly at 0%', () => {
    render(<TransferProgressBar percent={0} speedBps={0} etaSeconds={0} />);
    expect(screen.getByText('0 B/s')).toBeInTheDocument();
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('renders correctly at 50%', () => {
    render(<TransferProgressBar percent={50} speedBps={1572864} etaSeconds={10} />);
    expect(screen.getByText('1.5 MB/s')).toBeInTheDocument();
    expect(screen.getByText('~10s')).toBeInTheDocument();
  });

  it('renders correctly at 100%', () => {
    render(<TransferProgressBar percent={100} speedBps={5242880} etaSeconds={0} />);
    expect(screen.getByText('5.0 MB/s')).toBeInTheDocument();
  });
});

